
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Demo data array (customize or extend as needed)
const seedData = [
  {
    sku: "PRD-001",
    name: "Organic Apples",
    department: "Produce",
    quantity: 142,
    status: "In Stock",
  },
  {
    sku: "GRC-045",
    name: "Premium Coffee",
    department: "Beverages",
    quantity: 48,
    status: "Low Stock",
  },
  {
    sku: "ELC-102",
    name: "Wireless Earbuds",
    department: "Electronics",
    quantity: 18,
    status: "In Stock",
  },
  {
    sku: "DAI-008",
    name: "Whole Milk",
    department: "Dairy",
    quantity: 65,
    status: "In Stock",
  },
  {
    sku: "MT-105",
    name: "Ribeye Steak",
    department: "Meat",
    quantity: 10,
    status: "Critical",
  },
  {
    sku: "FZN-234",
    name: "Frozen Peas",
    department: "Frozen",
    quantity: 200,
    status: "In Stock",
  },
  {
    sku: "BKR-318",
    name: "Sourdough Bread",
    department: "Bakery",
    quantity: 29,
    status: "Low Stock",
  },
  {
    sku: "HST-470",
    name: "Pain Reliever",
    department: "Health",
    quantity: 33,
    status: "In Stock",
  },
  {
    sku: "BVG-901",
    name: "Sparkling Water",
    department: "Beverages",
    quantity: 90,
    status: "In Stock",
  },
  {
    sku: "PRD-022",
    name: "Bananas",
    department: "Produce",
    quantity: 100,
    status: "In Stock",
  },
];

const DEVELOPER_USER_ID =
  "00000000-0000-0000-0000-000000000000"; // Use a fixed dummy user for mock data

const DevSeedInventory = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [inserted, setInserted] = useState(0);

  const handleSeed = async () => {
    setLoading(true);
    setInserted(0);
    setDone(false);

    // Fetch how many items currently exist (don't double seed)
    const { data: existing, error: existingError } = await supabase
      .from("inventory_items")
      .select("id");

    if (existingError) {
      toast({
        title: "Error checking existing data",
        description: existingError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (existing && existing.length > 0) {
      toast({
        title: "Database Already Seeded",
        description: "There are already items in 'inventory_items'. Delete them first to re-seed.",
      });
      setLoading(false);
      setDone(true);
      return;
    }

    // Build insert data
    const today = new Date().toISOString();
    const rows = seedData.map(item => ({
      ...item,
      last_updated: today,
      user_id: DEVELOPER_USER_ID,
    }));

    // Insert
    const { error, count } = await supabase
      .from("inventory_items")
      .insert(rows, { count: "exact" });

    if (error) {
      toast({
        title: "Failed to Insert Data",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setInserted(rows.length);
      toast({
        title: "Seed Complete",
        description: `Inserted ${rows.length} inventory items!`,
      });
    }
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-muted">
      <Card className="p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Developer: Seed Inventory Database</h2>
        <p className="mb-4 text-muted-foreground">
          Click below to populate your Supabase <code>inventory_items</code> table with sample data.<br />
          For developer use only! Re-seeding only works if the table is empty.
        </p>
        <Button onClick={handleSeed} disabled={loading || done}>
          {loading ? "Inserting..." : done ? "Seeded!" : "Seed Database"}
        </Button>
        {inserted > 0 && (
          <div className="mt-4 text-green-600">
            {inserted} mock items inserted!
          </div>
        )}
      </Card>
    </div>
  );
};

export default DevSeedInventory;
