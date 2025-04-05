
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

const ProfileSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTwoFactor = async () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    toast.success(newState ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Security Settings</h2>
      
      <div className="border-b pb-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-medium">Change Password</h3>
          
          <div className="space-y-2">
            <label htmlFor="currentPassword" className="text-sm font-medium">Current Password</label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="bg-paywise-blue hover:bg-paywise-blue/90 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Updating...
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" /> 
                Update Password
              </>
            )}
          </Button>
        </form>
      </div>
      
      <div className="pt-2">
        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Enable 2FA</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={toggleTwoFactor}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSecurity;
