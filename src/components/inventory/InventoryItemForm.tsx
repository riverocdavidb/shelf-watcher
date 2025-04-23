
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useInventoryForm } from "./hooks/useInventoryForm";
import InventoryBasicFields from "./forms/InventoryBasicFields";
import InventoryDepartmentField from "./forms/InventoryDepartmentField";
import InventoryQuantityField from "./forms/InventoryQuantityField";
import InventoryStatusField from "./forms/InventoryStatusField";
import type { InventoryItem } from "./AddEditItemDialog";

type InventoryItemFormProps = {
  onSave: (data: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  onClose: () => void;
  item?: InventoryItem;
  onSuccess?: () => void;
};

const InventoryItemForm = ({ onSave, onClose, item, onSuccess }: InventoryItemFormProps) => {
  const { form, loading, isEditing, onSubmit } = useInventoryForm(onSave, onClose, item, onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InventoryBasicFields control={form.control} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InventoryDepartmentField control={form.control} />
          <InventoryQuantityField control={form.control} />
        </div>

        <InventoryStatusField control={form.control} />

        <div className="pt-4 flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? "Update" : "Add"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InventoryItemForm;
