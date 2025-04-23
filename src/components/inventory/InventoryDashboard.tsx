import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useInventoryItems, useDepartments } from "@/services/inventoryService";

const departmentData = [
  { name: "Produce", items: 120, color: "#4ADE80" },
  { name: "Dairy", items: 95, color: "#60A5FA" },
  { name: "Meat & Seafood", items: 78, color: "#F87171" },
  { name: "Bakery", items: 54, color: "#FBBF24" },
  { name: "Frozen Foods", items: 87, color: "#A78BFA" },
  { name: "Dry Goods", items: 145, color: "#F472B6" },
  { name: "Beverages", items: 68, color: "#34D399" },
];

const statusData = [
  { name: "In Stock", value: 420, color: "#4ADE80" },
  { name: "Low Stock", value: 180, color: "#FBBF24" },
  { name: "Out of Stock", value: 47, color: "#F87171" },
];

const InventoryDashboard = () => {
  // Update useInventoryItems to use new column name and filter out inactive items
  const { data: items = [], isLoading: loadingItems } = useInventoryItems();

  // Números obtenidos de la base de datos
  // const { data: items = [], isLoading: loadingItems } = useInventoryItems();
  const { data: departments = [], isLoading: loadingDepts } = useDepartments();

  // Filter out inactive items and calculate statistics based on new column names
  const activeItems = items.filter(item => item.item_status !== 'Inactive');
  const totalItems = activeItems.length;

  const totalDepartments = departments.length;

  // Aseguramos que si no hay datos, los gráficos no fallen
  // Nota: Aquí utilizarías lógica real para los dashboards/gráficos según tus necesidades de negocio
  // Por ahora, dejaremos el resto de la lógica igual con los gráficos de departamento simulados (puedes adaptar luego)

  const inStockItems = activeItems.filter(item => item.item_status === 'In Stock').length;
  const lowStockItems = activeItems.filter(item => item.item_status === 'Low Stock').length;
  const outOfStockItems = activeItems.filter(item => item.item_status === 'Out of Stock').length;
  const inStockPercentage = Math.round((inStockItems / (totalItems || 647)) * 100);
  const lowStockPercentage = Math.round((lowStockItems / (totalItems || 647)) * 100);
  const outOfStockPercentage = Math.round((outOfStockItems / (totalItems || 647)) * 100);

  // Actualiza los datos necesarios SOLO usando la info real extraída:
  // Los gráficos y status se mantienen como antes (con datos dummy), pero los KPI principales ahora reflejan la BD.

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingItems ? "..." : totalItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {loadingDepts ? "..." : totalDepartments} departments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">In Stock</div>
                  <div className="font-medium text-sm">{inStockPercentage}%</div>
                </div>
                <Progress value={inStockPercentage} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Low Stock</div>
                  <div className="font-medium text-sm">{lowStockPercentage}%</div>
                </div>
                <Progress value={lowStockPercentage} className="h-2 mt-1 bg-yellow-100" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Out of Stock</div>
                <div className="font-medium text-sm">{outOfStockPercentage}%</div>
              </div>
              <Progress value={outOfStockPercentage} className="h-2 mt-1 bg-red-100" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems} items</div>
            <p className="text-xs text-muted-foreground">
              Need attention soon
            </p>
            <div className="flex justify-between items-center text-sm mt-2">
              <div className="font-medium">Out of Stock</div>
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{outOfStockItems} items</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Items by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 35,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} items`, 'Quantity']}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="items">
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry, index) => (
                      <span style={{ color: statusData[index].color }}>
                        {value}: {statusData[index].value} items
                      </span>
                    )}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} items`, 'Quantity']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard;
