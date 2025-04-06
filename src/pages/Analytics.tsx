
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchTransactions } from "@/services/transactionService";
import PageLayout from "@/components/PageLayout";
import InsightCard from "@/components/InsightCard";
import SpendingChart from "@/components/SpendingChart";
import TransactionItem, { Transaction } from "@/components/TransactionItem";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

const Analytics = () => {
  const { user, isTestMode } = useAuth();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Sample data for spending charts - in a real app these would be calculated from transactions
  const weeklyData = [
    { name: "Mon", value: 22.5 },
    { name: "Tue", value: 15.75 },
    { name: "Wed", value: 30.25 },
    { name: "Thu", value: 12.0 },
    { name: "Fri", value: 45.5 },
    { name: "Sat", value: 18.25 },
    { name: "Sun", value: 10.75 },
  ];

  const monthlyData = [
    { name: "Week 1", value: 120.5 },
    { name: "Week 2", value: 95.25 },
    { name: "Week 3", value: 140.75 },
    { name: "Week 4", value: 115.0 },
  ];

  const yearlyData = [
    { name: "Jan", value: 450 },
    { name: "Feb", value: 400 },
    { name: "Mar", value: 525 },
    { name: "Apr", value: 475 },
    { name: "May", value: 300 },
    { name: "Jun", value: 350 },
    { name: "Jul", value: 325 },
    { name: "Aug", value: 510 },
    { name: "Sep", value: 475 },
    { name: "Oct", value: 400 },
    { name: "Nov", value: 450 },
    { name: "Dec", value: 550 },
  ];
  
  // This effect will trigger when a new payment is made
  useEffect(() => {
    // Listen for the custom event from payment success
    const handlePaymentSuccess = () => {
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('payment-completed', handlePaymentSuccess);
    
    return () => {
      window.removeEventListener('payment-completed', handlePaymentSuccess);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        const fetchedTransactions = await fetchTransactions(user.id, isTestMode);
        
        // Convert timestamp strings to Date objects for proper formatting
        const formattedTransactions = fetchedTransactions.map(tx => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        }));
        
        setTransactions(formattedTransactions);
      } catch (error) {
        console.error("Error loading transactions:", error);
        toast.error("Failed to load transaction history");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [user, refreshKey, isTestMode]);

  const handleViewTransaction = (id: string) => {
    toast.info(`Viewing transaction ${id}`);
  };

  // Calculate analytics totals
  const monthlySpending = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const transactionCount = transactions.length;
  const avgTransaction = transactionCount > 0 ? monthlySpending / transactionCount : 0;
  
  // Calculate dining percentage
  const diningTransactions = transactions.filter(tx => tx.category === "dining");
  const diningPercentage = transactions.length > 0 
    ? (diningTransactions.length / transactions.length) * 100 
    : 0;
    
  const getCardStyles = () => {
    switch (theme) {
      case "night":
        return "bg-gray-800 border-gray-700";
      case "fun":
        return "bg-white border-purple-200 shadow-purple-100";
      default:
        return "bg-white border-gray-100";
    }
  };

  return (
    <PageLayout>
      <div className="pt-6">
        <h1 className="text-xl font-bold mb-6">Analytics</h1>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <InsightCard
            title="Monthly Spending"
            value={monthlySpending}
            change={-12.5}
            timeFrame="last month"
            description="Total amount spent this month across all categories."
          />
          <InsightCard
            title="Transactions"
            value={transactionCount}
            change={8.3}
            timeFrame="last month"
            description="Total number of transactions completed this month."
          />
          <InsightCard
            title="Avg. Transaction"
            value={avgTransaction}
            change={-5.2}
            timeFrame="last month"
            description="Average amount spent per transaction this month."
          />
          <InsightCard
            title="Dining Expenses"
            value={`${diningPercentage.toFixed(0)}%`}
            change={3.8}
            timeFrame="last month"
            description="Percentage of total spending at campus dining venues."
          />
        </div>
        
        <div className="mb-6">
          <SpendingChart
            weeklyData={weeklyData}
            monthlyData={monthlyData}
            yearlyData={yearlyData}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="font-semibold mb-3">Transaction History</h2>
          <div className={`rounded-xl overflow-hidden shadow-sm ${getCardStyles()}`}>
            {isLoading ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin h-6 w-6 border-2 border-paywise-blue border-t-transparent rounded-full"></div>
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onClick={() => handleViewTransaction(transaction.id)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No transaction history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
