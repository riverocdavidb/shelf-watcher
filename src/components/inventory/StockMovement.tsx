
import React, { useState } from "react";
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
import { useStockMovements } from "@/services/inventoryService";
import { Loader2 } from "lucide-react";
import { StockMovementForm } from "./StockMovementForm";
import ImportStockMovementsDialog from "./ImportStockMovementsDialog";
import { ExportStockMovementsBtn } from "./ExportStockMovementsBtn";
import { toast } from "@/hooks/use-toast";

const getMovementColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "received":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "sold":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "damaged":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "stolen":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "adjustment":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (err) {
    return dateString;
  }
};

const StockMovement = () => {
  const { data: movements = [], isLoading, error } = useStockMovements();

  const [showImport, setShowImport] = useState(false);

  // TODO: Save movement to DB (Edge function/Supabase)
  const handleAddMovement = (data: any) => {
    toast({
      title: "Movement registered",
      description: `Type: ${data.type} - SKU: ${data.sku} - Qty: ${data.quantity}`,
    });
    // Aquí se debe guardar el movimiento real usando Supabase
  };

  const handleImportMovements = (movements: any[]) => {
    // Aquí se pueden guardar los movimientos usando Supabase
    toast({
      title: "Importación recibida",
      description: `${movements.length} movimientos recibidos`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="ml-2">Loading stock movements...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading stock movements. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h2 className="font-semibold text-lg">Register Movement</h2>
        <div className="flex gap-2">
          <ExportStockMovementsBtn />
          <Button type="button" onClick={() => setShowImport(true)} variant="outline">
            Import Movements
          </Button>
        </div>
      </div>
      <StockMovementForm onSave={handleAddMovement} />
      <ImportStockMovementsDialog open={showImport} onOpenChange={setShowImport} onImport={handleImportMovements} />

      <div className="rounded-md border">
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
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>
                    <Badge className={getMovementColor(item.type)}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.itemId.slice(0, 8)}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.employeeName}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockMovement;
