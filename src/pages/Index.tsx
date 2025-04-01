
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import BalanceCard from "@/components/BalanceCard";
import TransactionItem, { Transaction } from "@/components/TransactionItem";
import FraudAlert from "@/components/FraudAlert";
import { Bell, Search } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(245.75);
  const [spentToday, setSpentToday] = useState(18.50);
  const [showFraudAlert, setShowFraudAlert] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate loading transactions
    const mockTransactions: Transaction[] = [
      {
        id: "tx1",
        amount: 8.50,
        title: "Campus Cafe",
        location: "Student Union",
        category: "dining",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: "completed"
      },
      {
        id: "tx2",
        amount: 27.99,
        title: "University Bookstore",
        location: "Main Campus",
        category: "books",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        status: "completed"
      },
      {
        id: "tx3",
        amount: 10.00,
        title: "Monthly Plan",
        location: "PayWise Services",
        category: "payment",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: "completed"
      },
      {
        id: "tx4",
        amount: 15.75,
        title: "Campus Market",
        location: "East Residence",
        category: "shopping",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        status: "completed"
      }
    ];
    
    setRecentTransactions(mockTransactions);
  }, []);

  const handleAddMoney = () => {
    toast.info("Add money feature coming soon!");
  };
  
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
            <p className="text-gray-500">Welcome back, Student!</p>
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
          balance={balance}
          spentToday={spentToday}
          onAddMoney={handleAddMoney}
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
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
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
