
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const inventoryData = [
  {
    id: 1,
    department: "Produce",
    totalItems: 245,
    trackedItems: 230,
    discrepancies: 15,
    shrinkageRate: 1.2,
    status: "Warning",
  },
  {
    id: 2,
    department: "Dairy",
    totalItems: 178,
    trackedItems: 178,
    discrepancies: 3,
    shrinkageRate: 0.6,
    status: "Good",
  },
  {
    id: 3,
    department: "Meat & Seafood",
    totalItems: 126,
    trackedItems: 122,
    discrepancies: 8,
    shrinkageRate: 2.4,
    status: "Critical",
  },
  {
    id: 4,
    department: "Bakery",
    totalItems: 94,
    trackedItems: 91,
    discrepancies: 7,
    shrinkageRate: 1.8,
    status: "Warning",
  },
  {
    id: 5,
    department: "Frozen Foods",
    totalItems: 210,
    trackedItems: 210,
    discrepancies: 2,
    shrinkageRate: 0.4,
    status: "Good",
  },
  {
    id: 6,
    department: "Beverages",
    totalItems: 132,
    trackedItems: 132,
    discrepancies: 5,
    shrinkageRate: 0.9,
    status: "Good",
  },
];

const getBadgeColor = (status: string) => {
  switch (status) {
    case "Good":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Warning":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Critical":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const InventoryStatus = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Department Inventory Status</h3>
        <Badge variant="outline" className="ml-2">
          Last updated: Today, 10:45 AM
        </Badge>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Inventory Tracking Rate
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">98.2%</div>
              <div className="text-green-600 text-sm font-medium">+0.5%</div>
            </div>
            <Progress value={98.2} className="h-2 mt-2" />
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Department Compliance
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">5/6</div>
              <div className="text-yellow-600 text-sm font-medium">83.3%</div>
            </div>
            <Progress value={83.3} className="h-2 mt-2" />
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Total Discrepancies
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold">40</div>
              <div className="text-red-600 text-sm font-medium">+12</div>
            </div>
            <Progress value={40} max={100} className="h-2 mt-2 bg-gray-100" />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Tracked</TableHead>
                <TableHead className="text-right">Discrepancies</TableHead>
                <TableHead className="text-right">Shrinkage %</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.department}</TableCell>
                  <TableCell className="text-right">{item.totalItems}</TableCell>
                  <TableCell className="text-right">{item.trackedItems}</TableCell>
                  <TableCell className="text-right">{item.discrepancies}</TableCell>
                  <TableCell className="text-right">{item.shrinkageRate}%</TableCell>
                  <TableCell className="text-right">
                    <Badge className={`${getBadgeColor(item.status)}`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
