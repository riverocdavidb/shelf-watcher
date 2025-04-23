
import React from 'react';
import { Controller } from 'react-hook-form';
import { movementTypes } from "../utils/stockMovementUtils";

interface TypeFieldProps {
  control: any;
}

const MovementTypeField: React.FC<TypeFieldProps> = ({ control }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Movement Type</label>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <select {...field} className="border rounded-md h-10 px-3 py-2 w-full">
            {movementTypes.map(opt =>
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            )}
          </select>
        )}
      />
    </div>
  );
};

export default MovementTypeField;
