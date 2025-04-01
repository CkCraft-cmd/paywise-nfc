
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import NFCScanner from "@/components/NFCScanner";
import PaymentForm from "@/components/PaymentForm";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Payments = () => {
  const navigate = useNavigate();
  const [scanComplete, setScanComplete] = useState(false);
  const [cardId, setCardId] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  const handleScanComplete = (detectedCardId: string) => {
    setCardId(detectedCardId);
    setScanComplete(true);
    
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
  
  const handlePaymentSuccess = () => {
    // In a real app, we would process the payment here
    toast.success("Payment processed successfully!");
    
    // Navigate back to home after successful payment
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  
  const handleNewScan = () => {
    setScanComplete(false);
    setCardId("");
    setShowPaymentForm(false);
  };

  return (
    <PageLayout>
      <div className="pt-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 p-1"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">NFC Payment</h1>
        </div>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          {!scanComplete && (
            <>
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold mb-2">Scan Your Student ID Card</h2>
                <p className="text-sm text-gray-500">
                  Hold your phone near your student ID card to complete your payment
                </p>
              </div>
              
              <div className="p-4">
                <NFCScanner onScanComplete={handleScanComplete} />
              </div>
            </>
          )}
          
          {scanComplete && !showPaymentForm && (
            <div className="p-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-paywise-lightBlue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-paywise-blue font-bold">ID</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Card Detected</h3>
                <p className="text-gray-500 mb-3">Student ID: {cardId}</p>
                <p className="text-sm text-gray-400">Preparing payment form...</p>
              </div>
            </div>
          )}
          
          {showPaymentForm && (
            <PaymentForm
              amount={10.99}
              merchant="Campus Cafe"
              onCancel={handlePaymentCancel}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </div>
        
        {scanComplete && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNewScan}
              className="text-paywise-blue font-medium"
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
