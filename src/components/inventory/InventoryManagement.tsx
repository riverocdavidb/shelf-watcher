
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import InventoryList from "./InventoryList";
import StockMovement from "./StockMovement";
import InventoryDashboard from "./InventoryDashboard";
import { Badge } from "@/components/ui/badge";

const InventoryManagement = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            Track, manage, and update inventory items
          </p>
        </div>
      </div>

      {/* Dashboard será la predeterminada */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="list">Inventory List</TabsTrigger>
          <TabsTrigger value="movement">
            Stock Movement
            <Badge variant="outline" className="ml-2 bg-primary text-primary-foreground">New</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Card className="p-4">
            <InventoryDashboard />
          </Card>
        </TabsContent>
        
        <TabsContent value="list">
          <Card className="p-4">
            <InventoryList />
          </Card>
        </TabsContent>
        
        <TabsContent value="movement">
          <Card className="p-4">
            <StockMovement />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManagement;
