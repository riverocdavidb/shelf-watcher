
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { inventoryItemFormSchema } from '../inventoryFormUtils';
import type { InventoryItem } from '../AddEditItemDialog';

export const useInventoryForm = (
  onSave: (data: Omit<InventoryItem, "id" | "lastUpdated">) => void,
  onClose: () => void,
  item?: InventoryItem,
  onSuccess?: () => void
) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!item;

  const form = useForm({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: {
      sku: item?.sku || "",
      name: item?.name || "",
      department: item?.department || "",
      item_quantity: item?.item_quantity || 0,
      item_status: item?.item_status || "",
    },
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        sku: values.sku,
        name: values.name,
        department: values.department,
        item_quantity: values.item_quantity,
        item_status: values.item_status,
      };
      onSave(formData);
      form.reset();
      onClose();
      toast({
        title: `Item ${isEditing ? "updated" : "added"} successfully`,
        description: `${values.name} has been ${isEditing ? "updated" : "added"} to inventory.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Could not save the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isEditing,
    onSubmit
  };
};
