
import { ReactNode } from "react";
import TabBar from "./TabBar";

interface PageLayoutProps {
  children: ReactNode;
  showTabBar?: boolean;
  className?: string;
}

const PageLayout = ({ children, showTabBar = true, className = "" }: PageLayoutProps) => {
  return (
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      <main className={`flex-1 px-4 pb-20 ${showTabBar ? 'pb-28' : 'pb-6'}`}>
        {children}
      </main>
      {showTabBar && <TabBar />}
    </div>
  );
};

export default PageLayout;
