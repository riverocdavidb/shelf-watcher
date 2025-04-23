
import { useState, useMemo } from "react";
import type { InventoryItem } from "../AddEditItemDialog";

export const useInventoryFilters = (inventoryItems: InventoryItem[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const departments = useMemo(
    () => [...new Set(inventoryItems.map(item => item.department))],
    [inventoryItems]
  );
  
  const statuses = useMemo(
    () => [...new Set(inventoryItems.map(item => item.item_status))],
    [inventoryItems]
  );

  const filteredData = useMemo(
    () => inventoryItems.filter(item => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = !departmentFilter || item.department === departmentFilter;
      const matchesStatus = !statusFilter || item.item_status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    }),
    [inventoryItems, searchQuery, departmentFilter, statusFilter]
  );

  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter(null);
    setStatusFilter(null);
  };

  return {
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
  };
};
