
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileSearch, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

export default function InvestigationTable() {
  const [search, setSearch] = useState("");

  const { data: investigations = [], isLoading, error } = useQuery({
    queryKey: ['investigations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investigations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

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
              <TableHead>Items</TableHead>
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
                  <TableCell>{row.items || "N/A"}</TableCell>
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
