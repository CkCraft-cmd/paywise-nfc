
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Bell } from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const ProfileNotifications = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "payment",
      title: "Payment Notifications",
      description: "Get notified about new payments and transactions",
      enabled: true
    },
    {
      id: "security",
      title: "Security Alerts",
      description: "Receive alerts about suspicious activity",
      enabled: true
    },
    {
      id: "offers",
      title: "Promotions & Offers",
      description: "Stay updated with the latest offers and promotions",
      enabled: false
    },
    {
      id: "balance",
      title: "Low Balance Alerts",
      description: "Get notified when your account balance is low",
      enabled: true
    },
    {
      id: "news",
      title: "Campus News",
      description: "Receive notifications about campus events and news",
      enabled: false
    }
  ]);
  
  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };
  
  const saveSettings = () => {
    toast.success("Notification preferences saved");
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      
      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium">{setting.title}</p>
              <p className="text-sm text-gray-500">{setting.description}</p>
            </div>
            <Switch 
              checked={setting.enabled}
              onCheckedChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>
      
      <div className="pt-4">
        <Button 
          onClick={saveSettings}
          className="bg-paywise-blue hover:bg-paywise-blue/90 text-white"
        >
          <Bell className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default ProfileNotifications;
