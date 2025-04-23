
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InventoryItemForm from "./InventoryItemForm";

export type InventoryItem = {
  id: number;
  sku: string;
  name: string;
  department: string;
  item_quantity: number;
  item_status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Inactive';
  lastUpdated: string;
};

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  item?: InventoryItem;
  onSuccess?: () => void; // Add onSuccess callback
}

const AddEditItemDialog = ({
  open,
  onOpenChange,
  onSave,
  item,
  onSuccess,
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
          onSuccess={onSuccess}
        />

        {/* DialogFooter handled inside form for alignment */}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditItemDialog;
