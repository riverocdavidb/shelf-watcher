
import AppLayout from "@/components/AppLayout";
import LossAlertsTable from "@/components/LossAlertsTable";

const LossAlerts = () => {
  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Loss Alerts</h1>
        <p className="text-muted-foreground mb-6">
          View and manage recent inventory loss notifications, shrinkage incidents, and required actions below.
        </p>
        <LossAlertsTable />
      </div>
    </AppLayout>
  );
};

export default LossAlerts;
