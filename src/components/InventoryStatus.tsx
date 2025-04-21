
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
import { useMemo } from "react";

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

const InventoryStatus = () => {
  const { data: inventoryStatusData = [], isLoading } = useQuery({
    queryKey: ["inventory_status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_status")
        .select("*");

      if (error) throw error;

      return data || [];
    },
    staleTime: 1000 * 60,
  });

  // Compute aggregated summary values:
  const trackingRate = useMemo(() => {
    if (!inventoryStatusData.length) return 0;
    const totalTracked = inventoryStatusData.reduce((acc, d) => acc + d.tracked_items, 0);
    const totalItems = inventoryStatusData.reduce((acc, d) => acc + d.total_items, 0);
    return totalItems > 0 ? (totalTracked / totalItems) * 100 : 0;
  }, [inventoryStatusData]);

  const compliantDepartments = useMemo(() => {
    if (!inventoryStatusData.length) return 0;
    // Using the mock's 6 departments baseline
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
              {inventoryStatusData.map((item) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
