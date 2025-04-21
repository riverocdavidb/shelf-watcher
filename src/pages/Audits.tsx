
import AppLayout from "@/components/AppLayout";

const Audits = () => {
  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-2">Audits</h1>
        <p className="text-muted-foreground mb-4">
          Audit your stock and operations for inventory accuracy and compliance.
        </p>
        {/* Place future audit list or details here */}
      </div>
    </AppLayout>
  );
};

export default Audits;
