
import { ReactNode } from "react";
import TabBar from "./TabBar";
import { useTheme } from "@/contexts/ThemeContext";

interface PageLayoutProps {
  children: ReactNode;
  showTabBar?: boolean;
  className?: string;
}

const PageLayout = ({ children, showTabBar = true, className = "" }: PageLayoutProps) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    switch (theme) {
      case "night":
        return "bg-gray-900";
      case "fun":
        return "bg-gradient-to-br from-purple-50 to-pink-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${getBackgroundColor()} ${className}`}>
      <main className={`flex-1 px-4 pb-20 ${showTabBar ? 'pb-28' : 'pb-6'}`}>
        {children}
      </main>
      {showTabBar && <TabBar />}
    </div>
  );
};

export default PageLayout;
