
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InventoryItem } from "./AddEditItemDialog";
import InventoryTable from "./InventoryTable";
import InventoryListFilter from "./InventoryListFilter";
import InventoryDialogs from "./InventoryDialogs";

// Add default export to fix the error
const InventoryList = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Fetch inventory data
  const {
    data: inventoryItems = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*");
      
      if (error) throw error;
      
      // Transform the data to match our InventoryItem type
      return (data || []).map(item => ({
        id: parseInt(item.id),
        sku: item.sku || "",
        name: item.name,
        department: item.department || "",
        quantity: item.quantity,
        status: item.status,
        lastUpdated: new Date(item.last_updated).toLocaleDateString(),
      }));
    }
  });

  // Get unique departments and statuses for filters
  const departments = [...new Set(inventoryItems.map(item => item.department))];
  const statuses = [...new Set(inventoryItems.map(item => item.status))];

  // Apply filters
  const filteredData = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !departmentFilter || item.department === departmentFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Save (add or edit) inventory item
  const handleSaveItem = async (data: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const isEditing = !!editingItem;
    const today = new Date().toISOString();
    
    try {
      if (isEditing && editingItem) {
        // Update existing item
        const { error } = await supabase
          .from("inventory_items")
          .update({
            sku: data.sku,
            name: data.name,
            department: data.department,
            quantity: data.quantity, 
            status: data.status,
            last_updated: today
          })
          .eq("id", editingItem.id.toString()); // Convert number to string
          
        if (error) throw error;
        toast("Success: Item updated successfully");
      } else {
        // Add new item
        const { error } = await supabase
          .from("inventory_items")
          .insert({
            sku: data.sku,
            name: data.name,
            department: data.department,
            quantity: data.quantity,
            status: data.status,
            last_updated: today,
            user_id: "00000000-0000-0000-0000-000000000000" // Default user ID for demo
          });
          
        if (error) throw error;
        toast("Success: Item added successfully");
      }
      
      // Refresh data after changes
      refetch();
      
    } catch (err) {
      console.error("Error saving inventory item:", err);
      toast("Error: Failed to save item");
    }
  };

  // Delete item
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", itemToDelete.id.toString()); // Convert number to string
        
      if (error) throw error;
      
      toast("Success: Item deleted successfully");
      refetch();
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      toast("Error: Failed to delete item");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter(null);
    setStatusFilter(null);
  };

  // CSV import
  const handleImportCSV = async (items: Omit<InventoryItem, "id" | "lastUpdated">[]) => {
    const today = new Date().toISOString();
    const dbItems = items.map(item => ({
      ...item,
      last_updated: today,
      quantity: item.quantity,
      user_id: "00000000-0000-0000-0000-000000000000",
    }));
    
    const { error } = await supabase.from("inventory_items").insert(dbItems);
    if (error) {
      toast("Import Failed: Failed to import CSV.");
    } else {
      toast(`Import Successful: ${dbItems.length} items imported.`);
      refetch();
    }
  };

  // CSV export
  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ["sku", "name", "department", "quantity", "status", "lastUpdated"];
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

    toast("CSV Export Successful: " + `${filteredData.length} items exported to CSV.`);
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
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

      {/* Inventory table */}
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
      
      {/* Dialogs */}
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

// Add default export to fix the error
export default InventoryList;
