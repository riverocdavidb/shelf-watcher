
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Search,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const alertsData = [
  {
    id: 1,
    type: "Inventory Discrepancy",
    department: "Meat & Seafood",
    item: "Fresh Atlantic Salmon",
    timestamp: "Today, 09:23 AM",
    severity: "High",
    description:
      "System count shows 18 units but physical count recorded 12 units. Discrepancy of 6 units ($89.94).",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    id: 2,
    type: "Expiration Alert",
    department: "Dairy",
    item: "Organic Whole Milk",
    timestamp: "Today, 08:15 AM",
    severity: "Medium",
    description:
      "12 units expiring within 24 hours. Consider immediate markdown or promotion.",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: 3,
    type: "Price Discrepancy",
    department: "Electronics",
    item: "Wireless Earbuds",
    timestamp: "Yesterday, 04:42 PM",
    severity: "Medium",
    description:
      "POS system price ($49.99) does not match shelf tag ($59.99). Verify correct pricing.",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: 4,
    type: "Missing Scan",
    department: "Produce",
    item: "Organic Avocados",
    timestamp: "Yesterday, 02:30 PM",
    severity: "Low",
    description:
      "Inventory reduction detected without corresponding sales record. Potential scanning error.",
    icon: <Search className="h-5 w-5" />,
  },
  {
    id: 5,
    type: "Pattern Alert",
    department: "Health & Beauty",
    item: "Premium Razors",
    timestamp: "Yesterday, 11:05 AM",
    severity: "High",
    description:
      "Unusual stock reduction pattern detected. 30% increase in unexplained loss over 7 days.",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

const RecentAlerts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = alertsData.filter(
    (alert) =>
      alert.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">Recent Loss Alerts</h3>
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No alerts matching your search
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-start p-4">
                  <div className="bg-slate-100 p-3 rounded-full mr-4">
                    {alert.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                      <div className="font-semibold flex items-center">
                        {alert.type}
                        <Badge className={`ml-2 ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.timestamp}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {alert.department} - {alert.item}
                    </div>
                    <p className="text-sm">{alert.description}</p>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-2 flex justify-end border-t">
                  <Button variant="outline" size="sm" className="mr-2">
                    Dismiss
                  </Button>
                  <Button size="sm">Take Action</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredAlerts.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline">View All Alerts</Button>
        </div>
      )}
    </div>
  );
};

export default RecentAlerts;
