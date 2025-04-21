
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Status color
const statusColor = (status: string) => {
  if (status === "Complete") return "bg-green-100 text-green-800";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-800";
  if (status === "Discrepancy Found") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export default function AuditsTable() {
  const [search, setSearch] = useState("");

  const { data: audits = [], isLoading, error } = useQuery({
    queryKey: ['audits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .order("start_date", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

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
              {/* Removed Findings (no 'findings' column in audits table) */}
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
                  {/* 'assigned_to' instead of 'auditor' */}
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
