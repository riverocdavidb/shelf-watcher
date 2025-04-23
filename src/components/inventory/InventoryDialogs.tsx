
import AddEditItemDialog, { InventoryItem } from "./AddEditItemDialog";
import ImportCSVDialog from "./ImportCSVDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

type InventoryDialogsProps = {
  addDialogOpen: boolean;
  setAddDialogOpen: (b: boolean) => void;
  editingItem?: InventoryItem;
  setEditingItem: (i: InventoryItem | undefined) => void;
  onSave: (data: Omit<InventoryItem, "id" | "lastUpdated">) => void;
  importDialogOpen: boolean;
  setImportDialogOpen: (b: boolean) => void;
  onImport: (items: Omit<InventoryItem, "id" | "lastUpdated">[]) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (b: boolean) => void;
  onDeleteConfirm: () => void;
  itemToDelete: InventoryItem | null;
  onSuccess?: () => void; // Add onSuccess callback
};

const InventoryDialogs = ({
  addDialogOpen,
  setAddDialogOpen,
  editingItem,
  setEditingItem,
  onSave,
  importDialogOpen,
  setImportDialogOpen,
  onImport,
  deleteDialogOpen,
  setDeleteDialogOpen,
  onDeleteConfirm,
  itemToDelete,
  onSuccess,
}: InventoryDialogsProps) => (
  <>
    <AddEditItemDialog
      open={addDialogOpen || !!editingItem}
      onOpenChange={(open) => {
        if (!open) {
          setAddDialogOpen(false);
          setEditingItem(undefined);
        }
      }}
      onSave={onSave}
      item={editingItem}
      onSuccess={onSuccess} // Pass onSuccess callback
    />
    <ImportCSVDialog
      open={importDialogOpen}
      onOpenChange={setImportDialogOpen}
      onImport={onImport}
    />
    <DeleteConfirmDialog
      open={deleteDialogOpen}
      onOpenChange={setDeleteDialogOpen}
      onConfirm={onDeleteConfirm}
      itemName={itemToDelete?.name || ""}
    />
  </>
);

export default InventoryDialogs;
