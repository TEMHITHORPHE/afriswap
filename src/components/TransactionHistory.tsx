import React, { useState, useContext } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DateRange } from 'react-day-picker';
import { CalendarIcon, Download, Filter, Search, ArrowUpDown, ExternalLink, CheckCircle2, Clock, AlertCircle, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner@2.0.3';
import { cn } from './ui/utils';
import { WalletContext } from '../App';
import { useTransactions } from '../utils/supabase/hooks';



export function TransactionHistory() {
  const { userId } = useContext(WalletContext);
  const { transactions, loading } = useTransactions(userId);
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Update filtered transactions when real transactions load
  React.useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  // Apply filters
  React.useEffect(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.bankAccount.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Currency filter
    if (currencyFilter !== 'all') {
      filtered = filtered.filter(tx => tx.currency === currencyFilter);
    }

    // Amount filter
    if (minAmount) {
      filtered = filtered.filter(tx => tx.hbar_amount >= parseFloat(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter(tx => tx.hbar_amount <= parseFloat(maxAmount));
    }

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.created_at);
        return txDate >= dateRange.from! && txDate <= dateRange.to!;
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, statusFilter, currencyFilter, minAmount, maxAmount, dateRange]);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const exportTransactions = () => {
    // In a real app, this would generate and download a CSV file
    toast.success('Export started! Download will begin shortly.');
  };

  const currencies = ['NGN', 'GHS', 'KES', 'XOF', 'ZAR'];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">Track all your HBAR conversions</p>
          </div>
          <Button onClick={exportTransactions} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Converted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.reduce((sum, tx) => sum + tx.hbar_amount, 0).toLocaleString()} HBAR</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions.filter(tx => tx.status === 'completed').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Fees Paid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.reduce((sum, tx) => sum + tx.fee_amount, 0).toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Transaction ID, hash..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Currency Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    {currencies.map(currency => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Amount (HBAR)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max Amount (HBAR)</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
            <CardDescription>
              {filteredTransactions.length !== transactions.length && 
                `Showing ${filteredTransactions.length} of ${transactions.length} transactions`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Bank Account</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{format(new Date(tx.created_at), 'MMM dd, yyyy')}</div>
                          <div className="text-sm text-muted-foreground">{format(new Date(tx.created_at), 'HH:mm:ss')}</div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-mono text-sm">{tx.id}</div>
                          {tx.transaction_hash && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(tx.transaction_hash!)}
                              className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground"
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy Hash
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{tx.hbar_amount} HBAR</div>
                            <div className="text-sm text-muted-foreground">Fee: {tx.fee_amount.toFixed(2)} {tx.currency}</div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          1 HBAR = {tx.exchange_rate} {tx.currency}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          <div className="font-medium">{tx.net_amount.toLocaleString()} {tx.currency}</div>
                          <div className="text-sm text-muted-foreground">
                            Gross: {tx.fiat_amount.toLocaleString()} {tx.currency}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">Bank Account</div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(tx.status)}
                      </TableCell>
                      
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCurrencyFilter('all');
                    setDateRange(undefined);
                    setMinAmount('');
                    setMaxAmount('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}