
import AppLayout from "@/components/AppLayout";
import InvestigationTable from "@/components/InvestigationTable";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

const Investigation = () => {
  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex gap-2 items-center">
              <Search className="h-7 w-7 text-blue-500" />
              Investigation
            </h1>
            <p className="text-muted-foreground">
              Track and review open shrink/inventory incidents needing deeper investigation.
            </p>
          </div>
          <Button variant="default" size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </div>
        <InvestigationTable />
      </div>
    </AppLayout>
  );
};

export default Investigation;
