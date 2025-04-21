
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InventoryItemForm from "./InventoryItemForm";

export type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  department: string;
  quantity: number;
  status: string;
  lastUpdated: string;
};

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  item?: InventoryItem;
}

const AddEditItemDialog = ({
  open,
  onOpenChange,
  onSave,
  item,
}: AddEditItemDialogProps) => {
  const isEditing = !!item;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this inventory item"
              : "Fill in the details of the new inventory item"}
          </DialogDescription>
        </DialogHeader>

        <InventoryItemForm
          onSave={onSave}
          onClose={() => onOpenChange(false)}
          item={item}
        />

        {/* DialogFooter handled inside form for alignment */}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditItemDialog;
