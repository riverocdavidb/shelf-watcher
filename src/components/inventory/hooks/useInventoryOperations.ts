
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import type { InventoryItem } from "../AddEditItemDialog";

export const useInventoryOperations = (refetch: () => void) => {
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  const handleSaveItem = async (data: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const isEditing = !!itemToDelete;
    const today = new Date().toISOString();
    
    try {
      console.log("Saving inventory item:", data, isEditing ? "editing" : "adding new");
      
      if (isEditing && itemToDelete) {
        const { data: existingItems, error: fetchError } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("name", itemToDelete.name)
          .eq("department", itemToDelete.department);

        if (fetchError) {
          console.error("Error fetching item to update:", fetchError);
          throw fetchError;
        }

        if (existingItems && existingItems.length > 0) {
          const itemToUpdate = existingItems[0];
          
          console.log("Updating existing item:", itemToUpdate.id);
          
          const { error } = await supabase
            .from("inventory_items")
            .update({
              sku: data.sku,
              name: data.name,
              department: data.department,
              item_quantity: data.item_quantity,
              item_status: data.item_status,
              item_update_date: today,
            })
            .eq("id", itemToUpdate.id);

          if (error) {
            console.error("Error updating inventory item:", error);
            throw error;
          }
        } else {
          console.log("Couldn't find item to update, creating new one instead");
          await createNewItem(data, today);
        }
        
        toast.success("Item updated successfully");
      } else {
        await createNewItem(data, today);
        toast.success("Item added successfully");
      }

      refetch();
      return true;
    } catch (err) {
      console.error("Error saving inventory item:", err);
      toast.error("Failed to save item");
      return false;
    }
  };

  const createNewItem = async (data: Omit<InventoryItem, "id" | "lastUpdated">, today: string) => {
    const { error } = await supabase
      .from("inventory_items")
      .insert({
        id: uuidv4(),
        sku: data.sku,
        name: data.name,
        department: data.department,
        item_quantity: data.item_quantity,
        item_status: data.item_status,
        item_update_date: today
      });

    if (error) {
      console.error("Error inserting inventory item:", error);
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const { data: itemsToDelete, error: fetchError } = await supabase
        .from("inventory_items")
        .select("*")
        .eq("name", itemToDelete.name)
        .eq("department", itemToDelete.department);

      if (fetchError) {
        console.error("Error finding item to delete:", fetchError);
        throw fetchError;
      }

      if (itemsToDelete && itemsToDelete.length > 0) {
        const { error } = await supabase
          .from("inventory_items")
          .delete()
          .eq("id", itemsToDelete[0].id);

        if (error) {
          console.error("Error deleting item:", error);
          throw error;
        }
      } else {
        console.warn("Item to delete not found in database");
      }
      
      toast.success("Item deleted successfully");
      refetch();
      return true;
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      toast.error("Failed to delete item");
      return false;
    } finally {
      setItemToDelete(null);
    }
  };

  const handleImportCSV = async (items: Omit<InventoryItem, "id" | "lastUpdated">[]) => {
    const today = new Date().toISOString();
    
    try {
      const dbItems = items.map(item => ({
        id: uuidv4(),
        sku: item.sku,
        name: item.name,
        department: item.department,
        item_quantity: item.item_quantity,
        item_status: item.item_status,
        item_update_date: today
      }));

      const { error } = await supabase.from("inventory_items").insert(dbItems);
      
      if (error) {
        console.error("Error importing CSV items:", error);
        toast.error("Failed to import CSV.");
        return false;
      } else {
        toast.success(`${dbItems.length} items imported successfully.`);
        refetch();
        return true;
      }
    } catch (err) {
      console.error("Error in CSV import:", err);
      toast.error("An error occurred during import.");
      return false;
    }
  };

  return {
    itemToDelete,
    setItemToDelete,
    handleSaveItem,
    handleDeleteConfirm,
    handleImportCSV,
  };
};
