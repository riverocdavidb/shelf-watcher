
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { departments } from '../inventoryFormUtils';

interface DepartmentFieldProps {
  control: any;
}

const InventoryDepartmentField: React.FC<DepartmentFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="department"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InventoryDepartmentField;
