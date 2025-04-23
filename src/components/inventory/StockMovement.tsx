
import React, { useState } from "react";
import { useStockMovements, useInventoryItems } from "@/services/inventoryService";
import { Loader2 } from "lucide-react";
import AddEditStockMovementDialog from "./AddEditStockMovementDialog";
import ImportStockMovementsDialog from "./ImportStockMovementsDialog";
import MovementSearchBar from "./MovementSearchBar";
import MovementFilters from "./MovementFilters";
import MovementActionButtons from "./MovementActionButtons";
import MovementTable from "./MovementTable";
import { useMovementFilters } from "./hooks/useMovementFilters";
import { useStockMovementOperations } from "./hooks/useStockMovementOperations";

const StockMovement = () => {
  const { data: movements = [], isLoading, error, refetch } = useStockMovements();
  const { data: inventoryItems = [] } = useInventoryItems();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const {
    search, 
    setSearch, 
    filterType, 
    setFilterType,
    filterEmployee, 
    setFilterEmployee,
    movementTypes,
    employeeNames,
    filteredMovements
  } = useMovementFilters(movements);

  const { handleAddMovement, handleImportMovements } = useStockMovementOperations(refetch);

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
        onSuccess={() => {
          refetch();
          setAddDialogOpen(false);
        }}
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
