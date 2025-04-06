
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { addTransaction } from "@/services/transactionService";
import PageLayout from "@/components/PageLayout";
import NFCScanner from "@/components/NFCScanner";
import PaymentForm from "@/components/PaymentForm";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const Payments = () => {
  const navigate = useNavigate();
  const { user, profile, updateBalance, isTestMode } = useAuth();
  const { theme } = useTheme();
  const [scanComplete, setScanComplete] = useState(false);
  const [cardId, setCardId] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(10.99);
  const [merchantName, setMerchantName] = useState("Campus Cafe");
  
  const handleScanComplete = (
    detectedCardId: string, 
    customAmount?: number, 
    customMerchant?: string
  ) => {
    setCardId(detectedCardId);
    setScanComplete(true);
    
    // Use custom values if provided, otherwise use mock data
    if (customAmount !== undefined) {
      setPaymentAmount(customAmount);
    } else {
      // In a real app, we would fetch merchant details based on the card ID
      // For now, we'll use mock data
      const mockMerchants = [
        { id: "1234", name: "Campus Cafe", amount: 10.99 },
        { id: "5678", name: "University Bookstore", amount: 25.50 },
        { id: "9101", name: "Student Union", amount: 15.75 }
      ];
      
      const merchant = mockMerchants.find(m => m.id === detectedCardId.substring(0, 4)) || mockMerchants[0];
      setPaymentAmount(merchant.amount);
    }
    
    if (customMerchant) {
      setMerchantName(customMerchant);
    } else {
      // In a real app, we would fetch merchant details based on the card ID
      // For now, we'll use mock data
      const mockMerchants = [
        { id: "1234", name: "Campus Cafe", amount: 10.99 },
        { id: "5678", name: "University Bookstore", amount: 25.50 },
        { id: "9101", name: "Student Union", amount: 15.75 }
      ];
      
      const merchant = mockMerchants.find(m => m.id === detectedCardId.substring(0, 4)) || mockMerchants[0];
      setMerchantName(merchant.name);
    }
    
    // Show payment form after a short delay
    setTimeout(() => {
      setShowPaymentForm(true);
    }, 1000);
  };
  
  const handlePaymentCancel = () => {
    // Reset the scan state
    setScanComplete(false);
    setCardId("");
    setShowPaymentForm(false);
  };
  
  const handlePaymentSuccess = async () => {
    if (!user || !profile) return;
    
    try {
      // 1. Update user balance
      const newBalance = profile.balance - paymentAmount;
      await updateBalance(newBalance);
      
      // 2. Create a transaction record
      await addTransaction({
        user_id: user.id,
        amount: paymentAmount,
        title: merchantName,
        location: "Student Union",
        category: "dining",
        timestamp: new Date().toISOString(),
        status: "completed"
      }, isTestMode);
      
      toast.success("Payment processed successfully!");
      
      // 3. Dispatch an event so Analytics page can refresh data
      window.dispatchEvent(new Event('payment-completed'));
      
      // Navigate back to home after successful payment
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("Failed to process payment");
    }
  };
  
  const handleNewScan = () => {
    setScanComplete(false);
    setCardId("");
    setShowPaymentForm(false);
  };

  // Get theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case "night":
        return {
          background: "bg-gray-900",
          text: "text-white",
          card: "bg-gray-800 border border-gray-700",
          border: "border-gray-700"
        };
      case "fun":
        return {
          background: "bg-gradient-to-br from-purple-50 to-pink-50",
          text: "text-purple-900",
          card: "bg-white border border-purple-200 shadow-purple-100",
          border: "border-purple-200"
        };
      default:
        return {
          background: "bg-white",
          text: "text-black",
          card: "bg-white border border-gray-100",
          border: "border-gray-100"
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <PageLayout>
      <div className={`pt-6 ${styles.background} min-h-screen -mt-6 -mx-4 px-4`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className={`mr-3 p-1 ${theme === "night" ? "text-white" : ""}`}
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className={`text-xl font-bold ${styles.text}`}>NFC Payment</h1>
          </div>
          
          <ThemeToggle />
        </div>
        
        <div className={`rounded-xl overflow-hidden shadow-sm ${styles.card}`}>
          {!scanComplete && (
            <>
              <div className={`p-4 border-b ${styles.border}`}>
                <h2 className={`font-semibold mb-2 ${styles.text}`}>Scan Your Student ID Card</h2>
                <p className={`text-sm ${theme === "night" ? "text-gray-400" : "text-gray-500"}`}>
                  Hold your phone near your student ID card to complete your payment
                </p>
              </div>
              
              <div className="p-4">
                <NFCScanner 
                  onScanComplete={handleScanComplete} 
                  enableCustomOptions={true} 
                />
              </div>
            </>
          )}
          
          {scanComplete && !showPaymentForm && (
            <div className="p-4">
              <div className="text-center py-6">
                <div className={`w-16 h-16 ${
                  theme === "night" 
                    ? "bg-blue-900" 
                    : theme === "fun" 
                      ? "bg-purple-200"
                      : "bg-paywise-lightBlue"
                  } rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <span className={`${
                    theme === "night" 
                      ? "text-blue-300" 
                      : theme === "fun" 
                        ? "text-purple-700"
                        : "text-paywise-blue"
                    } font-bold`}>ID</span>
                </div>
                <h3 className={`text-lg font-semibold mb-1 ${styles.text}`}>Card Detected</h3>
                <p className={`${
                  theme === "night" ? "text-gray-400" : "text-gray-500"
                } mb-3`}>Student ID: {cardId}</p>
                <p className={`text-sm ${
                  theme === "night" ? "text-gray-500" : "text-gray-400"
                }`}>Preparing payment form...</p>
              </div>
            </div>
          )}
          
          {showPaymentForm && (
            <PaymentForm
              amount={paymentAmount}
              merchant={merchantName}
              onCancel={handlePaymentCancel}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </div>
        
        {scanComplete && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNewScan}
              className={`font-medium ${
                theme === "night" 
                  ? "text-blue-400" 
                  : theme === "fun" 
                    ? "text-purple-600"
                    : "text-paywise-blue"
              }`}
            >
              Scan a different card
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Payments;
