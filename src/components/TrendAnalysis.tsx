
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const monthlyData = [
  { name: "Jan", shrinkage: 8450, sales: 124000 },
  { name: "Feb", shrinkage: 7800, sales: 128000 },
  { name: "Mar", shrinkage: 9200, sales: 132000 },
  { name: "Apr", shrinkage: 10500, sales: 145000 },
  { name: "May", shrinkage: 11200, sales: 152000 },
  { name: "Jun", shrinkage: 9800, sales: 147000 },
  { name: "Jul", shrinkage: 8900, sales: 138000 },
  { name: "Aug", shrinkage: 9300, sales: 142000 },
  { name: "Sep", shrinkage: 10800, sales: 156000 },
  { name: "Oct", shrinkage: 12400, sales: 168000 },
  { name: "Nov", shrinkage: 11800, sales: 172000 },
  { name: "Dec", shrinkage: 14500, sales: 195000 },
];

const departmentData = [
  { name: "Produce", shrinkageRate: 2.8, avgRate: 1.6 },
  { name: "Dairy", shrinkageRate: 0.9, avgRate: 1.2 },
  { name: "Meat", shrinkageRate: 3.2, avgRate: 2.5 },
  { name: "Bakery", shrinkageRate: 1.8, avgRate: 1.8 },
  { name: "Frozen", shrinkageRate: 0.7, avgRate: 0.9 },
  { name: "Beverages", shrinkageRate: 1.2, avgRate: 1.1 },
  { name: "Health", shrinkageRate: 4.2, avgRate: 3.5 },
  { name: "Electronics", shrinkageRate: 1.9, avgRate: 1.7 },
];

const reasonData = [
  { name: "Theft", value: 38 },
  { name: "Spoilage", value: 27 },
  { name: "Admin Error", value: 15 },
  { name: "Vendor Issue", value: 12 },
  { name: "Damage", value: 8 },
];

const calculatePercentage = (value: number, total: number) => {
  return ((value / total) * 100).toFixed(1) + "%";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = reasonData.reduce((sum, item) => sum + item.value, 0);
    return (
      <div className="custom-tooltip bg-white p-3 border rounded shadow-sm">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-shrink-blue">{`${payload[0].value} units (${calculatePercentage(
          payload[0].value,
          total
        )})`}</p>
      </div>
    );
  }

  return null;
};

const TrendAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Shrinkage Trend Analysis</h3>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="reason">By Reason</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="pt-4">
          <Card className="p-4">
            <h4 className="text-lg font-medium mb-4">Monthly Shrinkage vs. Sales</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="shrinkage"
                    stroke="#ef4444"
                    activeDot={{ r: 8 }}
                    name="Shrinkage ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke="#1e40af"
                    name="Sales ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Analysis: Shrinkage tends to increase with sales volume, with Q4 showing highest shrinkage rates.
              Consider increased loss prevention measures during high-volume periods.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="pt-4">
          <Card className="p-4">
            <h4 className="text-lg font-medium mb-4">Shrinkage by Department</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="shrinkageRate"
                    name="Your Shrinkage Rate (%)"
                    fill="#ef4444"
                  />
                  <Bar
                    dataKey="avgRate"
                    name="Industry Average (%)"
                    fill="#3b82f6"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Analysis: Health & Beauty and Meat departments have the highest shrinkage rates, 
              significantly above industry averages. Focus loss prevention efforts on these departments.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="reason" className="pt-4">
          <Card className="p-4">
            <h4 className="text-lg font-medium mb-4">Shrinkage by Reason</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={reasonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Units Lost" fill="#1e40af" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Analysis: Theft (38%) and spoilage (27%) are the primary causes of shrinkage. 
              Implement targeted anti-theft measures and improve inventory rotation systems to address these issues.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendAnalysis;
