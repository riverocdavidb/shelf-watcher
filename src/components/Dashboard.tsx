
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShrinkageOverview from "./ShrinkageOverview";
import InventoryStatus from "./InventoryStatus";
import RecentAlerts from "./RecentAlerts";
import TrendAnalysis from "./TrendAnalysis";
import HighRiskItems from "./HighRiskItems";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shrink Minimization Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor, analyze, and prevent inventory shrinkage
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-shrink-blue-light/10 text-shrink-blue rounded-full px-3 py-1 text-sm font-medium">
            Last sync: Today, 10:45 AM
          </span>
        </div>
      </div>

      <ShrinkageOverview />

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Loss Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="high-risk">High Risk Items</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <Card className="p-4">
            <InventoryStatus />
          </Card>
        </TabsContent>
        <TabsContent value="alerts">
          <Card className="p-4">
            <RecentAlerts />
          </Card>
        </TabsContent>
        <TabsContent value="trends">
          <Card className="p-4">
            <TrendAnalysis />
          </Card>
        </TabsContent>
        <TabsContent value="high-risk">
          <Card className="p-4">
            <HighRiskItems />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
