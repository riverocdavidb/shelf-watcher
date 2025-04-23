
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockMovementForm } from "./StockMovementForm";

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onSave: (data: any) => Promise<void>;
  initialSku?: string;
  onSuccess?: () => void; // Add onSuccess callback
}

const AddEditStockMovementDialog = ({ open, onOpenChange, onSave, initialSku, onSuccess }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Stock Movement</DialogTitle>
          <DialogDescription>
            Fill in the details of the new inventory movement
          </DialogDescription>
        </DialogHeader>
        <StockMovementForm
          onSave={onSave}
          initialSku={initialSku}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddEditStockMovementDialog;
