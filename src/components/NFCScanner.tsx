
import { useEffect, useState } from "react";
import { ShieldCheck, SmartphoneNfc, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";

type ScanStatus = "idle" | "scanning" | "success" | "error";

interface NFCScannerProps {
  onScanComplete?: (cardId: string, customAmount?: number, customMerchant?: string) => void;
  autoStart?: boolean;
  enableCustomOptions?: boolean;
}

const NFCScanner = ({ 
  onScanComplete, 
  autoStart = false, 
  enableCustomOptions = false 
}: NFCScannerProps) => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [customAmount, setCustomAmount] = useState<number | undefined>(undefined);
  const [customMerchant, setCustomMerchant] = useState<string | undefined>(undefined);
  
  const { theme } = useTheme();

  // Simulate NFC availability check
  useEffect(() => {
    const checkNfcAvailability = () => {
      // In a real app, you would check if the device has NFC capabilities
      // For now, we'll simulate it
      const hasNfcCapability = true;
      setHasNfc(hasNfcCapability);
      
      if (!hasNfcCapability) {
        toast.error("NFC is not available on this device");
      }
    };
    
    checkNfcAvailability();
  }, []);

  // Auto start scanning if prop is true
  useEffect(() => {
    if (autoStart && hasNfc) {
      startScan();
    }
  }, [autoStart, hasNfc]);

  // Simulate scan progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (scanStatus === "scanning") {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 5;
          
          if (newProgress >= 100) {
            clearInterval(interval);
            simulateSuccessfulScan();
            return 100;
          }
          
          return newProgress;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanStatus]);

  const startScan = () => {
    if (hasNfc && scanStatus !== "scanning") {
      setScanStatus("scanning");
      setScanProgress(0);
      toast.info("Scanning for NFC card...");
    }
  };

  const simulateSuccessfulScan = () => {
    // In a real app, this would be the actual card ID from the NFC scan
    const mockCardId = `STU${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    setScanStatus("success");
    toast.success("Card detected successfully!");
    
    if (onScanComplete) {
      onScanComplete(mockCardId, customAmount, customMerchant);
    }
    
    // Reset after a delay
    setTimeout(() => {
      setScanStatus("idle");
      setScanProgress(0);
    }, 2000);
  };

  const getStatusColors = () => {
    switch (theme) {
      case "night":
        return scanStatus === "scanning" ? "text-blue-400" :
               scanStatus === "success" ? "text-green-400" :
               scanStatus === "error" ? "text-red-400" :
               "text-gray-500";
      case "fun":
        return scanStatus === "scanning" ? "text-purple-400" :
               scanStatus === "success" ? "text-pink-400" :
               scanStatus === "error" ? "text-orange-400" :
               "text-purple-300";
      default:
        switch (scanStatus) {
          case "scanning":
            return "text-paywise-blue";
          case "success":
            return "text-paywise-green";
          case "error":
            return "text-paywise-red";
          default:
            return "text-gray-400";
        }
    }
  };

  const getBgColors = () => {
    switch (theme) {
      case "night":
        return "bg-gray-800 text-white";
      case "fun":
        return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900";
      default:
        return "bg-white text-black";
    }
  };

  const getPulseColors = () => {
    switch (theme) {
      case "night":
        return "bg-blue-900 animate-pulse-soft";
      case "fun":
        return "bg-purple-200 animate-pulse-soft";
      default:
        return "bg-paywise-lightBlue animate-pulse-soft";
    }
  };

  const getProgressColors = () => {
    switch (theme) {
      case "night":
        return {
          bg: "#1a1a2e", 
          stroke: "#2563eb" // blue-600
        };
      case "fun":
        return {
          bg: "#f5d0fe", // purple-200
          stroke: "#a855f7" // purple-500
        };
      default:
        return {
          bg: "#E8EFFF",
          stroke: "#3366FF"
        };
    }
  };

  const progressColors = getProgressColors();

  const toggleCustomOptions = () => {
    setShowCustomOptions(!showCustomOptions);
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-sm ${getBgColors()}`}>
      <div 
        className={`relative flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all duration-300 ${
          scanStatus === "scanning" ? getPulseColors() : theme === "night" ? "bg-gray-700" : theme === "fun" ? "bg-purple-100" : "bg-gray-100"
        }`}
      >
        {scanStatus === "success" ? (
          <ShieldCheck size={40} className={theme === "night" ? "text-green-400" : theme === "fun" ? "text-pink-500" : "text-paywise-green"} />
        ) : (
          <SmartphoneNfc size={40} className={getStatusColors()} />
        )}
        
        {scanStatus === "scanning" && (
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={progressColors.bg}
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke={progressColors.stroke}
              strokeWidth="6"
              strokeDasharray="289.27"
              strokeDashoffset={289.27 * (1 - scanProgress / 100)}
              transform="rotate(-90 50 50)"
            />
          </svg>
        )}
      </div>
      
      <h3 className={`text-lg font-semibold mb-1 ${theme === "night" ? "text-white" : ""}`}>
        {scanStatus === "scanning"
          ? "Scanning..."
          : scanStatus === "success"
          ? "Card Detected!"
          : "Tap to Scan"}
      </h3>
      
      <p className={`text-sm text-center mb-4 ${theme === "night" ? "text-gray-300" : "text-gray-500"}`}>
        {scanStatus === "scanning"
          ? "Hold your student ID card near your device"
          : scanStatus === "success"
          ? "Authentication successful"
          : "Place your student ID card near the back of your phone"}
      </p>
      
      {enableCustomOptions && scanStatus === "idle" && (
        <button 
          onClick={toggleCustomOptions}
          className={`flex items-center mb-4 text-sm ${
            theme === "night" ? "text-blue-300" : 
            theme === "fun" ? "text-purple-600" : 
            "text-paywise-blue"
          }`}
        >
          <Edit2 size={16} className="mr-1" />
          {showCustomOptions ? "Hide custom options" : "Set custom options"}
        </button>
      )}
      
      {showCustomOptions && scanStatus === "idle" && (
        <div className="w-full space-y-3 mb-4">
          <div>
            <label className={`block text-sm mb-1 ${theme === "night" ? "text-gray-300" : "text-gray-600"}`}>
              Custom Amount (optional)
            </label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={customAmount || ""}
              onChange={(e) => setCustomAmount(e.target.value ? Number(e.target.value) : undefined)}
              className={theme === "night" ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
          <div>
            <label className={`block text-sm mb-1 ${theme === "night" ? "text-gray-300" : "text-gray-600"}`}>
              Custom Merchant (optional)
            </label>
            <Input
              type="text"
              placeholder="Enter merchant name"
              value={customMerchant || ""}
              onChange={(e) => setCustomMerchant(e.target.value || undefined)}
              className={theme === "night" ? "bg-gray-700 border-gray-600 text-white" : ""}
            />
          </div>
        </div>
      )}
      
      {scanStatus === "idle" && hasNfc && (
        <button
          onClick={startScan}
          className={`px-6 py-2.5 rounded-lg font-medium ${
            theme === "night" 
              ? "bg-blue-600 text-white hover:bg-blue-700" 
              : theme === "fun"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                : "bg-paywise-blue text-white"
          }`}
        >
          Start Scan
        </button>
      )}
      
      {hasNfc === false && (
        <p className="text-paywise-red">NFC is not available on this device</p>
      )}
    </div>
  );
};

export default NFCScanner;
