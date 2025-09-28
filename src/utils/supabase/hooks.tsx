import { useState, useEffect } from 'react';
import { supabase, apiCall, ExchangeRate, Transaction, BankAccount, PriceAlert } from './client';

// Hook for real-time exchange rates
export const useRealTimeRates = () => {
  const [rates, setRates] = useState<Record<string, number>>({
    NGN: 420.50,
    GHS: 12.85,
    KES: 148.30,
    XOF: 615.20,
    ZAR: 18.95,
  });
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const data = await apiCall('/rates');
        
        if (data.rates) {
          const rateMap: Record<string, number> = {};
          data.rates.forEach((rate: ExchangeRate) => {
            rateMap[rate.currency] = rate.rate;
          });
          setRates(rateMap);
          setLastUpdate(new Date().toISOString());
        }
        setError(null);
      } catch (err) {
        console.error('Failed to fetch rates:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rates');
        // Keep using mock data on error
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchRates();

    // Set up real-time subscription for rate updates
    const channel = supabase
      .channel('exchange_rates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'exchange_rates' },
        (payload) => {
          console.log('Rate update received:', payload);
          fetchRates(); // Refresh rates when updates occur
        }
      )
      .subscribe();

    // Periodic updates every 30 seconds as fallback
    const interval = setInterval(fetchRates, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return { rates, lastUpdate, loading, error };
};

// Hook for user transactions
export const useTransactions = (userId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await apiCall(`/transactions?user_id=${userId}`);
        setTransactions(data.transactions || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Set up real-time subscription for transaction updates
    const channel = supabase
      .channel('user_transactions')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Transaction update received:', payload);
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const createTransaction = async (transactionData: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });
      return data.transaction;
    } catch (err) {
      console.error('Failed to create transaction:', err);
      throw err;
    }
  };

  return { transactions, loading, error, createTransaction };
};

// Hook for bank accounts
export const useBankAccounts = (userId?: string) => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await apiCall(`/bank-accounts?user_id=${userId}`);
        setAccounts(data.accounts || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch bank accounts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch bank accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

  const addAccount = async (accountData: Omit<BankAccount, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await apiCall('/bank-accounts', {
        method: 'POST',
        body: JSON.stringify(accountData),
      });
      setAccounts(prev => [...prev, data.account]);
      return data.account;
    } catch (err) {
      console.error('Failed to add bank account:', err);
      throw err;
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await apiCall(`/bank-accounts/${accountId}`, {
        method: 'DELETE',
      });
      setAccounts(prev => prev.filter(acc => acc.id !== accountId));
    } catch (err) {
      console.error('Failed to delete bank account:', err);
      throw err;
    }
  };

  const setPrimaryAccount = async (accountId: string) => {
    try {
      await apiCall(`/bank-accounts/${accountId}/set-primary`, {
        method: 'PUT',
      });
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        is_primary: acc.id === accountId
      })));
    } catch (err) {
      console.error('Failed to set primary account:', err);
      throw err;
    }
  };

  return { accounts, loading, error, addAccount, deleteAccount, setPrimaryAccount };
};

// Hook for price alerts
export const usePriceAlerts = (userId?: string) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const data = await apiCall(`/price-alerts?user_id=${userId}`);
        setAlerts(data.alerts || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch price alerts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch price alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [userId]);

  const createAlert = async (alertData: Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await apiCall('/price-alerts', {
        method: 'POST',
        body: JSON.stringify(alertData),
      });
      setAlerts(prev => [...prev, data.alert]);
      return data.alert;
    } catch (err) {
      console.error('Failed to create price alert:', err);
      throw err;
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      await apiCall(`/price-alerts/${alertId}`, {
        method: 'DELETE',
      });
      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Failed to delete price alert:', err);
      throw err;
    }
  };

  const toggleAlert = async (alertId: string) => {
    try {
      await apiCall(`/price-alerts/${alertId}/toggle`, {
        method: 'PUT',
      });
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, is_active: !alert.is_active }
          : alert
      ));
    } catch (err) {
      console.error('Failed to toggle price alert:', err);
      throw err;
    }
  };

  return { alerts, loading, error, createAlert, deleteAlert, toggleAlert };
};

// Hook for user authentication
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const response = await apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password, metadata }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { user, loading, signIn, signUp, signOut };
};

// Hook for admin dashboard data
export const useAdminData = () => {
  const [stats, setStats] = useState({
    totalVolume: 0,
    totalTransactions: 0,
    activeUsers: 0,
    successRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const data = await apiCall('/admin/stats');
        setStats(data.stats || {});
        setError(null);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch admin data');
        // Use mock data on error
        setStats({
          totalVolume: 2456789.50,
          totalTransactions: 15847,
          activeUsers: 3241,
          successRate: 98.5,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return { stats, loading, error };
};