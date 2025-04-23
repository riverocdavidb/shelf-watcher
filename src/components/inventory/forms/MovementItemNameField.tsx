
import React from 'react';
import { Input } from "@/components/ui/input";

interface ItemNameFieldProps {
  itemName: string;
}

const MovementItemNameField: React.FC<ItemNameFieldProps> = ({ itemName }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Item Name</label>
      <Input
        value={itemName}
        disabled
        placeholder="Item name will appear here"
        className="bg-gray-100 text-gray-500"
      />
    </div>
  );
};

export default MovementItemNameField;
