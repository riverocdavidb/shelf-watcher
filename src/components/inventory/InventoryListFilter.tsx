
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter,
  X,
  FileUp,
  FileDown,
  Package,
} from "lucide-react";

interface InventoryListFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  departmentFilter: string | null;
  setDepartmentFilter: (val: string | null) => void;
  statusFilter: string | null;
  setStatusFilter: (val: string | null) => void;
  currentDepartments: string[];
  currentStatuses: string[];
  clearFilters: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onAddClick: () => void;
}

const InventoryListFilter = ({
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
  statusFilter,
  setStatusFilter,
  currentDepartments,
  currentStatuses,
  clearFilters,
  onImportClick,
  onExportClick,
  onAddClick,
}: InventoryListFilterProps) => {
  return (
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
          <PopoverContent className="w-72 z-50 bg-background">
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
                <Button variant="ghost" className="w-full" onClick={clearFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" size="sm" onClick={onImportClick}>
          <FileUp className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
        <Button variant="outline" size="sm" onClick={onExportClick}>
          <FileDown className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button onClick={onAddClick}>
          <Package className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default InventoryListFilter;
