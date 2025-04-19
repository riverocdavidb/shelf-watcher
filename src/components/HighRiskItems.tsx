
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const highRiskItems = [
  {
    id: 1,
    name: "Organic Avocados",
    sku: "PRD-12345",
    department: "Produce",
    riskScore: 92,
    valueAtRisk: 640,
    riskFactors: ["High Spoilage", "Pricing Error", "Handling Damage"],
    recommendedActions: [
      "Adjust order quantity",
      "Staff training",
      "Improve display",
    ],
  },
  {
    id: 2,
    name: "Premium Razors",
    sku: "HBA-78901",
    department: "Health & Beauty",
    riskScore: 88,
    valueAtRisk: 1250,
    riskFactors: ["Theft Target", "Incorrect Counting"],
    recommendedActions: ["Security measures", "Audit counts"],
  },
  {
    id: 3,
    name: "Fresh Atlantic Salmon",
    sku: "SEA-23456",
    department: "Meat & Seafood",
    riskScore: 85,
    valueAtRisk: 920,
    riskFactors: ["Expiration Risk", "Handling Errors"],
    recommendedActions: ["Implement FIFO strictly", "Staff training"],
  },
  {
    id: 4,
    name: "Specialty Cheeses",
    sku: "DRY-34567",
    department: "Dairy",
    riskScore: 79,
    valueAtRisk: 560,
    riskFactors: ["Expiration Risk", "Improper Storage"],
    recommendedActions: ["Temperature monitoring", "Adjust order frequency"],
  },
  {
    id: 5,
    name: "Wireless Earbuds",
    sku: "ELE-45678",
    department: "Electronics",
    riskScore: 77,
    valueAtRisk: 2400,
    riskFactors: ["Theft Target", "Display Security"],
    recommendedActions: ["Security cases", "Register verification"],
  },
  {
    id: 6,
    name: "Premium Chocolate",
    sku: "GRO-56789",
    department: "Grocery",
    riskScore: 74,
    valueAtRisk: 320,
    riskFactors: ["Theft Target", "Expiration Risk"],
    recommendedActions: ["Front of store placement", "FIFO rotation"],
  },
  {
    id: 7,
    name: "Baby Formula",
    sku: "INF-67890",
    department: "Baby Care",
    riskScore: 90,
    valueAtRisk: 1800,
    riskFactors: ["Theft Target", "Incorrect Counting"],
    recommendedActions: ["Locked display", "POS verification"],
  },
];

const getRiskColor = (score: number) => {
  if (score >= 85) return "bg-red-100 text-red-800";
  if (score >= 75) return "bg-yellow-100 text-yellow-800";
  return "bg-blue-100 text-blue-800";
};

const getRiskLabel = (score: number) => {
  if (score >= 85) return "Critical";
  if (score >= 75) return "High";
  return "Medium";
};

const HighRiskItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const departments = [
    "All Departments",
    ...new Set(highRiskItems.map((item) => item.department)),
  ];

  const filteredItems = highRiskItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (departmentFilter === "all" ||
        item.department === departmentFilter.replace("All Departments", "all"))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">High Risk Items</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by item name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={departmentFilter}
            onValueChange={(value) => setDepartmentFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem
                  key={dept}
                  value={dept === "All Departments" ? "all" : dept}
                >
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Value at Risk</TableHead>
              <TableHead>Risk Factors</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.sku}
                  </div>
                </TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge className={getRiskColor(item.riskScore)}>
                      {getRiskLabel(item.riskScore)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={item.riskScore}
                        className="h-2 w-16"
                        indicatorClassName={
                          item.riskScore >= 85
                            ? "bg-red-500"
                            : item.riskScore >= 75
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }
                      />
                      <span className="text-sm">{item.riskScore}%</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>${item.valueAtRisk.toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.riskFactors.map((factor) => (
                      <Badge
                        key={factor}
                        variant="outline"
                        className="text-xs bg-slate-50"
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">
                    View Plan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HighRiskItems;
