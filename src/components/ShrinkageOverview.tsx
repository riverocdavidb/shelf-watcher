
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, AlertTriangle, DollarSign } from "lucide-react";

const ShrinkageOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="stat-card">
        <CardContent className="p-0">
          <div className="stat-title">Total Shrinkage (MTD)</div>
          <div className="flex items-end justify-between">
            <div className="stat-value">$12,845</div>
            <div className="shrink-warning flex items-center text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              5.2%
            </div>
          </div>
          <div className="stat-desc">vs. $12,210 last month</div>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardContent className="p-0">
          <div className="stat-title">Shrinkage Rate</div>
          <div className="flex items-end justify-between">
            <div className="stat-value">2.1%</div>
            <div className="shrink-warning flex items-center text-sm">
              <ArrowUp className="h-4 w-4 mr-1" />
              0.3%
            </div>
          </div>
          <div className="stat-desc">Industry avg: 1.8%</div>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardContent className="p-0">
          <div className="stat-title">Active Alerts</div>
          <div className="flex items-end justify-between">
            <div className="stat-value">24</div>
            <div className="shrink-warning flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              High
            </div>
          </div>
          <div className="stat-desc">8 require immediate action</div>
        </CardContent>
      </Card>
      
      <Card className="stat-card">
        <CardContent className="p-0">
          <div className="stat-title">Potential Savings</div>
          <div className="flex items-end justify-between">
            <div className="stat-value">$4,250</div>
            <div className="shrink-success flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-1" />
              Opportunity
            </div>
          </div>
          <div className="stat-desc">Based on current action items</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShrinkageOverview;
