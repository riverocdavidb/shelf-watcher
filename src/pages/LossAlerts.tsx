
import AppLayout from "@/components/AppLayout";

const LossAlerts = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Loss Alerts</h1>
        <p className="text-muted-foreground mb-4">
          View and manage recent inventory loss notifications and actions.
        </p>
        {/* You can add table/lists/charts here for loss alerts */}
      </div>
    </AppLayout>
  );
};

export default LossAlerts;
