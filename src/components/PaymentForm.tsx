
import { useState } from "react";
import { Check, Lock } from "lucide-react";
import { toast } from "sonner";

interface PaymentFormProps {
  amount: number;
  merchant: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const PaymentForm = ({ amount, merchant, onCancel, onSuccess }: PaymentFormProps) => {
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
      
    }, 2000);
  };
  
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <Check size={32} className="text-paywise-green" />
        </div>
        <h3 className="text-xl font-bold mb-1">Payment Successful!</h3>
        <p className="text-gray-500 text-center mb-4">
          Your payment of ₹{amount.toLocaleString('en-IN')} to {merchant} has been processed successfully.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">Confirm Payment</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Amount</span>
          <span className="font-bold">₹{amount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Merchant</span>
          <span>{merchant}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Enter Payment Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isProcessing}
              className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-paywise-blue focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Lock size={16} className="text-gray-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <Lock size={12} className="mr-1" /> Your password is encrypted
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-paywise-blue text-white py-2.5 rounded-lg font-medium"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing
              </span>
            ) : (
              "Pay Now"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
