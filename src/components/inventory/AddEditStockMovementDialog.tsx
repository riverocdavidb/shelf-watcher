
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockMovementForm } from "./StockMovementForm";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  onSave: (data: any) => void;
}

const AddEditStockMovementDialog = ({ open, onOpenChange, onSave }: Props) => {
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
        />
        {/* DialogFooter handled inside <StockMovementForm> for alignment */}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditStockMovementDialog;
