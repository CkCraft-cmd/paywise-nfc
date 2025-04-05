
import { useState, useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { User, Shield, CreditCard, Bell, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileSecurity from "@/components/profile/ProfileSecurity";
import ProfilePaymentMethods from "@/components/profile/ProfilePaymentMethods";
import ProfileNotifications from "@/components/profile/ProfileNotifications";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: typeof User;
  action: () => void;
}

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  const profileOptions: ProfileOption[] = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Manage your personal details",
      icon: User,
      action: () => setActiveTab("personal")
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Update passwords and security options",
      icon: Shield,
      action: () => setActiveTab("security")
    },
    {
      id: "payment",
      title: "Payment Methods",
      description: "Add or remove payment sources",
      icon: CreditCard,
      action: () => setActiveTab("payment")
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure app notifications",
      icon: Bell,
      action: () => setActiveTab("notifications")
    },
    {
      id: "logout",
      title: "Log Out",
      description: "Sign out from your account",
      icon: LogOut,
      action: () => {
        signOut();
        toast.success("Logged out successfully");
      }
    }
  ];

  return (
    <PageLayout>
      <div className="pt-6">
        <h1 className="text-xl font-bold mb-6">Profile</h1>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
          <div className="p-6 flex items-center">
            <div className="w-16 h-16 bg-paywise-lightBlue rounded-full flex items-center justify-center text-paywise-blue text-xl font-bold">
              {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-lg">{user?.full_name || 'User'}</h2>
              <p className="text-gray-500 text-sm">{user?.email || 'user@example.com'}</p>
              <p className="text-gray-400 text-xs mt-1">Balance: ₹{profile?.balance || 0}</p>
            </div>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {profileOptions.map((option) => {
              const IconComponent = option.icon;
              
              return (
                <button
                  key={option.id}
                  className="w-full flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  onClick={option.action}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    option.id === "logout" ? "bg-red-100 text-paywise-red" : "bg-paywise-lightBlue text-paywise-blue"
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <div className="ml-3 flex-grow text-left">
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              );
            })}
          </div>
        )}

        {activeTab !== "overview" && (
          <div className="bg-white rounded-xl overflow-hidden shadow-sm p-4">
            <button 
              className="mb-4 flex items-center text-sm text-gray-500"
              onClick={() => setActiveTab("overview")}
            >
              <ChevronRight size={16} className="rotate-180 mr-1" />
              Back to Profile
            </button>
            
            {activeTab === "personal" && <ProfileDetails />}
            {activeTab === "security" && <ProfileSecurity />}
            {activeTab === "payment" && <ProfilePaymentMethods />}
            {activeTab === "notifications" && <ProfileNotifications />}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Profile;
