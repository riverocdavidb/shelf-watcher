
import AppLayout from "@/components/AppLayout";

const Settings = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground mb-4">
          Configure your application preferences and integrations.
        </p>
        {/* Future settings forms and lists will appear here */}
      </div>
    </AppLayout>
  );
};

export default Settings;
