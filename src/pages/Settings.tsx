
import AppLayout from "@/components/AppLayout";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Info, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useUserSettings } from "@/hooks/useUserSettings";
import { toast } from "@/components/ui/use-toast";

const Settings = () => {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings, isUpdating } = useUserSettings(user?.id);
  const [autoSync, setAutoSync] = useState(true);
  const [theme, setTheme] = useState("Light");
  const [storeName, setStoreName] = useState("ShelfWatch Demo Store");

  useEffect(() => {
    if (settings) {
      setAutoSync(settings.auto_sync);
      setTheme(settings.theme);
      setStoreName(settings.store_name);
    }
  }, [settings]);

  // Change theme instantly when switched
  useEffect(() => {
    if (theme === "Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    await updateSettings({
      auto_sync: autoSync,
      theme,
      store_name: storeName,
    });
    toast({
      title: "Settings updated",
      description: "Your preferences were saved!",
    });
  }

  async function handleReset() {
    setAutoSync(true);
    setTheme("Light");
    setStoreName("ShelfWatch Demo Store");
    if (user) {
      await updateSettings({
        auto_sync: true,
        theme: "Light",
        store_name: "ShelfWatch Demo Store",
      });
      toast({
        title: "Settings reset",
        description: "Defaults restored successfully.",
      });
    }
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <SettingsIcon className="h-7 w-7 text-blue-500" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <form className="space-y-8" onSubmit={handleSave}>
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
          <div className="mt-10 flex gap-2 justify-end">
            <Button variant="outline" type="button" onClick={handleReset} disabled={isUpdating}>
              Reset
            </Button>
            <Button type="submit" disabled={isUpdating || isLoading}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
};

export default Settings;
