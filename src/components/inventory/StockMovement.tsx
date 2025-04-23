
import React, { useState, useMemo } from "react";
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
import { Loader2, Filter, Search, Import, FileText, Plus } from "lucide-react";
import AddEditStockMovementDialog from "./AddEditStockMovementDialog";
import ImportStockMovementsDialog from "./ImportStockMovementsDialog";
import { ExportStockMovementsBtn } from "./ExportStockMovementsBtn";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useInventoryItems } from "@/services/inventoryService";

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
  const { data: inventoryItems = [] } = useInventoryItems();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterEmployee, setFilterEmployee] = useState<string | null>(null);

  const movementTypes = useMemo(
    () =>
      Array.from(
        new Set(movements.map((m) => m.type.toLowerCase()))
      ),
    [movements]
  );
  const employeeNames = useMemo(
    () =>
      Array.from(
        new Set(movements.map((m) => m.employeeName).filter(Boolean))
      ),
    [movements]
  );

  const filteredMovements = useMemo(() => {
    return movements.filter((item) => {
      const matchSearch =
        search.trim().length === 0 ||
        (item.itemName && item.itemName.toLowerCase().includes(search.toLowerCase())) ||
        (item.itemId && item.itemId.toLowerCase().includes(search.toLowerCase()));
      const matchType =
        !filterType || item.type.toLowerCase() === filterType.toLowerCase();
      const matchEmployee =
        !filterEmployee || item.employeeName === filterEmployee;
      return matchSearch && matchType && matchEmployee;
    });
  }, [movements, search, filterType, filterEmployee]);

  const handleAddMovement = async (data: any) => {
    try {
      const { data: items, error: itemError } = await supabase
        .from('inventory_items')
        .select('id')
        .eq('sku', data.sku)
        .single();

      if (itemError || !items) {
        throw new Error(`Item with SKU ${data.sku} not found`);
      }

      const { error: insertError } = await supabase
        .from('stock_movements')
        .insert({
          item_id: items.id,
          type: data.type,
          quantity: data.quantity,
          employee_id: data.employee !== 'System' ? null : null,
          created_at: data.date ? data.date : new Date().toISOString(),
          notes: data.notes || null
        });

      if (insertError) {
        throw new Error(`Failed to register movement: ${insertError.message}`);
      }

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
      const movementsToInsert = await Promise.all(movements.map(async (movement) => {
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
          employee_id: movement.employee !== 'System' ? null : null,
          created_at: movement.date ? movement.date : new Date().toISOString(),
          notes: movement.notes || null
        };
      }));
      
      const { error: insertError } = await supabase
        .from('stock_movements')
        .insert(movementsToInsert);
      
      if (insertError) {
        throw new Error(`Failed to import movements: ${insertError.message}`);
      }
      
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1">
        <div className="flex-1">
          <div className="relative">
            <Input
              className="pl-8 w-full md:w-[260px] bg-muted"
              placeholder="Search movement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 text-muted-foreground h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-row flex-wrap gap-2 mt-2 md:mt-0">
          <div>
            <Button
              variant="outline"
              className={filterType ? "bg-accent" : ""}
              onClick={() => setFilterType(null)}
            >
              <Filter className="mr-1 w-4 h-4" />
              Filters
            </Button>
            <select
              className="ml-2 border rounded-md h-[38px] px-3 py-1.5 text-sm"
              value={filterType || ""}
              onChange={e => setFilterType(e.target.value || null)}
            >
              <option value="">Type</option>
              {movementTypes.map(type =>
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              )}
            </select>
            <select
              className="ml-2 border rounded-md h-[38px] px-3 py-1.5 text-sm"
              value={filterEmployee || ""}
              onChange={e => setFilterEmployee(e.target.value || null)}
            >
              <option value="">Employee</option>
              {employeeNames.map(emp =>
                <option key={emp} value={emp}>{emp}</option>
              )}
            </select>
          </div>
          <Button
            onClick={() => setShowImport(true)}
            variant="outline"
            className="flex items-center"
          >
            <Import className="w-4 h-4 mr-1" /> Import CSV
          </Button>
          <ExportStockMovementsBtn>
            <FileText className="w-4 h-4 mr-1" /> Export CSV
          </ExportStockMovementsBtn>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="bg-[#1EAEDB] text-white hover:bg-[#179AC0] font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Movement
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white">
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
            {filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No stock movements found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{formatDate(item.date || '')}</TableCell>
                  <TableCell>
                    <Badge className={getMovementColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.itemId?.slice?.(0, 8) ?? ""}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.employeeName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddEditStockMovementDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSave={handleAddMovement}
      />
      <ImportStockMovementsDialog
        open={showImport}
        onOpenChange={setShowImport}
        onImport={handleImportMovements}
      />
    </div>
  );
};

export default StockMovement;
