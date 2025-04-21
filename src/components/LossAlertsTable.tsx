
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, ShieldOff, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function severityColor(severity: string) {
  if (severity === "High") return "bg-red-100 text-red-800";
  if (severity === "Medium") return "bg-yellow-100 text-yellow-800";
  if (severity === "Low") return "bg-blue-100 text-blue-800";
  return "bg-gray-100 text-gray-800";
}

export default function LossAlertsTable() {
  const { data: lossAlerts = [], isLoading, error } = useQuery({
    queryKey: ["lossAlerts"],
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

  if (isLoading) return <div>Loading Loss Alerts...</div>;
  if (error) return <div>Error loading Loss Alerts</div>;

  return (
    <div className="space-y-4">
      {lossAlerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No active alerts</div>
      ) : (
        lossAlerts.map((alert) => (
          <Card key={alert.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="flex items-center p-4">
                <div className="mr-4">
                  {
                    alert.severity === "High" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : alert.severity === "Medium" ? (
                      <ShieldAlert className="h-5 w-5 text-yellow-500" />
                    ) : alert.severity === "Low" ? (
                      <ShieldOff className="h-5 w-5 text-blue-500" />
                    ) : null
                  }
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <div className="font-semibold flex items-center">
                      {alert.title}
                      <Badge className={`ml-2 ${severityColor(alert.severity)}`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {alert.reported_at ? new Date(alert.reported_at).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {alert.description}
                  </div>
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
        ))
      )}
    </div>
  );
}
