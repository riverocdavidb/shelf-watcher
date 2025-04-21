
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, AlertCircle, FileText } from "lucide-react";
import { InventoryItem } from "./AddEditItemDialog";

interface ImportCSVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: Omit<InventoryItem, "id" | "lastUpdated">[]) => void;
}

const ImportCSVDialog = ({
  open,
  onOpenChange,
  onImport,
}: ImportCSVDialogProps) => {
  const [csvData, setCsvData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvData(text);
      setError(null);
    };
    reader.onerror = () => {
      setError("Error reading file");
    };
    reader.readAsText(file);
  };

  const parseCSV = (data: string) => {
    try {
      const lines = data.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      
      // Validate required headers
      const requiredHeaders = ["sku", "name", "department", "quantity", "status"];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        setError(`Missing required headers: ${missingHeaders.join(", ")}`);
        return null;
      }

      const items: Omit<InventoryItem, "id" | "lastUpdated">[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map(v => v.trim());
        if (values.length !== headers.length) continue;
        
        const item: Record<string, any> = {};
        headers.forEach((header, index) => {
          item[header] = values[index];
        });
        
        // Convert quantity to number
        item.quantity = parseInt(item.quantity, 10);
        
        items.push(item as Omit<InventoryItem, "id" | "lastUpdated">);
      }
      
      return items;
    } catch (err) {
      setError("Invalid CSV format");
      return null;
    }
  };

  const handleImport = () => {
    setLoading(true);
    setError(null);
    
    try {
      const items = parseCSV(csvData);
      if (!items) {
        setLoading(false);
        return;
      }
      
      onImport(items);
      onOpenChange(false);
      setCsvData("");
      toast({
        title: "CSV Import Successful",
        description: `Imported ${items.length} items into inventory.`,
      });
    } catch (err) {
      setError("Failed to import CSV data");
      toast({
        title: "Import Failed",
        description: "There was an error importing your data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleCSV = `sku,name,department,quantity,status
PRD001,Organic Bananas,Produce,150,In Stock
DRY001,Whole Grain Pasta,Dry Goods,85,Low Stock
DAI001,Fresh Milk 1L,Dairy,200,In Stock`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Inventory Items</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your inventory data or paste CSV content directly.
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
                onChange={handleFileUpload}
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
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="Paste CSV data here..."
              className="min-h-[150px] font-mono text-sm"
            />
          </div>

          {error && (
            <div className="text-destructive flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium">CSV Format:</p>
            <p>Required columns: sku, name, department, quantity, status</p>
            <p className="mt-1">Example:</p>
            <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
              {sampleCSV}
            </pre>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!csvData.trim() || loading}
          >
            <FileText className="mr-2 h-4 w-4" />
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// This is needed for the file upload button
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={className}
      {...props}
    />
  );
};

export default ImportCSVDialog;
