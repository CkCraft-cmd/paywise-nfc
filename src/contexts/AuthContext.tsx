import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Profile } from '@/types/database.types';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateBalance: (newBalance: number) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isTestMode: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// For development/demo purposes when no Supabase connection is available
const mockUser: User = {
  id: 'mock-user-id',
  email: 'demo@paywise.edu',
  full_name: 'Demo User'
};

const mockProfile: Profile = {
  id: 'mock-profile-id',
  user_id: 'mock-user-id',
  balance: 5000, // Starting with ₹5,000
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Error getting session, using test mode:', error.message);
          setIsTestMode(true);
          setUser(mockUser);
          setProfile(mockProfile);
          return;
        }
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata.full_name || ''
          });
          
          // Get user profile
          await fetchProfile(session.user.id);
        }
      } catch (error: any) {
        console.error('Error fetching session:', error);
        setIsTestMode(true);
        setUser(mockUser);
        setProfile(mockProfile);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Set up the subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isTestMode) return; // Don't update if in test mode
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata.full_name || ''
          });
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [isTestMode]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      if (isTestMode) {
        setProfile(mockProfile);
      }
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) return;
      
      if (isTestMode) {
        // Just update the local state for test mode
        setUser({ ...user, ...data });
        toast.success('Profile updated successfully');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: data
      });

      if (error) throw error;
      
      setUser({ ...user, ...data });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try to sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.warn('Supabase auth error (using test mode):', error.message);
        
        // Check if test mode credentials
        if (email === 'demo@paywise.edu' && password === 'demo') {
          setIsTestMode(true);
          setUser(mockUser);
          setProfile(mockProfile);
          toast.success('Signed in with demo account');
          return;
        }
        
        throw error;
      }
      
      toast.success('Signed in successfully');
    } catch (error: any) {
      // If it's a connection error, allow demo login
      if (error.message === 'Failed to fetch' && email === 'demo@paywise.edu' && password === 'demo') {
        setIsTestMode(true);
        setUser(mockUser);
        setProfile(mockProfile);
        toast.success('Signed in with demo account');
      } else {
        toast.error(error.message || 'Error signing in');
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      
      // Skip real signup in test mode
      if (email === 'demo@paywise.edu' && password === 'demo') {
        setIsTestMode(true);
        setUser(mockUser);
        setProfile(mockProfile);
        toast.success('Created demo account');
        return;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create a profile for the new user
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            user_id: data.user.id,
            balance: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

        if (profileError) throw profileError;
      }
      
      toast.success('Signed up successfully! Check your email for verification.');
    } catch (error: any) {
      // If it's a connection error, allow demo account creation
      if (error.message === 'Failed to fetch' && email === 'demo@paywise.edu') {
        setIsTestMode(true);
        setUser(mockUser);
        setProfile(mockProfile);
        toast.success('Created demo account');
      } else {
        toast.error(error.message || 'Error signing up');
        throw error;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      if (isTestMode) {
        setIsTestMode(false);
        setUser(null);
        setProfile(null);
        toast.success('Signed out of demo account');
      } else {
        await supabase.auth.signOut();
        toast.success('Signed out successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async (newBalance: number) => {
    try {
      if (!user || !profile) return;
      
      if (isTestMode) {
        // Just update the local state for test mode
        setProfile({ ...profile, balance: newBalance });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setProfile({ ...profile, balance: newBalance });
    } catch (error: any) {
      toast.error(error.message || 'Error updating balance');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateBalance,
      updateProfile,
      isTestMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
