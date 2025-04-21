
import { useState } from "react";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, User } from "lucide-react";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@shelfwatch.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Olivia Wolfe",
    email: "olivia@shelfwatch.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Eric Ray",
    email: "eric@shelfwatch.com",
    role: "Staff",
    status: "Suspended",
  },
];

const statusColor = (status: string) => {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "Suspended") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

export default function UserTable() {
  const [search, setSearch] = useState("");

  const filtered = mockUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-3 py-2 rounded border border-gray-200 w-full md:w-80 bg-white focus:outline-primary"
            placeholder="Search users"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded border bg-white shadow-sm overflow-x-auto animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? (
              filtered.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded ${statusColor(user.status)} text-xs font-semibold`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1">
                      <Trash className="h-4 w-4" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
