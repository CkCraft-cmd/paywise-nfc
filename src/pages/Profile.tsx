
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { User, Shield, CreditCard, Bell, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ProfileOption {
  id: string;
  title: string;
  description: string;
  icon: typeof User;
  action: () => void;
}

const Profile = () => {
  const [userName, setUserName] = useState("Alex Johnson");
  const [userEmail, setUserEmail] = useState("alex.j@university.edu");
  const [studentId, setStudentId] = useState("STU38291054");
  
  const profileOptions: ProfileOption[] = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Manage your personal details",
      icon: User,
      action: () => toast.info("Personal information settings")
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Update passwords and security options",
      icon: Shield,
      action: () => toast.info("Security settings")
    },
    {
      id: "payment",
      title: "Payment Methods",
      description: "Add or remove payment sources",
      icon: CreditCard,
      action: () => toast.info("Payment methods settings")
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Configure app notifications",
      icon: Bell,
      action: () => toast.info("Notification settings")
    },
    {
      id: "logout",
      title: "Log Out",
      description: "Sign out from your account",
      icon: LogOut,
      action: () => toast.info("Log out requested")
    }
  ];

  return (
    <PageLayout>
      <div className="pt-6">
        <h1 className="text-xl font-bold mb-6">Profile</h1>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-6">
          <div className="p-6 flex items-center">
            <div className="w-16 h-16 bg-paywise-lightBlue rounded-full flex items-center justify-center text-paywise-blue text-xl font-bold">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="ml-4">
              <h2 className="font-semibold text-lg">{userName}</h2>
              <p className="text-gray-500 text-sm">{userEmail}</p>
              <p className="text-gray-400 text-xs mt-1">Student ID: {studentId}</p>
            </div>
          </div>
        </div>
        
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
      </div>
    </PageLayout>
  );
};

export default Profile;
