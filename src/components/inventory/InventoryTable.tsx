
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { InventoryItem } from "./AddEditItemDialog";

type InventoryTableProps = {
  data: InventoryItem[];
  isLoading: boolean;
  error: any;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
};

// Utility for UI coloring
const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Out of Stock":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const InventoryTable = ({
  data,
  isLoading,
  error,
  onEdit,
  onDelete,
}: InventoryTableProps) => {
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
      {isLoading ? (
        <div className="text-center py-8">Loading inventory...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          Error loading inventory. Please try again.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">SKU</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No inventory items found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default InventoryTable;
