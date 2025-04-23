
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

interface StatusItem {
  id: string;
  department: string;
  total_items: number;
  tracked_items: number;
  discrepancies: number;
  shrinkage_rate: number;
  status: string;
}

interface DepartmentStatusTableProps {
  isLoading: boolean;
  data: StatusItem[];
}

const DepartmentStatusTable = ({ isLoading, data }: DepartmentStatusTableProps) => (
  <div className="rounded-md border overflow-x-auto">
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
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">Loading inventory data...</TableCell>
          </TableRow>
        ) : data.length > 0 ? (
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.department}</TableCell>
              <TableCell className="text-right">{item.total_items}</TableCell>
              <TableCell className="text-right">{item.tracked_items}</TableCell>
              <TableCell className="text-right">{item.discrepancies}</TableCell>
              <TableCell className="text-right">{item.shrinkage_rate.toFixed(1)}%</TableCell>
              <TableCell className="text-right">
                <Badge className={getBadgeColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">No inventory data available.</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);

export default DepartmentStatusTable;
