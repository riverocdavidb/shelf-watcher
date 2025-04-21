
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Package, 
  FileUp, 
  FileDown, 
  Edit, 
  Trash2,
  Filter,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddEditItemDialog, { InventoryItem } from "./AddEditItemDialog";
import ImportCSVDialog from "./ImportCSVDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useInventoryItems } from "@/services/inventoryService";
import { supabase } from "@/integrations/supabase/client";

// Utility for UI coloring
const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Out of Stock":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const departments = [
  "Produce",
  "Dairy",
  "Meat & Seafood",
  "Bakery",
  "Frozen Foods",
  "Dry Goods",
  "Beverages",
];

const statuses = ["In Stock", "Low Stock", "Out of Stock"];

const InventoryList = () => {
  // Fetch data from Supabase
  const { data, isLoading, error, refetch } = useInventoryItems();

  // List filters and dialogs
  const [filteredData, setFilteredData] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Convert "db inventory" to InventoryItem for UI. DB ids are uuid.
  function normalizeDbItem(db: any): InventoryItem {
    return {
      id: db.id,
      sku: db.sku || "",
      name: db.name,
      department: db.department || "",
      quantity: db.quantity,
      status: db.status,
      lastUpdated: db.last_updated?.split("T")[0] || "",
    };
  }

  // Apply filters and search
  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      return;
    }
    let items = data.map(normalizeDbItem);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      );
    }
    if (departmentFilter) {
      items = items.filter(item => item.department === departmentFilter);
    }
    if (statusFilter) {
      items = items.filter(item => item.status === statusFilter);
    }
    setFilteredData(items);
  }, [data, searchQuery, departmentFilter, statusFilter]);

  // Add new item to Supabase
  const handleAddItem = async (newItemData: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const today = new Date().toISOString();
    const { error } = await supabase.from("inventory_items").insert([{
      ...newItemData,
      last_updated: today,
      // For now, assign a fixed user_id since this demo doesn't link users
      user_id: "00000000-0000-0000-0000-000000000000",
    }]);
    if (error) {
      toast({ title: "Error", description: "Failed to add item." });
    } else {
      toast({ title: "Item Added", description: `${newItemData.name} added to inventory.` });
      refetch();
    }
  };

  // Edit item in Supabase
  const handleEditItem = async (editedItemData: Omit<InventoryItem, "id" | "lastUpdated">) => {
    if (!editingItem) return;
    const today = new Date().toISOString();
    const { error } = await supabase.from("inventory_items")
      .update({
        ...editedItemData,
        last_updated: today,
        user_id: "00000000-0000-0000-0000-000000000000",
      })
      .eq("id", editingItem.id);
    if (error) {
      toast({ title: "Error", description: "Failed to update item." });
    } else {
      toast({ title: "Item Updated", description: `${editedItemData.name} updated.` });
      refetch();
    }
    setEditingItem(undefined);
  };

  // Delete item from Supabase
  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    const { error } = await supabase.from("inventory_items").delete().eq("id", itemToDelete.id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete item." });
    } else {
      toast({ title: "Item Deleted", description: `${itemToDelete.name} has been removed.` });
      refetch();
    }
    setItemToDelete(null);
    setDeleteDialogOpen(false);
  };

  // Start edit process
  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
  };

  // Confirm delete dialog
  const confirmDelete = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Handle CSV import
  const handleImportCSV = async (items: Omit<InventoryItem, "id" | "lastUpdated">[]) => {
    const today = new Date().toISOString();
    const dbItems = items.map(item => ({
      ...item,
      last_updated: today,
      user_id: "00000000-0000-0000-0000-000000000000",
    }));
    const { error } = await supabase.from("inventory_items").insert(dbItems);
    if (error) {
      toast({ title: "Import Failed", description: "Failed to import CSV." });
    } else {
      toast({ title: "Import Successful", description: `${dbItems.length} items imported.` });
      refetch();
    }
  };

  // Handle CSV export
  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = ["sku", "name", "department", "quantity", "status", "lastUpdated"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map(item => 
        headers.map(header => (item as any)[header]).join(",")
      )
    ];
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_export.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Export Successful",
      description: `${filteredData.length} items exported to CSV.`,
    });
  };

  // Get unique departments for filter (based on loaded data)
  const currentDepartments = Array.from(new Set((data || []).map((d) => d.department || ""))).filter(Boolean);

  // Get unique statuses for filter (based on loaded data)
  const currentStatuses = Array.from(new Set((data || []).map((d) => d.status))).filter(Boolean);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setDepartmentFilter(null);
    setStatusFilter(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search inventory..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {(departmentFilter || statusFilter) && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">
                    {(departmentFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Inventory</h4>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select 
                    value={departmentFilter || "all"} 
                    onValueChange={(value) => setDepartmentFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {currentDepartments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    value={statusFilter || "all"} 
                    onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {currentStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(departmentFilter || statusFilter) && (
                  <Button 
                    variant="ghost" 
                    className="w-full" 
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          
          <Button onClick={() => setAddDialogOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-8">Loading inventory...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading inventory. Please try again.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">SKU</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No inventory items found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {item.lastUpdated}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => confirmDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Item Dialog */}
      <AddEditItemDialog
        open={addDialogOpen || !!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setAddDialogOpen(false);
            setEditingItem(undefined);
          }
        }}
        onSave={editingItem ? handleEditItem : handleAddItem}
        item={editingItem}
      />

      {/* Import CSV Dialog */}
      <ImportCSVDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportCSV}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteItem}
        itemName={itemToDelete?.name || ""}
      />
    </div>
  );
};

export default InventoryList;
