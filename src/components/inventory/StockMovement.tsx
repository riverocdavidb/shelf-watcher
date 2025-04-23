
import React, { useState, useMemo } from "react";
import { useStockMovements, useInventoryItems } from "@/services/inventoryService";
import { Loader2 } from "lucide-react";
import AddEditStockMovementDialog from "./AddEditStockMovementDialog";
import ImportStockMovementsDialog from "./ImportStockMovementsDialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MovementSearchBar from "./MovementSearchBar";
import MovementFilters from "./MovementFilters";
import MovementActionButtons from "./MovementActionButtons";
import MovementTable from "./MovementTable";

const StockMovement = () => {
  const { data: movements = [], isLoading, error, refetch } = useStockMovements();
  const { data: inventoryItems = [] } = useInventoryItems();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterEmployee, setFilterEmployee] = useState<string | null>(null);

  const movementTypes = useMemo(
    () => Array.from(new Set(movements.map((m) => m.type.toLowerCase()))),
    [movements]
  );
  
  const employeeNames = useMemo(
    () => Array.from(new Set(movements.map((m) => m.employeeName).filter(Boolean))),
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
      setAddDialogOpen(false);
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
        title: "Import completed",
        description: `${movements.length} movements imported`,
      });
      
      refetch();
      setShowImport(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-1 relative">
        <div className="flex-1">
          <MovementSearchBar search={search} setSearch={setSearch} />
        </div>
        <div className="flex flex-row flex-wrap gap-2 mt-2 md:mt-0 items-center">
          <MovementFilters 
            filterType={filterType}
            setFilterType={setFilterType}
            filterEmployee={filterEmployee}
            setFilterEmployee={setFilterEmployee}
            movementTypes={movementTypes}
            employeeNames={employeeNames}
          />
          <MovementActionButtons 
            onAddClick={() => setAddDialogOpen(true)}
            onImportClick={() => setShowImport(true)}
          />
        </div>
      </div>

      <MovementTable movements={filteredMovements} />

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
