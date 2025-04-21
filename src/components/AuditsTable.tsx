
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Status color
const statusColor = (status: string) => {
  if (status === "Complete") return "bg-green-100 text-green-800";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-800";
  if (status === "Discrepancy Found") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

// Sample audit data to use when database is empty
const sampleAudits = [
  {
    id: '1',
    title: 'Q1 Produce Inventory Audit',
    status: 'Complete',
    assigned_to: 'Sarah Johnson',
    start_date: '2025-03-15T10:00:00Z',
    end_date: '2025-03-15T15:30:00Z',
    department: 'Produce'
  },
  {
    id: '2',
    title: 'Monthly Electronics Stock Check',
    status: 'In Progress',
    assigned_to: 'Michael Chen',
    start_date: '2025-04-10T09:00:00Z',
    end_date: null,
    department: 'Electronics'
  },
  {
    id: '3',
    title: 'Weekly Perishables Audit',
    status: 'Discrepancy Found',
    assigned_to: 'Emily Rodriguez',
    start_date: '2025-04-18T08:30:00Z',
    end_date: '2025-04-18T11:45:00Z',
    department: 'Dairy & Refrigerated'
  },
  {
    id: '4',
    title: 'Annual Full Store Inventory',
    status: 'Pending',
    assigned_to: 'Robert Williams',
    start_date: '2025-05-01T07:00:00Z',
    end_date: null,
    department: 'All Departments'
  },
  {
    id: '5',
    title: 'Loss Prevention Special Audit',
    status: 'Complete',
    assigned_to: 'Jennifer Taylor',
    start_date: '2025-04-05T16:00:00Z',
    end_date: '2025-04-05T19:30:00Z',
    department: 'High-Value Items'
  }
];

export default function AuditsTable() {
  const [search, setSearch] = useState("");
  const [dataInitialized, setDataInitialized] = useState(false);

  const { data: audits = [], isLoading, error, refetch } = useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .order("start_date", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // If no data, return sample data
      if (!data || data.length === 0) {
        console.log("No audit data found, using sample data.");
        return sampleAudits;
      }
      
      return data || [];
    },
  });

  // Populate the table with sample data if it's empty
  useEffect(() => {
    const initializeData = async () => {
      if (dataInitialized) return;
      
      try {
        const { count, error: countError } = await supabase
          .from("audits")
          .select("*", { count: 'exact', head: true });
          
        if (countError) {
          console.error("Error checking audit count:", countError);
          return;
        }
        
        // If no data exists, insert sample data
        if (count === 0) {
          console.log("No audit data found, inserting sample data");
          
          const { error: insertError } = await supabase
            .from("audits")
            .insert(sampleAudits);
            
          if (insertError) {
            console.error("Error inserting sample audit data:", insertError);
          } else {
            console.log("Successfully inserted sample audit data.");
            toast.success("Sample audit data has been added for demonstration");
            refetch();
          }
        }
        
        setDataInitialized(true);
      } catch (e) {
        console.error("Exception when initializing audit data:", e);
      }
    };
    
    initializeData();
  }, [dataInitialized, refetch]);

  const filtered = audits.filter((audit) =>
    audit.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div>Loading audits...</div>;
  if (error) return <div>Error loading audits</div>;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-3 py-2 rounded border border-gray-200 w-full md:w-72 bg-white focus:outline-primary"
            placeholder="Search audits"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded border bg-white shadow-sm overflow-x-auto animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map(audit => (
                <TableRow key={audit.id}>
                  <TableCell>{audit.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded ${statusColor(audit.status)} text-xs font-semibold`}>
                      {audit.status}
                    </span>
                  </TableCell>
                  <TableCell>{audit.assigned_to || "N/A"}</TableCell>
                  <TableCell>{audit.start_date ? new Date(audit.start_date).toLocaleDateString() : ""}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <FileText className="h-4 w-4" /> Report
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No audits found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
