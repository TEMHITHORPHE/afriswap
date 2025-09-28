import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { useRates } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, AlertTriangle, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Mock price history data
const generatePriceHistory = (currency: string, currentRate: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
    const rate = currentRate * (1 + variation);
    
    data.push({
      date: date.toISOString().split('T')[0],
      rate: rate,
      timestamp: date.getTime(),
    });
  }
  
  return data;
};

const currencies = [
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭' },
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪' },
  { code: 'XOF', name: 'West African CFA Franc', flag: '🏴' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
];

// Mock alerts data
const mockAlerts = [
  {
    id: '1',
    currency: 'NGN',
    condition: 'above',
    targetPrice: 450,
    currentPrice: 420.50,
    isActive: true,
    createdAt: new Date('2024-12-10'),
    notificationMethods: ['email', 'sms'],
  },
  {
    id: '2',
    currency: 'GHS',
    condition: 'below', 
    targetPrice: 12,
    currentPrice: 12.85,
    isActive: true,
    createdAt: new Date('2024-12-12'),
    notificationMethods: ['email'],
  },
  {
    id: '3',
    currency: 'KES',
    condition: 'above',
    targetPrice: 150,
    currentPrice: 148.30,
    isActive: false,
    createdAt: new Date('2024-12-08'),
    notificationMethods: ['email', 'sms'],
  },
];

export function PriceAlerts() {
  const rates = useRates();
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [alerts, setAlerts] = useState(mockAlerts);
  const [newAlert, setNewAlert] = useState({
    currency: 'NGN',
    condition: 'above',
    targetPrice: '',
    notificationMethods: ['email'],
  });
  const [showNewAlertDialog, setShowNewAlertDialog] = useState(false);

  const priceHistory = generatePriceHistory(selectedCurrency, rates[selectedCurrency as keyof typeof rates] as number);
  const currentRate = rates[selectedCurrency as keyof typeof rates] as number;

  const handleCreateAlert = () => {
    if (!newAlert.targetPrice || parseFloat(newAlert.targetPrice) <= 0) {
      toast.error('Please enter a valid target price');
      return;
    }

    const alert = {
      id: Date.now().toString(),
      currency: newAlert.currency,
      condition: newAlert.condition,
      targetPrice: parseFloat(newAlert.targetPrice),
      currentPrice: rates[newAlert.currency as keyof typeof rates] as number,
      isActive: true,
      createdAt: new Date(),
      notificationMethods: newAlert.notificationMethods,
    };

    setAlerts([...alerts, alert]);
    setNewAlert({
      currency: 'NGN',
      condition: 'above',
      targetPrice: '',
      notificationMethods: ['email'],
    });
    setShowNewAlertDialog(false);
    toast.success('Price alert created successfully!');
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success('Alert deleted successfully');
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const getAlertStatus = (alert: any) => {
    const { condition, targetPrice, currentPrice } = alert;
    const isTriggered = condition === 'above' 
      ? currentPrice >= targetPrice 
      : currentPrice <= targetPrice;
    
    return isTriggered;
  };

  const formatCurrency = (value: number, currency: string) => {
    return `${value.toFixed(2)} ${currency}`;
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Price Alerts & Charts</h1>
            <p className="text-muted-foreground">Monitor HBAR exchange rates and set price alerts</p>
          </div>
          
          <Dialog open={showNewAlertDialog} onOpenChange={setShowNewAlertDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Alert</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
                <DialogDescription>
                  Get notified when HBAR reaches your target price
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={newAlert.currency} onValueChange={(value) => setNewAlert({...newAlert, currency: value})}>
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

                <div className="space-y-2">
                  <Label>Condition</Label>
                  <Select value={newAlert.condition} onValueChange={(value) => setNewAlert({...newAlert, condition: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price goes above</SelectItem>
                      <SelectItem value="below">Price goes below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Price</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      value={newAlert.targetPrice}
                      onChange={(e) => setNewAlert({...newAlert, targetPrice: e.target.value})}
                      placeholder="0.00"
                      className="pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Badge variant="secondary">{newAlert.currency}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current rate: {rates[newAlert.currency as keyof typeof rates]?.toFixed(2)} {newAlert.currency}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Notification Methods</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email"
                        checked={newAlert.notificationMethods.includes('email')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewAlert({...newAlert, notificationMethods: [...newAlert.notificationMethods, 'email']});
                          } else {
                            setNewAlert({...newAlert, notificationMethods: newAlert.notificationMethods.filter(m => m !== 'email')});
                          }
                        }}
                      />
                      <Label htmlFor="email" className="flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Email</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sms"
                        checked={newAlert.notificationMethods.includes('sms')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewAlert({...newAlert, notificationMethods: [...newAlert.notificationMethods, 'sms']});
                          } else {
                            setNewAlert({...newAlert, notificationMethods: newAlert.notificationMethods.filter(m => m !== 'sms')});
                          }
                        }}
                      />
                      <Label htmlFor="sms" className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>SMS</span>
                      </Label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleCreateAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Price Chart</span>
                </CardTitle>
                <CardDescription>
                  Historical HBAR exchange rates for the past 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center space-x-2">
                              <span>{currency.flag}</span>
                              <span>HBAR/{currency.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold">{currentRate.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">1 HBAR = {selectedCurrency}</div>
                    </div>
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={priceHistory}>
                        <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis 
                          domain={['dataMin - 5', 'dataMax + 5']}
                          tickFormatter={(value) => value.toFixed(2)}
                        />
                        <Tooltip 
                          formatter={(value: number) => [value.toFixed(2), selectedCurrency]}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorRate)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Section */}
          <div className="space-y-6">
            {/* Current Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Live Rates</CardTitle>
                <CardDescription>Current HBAR exchange rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currencies.map((currency) => {
                    const rate = rates[currency.code as keyof typeof rates] as number;
                    const change = (Math.random() - 0.5) * 10; // Mock change
                    
                    return (
                      <div key={currency.code} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span>{currency.flag}</span>
                          <div>
                            <div className="font-medium">{currency.code}</div>
                            <div className="text-xs text-muted-foreground">{currency.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{rate.toFixed(2)}</div>
                          <div className={`text-xs flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                            {Math.abs(change).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Your Alerts ({alerts.length})</span>
                </CardTitle>
                <CardDescription>Manage your price notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const isTriggered = getAlertStatus(alert);
                    
                    return (
                      <div key={alert.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={alert.isActive ? "default" : "secondary"}>
                              {alert.currency}
                            </Badge>
                            {isTriggered && alert.isActive && (
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleAlert(alert.id)}
                            >
                              {alert.isActive ? 'Pause' : 'Resume'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAlert(alert.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p>
                            Alert when price goes <strong>{alert.condition}</strong> {' '}
                            <strong>{formatCurrency(alert.targetPrice, alert.currency)}</strong>
                          </p>
                          <p className="text-muted-foreground">
                            Current: {formatCurrency(alert.currentPrice, alert.currency)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {alert.notificationMethods.map(method => (
                            <Badge key={method} variant="outline" className="text-xs">
                              {method === 'email' ? <Mail className="w-3 h-3 mr-1" /> : <MessageSquare className="w-3 h-3 mr-1" />}
                              {method}
                            </Badge>
                          ))}
                        </div>
                        
                        {isTriggered && alert.isActive && (
                          <div className="bg-orange-50 border border-orange-200 rounded p-2 text-sm text-orange-800">
                            🚨 Alert triggered! Price condition met.
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {alerts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No price alerts set</p>
                      <p className="text-sm">Create your first alert to get notified</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}