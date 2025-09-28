import React, { useState, useContext, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useRates, WalletContext } from '../App';
import { ArrowUpDown, Wallet, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const currencies = [
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { code: 'XOF', name: 'West African CFA Franc', flag: '🏴' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
];

export function ConversionWidget() {
  const rates = useRates();
  const { isConnected, balance } = useContext(WalletContext);
  const [hbarAmount, setHbarAmount] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [fiatAmount, setFiatAmount] = useState('');

  useEffect(() => {
    if (hbarAmount && selectedCurrency) {
      const rate = rates[selectedCurrency as keyof typeof rates];
      if (typeof rate === 'number') {
        const converted = parseFloat(hbarAmount) * rate;
        setFiatAmount(converted.toFixed(2));
      }
    }
  }, [hbarAmount, selectedCurrency, rates]);

  const handleHbarChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setHbarAmount(value);
    }
  };

  const handleConvert = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!hbarAmount || parseFloat(hbarAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(hbarAmount) > balance) {
      toast.error('Insufficient HBAR balance');
      return;
    }

    toast.success('Redirecting to conversion dashboard...');
    // In a real app, this would redirect to the dashboard with pre-filled values
  };

  const quickAmounts = [100, 500, 1000];

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <span>Convert HBAR</span>
          <ArrowUpDown className="w-5 h-5 text-primary" />
        </CardTitle>
        <CardDescription>
          Get real-time rates for African currencies
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* From (HBAR) */}
        <div className="space-y-2">
          <Label htmlFor="hbar-amount">From</Label>
          <div className="relative">
            <Input
              id="hbar-amount"
              type="text"
              value={hbarAmount}
              onChange={(e) => handleHbarChange(e.target.value)}
              placeholder="0.00"
              className="pr-16"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <Badge variant="secondary">HBAR</Badge>
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="flex space-x-2">
            {quickAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setHbarAmount(amount.toString())}
                className="flex-1"
              >
                {amount}
              </Button>
            ))}
          </div>
          
          {isConnected && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Wallet className="w-4 h-4" />
                <span>Balance: {balance.toFixed(2)} HBAR</span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHbarAmount(balance.toString())}
                className="p-0 h-auto text-primary hover:text-primary/80"
              >
                Max
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* To (Fiat) */}
        <div className="space-y-2">
          <Label htmlFor="fiat-amount">To</Label>
          <div className="space-y-2">
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
            
            <Input
              id="fiat-amount"
              type="text"
              value={fiatAmount}
              readOnly
              placeholder="0.00"
              className="bg-muted"
            />
          </div>
        </div>

        {/* Rate Information */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Exchange Rate</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="font-medium">
                1 HBAR = {rates[selectedCurrency as keyof typeof rates]?.toFixed(2)} {selectedCurrency}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Processing Fee</span>
            <span>1.5%</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated Time</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>2-5 minutes</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between font-medium">
            <span>You'll receive</span>
            <span>
              {fiatAmount ? (parseFloat(fiatAmount) * 0.985).toFixed(2) : '0.00'} {selectedCurrency}
            </span>
          </div>
        </div>

        {/* Convert Button */}
        <Button 
          onClick={handleConvert}
          className="w-full"
          size="lg"
          disabled={!hbarAmount || parseFloat(hbarAmount) <= 0}
        >
          {isConnected ? 'Convert Now' : 'Connect Wallet to Convert'}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground text-center">
          Rates update every 30 seconds. Final amount may vary slightly due to market fluctuations.
        </p>
      </CardContent>
    </Card>
  );
}