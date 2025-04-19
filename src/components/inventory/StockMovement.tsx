
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const mockMovementData = [
  {
    id: 1,
    date: "2024-04-19",
    type: "Received",
    sku: "PRD001",
    name: "Organic Bananas",
    quantity: 50,
    employee: "John Smith",
  },
  {
    id: 2,
    date: "2024-04-19",
    type: "Damaged",
    sku: "DRY001",
    name: "Whole Grain Pasta",
    quantity: -5,
    employee: "Sarah Johnson",
  },
  {
    id: 3,
    date: "2024-04-19",
    type: "Sold",
    sku: "DAI001",
    name: "Fresh Milk 1L",
    quantity: -20,
    employee: "System",
  },
];

const getMovementColor = (type: string) => {
  switch (type) {
    case "Received":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Sold":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "Damaged":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const StockMovement = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Employee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockMovementData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <Badge className={getMovementColor(item.type)}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.employee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockMovement;
