
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTransactions } from "@/services/transactionService";
import PageLayout from "@/components/PageLayout";
import BalanceCard from "@/components/BalanceCard";
import TransactionItem, { Transaction } from "@/components/TransactionItem";
import FraudAlert from "@/components/FraudAlert";
import { Bell, Search } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [spentToday, setSpentToday] = useState(0);
  const [showFraudAlert, setShowFraudAlert] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const transactions = await fetchTransactions(user.id);
        
        // Convert timestamp strings to Date objects
        const formattedTransactions = transactions.map(tx => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        }));
        
        setRecentTransactions(formattedTransactions);
        
        // Calculate spent today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todaySpent = formattedTransactions
          .filter(tx => 
            tx.status === "completed" && 
            new Date(tx.timestamp) >= today
          )
          .reduce((sum, tx) => sum + tx.amount, 0);
          
        setSpentToday(todaySpent);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast.error("Failed to load transactions");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [user]);
  
  const handleScanCard = () => {
    navigate("/payments");
  };
  
  const handleViewTransaction = (transactionId: string) => {
    toast.info(`Viewing details for transaction ${transactionId}`);
    // Would navigate to transaction details in a real app
  };

  return (
    <PageLayout>
      <div className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">PayWise</h1>
            <p className="text-gray-500">Welcome back, {user?.full_name || 'Student'}!</p>
          </div>
          <div className="flex space-x-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Search size={20} className="text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Bell size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <BalanceCard
          spentToday={spentToday}
          onScanCard={handleScanCard}
        />
        
        {showFraudAlert && (
          <FraudAlert
            message="Unusual transaction detected at University Lab Building yesterday at 11:45 PM."
            level="warning"
            timestamp={new Date(Date.now() - 1000 * 60 * 60 * 12)}
            onClose={() => setShowFraudAlert(false)}
          />
        )}
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold">Recent Transactions</h2>
            <button 
              className="text-paywise-blue text-sm font-medium"
              onClick={() => navigate("/analytics")}
            >
              See All
            </button>
          </div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-paywise-blue border-t-transparent rounded-full"></div>
              </div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.slice(0, 4).map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => handleViewTransaction(transaction.id)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No recent transactions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
