
import { useState, useEffect } from "react";
import { seedDatabase } from "@/utils/seedDatabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import DevSeedAllButton from "@/components/DevSeedAllButton";

const DevSeedAll = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Option to auto-seed when the page loads
  const autoSeed = async () => {
    if (window.location.search.includes('auto=true')) {
      setLoading(true);
      try {
        await seedDatabase();
        setSuccess(true);
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
  };
  
  useEffect(() => {
    autoSeed();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Database Seeding Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            <p>This tool will populate your database with sample data for all tables:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Inventory Items</li>
              <li>User Profiles</li>
              <li>Settings</li>
              <li>Audits</li>
              <li>Stock Movements</li>
              <li>Department Shrinkage</li>
              <li>Monthly Shrinkage</li>
              <li>Shrinkage Reasons</li>
              <li>High Risk Items</li>
              <li>Risk Factors</li>
              <li>Recommended Actions</li>
              <li>Investigations</li>
              <li>Loss Alerts</li>
              <li>Inventory Status</li>
            </ul>
          </div>
          
          {success ? (
            <div className="flex flex-col items-center justify-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
              <p className="font-medium text-center">Database successfully seeded!</p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                You can now use the application with the sample data.
              </p>
              <Button 
                className="mt-4" 
                onClick={() => window.location.href = '/'}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-sm">
                Click the button below to seed the database with all sample data:
              </p>
              
              {loading ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Seeding Database...
                </Button>
              ) : (
                <DevSeedAllButton />
              )}
              
              <p className="text-xs text-center text-muted-foreground">
                Note: The seeding process will check for existing data before inserting
                to avoid duplicates.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevSeedAll;
