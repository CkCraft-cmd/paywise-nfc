
import { Link, useLocation } from "react-router-dom";
import { CreditCard, Home, PieChart, Settings, User } from "lucide-react";

const TabBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: "Home", path: "/", icon: Home },
    { name: "Payments", path: "/payments", icon: CreditCard },
    { name: "Analytics", path: "/analytics", icon: PieChart },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around py-2 px-2">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path;
        const IconComponent = tab.icon;
        
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`tab-button ${isActive ? "active" : ""} px-3 py-2`}
          >
            <IconComponent size={20} className={isActive ? "text-paywise-blue" : "text-gray-400"} />
            <span className="mt-1">{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default TabBar;
