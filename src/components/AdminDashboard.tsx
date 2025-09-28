import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useRates } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Shield, 
  Settings, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Database,
  Globe
} from 'lucide-react';

// Mock admin data
const dashboardStats = {
  totalVolume: 2456789.50,
  totalTransactions: 15847,
  activeUsers: 3241,
  successRate: 98.5,
  avgProcessingTime: 4.2,
  revenue: 34567.89,
};

const volumeData = [
  { name: 'Jan', volume: 180000, users: 240 },
  { name: 'Feb', volume: 220000, users: 320 },
  { name: 'Mar', volume: 190000, users: 280 },
  { name: 'Apr', volume: 280000, users: 450 },
  { name: 'May', volume: 320000, users: 520 },
  { name: 'Jun', volume: 350000, users: 580 },
];

const currencyDistribution = [
  { name: 'NGN', value: 45, color: '#3b82f6' },
  { name: 'GHS', value: 20, color: '#ef4444' },
  { name: 'KES', value: 18, color: '#10b981' },
  { name: 'ZAR', value: 12, color: '#f59e0b' },
  { name: 'XOF', value: 5, color: '#8b5cf6' },
];

const recentTransactions = [
  {
    id: 'tx-001',
    user: '0.0.123456',
    amount: 500,
    currency: 'NGN',
    status: 'completed',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'tx-002',
    user: '0.0.789012',
    amount: 1000,
    currency: 'GHS',
    status: 'pending',
    timestamp: new Date(Date.now() - 600000),
  },
  {
    id: 'tx-003',
    user: '0.0.345678',
    amount: 750,
    currency: 'KES',
    status: 'completed',
    timestamp: new Date(Date.now() - 900000),
  },
];

const systemHealth = {
  hedera: { status: 'healthy', latency: 1.2 },
  database: { status: 'healthy', latency: 45 },
  bankApi: { status: 'degraded', latency: 2100 },
  rateProvider: { status: 'healthy', latency: 230 },
};

export function AdminDashboard() {
  const rates = useRates();
  const [rateMode, setRateMode] = useState('automatic');
  const [manualRates, setManualRates] = useState({
    NGN: '',
    GHS: '',
    KES: '',
    XOF: '',
    ZAR: '',
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-800">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Monitor system performance and manage platform operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="rates">Rate Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardStats.totalVolume.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12.3% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalTransactions.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+8.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.activeUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+5.7% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.successRate}%</div>
                  <p className="text-xs text-muted-foreground">+0.3% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volume Over Time</CardTitle>
                  <CardDescription>Monthly transaction volume and user growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="volume" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Currency Distribution</CardTitle>
                  <CardDescription>Transaction volume by currency</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currencyDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {currencyDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.id}</TableCell>
                        <TableCell className="font-mono text-sm">{tx.user}</TableCell>
                        <TableCell>{tx.amount} HBAR</TableCell>
                        <TableCell>{tx.currency}</TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell>{tx.timestamp.toLocaleTimeString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Management</CardTitle>
                <CardDescription>Monitor and manage all platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Input placeholder="Search transactions..." className="max-w-sm" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Export</Button>
                </div>
                
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Transaction management interface would be implemented here</p>
                  <p className="text-sm">Full transaction table with filtering, bulk actions, and detailed views</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>User management interface would be implemented here</p>
                  <p className="text-sm">User profiles, KYC status, transaction history, and account controls</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rate Management Tab */}
          <TabsContent value="rates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exchange Rate Management</CardTitle>
                <CardDescription>Configure and monitor exchange rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rate Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="rate-mode" 
                    checked={rateMode === 'automatic'}
                    onCheckedChange={(checked) => setRateMode(checked ? 'automatic' : 'manual')}
                  />
                  <Label htmlFor="rate-mode">
                    Automatic Rate Updates (from external sources)
                  </Label>
                </div>

                {/* Current Rates Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(rates).slice(0, -1).map(([currency, rate]) => (
                    <Card key={currency}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{currency}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{typeof rate === 'number' ? rate.toFixed(2) : rate}</div>
                        <div className="text-xs text-muted-foreground">per HBAR</div>
                        {rateMode === 'manual' && (
                          <Input
                            type="number"
                            step="0.01"
                            value={manualRates[currency as keyof typeof manualRates]}
                            onChange={(e) => setManualRates({
                              ...manualRates,
                              [currency]: e.target.value
                            })}
                            className="mt-2"
                            placeholder="Override rate"
                          />
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Rate Source Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rate Sources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Primary Source</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select defaultValue="coingecko">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="coingecko">CoinGecko API</SelectItem>
                            <SelectItem value="coinmarketcap">CoinMarketCap</SelectItem>
                            <SelectItem value="binance">Binance API</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Update Frequency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select defaultValue="30s">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30s">Every 30 seconds</SelectItem>
                            <SelectItem value="1m">Every minute</SelectItem>
                            <SelectItem value="5m">Every 5 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Fee Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Fee Structure</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Processing Fee (%)</Label>
                      <Input type="number" step="0.1" defaultValue="1.5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Fee Amount</Label>
                      <Input type="number" step="0.01" defaultValue="1.00" />
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Rate Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(systemHealth).map(([service, health]) => (
                <Card key={service}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{service.replace('Api', ' API')}</span>
                      {getHealthBadge(health.status)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Latency</span>
                        <span className="text-sm font-medium">{health.latency}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Check</span>
                        <span className="text-sm font-medium">30s ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>Emergency controls and maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Services</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Database className="w-4 h-4" />
                    <span>Database Backup</span>
                  </Button>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Maintenance Mode</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure global platform parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Transaction Limits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Transaction (HBAR)</Label>
                      <Input type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Transaction (HBAR)</Label>
                      <Input type="number" defaultValue="50000" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="kyc-required" defaultChecked />
                      <Label htmlFor="kyc-required">Require KYC for transactions above $1000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="rate-limiting" defaultChecked />
                      <Label htmlFor="rate-limiting">Enable rate limiting</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="maintenance-mode" />
                      <Label htmlFor="maintenance-mode">Maintenance mode</Label>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}