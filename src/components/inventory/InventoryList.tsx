import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import InventoryTable from "./InventoryTable";
import InventoryListFilter from "./InventoryListFilter";
import InventoryDialogs from "./InventoryDialogs";

export type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  department: string;
  quantity: number;
  status: string;
  lastUpdated: string;
};

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
        .select("*");

      if (error) throw error;

      return (data || []).map((item) => ({
        id: parseInt(item.id),
        sku: item.sku || "",
        name: item.name,
        department: item.department || "",
        quantity: item.quantity,
        status: item.status,
        lastUpdated: new Date(item.last_updated).toLocaleDateString(),
      }));
    },
    staleTime: 1000 * 60,
  });

  const inventoryItems = React.useMemo(() => {
    if (inventoryItemsRaw.length >= 500) return inventoryItemsRaw;
    const generated: InventoryItem[] = [...inventoryItemsRaw];
    const departments = ["Produce", "Dairy", "Meat & Seafood", "Bakery", "Frozen Foods", "Beverages"];
    const statuses = ["In Stock", "Low Stock", "Out of Stock"];
    let idBase = generated.length ? Math.max(...generated.map(i => i.id)) + 1 : 1;

    while (generated.length < 500) {
      const dept = departments[Math.floor(Math.random() * departments.length)];
      const stat = statuses[Math.floor(Math.random() * statuses.length)];
      const quantity = stat === "Out of Stock" ? 0 : Math.floor(Math.random() * 150) + 1;
      generated.push({
        id: idBase++,
        sku: `SKU-${idBase.toString().padStart(5, "0")}`,
        name: `Sample Item ${idBase}`,
        department: dept,
        quantity,
        status: stat,
        lastUpdated: new Date().toLocaleDateString(),
      });
    }
    return generated;
  }, [inventoryItemsRaw]);

  const departments = [...new Set(inventoryItems.map(item => item.department))];
  const statuses = [...new Set(inventoryItems.map(item => item.status))];

  const filteredData = inventoryItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = !departmentFilter || item.department === departmentFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSaveItem = async (data: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const isEditing = !!editingItem;
    const today = new Date().toISOString();

    try {
      if (isEditing && editingItem) {
        const { error } = await supabase
          .from("inventory_items")
          .update({
            sku: data.sku,
            name: data.name,
            department: data.department,
            quantity: data.quantity,
            status: data.status,
            last_updated: today,
          })
          .eq("id", editingItem.id.toString());

        if (error) throw error;
        toast.success("Item updated successfully");
      } else {
        const { error } = await supabase
          .from("inventory_items")
          .insert({
            sku: data.sku,
            name: data.name,
            department: data.department,
            quantity: data.quantity,
            status: data.status,
            last_updated: today,
            user_id: "00000000-0000-0000-0000-000000000000",
          });

        if (error) throw error;
        toast.success("Item added successfully");
      }

      refetch();
    } catch (err) {
      console.error("Error saving inventory item:", err);
      toast.error("Failed to save item");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      const { error } = await supabase
        .from("inventory_items")
        .delete()
        .eq("id", itemToDelete.id.toString());

      if (error) throw error;
      toast.success("Item deleted successfully");
      refetch();
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      toast.error("Failed to delete item");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter(null);
    setStatusFilter(null);
  };

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
      toast.error("Failed to import CSV.");
    } else {
      toast.success(`${dbItems.length} items imported successfully.`);
      refetch();
    }
  };

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
