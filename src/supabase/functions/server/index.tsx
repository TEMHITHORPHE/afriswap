import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-41ea9f40/health", (c) => {
  return c.json({ status: "ok" });
});

// Exchange rates endpoints
app.get("/make-server-41ea9f40/rates", async (c) => {
  try {
    // First try to get rates from KV store
    const cachedRates = await kv.get("exchange_rates");
    
    if (cachedRates) {
      return c.json({ rates: cachedRates });
    }

    // If no cached rates, fetch from external API and cache
    const rates = await fetchExchangeRates();
    await kv.set("exchange_rates", rates);
    
    return c.json({ rates });
  } catch (error) {
    console.error('Error fetching rates:', error);
    return c.json({ error: 'Failed to fetch rates' }, 500);
  }
});

app.post("/make-server-41ea9f40/rates/update", async (c) => {
  try {
    const rates = await fetchExchangeRates();
    await kv.set("exchange_rates", rates);
    
    return c.json({ success: true, rates });
  } catch (error) {
    console.error('Error updating rates:', error);
    return c.json({ error: 'Failed to update rates' }, 500);
  }
});

// Transaction endpoints
app.get("/make-server-41ea9f40/transactions", async (c) => {
  try {
    const userId = c.req.query('user_id');
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    const transactions = await kv.getByPrefix(`transaction:${userId}`);
    return c.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

app.post("/make-server-41ea9f40/transactions", async (c) => {
  try {
    const body = await c.req.json();
    const transactionId = crypto.randomUUID();
    
    const transaction = {
      id: transactionId,
      ...body,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`transaction:${body.user_id}:${transactionId}`, transaction);
    
    // Process transaction asynchronously
    processTransaction(transaction);
    
    return c.json({ transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return c.json({ error: 'Failed to create transaction' }, 500);
  }
});

// Bank account endpoints
app.get("/make-server-41ea9f40/bank-accounts", async (c) => {
  try {
    const userId = c.req.query('user_id');
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    const accounts = await kv.getByPrefix(`bank_account:${userId}`);
    return c.json({ accounts });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    return c.json({ error: 'Failed to fetch bank accounts' }, 500);
  }
});

app.post("/make-server-41ea9f40/bank-accounts", async (c) => {
  try {
    const body = await c.req.json();
    const accountId = crypto.randomUUID();
    
    const account = {
      id: accountId,
      ...body,
      is_verified: true, // Mock verification for demo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`bank_account:${body.user_id}:${accountId}`, account);
    
    return c.json({ account });
  } catch (error) {
    console.error('Error creating bank account:', error);
    return c.json({ error: 'Failed to create bank account' }, 500);
  }
});

app.delete("/make-server-41ea9f40/bank-accounts/:id", async (c) => {
  try {
    const accountId = c.req.param('id');
    const userId = c.req.query('user_id');
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    await kv.del(`bank_account:${userId}:${accountId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    return c.json({ error: 'Failed to delete bank account' }, 500);
  }
});

// Price alert endpoints
app.get("/make-server-41ea9f40/price-alerts", async (c) => {
  try {
    const userId = c.req.query('user_id');
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    const alerts = await kv.getByPrefix(`price_alert:${userId}`);
    return c.json({ alerts });
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    return c.json({ error: 'Failed to fetch price alerts' }, 500);
  }
});

app.post("/make-server-41ea9f40/price-alerts", async (c) => {
  try {
    const body = await c.req.json();
    const alertId = crypto.randomUUID();
    
    const alert = {
      id: alertId,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await kv.set(`price_alert:${body.user_id}:${alertId}`, alert);
    
    return c.json({ alert });
  } catch (error) {
    console.error('Error creating price alert:', error);
    return c.json({ error: 'Failed to create price alert' }, 500);
  }
});

app.delete("/make-server-41ea9f40/price-alerts/:id", async (c) => {
  try {
    const alertId = c.req.param('id');
    const userId = c.req.query('user_id');
    
    if (!userId) {
      return c.json({ error: 'User ID required' }, 400);
    }

    await kv.del(`price_alert:${userId}:${alertId}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting price alert:', error);
    return c.json({ error: 'Failed to delete price alert' }, 500);
  }
});

// Auth endpoints
app.post("/make-server-41ea9f40/auth/signup", async (c) => {
  try {
    const { email, password, metadata } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: metadata || {},
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Admin endpoints
app.get("/make-server-41ea9f40/admin/stats", async (c) => {
  try {
    // Get all transactions for stats
    const allTransactions = await kv.getByPrefix("transaction:");
    const totalTransactions = allTransactions.length;
    const completedTransactions = allTransactions.filter((tx: any) => tx.status === 'completed');
    const totalVolume = completedTransactions.reduce((sum: number, tx: any) => sum + (tx.hbar_amount || 0), 0);
    
    // Get unique users
    const uniqueUsers = new Set();
    allTransactions.forEach((tx: any) => {
      if (tx.user_id) uniqueUsers.add(tx.user_id);
    });

    const stats = {
      totalVolume,
      totalTransactions,
      activeUsers: uniqueUsers.size,
      successRate: totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0,
    };

    return c.json({ stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return c.json({ error: 'Failed to fetch admin stats' }, 500);
  }
});

// Helper functions
async function fetchExchangeRates() {
  try {
    // Using CoinGecko API as an example
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd');
    const data = await response.json();
    const hbarUsdRate = data['hedera-hashgraph']?.usd || 0.05;

    // Convert USD to African currencies (mock rates for demo)
    const usdRates = {
      NGN: 800,   // 1 USD = 800 NGN
      GHS: 12,    // 1 USD = 12 GHS
      KES: 150,   // 1 USD = 150 KES
      XOF: 600,   // 1 USD = 600 XOF
      ZAR: 18,    // 1 USD = 18 ZAR
    };

    const rates = Object.entries(usdRates).map(([currency, usdRate]) => ({
      id: crypto.randomUUID(),
      currency,
      rate: hbarUsdRate * usdRate,
      source: 'coingecko',
      created_at: new Date().toISOString(),
    }));

    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return fallback rates
    return [
      { id: crypto.randomUUID(), currency: 'NGN', rate: 420.50, source: 'fallback', created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), currency: 'GHS', rate: 12.85, source: 'fallback', created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), currency: 'KES', rate: 148.30, source: 'fallback', created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), currency: 'XOF', rate: 615.20, source: 'fallback', created_at: new Date().toISOString() },
      { id: crypto.randomUUID(), currency: 'ZAR', rate: 18.95, source: 'fallback', created_at: new Date().toISOString() },
    ];
  }
}

async function processTransaction(transaction: any) {
  try {
    // Mock transaction processing
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
    
    // Update transaction status
    const updatedTransaction = {
      ...transaction,
      status: Math.random() > 0.1 ? 'completed' : 'failed', // 90% success rate
      transaction_hash: `0.0.123456@${Date.now()}.${Math.floor(Math.random() * 1000000)}`,
      updated_at: new Date().toISOString(),
    };

    await kv.set(`transaction:${transaction.user_id}:${transaction.id}`, updatedTransaction);
    
    console.log(`Transaction ${transaction.id} processed: ${updatedTransaction.status}`);
  } catch (error) {
    console.error('Error processing transaction:', error);
  }
}

// Set up periodic rate updates
setInterval(async () => {
  try {
    const rates = await fetchExchangeRates();
    await kv.set("exchange_rates", rates);
    console.log('Exchange rates updated');
  } catch (error) {
    console.error('Error updating rates automatically:', error);
  }
}, 30000); // Update every 30 seconds

Deno.serve(app.fetch);