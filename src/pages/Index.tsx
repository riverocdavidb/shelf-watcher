
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/components/Dashboard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <Dashboard />
        <div className="mt-6">
          <Link to="/dev-seed-all">
            <Button variant="outline">Go to Database Seed Page</Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
