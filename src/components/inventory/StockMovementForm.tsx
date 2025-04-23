import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, parse, isValid } from "date-fns";
import { useInventoryItems, useStockMovements } from "@/services/inventoryService";
import { movementTypes } from "./utils/stockMovementUtils";
import { movementSchema, MovementFormInputs, MovementFormProps } from "./forms/StockMovementSchema";
import SKUField from "./forms/SKUField";
import DatePickerField from "./forms/DatePickerField";

export const StockMovementForm: React.FC<MovementFormProps> = ({ onSave, initialSku, onSuccess }) => {
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
  const skuToItemId = useMemo(() => {
    const map: Record<string, string> = {};
    inventoryItems.forEach(item => { map[item.sku] = item.id; });
    return map;
  }, [inventoryItems]);

  const [skuInput, setSkuInput] = useState(initialSku ?? "");
  const [selectedSKU, setSelectedSKU] = useState<string | null>(initialSku ?? null);
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);

  const form = useForm<MovementFormInputs>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      sku: initialSku ?? "",
      itemName: initialSku && skuToItemName[initialSku] ? skuToItemName[initialSku] : "",
      type: "received",
      quantity: 1,
      employee: employees[0] || "System",
      date: new Date(),
    },
  });

  React.useEffect(() => {
    if (!skuInput) {
      setAutocompleteResults([]);
      setSelectedSKU(null);
      form.setValue("sku", "");
      form.setValue("itemName", "");
      return;
    }
    const lower = skuInput.toLowerCase();
    const results = SKUlist.filter(
      sku => sku.toLowerCase().includes(lower)
    );
    setAutocompleteResults(results.slice(0, 5));
    if (results.length === 1 && results[0] === skuInput) {
      setSelectedSKU(results[0]);
      form.setValue("sku", results[0]);
      form.setValue("itemName", skuToItemName[results[0]] || "");
      setAutocompleteResults([]);
    } else if (SKUlist.includes(skuInput)) {
      setSelectedSKU(skuInput);
      form.setValue("itemName", skuToItemName[skuInput] || "");
    } else {
      setSelectedSKU(null);
      form.setValue("itemName", "");
    }
  }, [skuInput, SKUlist, form, skuToItemName]);

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSkuInput(e.target.value.trim().toUpperCase());
    form.setValue("sku", e.target.value.trim().toUpperCase());
  };

  const handleSelectSku = (sku: string) => {
    setSkuInput(sku);
    setSelectedSKU(sku);
    form.setValue("sku", sku);
    form.setValue("itemName", skuToItemName[sku] || "");
    setAutocompleteResults([]);
  };

  const onSubmit = async (values: MovementFormInputs) => {
    if (!SKUlist.includes(values.sku)) {
      toast({
        title: "SKU Number not valid",
        description: "Please doublecheck",
        variant: "destructive",
      });
      return;
    }

    let dateStr: string;
    if (values.date instanceof Date) {
      dateStr = format(values.date, "yyyy-MM-dd");
    } else {
      const parsed = parse(values.date, "MM/dd/yyyy", new Date());
      if (isNaN(parsed.getTime())) {
        toast({
          title: "Invalid date",
          description: "Use MM/DD/YYYY",
          variant: "destructive",
        });
        return;
      }
      dateStr = format(parsed, "yyyy-MM-dd");
    }

    try {
      await onSave({
        ...values,
        date: dateStr,
      });
      form.reset();
      setSkuInput("");
      setSelectedSKU(null);

      toast({
        title: "Movement registered",
        description: `Type: ${values.type} - SKU: ${values.sku} - Qty: ${values.quantity}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error registering movement",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

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

      <div>
        <label className="block text-sm font-medium mb-1">Item Name</label>
        <Input
          value={selectedSKU ? skuToItemName[selectedSKU] : ""}
          disabled
          placeholder="Item name will appear here"
          className="bg-gray-100 text-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Movement Type</label>
        <Controller
          name="type"
          control={form.control}
          render={({ field }) => (
            <select {...field} className="border rounded-md h-10 px-3 py-2 w-full">
              {movementTypes.map(opt =>
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              )}
            </select>
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Quantity</label>
        <Controller
          name="quantity"
          control={form.control}
          render={({ field }) => (
            <Input
              type="number"
              min={1}
              {...field}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Employee</label>
        <Controller
          name="employee"
          control={form.control}
          render={({ field }) => (
            <select {...field} className="border rounded-md h-10 px-3 py-2 w-full">
              {employees.map(emp =>
                <option value={emp} key={emp}>{emp}</option>
              )}
              <option value="System" key="System">System</option>
            </select>
          )}
        />
      </div>

      <DatePickerField control={form.control} />

      <div className="flex justify-end pt-3">
        <Button type="submit" disabled={!selectedSKU}>
          Save Movement
        </Button>
      </div>
    </form>
  );
};
