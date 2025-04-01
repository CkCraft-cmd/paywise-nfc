
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface FraudAlertProps {
  message: string;
  level: "warning" | "critical";
  timestamp: Date;
  onClose: () => void;
}

const FraudAlert = ({ message, level, timestamp, onClose }: FraudAlertProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBgColor = () => {
    return level === "critical" ? "bg-red-50" : "bg-amber-50";
  };

  const getBorderColor = () => {
    return level === "critical" ? "border-red-200" : "border-amber-200";
  };

  const getTextColor = () => {
    return level === "critical" ? "text-red-700" : "text-amber-700";
  };

  const getIconColor = () => {
    return level === "critical" ? "text-red-500" : "text-amber-500";
  };

  return (
    <div 
      className={`${getBgColor()} ${getBorderColor()} border rounded-lg p-4 mb-4 animate-fade-in`}
    >
      <div className="flex justify-between items-start">
        <div className="flex">
          <div className={`${getIconColor()} flex-shrink-0 mt-0.5`}>
            <AlertTriangle size={18} />
          </div>
          <div className="ml-3">
            <h3 className={`text-sm font-medium ${getTextColor()}`}>
              {level === "critical" ? "Potential Fraud Detected" : "Unusual Activity Alert"}
            </h3>
            <div className={`mt-1 text-sm ${getTextColor()}`}>
              <p>{message}</p>
              {isExpanded && (
                <div className="mt-2 text-xs">
                  <p>Our AI system has detected this activity as potentially suspicious based on your past behavior patterns.</p>
                  <p className="mt-1">Detected: {timestamp.toLocaleString()}</p>
                </div>
              )}
            </div>
            <button 
              className={`mt-2 text-xs font-medium ${getTextColor()} hover:underline`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Learn more"}
            </button>
          </div>
        </div>
        <button 
          className={`${getIconColor()} ml-4`}
          onClick={onClose}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default FraudAlert;
