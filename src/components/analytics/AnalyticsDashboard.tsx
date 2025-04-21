
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import TrendAnalysis from "@/components/analytics/TrendAnalysis";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AnalyticsDashboard = () => {
  const handleExportData = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting analytics data as ${format}...`,
    });
    // In a real app, this would trigger an actual export
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time inventory shrinkage analytics and insights
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportData("CSV")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="trends">Shrinkage Trends</TabsTrigger>
          <TabsTrigger value="items">Item Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <Card className="p-4">
            <TrendAnalysis />
          </Card>
        </TabsContent>
        <TabsContent value="items">
          <Card className="p-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Item-level Analysis</h3>
              <p className="text-muted-foreground mt-2">
                Coming soon - Connect to your inventory data to see item-level shrinkage analysis
              </p>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="forecast">
          <Card className="p-4">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Shrinkage Forecasting</h3>
              <p className="text-muted-foreground mt-2">
                Coming soon - Predictive analytics based on historical patterns
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
