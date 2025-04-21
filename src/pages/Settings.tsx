
import AppLayout from "@/components/AppLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Info, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState("Light");
  const [storeName, setStoreName] = useState("ShelfWatch Demo Store");

  return (
    <AppLayout>
      <div className="p-8 max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <SettingsIcon className="h-7 w-7 text-blue-500" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <form className="space-y-8">
          <div className="space-y-1">
            <label className="block font-medium">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              className="px-3 py-2 rounded border border-gray-200 w-full bg-white"
            />
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Info className="h-3 w-3" />
              Displayed in the app navigation.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            <span className="font-medium">Auto Sync</span>
            <span className="text-xs text-gray-500 ml-2">
              Enable to synchronize inventory hourly.
            </span>
          </div>

          <div>
            <label className="block font-medium mb-1">Theme</label>
            <select
              className="px-3 py-2 rounded border border-gray-200 w-full bg-white"
              value={theme}
              onChange={e => setTheme(e.target.value)}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </form>

        <div className="mt-10 flex gap-2 justify-end">
          <Button variant="outline">Reset</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
