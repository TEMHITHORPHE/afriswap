import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create Supabase client
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// Types for our application
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  hbar_amount: number;
  fiat_amount: number;
  currency: string;
  exchange_rate: number;
  fee_amount: number;
  net_amount: number;
  status: 'pending' | 'completed' | 'failed';
  bank_account_id?: string;
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface BankAccount {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  country: string;
  currency: string;
  is_primary: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExchangeRate {
  id: string;
  currency: string;
  rate: number;
  source: string;
  created_at: string;
}

export interface PriceAlert {
  id: string;
  user_id: string;
  currency: string;
  condition: 'above' | 'below';
  target_price: number;
  is_active: boolean;
  notification_methods: string[];
  created_at: string;
  updated_at: string;
}

// API helper function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-41ea9f40${endpoint}`,
    {
      ...options,
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};