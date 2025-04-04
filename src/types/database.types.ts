
export type User = {
  id: string;
  email: string;
  full_name: string;
}

export type Profile = {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export type Transaction = {
  id: string;
  user_id: string;
  amount: number;
  title: string;
  location: string;
  category: "dining" | "books" | "shopping" | "payment" | "other";
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export type Database = {
  profiles: Profile[];
  transactions: Transaction[];
}
