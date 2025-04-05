import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  user_id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

// Fetch chat history from Supabase
export const fetchChatHistory = async (userId: string, useTestMode = false): Promise<ChatMessage[]> => {
  try {
    // If test mode is enabled or if we've previously detected connection issues
    if (useTestMode) {
      // Return empty array or local storage data if available
      const localHistory = localStorage.getItem(`chat_history_${userId}`);
      return localHistory ? JSON.parse(localHistory) : [];
    }

    // Otherwise, try to fetch from Supabase
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });
      
    if (error) {
      console.warn('Error fetching chat history, using local storage:', error);
      const localHistory = localStorage.getItem(`chat_history_${userId}`);
      return localHistory ? JSON.parse(localHistory) : [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    // Fallback to local storage
    const localHistory = localStorage.getItem(`chat_history_${userId}`);
    return localHistory ? JSON.parse(localHistory) : [];
  }
};

// Save a message to Supabase
export const saveMessage = async (message: Omit<ChatMessage, 'id'>, useTestMode = false): Promise<ChatMessage> => {
  const newMessage = {
    ...message,
    id: uuidv4()
  };
  
  try {
    // If test mode is enabled or if we've previously detected connection issues
    if (useTestMode) {
      // Store in local storage
      const userId = message.user_id;
      const localHistory = localStorage.getItem(`chat_history_${userId}`);
      const messages = localHistory ? JSON.parse(localHistory) : [];
      messages.push(newMessage);
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
      return newMessage;
    }

    // Otherwise, try to save to Supabase
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([newMessage])
      .select()
      .single();
      
    if (error) {
      console.warn('Error saving message to Supabase, using local storage:', error);
      // Fallback to local storage
      const userId = message.user_id;
      const localHistory = localStorage.getItem(`chat_history_${userId}`);
      const messages = localHistory ? JSON.parse(localHistory) : [];
      messages.push(newMessage);
      localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
      return newMessage;
    }
    
    return data;
  } catch (error) {
    console.error('Error saving message:', error);
    // Fallback to local storage
    const userId = message.user_id;
    const localHistory = localStorage.getItem(`chat_history_${userId}`);
    const messages = localHistory ? JSON.parse(localHistory) : [];
    messages.push(newMessage);
    localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
    return newMessage;
  }
};

// Delete all chat history for a user
export const clearChatHistory = async (userId: string, useTestMode = false): Promise<void> => {
  try {
    // Always clear local storage
    localStorage.removeItem(`chat_history_${userId}`);
    
    if (useTestMode) {
      return;
    }

    // Try to delete from Supabase
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', userId);
      
    if (error) {
      console.warn('Error clearing chat history from Supabase:', error);
    }
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};
