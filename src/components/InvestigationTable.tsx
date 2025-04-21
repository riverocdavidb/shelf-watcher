
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileSearch, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusColor = (status: string) => {
  if (status === "Open") return "bg-red-100 text-red-800";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-800";
  if (status === "Closed") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const priorityColor = (priority: string) => {
  if (priority === "High") return "bg-red-200 text-red-700";
  if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
  if (priority === "Low") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
};

// Sample investigation data
const sampleInvestigations = [
  {
    id: '1',
    title: 'Missing electronics inventory',
    status: 'Open',
    assigned_to: 'John Smith',
    created_at: '2025-04-15T08:30:00Z',
    loss_amount: 1250.75,
    priority: 'High',
    department: 'Electronics'
  },
  {
    id: '2',
    title: 'Cosmetics department shrinkage',
    status: 'In Progress',
    assigned_to: 'Maria Garcia',
    created_at: '2025-04-10T14:15:00Z',
    loss_amount: 750.25,
    priority: 'Medium',
    department: 'Health & Beauty'
  },
  {
    id: '3',
    title: 'Register 4 cash discrepancy',
    status: 'Closed',
    assigned_to: 'David Johnson',
    created_at: '2025-04-05T16:45:00Z',
    loss_amount: 124.50,
    priority: 'Low',
    department: 'Front End'
  },
  {
    id: '4',
    title: 'Receiving dock inventory missing',
    status: 'Open',
    assigned_to: 'Sarah Williams',
    created_at: '2025-04-12T09:20:00Z',
    loss_amount: 3200.00,
    priority: 'High',
    department: 'Receiving'
  },
  {
    id: '5',
    title: 'Dairy department expired product',
    status: 'In Progress',
    assigned_to: 'Robert Brown',
    created_at: '2025-04-08T11:30:00Z',
    loss_amount: 425.75,
    priority: 'Medium',
    department: 'Dairy'
  }
];

export default function InvestigationTable() {
  const [search, setSearch] = useState("");
  const [dataInitialized, setDataInitialized] = useState(false);

  const { data: investigations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['investigations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investigations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // If no data, return sample data
      if (!data || data.length === 0) {
        console.log("No investigation data found, using sample data.");
        return sampleInvestigations;
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
          .from("investigations")
          .select("*", { count: 'exact', head: true });
          
        if (countError) {
          console.error("Error checking investigation count:", countError);
          return;
        }
        
        // If no data exists, insert sample data
        if (count === 0) {
          console.log("No investigation data found, inserting sample data");
          
          const { error: insertError } = await supabase
            .from("investigations")
            .insert(sampleInvestigations);
            
          if (insertError) {
            console.error("Error inserting sample investigation data:", insertError);
          } else {
            console.log("Successfully inserted sample investigation data.");
            toast.success("Sample investigation data has been added for demonstration");
            refetch();
          }
        }
        
        setDataInitialized(true);
      } catch (e) {
        console.error("Exception when initializing investigation data:", e);
      }
    };
    
    initializeData();
  }, [dataInitialized, refetch]);

  const filtered = investigations.filter(row =>
    row.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return <div>Loading investigations...</div>;
  if (error) return <div>Error loading investigations</div>;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <FileSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-3 py-2 rounded border border-gray-200 w-full md:w-80 bg-white focus:outline-primary"
            placeholder="Search investigations"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded border bg-white shadow-sm overflow-x-auto animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Date Opened</TableHead>
              <TableHead>Loss Amount</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded ${statusColor(row.status)} text-xs font-semibold`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.assigned_to || "N/A"}</TableCell>
                  <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : ""}</TableCell>
                  <TableCell>
                    {row.loss_amount != null ? (
                      <span className="text-blue-900">${row.loss_amount}</span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded ${priorityColor(row.priority)} text-xs font-semibold`}>
                      {row.priority}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-4 w-4" /> View
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <X className="h-4 w-4" /> Close
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No investigations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
