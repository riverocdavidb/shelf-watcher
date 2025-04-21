
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import { toast } from "sonner";

const Inventory = () => {
  useEffect(() => {
    // Simple way to verify the page is loading correctly
    console.log("Inventory page loaded");
    
    toast("Inventory Module", {
      description: "Connected to database. Add, edit, or delete items to manage your inventory.",
    });
  }, []);

  return (
    <AppLayout>
      <InventoryManagement />
    </AppLayout>
  );
};

export default Inventory;
