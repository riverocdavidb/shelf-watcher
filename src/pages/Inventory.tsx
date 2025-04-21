
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import InventoryManagement from "@/components/inventory/InventoryManagement";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem } from "@/services/inventoryService";

const Inventory = () => {
  const [importing, setImporting] = useState(false);
  
  useEffect(() => {
    toast({
      title: "Inventory Data Loaded",
      description: "Showing mock inventory data. Connect to a database for production use.",
    });
  }, []);

  // Function to import mock data from inventoryService
  const importMockData = async () => {
    setImporting(true);
    
    try {
      // Import the mock data dynamically to avoid circular dependencies
      const { mockInventoryItems } = await import("@/services/inventoryService");
      
      if (!mockInventoryItems || mockInventoryItems.length === 0) {
        toast({
          title: "No mock data available",
          description: "There is no mock data to import.",
          variant: "destructive",
        });
        return;
      }
      
      // Format the data for Supabase
      const items = mockInventoryItems.map(item => ({
        name: item.name,
        sku: item.sku,
        department: item.category,
        quantity: item.currentStock,
        status: item.currentStock > 0 ? "In Stock" : "Out of Stock",
        last_updated: new Date().toISOString(),
        user_id: "00000000-0000-0000-0000-000000000000" // Default user ID for demo
      }));
      
      // Insert the items into Supabase
      const { error } = await supabase
        .from("inventory_items")
        .insert(items);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Mock Data Imported",
        description: `Successfully imported ${items.length} items into the database.`,
      });
      
    } catch (error) {
      console.error("Error importing mock data:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import mock data. See console for details.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-4 flex justify-end px-6 pt-6">
        <Button 
          variant="outline" 
          onClick={importMockData} 
          disabled={importing}
        >
          {importing ? "Importing..." : "Import Mock Data"}
        </Button>
      </div>
      <InventoryManagement />
    </AppLayout>
  );
};

export default Inventory;
