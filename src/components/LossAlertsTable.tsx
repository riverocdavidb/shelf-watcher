
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, ShieldOff, X } from "lucide-react";

const mockAlerts = [
  {
    id: 1,
    type: "Stock Shrinkage",
    item: "Organic Avocados",
    severity: "High",
    date: "2025-04-14 16:33",
    value: "$45.90",
    cause: "Unexplained reduction during inventory count.",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
  },
  {
    id: 2,
    type: "Damaged Goods",
    item: "Whole Milk (Dairy)",
    severity: "Medium",
    date: "2025-04-14 14:09",
    value: "$23.50",
    cause: "Expired/damaged milk found during inspection.",
    icon: <ShieldAlert className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: 3,
    type: "Suspicious Adjustment",
    item: "Bluetooth Headphones",
    severity: "High",
    date: "2025-04-13 18:12",
    value: "$98.99",
    cause: "Large adjustment outside business hours.",
    icon: <ShieldOff className="h-5 w-5 text-red-500" />,
  },
  {
    id: 4,
    type: "POS Exception",
    item: "Premium Coffee Beans",
    severity: "Low",
    date: "2025-04-13 10:49",
    value: "$12.40",
    cause: "Manual override at checkout.",
    icon: <AlertTriangle className="h-5 w-5 text-blue-600" />,
  },
];

function severityColor(severity: string) {
  if (severity === "High") return "bg-red-100 text-red-800";
  if (severity === "Medium") return "bg-yellow-100 text-yellow-800";
  if (severity === "Low") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

export default function LossAlertsTable() {
  return (
    <div className="space-y-4">
      {mockAlerts.map(alert => (
        <Card key={alert.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="mr-4">{alert.icon}</div>
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center font-semibold">
                    {alert.type}
                    <Badge className={`ml-2 ${severityColor(alert.severity)}`}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{alert.date}</div>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {alert.item} &middot; <span className="font-medium">{alert.value}</span>
                </div>
                <p className="text-sm">{alert.cause}</p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-2 flex justify-end border-t gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-1">
                <X className="h-4 w-4" /> Dismiss
              </Button>
              <Button size="sm">Investigate</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
