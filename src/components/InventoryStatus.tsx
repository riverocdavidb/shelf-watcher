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
import SummaryCards from "./inventory-status/SummaryCards";
import DepartmentStatusTable from "./inventory-status/DepartmentStatusTable";

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
        <SummaryCards
          trackingRate={trackingRate}
          compliantDepartments={compliantDepartments}
          totalDepartmentsCount={totalDepartmentsCount}
          totalDiscrepancies={totalDiscrepancies}
        />
        <DepartmentStatusTable
          isLoading={isLoading}
          data={inventoryStatusData}
        />
      </div>
    </div>
  );
};

export default InventoryStatus;
