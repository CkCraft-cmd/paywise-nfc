
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import InsightCard from "@/components/InsightCard";
import SpendingChart from "@/components/SpendingChart";
import TransactionItem, { Transaction } from "@/components/TransactionItem";
import { toast } from "sonner";

const Analytics = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
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
    },
    {
      id: "tx5",
      amount: 5.25,
      title: "University Printing",
      location: "Library",
      category: "other",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      status: "completed"
    },
    {
      id: "tx6",
      amount: 12.50,
      title: "Campus Cafe",
      location: "Student Union",
      category: "dining",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      status: "completed"
    }
  ]);

  // Sample data for spending charts
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

  const handleViewTransaction = (id: string) => {
    toast.info(`Viewing transaction ${id}`);
  };

  return (
    <PageLayout>
      <div className="pt-6">
        <h1 className="text-xl font-bold mb-6">Analytics</h1>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <InsightCard
            title="Monthly Spending"
            value={285.75}
            change={-12.5}
            timeFrame="last month"
            description="Total amount spent this month across all categories."
          />
          <InsightCard
            title="Transactions"
            value={16}
            change={8.3}
            timeFrame="last month"
            description="Total number of transactions completed this month."
          />
          <InsightCard
            title="Avg. Transaction"
            value={17.86}
            change={-5.2}
            timeFrame="last month"
            description="Average amount spent per transaction this month."
          />
          <InsightCard
            title="Dining Expenses"
            value="42%"
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
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onClick={() => handleViewTransaction(transaction.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Analytics;
