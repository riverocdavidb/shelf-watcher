
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface MovementFiltersProps {
  filterType: string | null;
  setFilterType: (type: string | null) => void;
  filterEmployee: string | null;
  setFilterEmployee: (employee: string | null) => void;
  movementTypes: string[];
  employeeNames: string[];
}

const MovementFilters: React.FC<MovementFiltersProps> = ({
  filterType,
  setFilterType,
  filterEmployee,
  setFilterEmployee,
  movementTypes,
  employeeNames,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`flex items-center font-medium ${
            filterType || filterEmployee ? "bg-accent" : ""
          }`}
        >
          <Filter className="mr-1 w-4 h-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 z-50 bg-white border rounded-lg p-3 shadow focus:outline-none">
        <DropdownMenuLabel className="font-semibold text-base mb-2">
          Filter Movements
        </DropdownMenuLabel>
        <div className="mb-3">
          <span className="block text-xs font-semibold mb-1">Type</span>
          <select
            className="w-full border rounded-md h-9 px-3 py-1 text-sm bg-gray-50"
            value={filterType || ""}
            onChange={(e) => setFilterType(e.target.value || null)}
          >
            <option value="">All Types</option>
            {movementTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <span className="block text-xs font-semibold mb-1">Employee</span>
          <select
            className="w-full border rounded-md h-9 px-3 py-1 text-sm bg-gray-50"
            value={filterEmployee || ""}
            onChange={(e) => setFilterEmployee(e.target.value || null)}
          >
            <option value="">All Employees</option>
            {employeeNames.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
        <DropdownMenuSeparator className="my-2" />
        <div className="flex justify-end">
          <Button
            variant="ghost"
            type="button"
            size="sm"
            onClick={() => {
              setFilterType(null);
              setFilterEmployee(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MovementFilters;
