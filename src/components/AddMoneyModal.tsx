
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlusCircle, Check, X, Wallet } from "lucide-react";
import { toast } from "sonner";

interface AddMoneyModalProps {
  onAddMoney: (amount: number) => void;
}

const AddMoneyModal = ({ onAddMoney }: AddMoneyModalProps) => {
  const [amount, setAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    onAddMoney(numAmount);
    toast.success(`₹${numAmount.toLocaleString('en-IN')} added to your account`);
    setAmount("");
    setIsOpen(false);
  };

  const predefinedAmounts = [500, 1000, 2000, 5000];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          className="bg-white text-paywise-blue px-4 py-2 rounded-lg text-sm font-medium flex-1 flex items-center justify-center"
        >
          <Wallet size={16} className="mr-2" />
          Add Money
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="center">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Add Money</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>

          <div>
            <label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-1 block">
              Enter Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                className="pl-8"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {predefinedAmounts.map((presetAmount) => (
              <Button
                key={presetAmount}
                variant="outline"
                className="w-full"
                onClick={() => setAmount(presetAmount.toString())}
              >
                ₹{presetAmount}
              </Button>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="bg-paywise-blue text-white"
            >
              <Check size={16} className="mr-2" />
              Confirm
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddMoneyModal;
