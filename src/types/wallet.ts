export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type TransactionType = 
  | 'deposit' 
  | 'withdrawal' 
  | 'order_payment' 
  | 'fee' 
  | 'refund' 
  | 'payout' 
  | 'reward'
  | 'purchase'
  | 'bonus'
  | 'commission'
  | 'COURIER_PAYOUT'
  | 'COURIER_BONUS'
  | 'campaign_payment';

export interface Transaction {
  id: string;
  date: string;
  timestamp?: string; // To be deprecated, use date
  description: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  relatedOrderId?: string;
  relatedCampaignId?: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  transactions: Transaction[];
  lastUpdatedAt: string;
}

export {};
