
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface SpendingData {
  name: string;
  value: number;
}

interface SpendingChartProps {
  weeklyData: SpendingData[];
  monthlyData: SpendingData[];
  yearlyData: SpendingData[];
}

type TimeRange = "weekly" | "monthly" | "yearly";

const SpendingChart = ({ weeklyData, monthlyData, yearlyData }: SpendingChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  
  const getCurrentData = () => {
    switch (timeRange) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };
  
  const data = getCurrentData();
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded-md border border-gray-100">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-paywise-blue">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Spending Overview</h3>
        <div className="flex space-x-2 text-sm">
          <button
            className={`px-3 py-1 rounded-full ${
              timeRange === "weekly" ? "bg-paywise-blue text-white" : "bg-gray-100"
            }`}
            onClick={() => setTimeRange("weekly")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 rounded-full ${
              timeRange === "monthly" ? "bg-paywise-blue text-white" : "bg-gray-100"
            }`}
            onClick={() => setTimeRange("monthly")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 rounded-full ${
              timeRange === "yearly" ? "bg-paywise-blue text-white" : "bg-gray-100"
            }`}
            onClick={() => setTimeRange("yearly")}
          >
            Year
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              hide={true}
              domain={[0, 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#3366FF" 
              radius={[4, 4, 0, 0]}
              barSize={timeRange === "yearly" ? 20 : 30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
