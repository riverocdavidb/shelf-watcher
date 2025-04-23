import React, { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import * as z from "zod";
import { useInventoryItems, useStockMovements } from "@/services/inventoryService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const movementTypes = [
  { value: "received", label: "Received" },
  { value: "sold", label: "Sold" },
  { value: "damaged", label: "Damaged" },
  { value: "stolen", label: "Stolen" },
  { value: "adjustment", label: "Adjustment" },
];

const movementSchema = z.object({
  sku: z.string().min(3, "SKU required"),
  itemName: z.string().min(2),
  type: z.enum(["received", "sold", "damaged", "stolen", "adjustment"]),
  quantity: z.coerce.number().int().positive("Must be positive"),
  employee: z.string(),
  date: z.union([z.date(), z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Use MM/DD/YYYY")])
});

type MovementFormInputs = z.infer<typeof movementSchema>;

interface Props {
  onSave: (data: Omit<MovementFormInputs, "itemName">) => void;
  initialSku?: string;
}

export const StockMovementForm: React.FC<Props> = ({ onSave, initialSku }) => {
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

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("date", e.target.value);
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
      <div>
        <label className="block text-sm font-medium mb-1">SKU <span className="text-destructive">*</span></label>
        <Input
          value={skuInput}
          onChange={handleSkuChange}
          placeholder="Enter SKU"
          autoComplete="off"
          className="font-mono"
        />
        {skuInput && autocompleteResults.length > 0 && (
          <div className="border rounded-md p-1 bg-background mt-1 z-20 absolute max-w-xs shadow">
            {autocompleteResults.map(sku => (
              <button
                type="button"
                key={sku}
                className="w-full text-left px-2 py-1 hover:bg-muted/80 font-mono"
                onClick={() => handleSelectSku(sku)}
              >
                {sku}
              </button>
            ))}
          </div>
        )}
        {skuInput && !SKUlist.includes(skuInput) && (
          <span className="text-xs text-destructive">SKU Number not valid, Please doublecheck</span>
        )}
      </div>

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

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Controller
          name="date"
          control={form.control}
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  {field.value
                    ? (field.value instanceof Date
                        ? format(field.value, "MM/dd/yyyy")
                        : field.value)
                    : <span>Pick a date or type MM/DD/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    field.value
                      ? (field.value instanceof Date
                          ? field.value
                          : parse(field.value, "MM/dd/yyyy", new Date()))
                      : undefined
                  }
                  onSelect={date => date && field.onChange(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          )}
        />
        <Input
          placeholder="Or type MM/DD/YYYY"
          value={
            form.watch("date") instanceof Date
              ? format(form.watch("date") as Date, "MM/dd/yyyy")
              : (form.watch("date") as string || "")
          }
          onChange={handleDateInputChange}
          className="mt-2"
        />
      </div>

      <div className="flex justify-end pt-3">
        <Button type="submit" disabled={!selectedSKU}>
          Save Movement
        </Button>
      </div>
    </form>
  );
};
