
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useEffect } from "react";
import { toast } from "sonner";

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Good":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Warning":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Critical":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

// Sample data to use when database is empty
const sampleInventoryStatus = [
  {
    id: '1',
    department: 'Produce',
    total_items: 325,
    tracked_items: 310,
    discrepancies: 15,
    shrinkage_rate: 4.6,
    status: 'Warning'
  },
  {
    id: '2',
    department: 'Meat & Seafood',
    total_items: 189,
    tracked_items: 175,
    discrepancies: 14,
    shrinkage_rate: 7.4,
    status: 'Critical'
  },
  {
    id: '3',
    department: 'Dairy',
    total_items: 210,
    tracked_items: 208,
    discrepancies: 2,
    shrinkage_rate: 0.95,
    status: 'Good'
  },
  {
    id: '4',
    department: 'Bakery',
    total_items: 150,
    tracked_items: 146,
    discrepancies: 4,
    shrinkage_rate: 2.6,
    status: 'Warning'
  },
  {
    id: '5',
    department: 'Frozen Foods',
    total_items: 278,
    tracked_items: 275,
    discrepancies: 3,
    shrinkage_rate: 1.1,
    status: 'Good'
  },
  {
    id: '6',
    department: 'Beverages',
    total_items: 195,
    tracked_items: 192,
    discrepancies: 3,
    shrinkage_rate: 1.5,
    status: 'Good'
  }
];

const InventoryStatus = () => {
  const { data: inventoryStatusData = [], isLoading } = useQuery({
    queryKey: ["inventory_status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_status")
        .select("*");

      if (error) {
        console.error("Error fetching inventory status:", error);
        throw error;
      }

      // If no data, populate the table with sample data
      if (!data || data.length === 0) {
        console.log("No inventory status data found, using sample data.");
        
        // Optionally, we can insert the sample data into the database
        try {
          const { error: insertError } = await supabase
            .from("inventory_status")
            .insert(sampleInventoryStatus);
            
          if (insertError) {
            console.error("Error inserting sample data:", insertError);
          } else {
            console.log("Successfully inserted sample data.");
          }
        } catch (e) {
          console.error("Exception when inserting sample data:", e);
        }
        
        return sampleInventoryStatus;
      }

      return data || [];
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (inventoryStatusData.length > 0) {
      console.log("Loaded inventory status data:", inventoryStatusData);
    }
  }, [inventoryStatusData]);

  // Compute aggregated summary values:
  const trackingRate = useMemo(() => {
    if (!inventoryStatusData.length) return 0;
    const totalTracked = inventoryStatusData.reduce((acc, d) => acc + d.tracked_items, 0);
    const totalItems = inventoryStatusData.reduce((acc, d) => acc + d.total_items, 0);
    return totalItems > 0 ? (totalTracked / totalItems) * 100 : 0;
  }, [inventoryStatusData]);

  const compliantDepartments = useMemo(() => {
    if (!inventoryStatusData.length) return 0;
    const compliantCount = inventoryStatusData.filter(d => d.discrepancies <= 5).length;
    return compliantCount;
  }, [inventoryStatusData]);

  const totalDepartmentsCount = inventoryStatusData.length || 6;

  const totalDiscrepancies = useMemo(() => {
    if (!inventoryStatusData.length) return 0;
    return inventoryStatusData.reduce((acc, d) => acc + d.discrepancies, 0);
  }, [inventoryStatusData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Department Inventory Status</h3>
        <Badge variant="outline" className="ml-2">
          Last updated: Today, 10:45 AM
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Inventory Tracking Rate
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">{trackingRate.toFixed(1)}%</div>
              <div className="text-green-600 text-sm font-medium">+0.5%</div>
            </div>
            <Progress value={trackingRate} className="h-2 mt-2" />
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Department Compliance
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">{compliantDepartments}/{totalDepartmentsCount}</div>
              <div className="text-yellow-600 text-sm font-medium">
                {totalDepartmentsCount > 0 ? ((compliantDepartments*100)/totalDepartmentsCount).toFixed(1) : "0"}%
              </div>
            </div>
            <Progress value={totalDepartmentsCount > 0 ? (compliantDepartments*100)/totalDepartmentsCount : 0} className="h-2 mt-2" />
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Total Discrepancies
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">{totalDiscrepancies}</div>
              <div className="text-red-600 text-sm font-medium">+12</div>
            </div>
            <Progress value={totalDiscrepancies} max={100} className="h-2 mt-2 bg-gray-100" />
          </div>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Tracked</TableHead>
                <TableHead className="text-right">Discrepancies</TableHead>
                <TableHead className="text-right">Shrinkage %</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">Loading inventory data...</TableCell>
                </TableRow>
              ) : inventoryStatusData.length > 0 ? (
                inventoryStatusData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.department}</TableCell>
                    <TableCell className="text-right">{item.total_items}</TableCell>
                    <TableCell className="text-right">{item.tracked_items}</TableCell>
                    <TableCell className="text-right">{item.discrepancies}</TableCell>
                    <TableCell className="text-right">{item.shrinkage_rate.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <Badge className={`${getBadgeColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No inventory data available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
