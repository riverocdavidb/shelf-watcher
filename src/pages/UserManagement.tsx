
import AppLayout from "@/components/AppLayout";
import UserTable from "@/components/UserTable";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const UserManagement = () => {
  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex gap-2 items-center">
              <Users className="h-7 w-7 text-blue-500" />
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage your team, permissions, and access.
            </p>
          </div>
          <Button variant="default" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        <UserTable />
      </div>
    </AppLayout>
  );
};

export default UserManagement;
