
import { useState, useMemo } from "react";
import { StockMovement } from "@/services/inventoryService";

export const useMovementFilters = (movements: StockMovement[]) => {
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

  return {
    search, 
    setSearch, 
    filterType, 
    setFilterType,
    filterEmployee, 
    setFilterEmployee,
    movementTypes,
    employeeNames,
    filteredMovements
  };
};
