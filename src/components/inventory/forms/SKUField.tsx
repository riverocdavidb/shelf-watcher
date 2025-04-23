
import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface SKUFieldProps {
  skuInput: string;
  onSkuChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autocompleteResults: string[];
  onSelectSku: (sku: string) => void;
  isValid: boolean;
}

const SKUField: React.FC<SKUFieldProps> = ({
  skuInput,
  onSkuChange,
  autocompleteResults,
  onSelectSku,
  isValid
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">SKU <span className="text-destructive">*</span></label>
      <Input
        value={skuInput}
        onChange={onSkuChange}
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
              onClick={() => onSelectSku(sku)}
            >
              {sku}
            </button>
          ))}
        </div>
      )}
      {skuInput && !isValid && (
        <span className="text-xs text-destructive">SKU Number not valid, Please doublecheck</span>
      )}
    </div>
  );
};

export default SKUField;
