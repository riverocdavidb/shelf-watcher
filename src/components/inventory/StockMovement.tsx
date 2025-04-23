
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStockMovements } from "@/services/inventoryService";
import { Loader2 } from "lucide-react";
import { StockMovementForm } from "./StockMovementForm";
import ImportStockMovementsDialog from "./ImportStockMovementsDialog";
import { ExportStockMovementsBtn } from "./ExportStockMovementsBtn";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const getMovementColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "received":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "sold":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "damaged":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "stolen":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "adjustment":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (err) {
    return dateString;
  }
};

const StockMovement = () => {
  const { data: movements = [], isLoading, error, refetch } = useStockMovements();
  const [showImport, setShowImport] = useState(false);

  const handleAddMovement = async (data: any) => {
    try {
      // Buscar el ID del ítem basado en el SKU
      const { data: items, error: itemError } = await supabase
        .from('inventory_items')
        .select('id')
        .eq('sku', data.sku)
        .single();
      
      if (itemError || !items) {
        throw new Error(`Item with SKU ${data.sku} not found`);
      }
      
      // Guardar el movimiento en la base de datos
      const { error: insertError } = await supabase
        .from('stock_movements')
        .insert({
          item_id: items.id,
          type: data.type,
          quantity: data.quantity,
          employee_id: data.employee !== 'System' ? null : null, // Aquí se debería mapear a un ID de empleado real si existe
          created_at: data.date ? data.date : new Date().toISOString(),
          notes: data.notes || null
        });
      
      if (insertError) {
        throw new Error(`Failed to register movement: ${insertError.message}`);
      }
      
      // Actualizar la cantidad en el inventario según el tipo de movimiento
      const { data: itemData, error: getItemError } = await supabase
        .from('inventory_items')
        .select('item_quantity')
        .eq('id', items.id)
        .single();
        
      if (getItemError) {
        throw new Error(`Failed to get current quantity: ${getItemError.message}`);
      }
      
      let newQuantity = itemData.item_quantity;
      
      switch(data.type) {
        case 'received':
          newQuantity += data.quantity;
          break;
        case 'sold':
        case 'damaged':
        case 'stolen':
          newQuantity -= data.quantity;
          if (newQuantity < 0) newQuantity = 0;
          break;
        case 'adjustment':
          // La cantidad de ajuste puede ser positiva o negativa
          newQuantity = data.quantity;
          break;
      }
      
      const { error: updateError } = await supabase
        .from('inventory_items')
        .update({ 
          item_quantity: newQuantity, 
          item_update_date: new Date().toISOString() 
        })
        .eq('id', items.id);
      
      if (updateError) {
        throw new Error(`Failed to update inventory: ${updateError.message}`);
      }
      
      toast({
        title: "Movement registered",
        description: `Type: ${data.type} - SKU: ${data.sku} - Qty: ${data.quantity}`,
      });
      
      // Actualizar la lista de movimientos
      refetch();
    } catch (error) {
      console.error("Error saving movement:", error);
      toast({
        title: "Error registering movement",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleImportMovements = async (movements: any[]) => {
    try {
      // Convertir los movimientos importados al formato esperado por Supabase
      const movementsToInsert = await Promise.all(movements.map(async (movement) => {
        // Buscar el ID del ítem basado en el SKU
        const { data: items, error: itemError } = await supabase
          .from('inventory_items')
          .select('id')
          .eq('sku', movement.sku)
          .single();
        
        if (itemError || !items) {
          throw new Error(`Item with SKU ${movement.sku} not found`);
        }
        
        return {
          item_id: items.id,
          type: movement.type,
          quantity: parseInt(movement.quantity, 10),
          employee_id: movement.employee !== 'System' ? null : null, // Aquí se debería mapear a un ID de empleado real si existe
          created_at: movement.date ? movement.date : new Date().toISOString(),
          notes: movement.notes || null
        };
      }));
      
      // Insertar los movimientos en la base de datos
      const { error: insertError } = await supabase
        .from('stock_movements')
        .insert(movementsToInsert);
      
      if (insertError) {
        throw new Error(`Failed to import movements: ${insertError.message}`);
      }
      
      // Actualizar los ítems en el inventario según los movimientos importados
      for (const movement of movements) {
        const { data: items, error: itemError } = await supabase
          .from('inventory_items')
          .select('id, item_quantity')
          .eq('sku', movement.sku)
          .single();
        
        if (itemError || !items) continue;
        
        let newQuantity = items.item_quantity;
        
        switch(movement.type) {
          case 'received':
            newQuantity += parseInt(movement.quantity, 10);
            break;
          case 'sold':
          case 'damaged':
          case 'stolen':
            newQuantity -= parseInt(movement.quantity, 10);
            if (newQuantity < 0) newQuantity = 0;
            break;
          case 'adjustment':
            newQuantity = parseInt(movement.quantity, 10);
            break;
        }
        
        await supabase
          .from('inventory_items')
          .update({ 
            item_quantity: newQuantity, 
            item_update_date: new Date().toISOString() 
          })
          .eq('id', items.id);
      }
      
      toast({
        title: "Importación completada",
        description: `${movements.length} movimientos importados`,
      });
      
      // Actualizar la lista de movimientos
      refetch();
    } catch (error) {
      console.error("Error importing movements:", error);
      toast({
        title: "Error importing movements",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="ml-2">Loading stock movements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading stock movements. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h2 className="font-semibold text-lg">Register Movement</h2>
        <div className="flex gap-2">
          <ExportStockMovementsBtn />
          <Button type="button" onClick={() => setShowImport(true)} variant="outline">
            Import Movements
          </Button>
        </div>
      </div>
      <StockMovementForm onSave={handleAddMovement} />
      <ImportStockMovementsDialog open={showImport} onOpenChange={setShowImport} onImport={handleImportMovements} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Employee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No stock movements found.
                </TableCell>
              </TableRow>
            ) : (
              movements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <Badge className={getMovementColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.itemId.slice(0, 8)}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.employeeName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockMovement;
