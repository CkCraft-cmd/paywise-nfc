
import { Link, useLocation } from "react-router-dom";
import { CreditCard, Home, PieChart, Settings, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const TabBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme } = useTheme();

  const tabs = [
    { name: "Home", path: "/", icon: Home },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const getActiveColor = () => {
    switch (theme) {
      case "night":
        return "text-blue-400";
      case "fun":
        return "text-purple-600";
      default:
        return "text-paywise-blue";
    }
  };

  const getTabBarStyles = () => {
    switch (theme) {
      case "night":
        return "bg-gray-900 border-gray-800";
      case "fun":
        return "bg-white border-purple-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 border-t flex justify-around py-2 px-2 ${getTabBarStyles()}`}>
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        const IconComponent = tab.icon;
        
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-button ${isActive ? "active" : ""} px-3 py-2`}
          >
            <IconComponent 
              size={20} 
              className={isActive ? getActiveColor() : theme === "night" ? "text-gray-500" : "text-gray-400"} 
            />
            <span className="mt-1">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default TabBar;
