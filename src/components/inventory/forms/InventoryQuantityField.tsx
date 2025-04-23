
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface QuantityFieldProps {
  control: any;
}

const InventoryQuantityField: React.FC<QuantityFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="item_quantity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Quantity</FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder="Enter quantity"
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InventoryQuantityField;
