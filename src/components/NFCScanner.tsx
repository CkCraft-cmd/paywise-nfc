
import { useEffect, useState } from "react";
import { ShieldCheck, SmartphoneNfc } from "lucide-react";
import { toast } from "sonner";

type ScanStatus = "idle" | "scanning" | "success" | "error";

interface NFCScannerProps {
  onScanComplete?: (cardId: string) => void;
  autoStart?: boolean;
}

const NFCScanner = ({ onScanComplete, autoStart = false }: NFCScannerProps) => {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [hasNfc, setHasNfc] = useState<boolean | null>(null);

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
      onScanComplete(mockCardId);
    }
    
    // Reset after a delay
    setTimeout(() => {
      setScanStatus("idle");
      setScanProgress(0);
    }, 2000);
  };

  const getStatusColors = () => {
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
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white shadow-sm">
      <div 
        className={`relative flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all duration-300 ${
          scanStatus === "scanning" ? "bg-paywise-lightBlue animate-pulse-soft" : "bg-gray-100"
        }`}
      >
        {scanStatus === "success" ? (
          <ShieldCheck size={40} className="text-paywise-green" />
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
              stroke="#E8EFFF"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#3366FF"
              strokeWidth="6"
              strokeDasharray="289.27"
              strokeDashoffset={289.27 * (1 - scanProgress / 100)}
              transform="rotate(-90 50 50)"
            />
          </svg>
        )}
      </div>
      
      <h3 className="text-lg font-semibold mb-1">
        {scanStatus === "scanning"
          ? "Scanning..."
          : scanStatus === "success"
          ? "Card Detected!"
          : "Tap to Scan"}
      </h3>
      
      <p className="text-gray-500 text-sm text-center mb-4">
        {scanStatus === "scanning"
          ? "Hold your student ID card near your device"
          : scanStatus === "success"
          ? "Authentication successful"
          : "Place your student ID card near the back of your phone"}
      </p>
      
      {scanStatus === "idle" && hasNfc && (
        <button
          onClick={startScan}
          className="bg-paywise-blue text-white px-6 py-2.5 rounded-lg font-medium"
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
