
import React from 'react';
import { Controller } from 'react-hook-form';

interface EmployeeFieldProps {
  control: any;
  employees: string[];
}

const MovementEmployeeField: React.FC<EmployeeFieldProps> = ({ control, employees }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Employee</label>
      <Controller
        name="employee"
        control={control}
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
  );
};

export default MovementEmployeeField;
