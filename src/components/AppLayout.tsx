
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { RequireAuth } from "@/components/RequireAuth";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <RequireAuth>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-shrink-blue">ShelfWatch</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                  5
                </span>
              </Button>
              <LogoutButton />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-shrink-blue rounded-full flex items-center justify-center text-white font-medium">
                  JD
                </div>
                <span className="font-medium text-sm">John Doe</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
};

export default AppLayout;
