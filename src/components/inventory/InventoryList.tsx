
import { useState, useEffect } from "react";
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

// Mock data
const initialInventoryData = [
  {
    id: 1,
    sku: "PRD001",
    name: "Organic Bananas",
    department: "Produce",
    quantity: 150,
    status: "In Stock",
    lastUpdated: "2024-04-19",
  },
  {
    id: 2,
    sku: "DRY001",
    name: "Whole Grain Pasta",
    department: "Dry Goods",
    quantity: 85,
    status: "Low Stock",
    lastUpdated: "2024-04-19",
  },
  {
    id: 3,
    sku: "DAI001",
    name: "Fresh Milk 1L",
    department: "Dairy",
    quantity: 200,
    status: "In Stock",
    lastUpdated: "2024-04-19",
  },
  {
    id: 4,
    sku: "BAK001",
    name: "Fresh Sourdough Bread",
    department: "Bakery",
    quantity: 45,
    status: "Low Stock",
    lastUpdated: "2024-04-20",
  },
  {
    id: 5,
    sku: "MEA001",
    name: "Grass-Fed Ground Beef",
    department: "Meat & Seafood",
    quantity: 60,
    status: "In Stock",
    lastUpdated: "2024-04-20",
  },
  {
    id: 6,
    sku: "FRZ001",
    name: "Frozen Mixed Berries",
    department: "Frozen Foods",
    quantity: 120,
    status: "In Stock",
    lastUpdated: "2024-04-18",
  },
  {
    id: 7,
    sku: "BEV001",
    name: "Sparkling Water 12-pack",
    department: "Beverages",
    quantity: 10,
    status: "Low Stock",
    lastUpdated: "2024-04-19",
  },
];

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

const InventoryList = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [filteredData, setFilteredData] = useState<InventoryItem[]>(initialInventoryData);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Apply filters and search
  useEffect(() => {
    let result = [...inventoryData];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.sku.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query)
      );
    }
    
    // Apply department filter
    if (departmentFilter) {
      result = result.filter(item => item.department === departmentFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(item => item.status === statusFilter);
    }
    
    setFilteredData(result);
  }, [inventoryData, searchQuery, departmentFilter, statusFilter]);

  // Handle adding a new item
  const handleAddItem = (newItemData: Omit<InventoryItem, "id" | "lastUpdated">) => {
    const today = new Date().toISOString().split('T')[0];
    const newItem: InventoryItem = {
      id: Math.max(0, ...inventoryData.map(item => item.id)) + 1,
      ...newItemData,
      lastUpdated: today,
    };
    
    setInventoryData([...inventoryData, newItem]);
  };

  // Handle editing an item
  const handleEditItem = (editedItemData: Omit<InventoryItem, "id" | "lastUpdated">) => {
    if (!editingItem) return;
    
    const today = new Date().toISOString().split('T')[0];
    const updatedItems = inventoryData.map(item => 
      item.id === editingItem.id 
        ? { ...item, ...editedItemData, lastUpdated: today } 
        : item
    );
    
    setInventoryData(updatedItems);
    setEditingItem(undefined);
  };

  // Start edit process
  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
  };

  // Handle deleting an item
  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    const updatedItems = inventoryData.filter(item => item.id !== itemToDelete.id);
    setInventoryData(updatedItems);
    setItemToDelete(null);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Item Deleted",
      description: `${itemToDelete.name} has been removed from inventory.`,
    });
  };

  // Confirm delete dialog
  const confirmDelete = (item: InventoryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Handle CSV import
  const handleImportCSV = (items: Omit<InventoryItem, "id" | "lastUpdated">[]) => {
    const today = new Date().toISOString().split('T')[0];
    const highestId = Math.max(0, ...inventoryData.map(item => item.id));
    
    const newItems = items.map((item, index) => ({
      ...item,
      id: highestId + index + 1,
      lastUpdated: today,
    }));
    
    setInventoryData([...inventoryData, ...newItems]);
  };

  // Handle CSV export
  const handleExportCSV = () => {
    const headers = ["sku", "name", "department", "quantity", "status", "lastUpdated"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map(item => 
        headers.map(header => item[header as keyof InventoryItem]).join(",")
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

  // Get unique departments for filter
  const departments = Array.from(new Set(inventoryData.map(item => item.department)));
  
  // Get unique statuses for filter
  const statuses = Array.from(new Set(inventoryData.map(item => item.status)));

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
                      {departments.map((dept) => (
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
                      {statuses.map((status) => (
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
