
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parse, isValid } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { movementSchema, MovementFormInputs } from '../forms/StockMovementSchema';

export const useStockMovementForm = (
  onSave: (values: any) => Promise<void>,
  initialSku: string | undefined,
  skuToItemName: Record<string, string>,
  SKUlist: string[],
  employees: string[],
  onSuccess?: () => void
) => {
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

  useEffect(() => {
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

  return {
    form,
    skuInput,
    selectedSKU,
    autocompleteResults,
    handleSkuChange,
    handleSelectSku,
    onSubmit
  };
};
