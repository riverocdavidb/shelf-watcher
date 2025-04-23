
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StockMovement } from "@/services/inventoryService";
import { getMovementColor, formatDate } from "./utils/stockMovementUtils";

interface MovementTableProps {
  movements: StockMovement[];
}

const MovementTable: React.FC<MovementTableProps> = ({ movements }) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Employee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No stock movements found.
              </TableCell>
            </TableRow>
          ) : (
            movements.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.date || "")}</TableCell>
                <TableCell>
                  <Badge className={getMovementColor(item.type)}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {item.itemId?.slice?.(0, 8) ?? ""}
                </TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.employeeName}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default MovementTable;
