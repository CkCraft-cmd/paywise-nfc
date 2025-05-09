
import { TrendingUp, CreditCard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AddMoneyModal from "./AddMoneyModal";

interface BalanceCardProps {
  spentToday: number;
  onScanCard: () => void;
}

const BalanceCard = ({ spentToday, onScanCard }: BalanceCardProps) => {
  const { profile, updateBalance } = useAuth();
  const balance = profile?.balance || 0;

  const handleAddMoney = async (amount: number) => {
    if (!profile) return;
    
    const newBalance = balance + amount;
    await updateBalance(newBalance);
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-6">
      <div className="card-gradient p-5">
        <div className="flex justify-between items-start mb-12">
          <div>
            <p className="text-sm font-medium text-white/80 mb-1">Current Balance</p>
            <h3 className="text-3xl font-bold">₹{balance.toLocaleString('en-IN')}</h3>
          </div>
          <div className="flex items-center bg-white/20 rounded-lg px-2 py-1">
            <TrendingUp size={14} className="mr-1" />
            <span className="text-xs font-medium">₹{spentToday.toLocaleString('en-IN')} today</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <AddMoneyModal onAddMoney={handleAddMoney} />
          <button 
            onClick={onScanCard}
            className="bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex-1 flex items-center justify-center"
          >
            <CreditCard size={16} className="mr-2" />
            Pay Now
          </button>
        </div>
      </div>
      <div className="absolute w-32 h-32 rounded-full bg-white/10 -top-10 -right-10"></div>
      <div className="absolute w-20 h-20 rounded-full bg-white/10 bottom-10 -left-10"></div>
    </div>
  );
};

export default BalanceCard;
