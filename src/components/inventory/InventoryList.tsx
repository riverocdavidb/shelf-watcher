import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useInventoryItems } from "@/services/inventoryService";
import { supabase } from "@/integrations/supabase/client";
import type { InventoryItem as InventoryItemType } from "./AddEditItemDialog";
import InventoryListFilter from "./InventoryListFilter";
import InventoryTable from "./InventoryTable";
import InventoryDialogs from "./InventoryDialogs";

// This utility function is used for UI coloring (kept for reference)
const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Out of Stock":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const departments = [
  "Produce",
  "Dairy",
  "Meat & Seafood",
  "Bakery",
  "Frozen Foods",
  "Dry Goods",
  "Beverages",
];

const statuses = ["In Stock", "Low Stock", "Out of Stock"];

// Convert db row to InventoryItem for the UI
function normalizeDbItem(db: any): InventoryItemType {
  return {
    id: db.id,
    sku: db.sku || "",
    name: db.name,
    department: db.department || "",
    quantity: db.quantity,
    status: db.status,
    lastUpdated: db.last_updated?.split("T")[0] || "",
  };
}

const InventoryList = () => {
  // Fetch data from Supabase
  const { data, isLoading, error, refetch } = useInventoryItems();

  // List filters and dialogs
  const [filteredData, setFilteredData] = useState<InventoryItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItemType | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItemType | null>(null);

  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      return;
    }
    let items = data.map(normalizeDbItem);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      );
    }
    if (departmentFilter) {
      items = items.filter(item => item.department === departmentFilter);
    }
    if (statusFilter) {
      items = items.filter(item => item.status === statusFilter);
    }
    setFilteredData(items);
  }, [data, searchQuery, departmentFilter, statusFilter]);

  // Add new item to Supabase
  const handleAddItem = async (newItemData: Omit<InventoryItemType, "id" | "lastUpdated">) => {
    const today = new Date().toISOString();
    const { error } = await supabase.from("inventory_items").insert([{
      ...newItemData,
      last_updated: today,
      // For now, assign a fixed user_id since this demo doesn't link users
      user_id: "00000000-0000-0000-0000-000000000000",
    }]);
    if (error) {
      toast({ title: "Error", description: "Failed to add item." });
    } else {
      toast({ title: "Item Added", description: `${newItemData.name} added to inventory.` });
      refetch();
    }
  };

  // Edit item in Supabase
  const handleEditItem = async (editedItemData: Omit<InventoryItemType, "id" | "lastUpdated">) => {
    if (!editingItem) return;
    const today = new Date().toISOString();
    const { error } = await supabase.from("inventory_items")
      .update({
        ...editedItemData,
        last_updated: today,
        user_id: "00000000-0000-0000-0000-000000000000",
      })
      .eq("id", editingItem.id);
    if (error) {
      toast({ title: "Error", description: "Failed to update item." });
    } else {
      toast({ title: "Item Updated", description: `${editedItemData.name} updated.` });
      refetch();
    }
    setEditingItem(undefined);
  };

  // Delete item from Supabase
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from("inventory_items").delete().eq("id", itemToDelete.id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete item." });
    } else {
      toast({ title: "Item Deleted", description: `${itemToDelete.name} has been removed.` });
      refetch();
    }
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  // CSV import
  const handleImportCSV = async (items: Omit<InventoryItemType, "id" | "lastUpdated">[]) => {
    const today = new Date().toISOString();
    const dbItems = items.map(item => ({
      ...item,
      last_updated: today,
      user_id: "00000000-0000-0000-0000-000000000000",
    }));
    const { error } = await supabase.from("inventory_items").insert(dbItems);
    if (error) {
      toast({ title: "Import Failed", description: "Failed to import CSV." });
    } else {
      toast({ title: "Import Successful", description: `${dbItems.length} items imported.` });
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

    toast({
      title: "CSV Export Successful",
      description: `${filteredData.length} items exported to CSV.`,
    });
  };

  // Get unique departments for filter (based on loaded data)
  const currentDepartments = Array.from(new Set((data || []).map((d: any) => d.department || ""))).filter(Boolean);
  // Get unique statuses for filter (based on loaded data)
  const currentStatuses = Array.from(new Set((data || []).map((d: any) => d.status))).filter(Boolean);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter(null);
    setStatusFilter(null);
  };

  // Event handlers
  const startEdit = (item: InventoryItemType) => setEditingItem(item);
  const confirmDelete = (item: InventoryItemType) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <InventoryListFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentDepartments={currentDepartments}
        currentStatuses={currentStatuses}
        clearFilters={clearFilters}
        onImportClick={() => setImportDialogOpen(true)}
        onExportClick={handleExportCSV}
        onAddClick={() => setAddDialogOpen(true)}
      />
      <InventoryTable
        data={filteredData}
        isLoading={isLoading}
        error={error}
        onEdit={startEdit}
        onDelete={confirmDelete}
      />
      <InventoryDialogs
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
        onSave={editingItem ? handleEditItem : handleAddItem}
        importDialogOpen={importDialogOpen}
        setImportDialogOpen={setImportDialogOpen}
        onImport={handleImportCSV}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        onDeleteConfirm={handleDeleteItem}
        itemToDelete={itemToDelete}
      />
    </div>
  );
};

export default InventoryList;
