import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types/database.types';

// Mock data for testing without Supabase connection
const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    user_id: 'mock-user-id',
    amount: 120.50,
    title: 'Campus Café',
    location: 'Student Union',
    category: 'dining',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    status: 'completed'
  },
  {
    id: 'txn-002',
    user_id: 'mock-user-id',
    amount: 45.00,
    title: 'University Bookstore',
    location: 'Main Campus',
    category: 'books',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'completed'
  },
  {
    id: 'txn-003',
    user_id: 'mock-user-id',
    amount: 500.00,
    title: 'Semester Fee Payment',
    location: 'Admin Building',
    category: 'payment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    status: 'completed'
  },
  {
    id: 'txn-004',
    user_id: 'mock-user-id',
    amount: 75.25,
    title: 'Campus Store',
    location: 'Student Center',
    category: 'shopping',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    status: 'completed'
  }
];

let localTransactions = [...mockTransactions];

export const fetchTransactions = async (userId: string, useTestMode = false): Promise<Transaction[]> => {
  try {
    // If test mode is enabled or if we've previously detected connection issues
    if (useTestMode) {
      return localTransactions.filter(t => t.user_id === userId);
    }

    // Otherwise, try to fetch from Supabase
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.warn('Error fetching transactions, using mock data:', error);
      return localTransactions.filter(t => t.user_id === userId);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return localTransactions.filter(t => t.user_id === userId);
  }
};

export const addTransaction = async (transaction: Omit<Transaction, 'id'>, useTestMode = false): Promise<Transaction> => {
  try {
    // If test mode is enabled or if we've previously detected connection issues
    if (useTestMode) {
      const newTransaction = {
        ...transaction,
        id: `txn-${Date.now()}`
      };
      
      localTransactions = [newTransaction, ...localTransactions];
      return newTransaction;
    }

    // Otherwise, try to add to Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
      
    if (error) {
      console.warn('Error adding transaction, using mock data:', error);
      const newTransaction = {
        ...transaction,
        id: `txn-${Date.now()}`
      };
      
      localTransactions = [newTransaction, ...localTransactions];
      return newTransaction;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    
    // Fall back to local storage
    const newTransaction = {
      ...transaction,
      id: `txn-${Date.now()}`
    };
    
    localTransactions = [newTransaction, ...localTransactions];
    return newTransaction;
  }
};
