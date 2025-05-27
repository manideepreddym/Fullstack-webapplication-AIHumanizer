export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  credits_per_month: number;
  price: number;
  features: string[];
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface UserCredits {
  id: string;
  user_id: string;
  credits_remaining: number;
  credits_used: number;
  last_reset_at: string;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  original_text: string;
  humanized_text: string | null;
  words_count: number;
  credits_used: number;
  status: 'pending' | 'completed' | 'error';
  created_at: string;
}

export interface DocumentStats {
  total: number;
  completed: number;
  pending: number;
  error: number;
  totalWords: number;
  averageWords: number;
  successRate: number;
}

export interface CreditHistory {
  id: string;
  user_id: string;
  amount: number;
  type: 'debit' | 'credit';
  description: string;
  created_at: string;
}