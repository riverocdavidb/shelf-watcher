
import React, { useMemo } from "react";
import { useInventoryItems, useStockMovements } from "@/services/inventoryService";
import { Button } from "@/components/ui/button";
import { useStockMovementForm } from "./hooks/useStockMovementForm";
import SKUField from "./forms/SKUField";
import DatePickerField from "./forms/DatePickerField";
import MovementTypeField from "./forms/MovementTypeField";
import MovementQuantityField from "./forms/MovementQuantityField";
import MovementEmployeeField from "./forms/MovementEmployeeField";
import MovementItemNameField from "./forms/MovementItemNameField";

export const StockMovementForm: React.FC<{
  onSave: (data: any) => Promise<void>;
  initialSku?: string;
  onSuccess?: () => void;
}> = ({ onSave, initialSku, onSuccess }) => {
  const { data: inventoryItems = [] } = useInventoryItems();
  const { data: stockMovements = [] } = useStockMovements();
  
  const employees = useMemo(
    () => Array.from(new Set(stockMovements.map(sm => sm.employeeName))).filter(e => e),
    [stockMovements]
  );
  
  const SKUlist = useMemo(() => inventoryItems.map(item => item.sku), [inventoryItems]);
  
  const skuToItemName = useMemo(() => {
    const map: Record<string, string> = {};
    inventoryItems.forEach(item => { map[item.sku] = item.name; });
    return map;
  }, [inventoryItems]);

  const {
    form,
    skuInput,
    selectedSKU,
    autocompleteResults,
    handleSkuChange,
    handleSelectSku,
    onSubmit
  } = useStockMovementForm(onSave, initialSku, skuToItemName, SKUlist, employees, onSuccess);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
      autoComplete="off"
    >
      <SKUField 
        skuInput={skuInput}
        onSkuChange={handleSkuChange}
        autocompleteResults={autocompleteResults}
        onSelectSku={handleSelectSku}
        isValid={SKUlist.includes(skuInput)}
      />

      <MovementItemNameField 
        itemName={selectedSKU ? skuToItemName[selectedSKU] : ""} 
      />

      <MovementTypeField control={form.control} />
      
      <MovementQuantityField control={form.control} />
      
      <MovementEmployeeField control={form.control} employees={employees} />

      <DatePickerField control={form.control} />

      <div className="flex justify-end pt-3">
        <Button type="submit" disabled={!selectedSKU}>
          Save Movement
        </Button>
      </div>
    </form>
  );
};
