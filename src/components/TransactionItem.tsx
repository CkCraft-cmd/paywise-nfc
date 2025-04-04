
import { CreditCard, Coffee, Book, Utensils, ShoppingBag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Transaction {
  id: string;
  amount: number;
  title: string;
  location: string;
  category: "dining" | "books" | "shopping" | "payment" | "other";
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

interface TransactionItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionItem = ({ transaction, onClick }: TransactionItemProps) => {
  const { title, amount, category, timestamp, status, location } = transaction;
  
  const getCategoryIcon = () => {
    switch (category) {
      case "dining":
        return <Utensils size={20} />;
      case "books":
        return <Book size={20} />;
      case "shopping":
        return <ShoppingBag size={20} />;
      case "payment":
        return <CreditCard size={20} />;
      default:
        return <Coffee size={20} />;
    }
  };
  
  const getCategoryColor = () => {
    switch (category) {
      case "dining":
        return "bg-orange-100 text-orange-600";
      case "books":
        return "bg-blue-100 text-blue-600";
      case "shopping":
        return "bg-purple-100 text-purple-600";
      case "payment":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "text-paywise-green";
      case "pending":
        return "text-amber-500";
      case "failed":
        return "text-paywise-red";
      default:
        return "text-gray-500";
    }
  };

  const formattedTime = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div 
      className="flex items-center p-4 border-b border-gray-100 last:border-0 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className={`flex-shrink-0 w-10 h-10 ${getCategoryColor()} rounded-full flex items-center justify-center mr-3`}>
        {getCategoryIcon()}
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-xs text-gray-500">{location} • {formattedTime}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">₹{amount.toLocaleString('en-IN')}</p>
            <p className={`text-xs ${getStatusColor()}`}>{status === "completed" ? "Completed" : status === "pending" ? "Pending" : "Failed"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
