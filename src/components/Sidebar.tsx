
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShoppingCart,
  AlertTriangle,
  BarChart,
  Settings,
  User,
  List,
  Search,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  to?: string;
  active?: boolean;
  collapsed?: boolean;
}

const SidebarItem = ({
  icon,
  label,
  to,
  active = false,
  collapsed = false,
}: SidebarItemProps) => {
  const content = (
    <div className={cn("flex items-center", collapsed ? "justify-center" : "")}>
      <div className="mr-2">{icon}</div>
      {!collapsed && <span>{label}</span>}
    </div>
  );

  return to ? (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "w-full justify-start py-6 flex",
          collapsed ? "px-2" : "px-4",
          isActive
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "hover:bg-primary/5"
        )
      }
      end
    >
      {content}
    </NavLink>
  ) : (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start py-6",
        collapsed ? "px-2" : "px-4",
        active
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : "hover:bg-primary/5"
      )}
    >
      {content}
    </Button>
  );
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "bg-shrink-blue-dark text-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-700/50">
        {!collapsed && (
          <div className="text-lg font-bold tracking-tight">ShelfWatch</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-shrink-blue hover:text-white ml-auto"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <div className="py-2">
        <SidebarItem
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          to="/"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<ShoppingCart className="h-5 w-5" />}
          label="Inventory"
          to="/inventory"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Loss Alerts"
          to="/loss-alerts"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<BarChart className="h-5 w-5" />}
          label="Analytics"
          to="/analytics"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<List className="h-5 w-5" />}
          label="Audits"
          to="/audits"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Search className="h-5 w-5" />}
          label="Investigation"
          to="/investigation"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          to="/settings"
          collapsed={collapsed}
        />
        <SidebarItem
          icon={<User className="h-5 w-5" />}
          label="User Management"
          to="/user-management"
          collapsed={collapsed}
        />
      </div>

      <div className="mt-auto p-4 border-t border-gray-700/50">
        {!collapsed && (
          <div className="text-xs text-gray-300">
            <div>ShelfWatch v1.0</div>
            <div className="mt-1">© 2025 Shrink Analytics Inc.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
