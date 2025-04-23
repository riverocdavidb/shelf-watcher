
import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import InventoryTable from "./InventoryTable";
import InventoryListFilter from "./InventoryListFilter";
import InventoryDialogs from "./InventoryDialogs";
import { useInventoryItems } from "@/services/inventoryService";
import { useInventoryFilters } from "./hooks/useInventoryFilters";
import { useInventoryOperations } from "./hooks/useInventoryOperations";
import { handleExportCSV } from "./utils/exportUtils";
import type { InventoryItem } from "./AddEditItemDialog";

const InventoryList = () => {
  const { data: rawInventoryItems = [], isLoading, error, refetch } = useInventoryItems();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const inventoryItems: InventoryItem[] = useMemo(() => {
    return rawInventoryItems.map(item => ({
      id: typeof item.id === 'string' ? parseInt(item.id.replace(/\D/g, '').slice(0, 8), 16) || Math.floor(Math.random() * 100000) : item.id,
      sku: item.sku || "",
      name: item.name || "",
      department: item.department || "",
      item_quantity: item.item_quantity || 0,
      item_status: item.item_status || "In Stock",
      lastUpdated: new Date(item.lastUpdated).toLocaleDateString()
    }));
  }, [rawInventoryItems]);

  const {
    searchQuery,
    setSearchQuery,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    departments,
    statuses,
    filteredData,
    clearFilters
  } = useInventoryFilters(inventoryItems);

  const {
    itemToDelete,
    setItemToDelete,
    handleSaveItem,
    handleDeleteConfirm,
    handleImportCSV
  } = useInventoryOperations(refetch);

  const onExportClick = () => {
    const exportedCount = handleExportCSV(filteredData);
    if (exportedCount) {
      toast.success(`${exportedCount} items exported to CSV.`);
    }
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
        onExportClick={onExportClick}
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
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default InventoryList;
