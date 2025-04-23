
import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from "@/components/ui/input";

interface QuantityFieldProps {
  control: any;
}

const MovementQuantityField: React.FC<QuantityFieldProps> = ({ control }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Quantity</label>
      <Controller
        name="quantity"
        control={control}
        render={({ field }) => (
          <Input
            type="number"
            min={1}
            {...field}
          />
        )}
      />
    </div>
  );
};

export default MovementQuantityField;
