
import { Progress } from "@/components/ui/progress";

interface SummaryCardsProps {
  trackingRate: number;
  compliantDepartments: number;
  totalDepartmentsCount: number;
  totalDiscrepancies: number;
}

const SummaryCards = ({
  trackingRate,
  compliantDepartments,
  totalDepartmentsCount,
  totalDiscrepancies,
}: SummaryCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="bg-white p-4 rounded-lg border">
      <div className="text-sm font-medium text-muted-foreground">
        Inventory Tracking Rate
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold">
          {trackingRate.toFixed(1)}%
        </div>
        <div className="text-green-600 text-sm font-medium">+0.5%</div>
      </div>
      <Progress value={trackingRate} className="h-2 mt-2" />
    </div>

    <div className="bg-white p-4 rounded-lg border">
      <div className="text-sm font-medium text-muted-foreground">
        Department Compliance
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold">
          {compliantDepartments}/{totalDepartmentsCount}
        </div>
        <div className="text-yellow-600 text-sm font-medium">
          {totalDepartmentsCount > 0 ? ((compliantDepartments * 100) / totalDepartmentsCount).toFixed(1) : "0"}%
        </div>
      </div>
      <Progress value={totalDepartmentsCount > 0 ? (compliantDepartments * 100) / totalDepartmentsCount : 0} className="h-2 mt-2" />
    </div>

    <div className="bg-white p-4 rounded-lg border">
      <div className="text-sm font-medium text-muted-foreground">
        Total Discrepancies
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-2xl font-bold">{totalDiscrepancies}</div>
        <div className="text-red-600 text-sm font-medium">+12</div>
      </div>
      <Progress value={totalDiscrepancies} max={100} className="h-2 mt-2 bg-gray-100" />
    </div>
  </div>
);

export default SummaryCards;
