
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import { toast } from "@/hooks/use-toast";

const Inventory = () => {
  useEffect(() => {
    toast({
      title: "Inventory Data Loaded",
      description: "Showing mock inventory data. Connect to a database for production use.",
    });
  }, []);

  return (
    <AppLayout>
      <InventoryManagement />
    </AppLayout>
  );
};

export default Inventory;
