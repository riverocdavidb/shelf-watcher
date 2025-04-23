
import { Badge } from "@/components/ui/badge";

type InventoryStatusHeaderProps = {
  lastUpdatedText: string;
};

const InventoryStatusHeader = ({ lastUpdatedText }: InventoryStatusHeaderProps) => (
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-semibold">Department Inventory Status</h3>
    <Badge variant="outline" className="ml-2">
      Last updated: {lastUpdatedText}
    </Badge>
  </div>
);

export default InventoryStatusHeader;

