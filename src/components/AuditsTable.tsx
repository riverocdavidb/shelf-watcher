
import { useState } from "react";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileText, Search } from "lucide-react";

const mockAudits = [
  {
    id: 1,
    name: "April Inventory Check",
    status: "Complete",
    auditor: "Maria Smith",
    date: "2025-04-14",
    findings: 3,
  },
  {
    id: 2,
    name: "March Cycle Count",
    status: "In Progress",
    auditor: "Eric Ray",
    date: "2025-03-22",
    findings: 0,
  },
  {
    id: 3,
    name: "Surprise Audit",
    status: "Discrepancy Found",
    auditor: "J. Lee",
    date: "2025-02-15",
    findings: 7,
  },
  {
    id: 4,
    name: "Annual Compliance Review",
    status: "Complete",
    auditor: "M. O'Neil",
    date: "2024-12-05",
    findings: 0,
  },
];

const statusColor = (status: string) => {
  if (status === "Complete") return "bg-green-100 text-green-800";
  if (status === "In Progress") return "bg-yellow-100 text-yellow-800";
  if (status === "Discrepancy Found") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export default function AuditsTable() {
  const [search, setSearch] = useState("");

  const filtered = mockAudits.filter((audit) =>
    audit.name.toLowerCase().includes(search.toLowerCase())
  );

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
              <TableHead>Auditor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Findings</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell>{audit.name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded ${statusColor(audit.status)} text-xs font-semibold`}>
                      {audit.status}
                    </span>
                  </TableCell>
                  <TableCell>{audit.auditor}</TableCell>
                  <TableCell>{audit.date}</TableCell>
                  <TableCell>
                    {audit.findings > 0
                      ? <span className="text-red-600 font-bold">{audit.findings}</span>
                      : <span className="text-gray-500">None</span>
                    }
                  </TableCell>
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
                <TableCell colSpan={6} className="text-center text-muted-foreground">
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
