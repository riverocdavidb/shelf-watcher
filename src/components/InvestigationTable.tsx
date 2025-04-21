
import { useState } from "react";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, FileSearch, X } from "lucide-react";

const mockCases = [
  {
    id: 100,
    incident: "Stolen Laptops",
    status: "Open",
    owner: "Eric Ray",
    opened: "2025-04-11",
    items: 5,
    priority: "High",
  },
  {
    id: 101,
    incident: "Damaged Dairy Case",
    status: "In Progress",
    owner: "Olivia Wong",
    opened: "2025-04-10",
    items: 1,
    priority: "Medium",
  },
  {
    id: 102,
    incident: "Missing Inventory Audit #201",
    status: "Closed",
    owner: "Maria S.",
    opened: "2025-04-01",
    items: 12,
    priority: "Low",
  },
];

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

  const filtered = mockCases.filter((row) =>
    row.incident.toLowerCase().includes(search.toLowerCase())
  );

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
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.incident}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded ${statusColor(row.status)} text-xs font-semibold`}>
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.opened}</TableCell>
                  <TableCell>{row.items}</TableCell>
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
