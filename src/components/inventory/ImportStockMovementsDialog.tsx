
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { FileUp, FileText, AlertCircle } from "lucide-react";
import { useInventoryItems } from "@/services/inventoryService";

type MovementCSV = {
  sku: string;
  type: string;
  quantity: string;
  employee: string;
  date: string;
};

type ParsedMovement = {
  sku: string;
  type: string;
  quantity: number;
  employee: string;
  date: string;
};

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onImport: (movements: ParsedMovement[]) => void;
}

const ImportStockMovementsDialog: React.FC<Props> = ({ open, onOpenChange, onImport }) => {
  const [csv, setCsv] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: inventoryItems = [] } = useInventoryItems();
  const SKUlist = inventoryItems.map(i => i.sku);

  const sample = `sku,type,quantity,employee,date
PRD-1001,received,15,John Smith,04/10/2024
PRD-1002,sold,3,Emily Johnson,04/11/2024
`;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCsv(evt.target?.result as string);
      setError(null);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);
  };

  function parseCSV(raw: string): ParsedMovement[] | null {
    try {
      const lines = raw.trim().split("\n");
      if (lines.length < 2) return [];
      const headers = lines[0].split(",").map(h => h.trim());
      if (!["sku", "type", "quantity", "employee", "date"].every(h => headers.includes(h))) {
        setError("CSV is missing required columns");
        return null;
      }
      const items = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.trim());
        const obj: any = {};
        headers.forEach((h, idx) => { obj[h] = cols[idx]; });
        // Validate SKU (must exist)
        if (!SKUlist.includes(obj.sku)) {
          setError(`Invalid SKU: ${obj.sku}`);
          return null;
        }
        items.push({
          sku: obj.sku,
          type: obj.type.toLowerCase(),
          quantity: parseInt(obj.quantity, 10),
          employee: obj.employee,
          date: obj.date // let backend parse date
        });
      }
      return items;
    } catch (err) {
      setError("Invalid CSV format");
      return null;
    }
  }

  const handleImport = () => {
    setLoading(true);
    setError(null);

    const parsed = parseCSV(csv);
    if (!parsed) {
      setLoading(false);
      return;
    }
    onImport(parsed);
    onOpenChange(false);
    setCsv("");
    toast({
      title: "Movements imported",
      description: `${parsed.length} movements imported.`,
    });
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Stock Movements</DialogTitle>
          <DialogDescription>
            Upload a CSV with your stock movement data or paste it directly.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label htmlFor="csv-upload" className="block text-sm font-medium mb-2">
              Upload CSV File
            </label>
            <div className="flex items-center">
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("csv-upload")?.click()}
                className="w-full justify-start"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Or paste CSV data directly
            </label>
            <Textarea
              value={csv}
              onChange={e => { setCsv(e.target.value); setError(null); }}
              placeholder="Paste CSV movements here..."
              className="min-h-[120px] font-mono text-sm"
            />
          </div>
          {error && (
            <div className="text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Format:</p>
            <p>Columns: sku, type, quantity, employee, date</p>
            <pre className="bg-muted p-2 rounded-md text-xs">
{sample}
            </pre>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!csv.trim() || loading}>
            <FileText className="mr-2 h-4 w-4" />
            Import Movements
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStockMovementsDialog;
