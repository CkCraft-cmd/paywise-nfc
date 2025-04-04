
import { createClient } from '@supabase/supabase-js';

// When using Supabase through the Lovable integration, we don't need to specify
// the URL and key in the code. The Lovable platform handles the connection.
// We'll modify this approach to make it work in both environments.

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// If environment variables aren't available, use defaults that will be replaced
// by the Lovable platform
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using default Supabase client configuration. This will be handled by the Lovable platform.');
  supabaseUrl = 'https://your-project.supabase.co';
  supabaseAnonKey = 'your-anon-key';
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
