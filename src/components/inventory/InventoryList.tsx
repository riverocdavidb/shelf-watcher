
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import InventoryTable from "./InventoryTable";
import InventoryListFilter from "./InventoryListFilter";
import InventoryDialogs from "./InventoryDialogs";
import { v4 as uuidv4 } from "uuid";
import type { InventoryItem } from "./AddEditItemDialog";

const InventoryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const { data: inventoryItemsRaw = [], isLoading, error, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .neq('item_status', 'Inactive');

      if (error) {
        console.error("Error fetching inventory:", error);
        throw error;
      }

      return (data || [])
        .map((item) => ({
          id: parseInt(item.id.slice(0, 8), 16) || Math.floor(Math.random() * 100000),
          sku: item.sku || "",
          name: item.name,
          department: item.department || "",
          item_quantity: item.item_quantity,
          item_status: item.item_status as 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Inactive',
          lastUpdated: new Date(item.item_update_date).toLocaleDateString(),
        }));
    },
    staleTime: 1000 * 60,
  });

  const inventoryItems = React.useMemo(() => {
    if (inventoryItemsRaw.length >= 5) return inventoryItemsRaw;
    const generated: InventoryItem[] = [...inventoryItemsRaw];
    const departments = ["Produce", "Dairy", "Meat & Seafood", "Bakery", "Frozen Foods", "Beverages"];
    const statuses: Array<'In Stock' | 'Low Stock' | 'Out of Stock'> = ["In Stock", "Low Stock", "Out of Stock"];
    let idBase = generated.length ? Math.max(...generated.map(i => i.id)) + 1 : 1;

    while (generated.length < 15) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const stat = statuses[Math.floor(Math.random() * statuses.length)];
      const quantity = stat === "Out of Stock" ? 0 : Math.floor(Math.random() * 150) + 1;
      generated.push({
        id: idBase++,
        sku: `SKU-${idBase.toString().padStart(5, "0")}`,
        name: `Sample Item ${idBase}`,
        department: dept,
        item_quantity: quantity,
        item_status: stat,
        lastUpdated: new Date().toLocaleDateString(),
      });
    }
    return generated;
  }, [inventoryItemsRaw]);

  const departments = [...new Set(inventoryItems.map(item => item.department))];
  const statuses = [...new Set(inventoryItems.map(item => item.item_status))];

  const filteredData = inventoryItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = !departmentFilter || item.department === departmentFilter;
    const matchesStatus = !statusFilter || item.item_status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSaveItem = async (data: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const isEditing = !!editingItem;
    const today = new Date().toISOString();
    
    try {
      console.log("Saving inventory item:", data, isEditing ? "editing" : "adding new");
      
      if (isEditing && editingItem) {
        const { data: existingItems, error: fetchError } = await supabase
          .from("inventory_items")
          .select("*")
          .eq("name", editingItem.name)
          .eq("department", editingItem.department);

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
    } catch (err) {
      console.error("Error saving inventory item:", err);
      toast.error("Failed to save item");
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
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      toast.error("Failed to delete item");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter(null);
    setStatusFilter(null);
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
      } else {
        toast.success(`${dbItems.length} items imported successfully.`);
        refetch();
      }
    } catch (err) {
      console.error("Error in CSV import:", err);
      toast.error("An error occurred during import.");
    }
  };

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ["sku", "name", "department", "item_quantity", "item_status", "lastUpdated"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map(item => 
        headers.map(header => (item as any)[header]).join(",")
      )
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_export.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filteredData.length} items exported to CSV.`);
  };

  return (
    <div className="space-y-6">
      <InventoryListFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentDepartments={departments}
        currentStatuses={statuses}
        clearFilters={clearFilters}
        onImportClick={() => setImportDialogOpen(true)}
        onExportClick={handleExportCSV}
        onAddClick={() => setAddDialogOpen(true)}
      />
      <InventoryTable 
        data={filteredData}
        isLoading={isLoading}
        error={error}
        onEdit={(item) => setEditingItem(item)}
        onDelete={(item) => {
          setItemToDelete(item);
          setDeleteDialogOpen(true);
        }}
      />
      <InventoryDialogs 
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onSave={handleSaveItem}
        importDialogOpen={importDialogOpen}
        setImportDialogOpen={setImportDialogOpen}
        onImport={handleImportCSV}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteConfirm}
        itemToDelete={itemToDelete}
      />
    </div>
  );
};

export default InventoryList;
