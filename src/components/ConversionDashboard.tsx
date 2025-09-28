import React, { useState, useContext } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useRates, WalletContext } from '../App';
import { useBankAccounts, useTransactions } from '../utils/supabase/hooks';
import { ArrowUpDown, Wallet, Clock, TrendingUp, Plus, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const currencies = [
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { code: 'XOF', name: 'West African CFA Franc', flag: '🏴' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
];



export function ConversionDashboard() {
  const rates = useRates();
  const { isConnected, balance, address, userId } = useContext(WalletContext);
  const { accounts: bankAccounts, loading: accountsLoading } = useBankAccounts(userId);
  const { transactions: recentTransactions, createTransaction } = useTransactions(userId);
  const [hbarAmount, setHbarAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // Set default selected account when accounts load
  React.useEffect(() => {
    if (bankAccounts.length > 0 && !selectedAccount) {
      const primaryAccount = bankAccounts.find(acc => acc.is_primary) || bankAccounts[0];
      setSelectedAccount(primaryAccount.id);
    }
  }, [bankAccounts, selectedAccount]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access the conversion dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fiatAmount = hbarAmount && selectedCurrency 
    ? (parseFloat(hbarAmount) * rates[selectedCurrency as keyof typeof rates] as number).toFixed(2)
    : '0.00';

  const handleConvert = async () => {
    if (!hbarAmount || parseFloat(hbarAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(hbarAmount) > balance) {
      toast.error('Insufficient HBAR balance');
      return;
    }

    if (!selectedAccount) {
      toast.error('Please select a bank account');
      return;
    }

    setIsConverting(true);
    
    try {
      toast.loading('Processing transaction...', { id: 'convert' });
      
      const rate = rates[selectedCurrency as keyof typeof rates] as number;
      const fiatAmount = parseFloat(hbarAmount) * rate;
      const feeAmount = fiatAmount * 0.015; // 1.5% fee
      const netAmount = fiatAmount - feeAmount;

      const transactionData = {
        user_id: userId!,
        hbar_amount: parseFloat(hbarAmount),
        fiat_amount: fiatAmount,
        currency: selectedCurrency,
        exchange_rate: rate,
        fee_amount: feeAmount,
        net_amount: netAmount,
        bank_account_id: selectedAccount,
        status: 'pending' as const,
      };

      await createTransaction(transactionData);
      
      toast.success('Transaction created successfully! Processing...', { id: 'convert' });
      setHbarAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed. Please try again.', { id: 'convert' });
    } finally {
      setIsConverting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Conversion Dashboard</h1>
          <p className="text-muted-foreground">Convert your HBAR to African currencies</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Conversion Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Wallet Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">HBAR Balance</p>
                    <p className="text-2xl font-bold">{balance.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Wallet Address</p>
                    <p className="text-sm font-mono">{address}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Network</p>
                    <p className="font-semibold">Hedera Mainnet</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowUpDown className="w-5 h-5" />
                  <span>Convert HBAR</span>
                </CardTitle>
                <CardDescription>
                  Enter the amount you want to convert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <Label>Amount to Convert</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={hbarAmount}
                      onChange={(e) => setHbarAmount(e.target.value)}
                      placeholder="0.00"
                      className="pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Badge variant="secondary">HBAR</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Available: {balance.toFixed(2)} HBAR</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setHbarAmount(balance.toString())}
                      className="p-0 h-auto text-primary"
                    >
                      Use Max
                    </Button>
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="space-y-2">
                  <Label>Convert To</Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center space-x-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                            <span className="text-muted-foreground">- {currency.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank Account Selection */}
                <div className="space-y-2">
                  <Label>Destination Account</Label>
                  <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                    <SelectTrigger>
                      <SelectValue placeholder={accountsLoading ? "Loading accounts..." : "Select account"} />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts
                        .filter(account => account.currency === selectedCurrency)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            <div className="flex items-center space-x-2">
                              <span>{account.bank_name}</span>
                              <span className="text-muted-foreground">(*{account.account_number.slice(-4)})</span>
                              {account.is_primary && <Badge variant="secondary" className="text-xs">Primary</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Account
                  </Button>
                </div>

                {/* Conversion Summary */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Exchange Rate</span>
                    <span className="text-sm font-medium">
                      1 HBAR = {rates[selectedCurrency as keyof typeof rates]?.toFixed(2)} {selectedCurrency}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">You'll Convert</span>
                    <span className="text-sm font-medium">{hbarAmount || '0'} HBAR</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Processing Fee (1.5%)</span>
                    <span className="text-sm">{fiatAmount ? (parseFloat(fiatAmount) * 0.015).toFixed(2) : '0.00'} {selectedCurrency}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between font-medium">
                    <span>You'll Receive</span>
                    <span className="text-lg">
                      {fiatAmount ? (parseFloat(fiatAmount) * 0.985).toFixed(2) : '0.00'} {selectedCurrency}
                    </span>
                  </div>
                </div>

                {/* Convert Button */}
                <Button 
                  onClick={handleConvert}
                  className="w-full"
                  size="lg"
                  disabled={!hbarAmount || parseFloat(hbarAmount) <= 0 || isConverting}
                >
                  {isConverting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Converting...
                    </>
                  ) : (
                    'Convert Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Converted</span>
                  <span className="font-semibold">2,250 HBAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold">1,750 HBAR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Rate</span>
                  <span className="font-semibold">₦420.50</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{tx.hbar_amount} HBAR</span>
                          <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{tx.net_amount.toLocaleString()} {tx.currency}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      {getStatusBadge(tx.status)}
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Current Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Live Rates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currencies.map((currency) => (
                    <div key={currency.code} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span>{currency.flag}</span>
                        <span className="text-sm font-medium">{currency.code}</span>
                      </div>
                      <span className="text-sm">
                        {rates[currency.code as keyof typeof rates]?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Updated {new Date(rates.lastUpdate).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}