
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useStockMovements } from "@/services/inventoryService";
import { toast } from "@/hooks/use-toast";

type Props = {
  filterBySKU?: string;
};

const headers = [
  "sku","type","quantity","employee","date"
];

export const ExportStockMovementsBtn: React.FC<Props> = ({ filterBySKU }) => {
  const { data: movements = [] } = useStockMovements();

  const handleExport = () => {
    const exportData = filterBySKU
      ? movements.filter(mv => mv.itemId === filterBySKU)
      : movements;
    if (!exportData.length) {
      toast({ title: "No movements to export" });
      return;
    }
    const csvRows = [
      headers.join(","),
      ...exportData.map(mv =>
        [
          mv.itemId,
          mv.type,
          mv.quantity,
          mv.employeeName,
          mv.date ? mv.date.split("T")[0] : "",
        ].join(",")
      )
    ];
    const csv = csvRows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_movements_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast({ title: "Movements exported" });
  };

  return (
    <Button type="button" onClick={handleExport} variant="outline">
      <FileText className="mr-2 h-4 w-4" />
      Export Movements
    </Button>
  );
};
