
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CreditCard, PlusCircle, Trash2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  last4: string;
  expMonth: number;
  expYear: number;
  type: "card" | "upi" | "bank";
}

const ProfilePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card-1",
      name: "SBI Debit Card",
      last4: "4242",
      expMonth: 12,
      expYear: 2027,
      type: "card"
    },
    {
      id: "upi-1",
      name: "UPI ID",
      last4: "9876",
      expMonth: 0,
      expYear: 0,
      type: "upi"
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    type: "card"
  });
  
  const handleRemoveMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Payment method removed");
  };
  
  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMethod: PaymentMethod = {
      id: `${formData.type}-${Date.now()}`,
      name: formData.name,
      last4: formData.cardNumber.slice(-4),
      expMonth: parseInt(formData.expMonth) || 0,
      expYear: parseInt(formData.expYear) || 0,
      type: formData.type as "card" | "upi" | "bank"
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowAddForm(false);
    setFormData({
      name: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      cvv: "",
      type: "card"
    });
    
    toast.success("Payment method added");
  };
  
  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-paywise-blue" />;
      case 'upi':
        return <span className="font-bold text-green-600">UPI</span>;
      default:
        return <CreditCard className="h-5 w-5 text-paywise-blue" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Payment Methods</h2>
      
      {paymentMethods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payment methods added yet
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center">
                <div className="mr-3">
                  {getPaymentIcon(method.type)}
                </div>
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500">
                    {method.type === 'card' ? (
                      <>•••• {method.last4} | Exp: {method.expMonth}/{method.expYear % 100}</>
                    ) : (
                      <>•••••{method.last4}</>
                    )}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveMethod(method.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {showAddForm ? (
        <div className="border rounded-md p-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Add Payment Method</h3>
          
          <form onSubmit={handleAddMethod} className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Type</label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank">Bank Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={formData.type === "card" ? "Card Name" : 
                             formData.type === "upi" ? "UPI ID Name" : "Bank Account Name"}
                required
              />
            </div>
            
            {formData.type === "card" ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input 
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Month</label>
                    <Input 
                      value={formData.expMonth}
                      onChange={(e) => setFormData({...formData, expMonth: e.target.value})}
                      placeholder="MM"
                      maxLength={2}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Year</label>
                    <Input 
                      value={formData.expYear}
                      onChange={(e) => setFormData({...formData, expYear: e.target.value})}
                      placeholder="YYYY"
                      maxLength={4}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <Input 
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      placeholder="123"
                      maxLength={4}
                      required
                      type="password"
                    />
                  </div>
                </div>
              </>
            ) : formData.type === "upi" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">UPI ID</label>
                <Input 
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                  placeholder="name@upi"
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input 
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    placeholder="Account Number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">IFSC Code</label>
                  <Input 
                    value={formData.expMonth}
                    onChange={(e) => setFormData({...formData, expMonth: e.target.value})}
                    placeholder="IFSC Code"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="flex space-x-2 pt-2">
              <Button type="submit" className="bg-paywise-blue hover:bg-paywise-blue/90 text-white">
                Add Method
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="mt-4 flex items-center"
          variant="outline"
        >
          <PlusCircle className="h-4 w-4 mr-2" /> Add Payment Method
        </Button>
      )}
    </div>
  );
};

export default ProfilePaymentMethods;
