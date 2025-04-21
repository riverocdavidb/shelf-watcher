
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { seedDatabase } from "@/utils/seedDatabase";
import { toast } from "@/hooks/use-toast";

const DevSeedAllButton = () => {
  const [loading, setLoading] = useState(false);

  async function handleSeedAll() {
    setLoading(true);
    try {
      await seedDatabase();
      toast({
        title: "Database Seeded",
        description: "All demo/sample data has been inserted.",
      });
    } catch (err) {
      toast({
        title: "Seeding Failed",
        description: "" + err,
        variant: "destructive",
      });
    }
    setLoading(false);
  }

  return (
    <Button onClick={handleSeedAll} disabled={loading} variant="outline">
      {loading ? "Seeding..." : "Seed All Demo Data"}
    </Button>
  );
};

export default DevSeedAllButton;
