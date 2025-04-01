
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, CreditCard, Fingerprint, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface SettingToggle {
  id: string;
  title: string;
  description: string;
  icon: typeof Shield;
  enabled: boolean;
}

const Settings = () => {
  const [securitySettings, setSecuritySettings] = useState<SettingToggle[]>([
    {
      id: "biometric",
      title: "Biometric Authentication",
      description: "Use fingerprint to authenticate payments",
      icon: Fingerprint,
      enabled: true
    },
    {
      id: "pin",
      title: "Payment PIN",
      description: "Require PIN for all transactions",
      icon: Shield,
      enabled: true
    },
    {
      id: "fraud",
      title: "Fraud Detection",
      description: "AI-powered unusual activity alerts",
      icon: Shield,
      enabled: true
    }
  ]);
  
  const [notificationSettings, setNotificationSettings] = useState<SettingToggle[]>([
    {
      id: "transaction",
      title: "Transaction Alerts",
      description: "Get notified about all transactions",
      icon: Bell,
      enabled: true
    },
    {
      id: "security",
      title: "Security Alerts",
      description: "Get notified about security events",
      icon: Bell,
      enabled: true
    },
    {
      id: "marketing",
      title: "Marketing Notifications",
      description: "Receive offers and promotions",
      icon: Bell,
      enabled: false
    }
  ]);
  
  const [paymentSettings, setPaymentSettings] = useState<SettingToggle[]>([
    {
      id: "nfc",
      title: "NFC Payments",
      description: "Enable contactless payments",
      icon: Smartphone,
      enabled: true
    },
    {
      id: "autoReload",
      title: "Auto Reload",
      description: "Automatically add funds when balance is low",
      icon: CreditCard,
      enabled: false
    }
  ]);
  
  const handleToggleSetting = (
    section: "security" | "notification" | "payment",
    id: string,
    enabled: boolean
  ) => {
    let updatedSettings;
    
    if (section === "security") {
      updatedSettings = securitySettings.map((s) =>
        s.id === id ? { ...s, enabled } : s
      );
      setSecuritySettings(updatedSettings);
    } else if (section === "notification") {
      updatedSettings = notificationSettings.map((s) =>
        s.id === id ? { ...s, enabled } : s
      );
      setNotificationSettings(updatedSettings);
    } else if (section === "payment") {
      updatedSettings = paymentSettings.map((s) =>
        s.id === id ? { ...s, enabled } : s
      );
      setPaymentSettings(updatedSettings);
    }
    
    toast.info(`${enabled ? "Enabled" : "Disabled"} ${id} setting`);
  };
  
  const SettingsSection = ({
    title,
    settings,
    section
  }: {
    title: string;
    settings: SettingToggle[];
    section: "security" | "notification" | "payment";
  }) => (
    <div className="mb-6">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {settings.map((setting) => {
          const IconComponent = setting.icon;
          
          return (
            <div
              key={setting.id}
              className="flex items-center p-4 border-b border-gray-100 last:border-0"
            >
              <div className="w-10 h-10 bg-paywise-lightBlue rounded-full flex items-center justify-center text-paywise-blue">
                <IconComponent size={20} />
              </div>
              <div className="ml-3 flex-grow">
                <h3 className="font-medium">{setting.title}</h3>
                <p className="text-xs text-gray-500">{setting.description}</p>
              </div>
              <Switch
                checked={setting.enabled}
                onCheckedChange={(checked) =>
                  handleToggleSetting(section, setting.id, checked)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <PageLayout>
      <div className="pt-6">
        <h1 className="text-xl font-bold mb-6">Settings</h1>
        
        <SettingsSection
          title="Security"
          settings={securitySettings}
          section="security"
        />
        
        <SettingsSection
          title="Notifications"
          settings={notificationSettings}
          section="notification"
        />
        
        <SettingsSection
          title="Payment Options"
          settings={paymentSettings}
          section="payment"
        />
        
        <div className="mt-8 mb-6 text-center">
          <p className="text-gray-500 text-sm">PayWise NFC v1.0.0</p>
          <p className="text-gray-400 text-xs mt-1">© 2023 PayWise. All rights reserved.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
