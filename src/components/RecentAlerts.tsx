
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, DollarSign, Search, ShoppingCart, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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

const iconBySeverity = (severity: string) => {
  switch (severity) {
    case "High": return <AlertTriangle className="h-5 w-5" />;
    case "Medium": return <DollarSign className="h-5 w-5" />;
    case "Low": return <Search className="h-5 w-5" />;
    default: return null;
  }
};

const RecentAlerts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: alertsData = [], isLoading, error } = useQuery({
    queryKey: ["loss_alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("loss_alerts")
        .select("*")
        .order("reported_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
  });

  const filteredAlerts = alertsData.filter(
    (alert) =>
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.description ? alert.description.toLowerCase().includes(searchQuery.toLowerCase()) : false)
  );

  if (isLoading) return <div>Loading alerts...</div>;
  if (error) return <div>Error loading alerts</div>;

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
          <div className="text-center py-8 text-muted-foreground">No alerts matching your search</div>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-start p-4">
                  <div className="bg-slate-100 p-3 rounded-full mr-4">
                    {iconBySeverity(alert.severity)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                      <div className="font-semibold flex items-center">
                        {alert.title}
                        <Badge className={`ml-2 ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {alert.reported_at ? new Date(alert.reported_at).toLocaleString() : ""}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </div>
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
