
import AppLayout from "@/components/AppLayout";

const UserManagement = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground mb-4">
          Manage team members, permissions, and access control.
        </p>
        {/* User table/list will go here in the future */}
      </div>
    </AppLayout>
  );
};

export default UserManagement;
