
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useStockMovementOperations = (refetch: () => void) => {
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

      return Promise.resolve();
    } catch (error) {
      console.error("Error saving movement:", error);
      toast({
        title: "Error registering movement",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return Promise.reject(error);
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
      return true;
    } catch (error) {
      console.error("Error importing movements:", error);
      toast({
        title: "Error importing movements",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleAddMovement, handleImportMovements };
};
