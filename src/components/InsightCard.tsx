
import { TrendingDown, TrendingUp, HelpCircle } from "lucide-react";
import { useState } from "react";

interface InsightCardProps {
  title: string;
  value: string | number;
  change: number;
  timeFrame: string;
  description?: string;
}

const InsightCard = ({ title, value, change, timeFrame, description }: InsightCardProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const isPositive = change >= 0;
  const formattedChange = Math.abs(change).toFixed(1);
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {description && (
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={16} />
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-10 w-60 p-3 text-xs bg-gray-800 text-white rounded shadow-lg">
                {description}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline">
        <span className="text-xl font-bold mr-2">{typeof value === 'number' ? value.toFixed(2) : value}</span>
        <div className={`flex items-center text-xs ${isPositive ? 'text-paywise-green' : 'text-paywise-red'}`}>
          {isPositive ? (
            <TrendingUp size={12} className="mr-1" />
          ) : (
            <TrendingDown size={12} className="mr-1" />
          )}
          <span>{formattedChange}% {isPositive ? 'up' : 'down'}</span>
        </div>
      </div>
      
      <p className="text-xs text-gray-400 mt-1">vs. {timeFrame}</p>
    </div>
  );
};

export default InsightCard;
