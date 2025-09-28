import React, { useState, useContext } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Plus, CreditCard, Trash2, Edit, CheckCircle2, Clock, AlertCircle, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { WalletContext } from '../App';
import { useBankAccounts } from '../utils/supabase/hooks';

const countries = [
  {
    name: 'Nigeria',
    code: 'NG',
    currency: 'NGN',
    flag: '🇳🇬',
    banks: [
      'Access Bank',
      'First Bank of Nigeria',
      'Guaranty Trust Bank',
      'United Bank for Africa',
      'Zenith Bank',
      'Fidelity Bank',
      'Union Bank',
      'Sterling Bank',
      'Wema Bank',
      'Polaris Bank'
    ]
  },
  {
    name: 'Ghana',
    code: 'GH',
    currency: 'GHS',
    flag: '🇬🇭',
    banks: [
      'Ecobank Ghana',
      'Ghana Commercial Bank',
      'Standard Chartered Bank Ghana',
      'Barclays Bank Ghana',
      'Fidelity Bank Ghana',
      'United Bank for Africa Ghana',
      'Agricultural Development Bank',
      'Prudential Bank'
    ]
  },
  {
    name: 'Kenya',
    code: 'KE',
    currency: 'KES',
    flag: '🇰🇪',
    banks: [
      'Kenya Commercial Bank',
      'Equity Bank',
      'Cooperative Bank of Kenya',
      'Standard Chartered Bank Kenya',
      'Barclays Bank Kenya',
      'Diamond Trust Bank',
      'National Bank of Kenya',
      'Commercial Bank of Africa'
    ]
  },
  {
    name: 'Côte d\'Ivoire',
    code: 'CI',
    currency: 'XOF',
    flag: '🇨🇮',
    banks: [
      'Bank of Africa Côte d\'Ivoire',
      'Ecobank Côte d\'Ivoire',
      'Société Générale Côte d\'Ivoire',
      'Standard Chartered Bank Côte d\'Ivoire',
      'United Bank for Africa Côte d\'Ivoire',
      'Banque Atlantique Côte d\'Ivoire'
    ]
  },
  {
    name: 'South Africa',
    code: 'ZA',
    currency: 'ZAR',
    flag: '🇿🇦',
    banks: [
      'Standard Bank',
      'FirstRand Bank',
      'ABSA Bank',
      'Nedbank',
      'Capitec Bank',
      'African Bank',
      'Investec Bank',
      'Bidvest Bank'
    ]
  }
];



export function BankAccounts() {
  const { userId } = useContext(WalletContext);
  const { accounts, loading, addAccount, deleteAccount, setPrimaryAccount } = useBankAccounts(userId);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    country: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    accountType: 'savings',
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAddAccount = async () => {
    if (!newAccount.country || !newAccount.bankName || !newAccount.accountNumber || !userId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsVerifying(true);
    
    try {
      const country = countries.find(c => c.name === newAccount.country);
      const accountData = {
        user_id: userId,
        bank_name: newAccount.bankName,
        account_number: newAccount.accountNumber,
        account_name: newAccount.accountName || 'John Doe', // Mock verified name
        country: newAccount.country,
        currency: country?.currency || 'NGN',
        is_primary: accounts.length === 0,
        is_verified: true,
      };

      await addAccount(accountData);
      
      setNewAccount({
        country: '',
        bankName: '',
        accountNumber: '',
        accountName: '',
        accountType: 'savings',
      });
      setShowAddDialog(false);
      toast.success('Bank account added successfully!');
    } catch (error) {
      console.error('Failed to add account:', error);
      toast.error('Failed to add account. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount(id);
      toast.success('Account removed successfully');
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to remove account');
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await setPrimaryAccount(id);
      toast.success('Primary account updated');
    } catch (error) {
      console.error('Failed to set primary account:', error);
      toast.error('Failed to update primary account');
    }
  };

  const getStatusBadge = (account: any) => {
    if (account.isVerified) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
    }
    return <Badge variant="outline" className="border-yellow-300 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
  };

  const selectedCountry = countries.find(c => c.name === newAccount.country);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bank Accounts</h1>
            <p className="text-muted-foreground">Manage your bank accounts for receiving payments</p>
          </div>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Account</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
                <DialogDescription>
                  Add a new bank account to receive your converted funds
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Country Selection */}
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Select value={newAccount.country} onValueChange={(value) => setNewAccount({...newAccount, country: value, bankName: ''})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="text-muted-foreground">({country.currency})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank Selection */}
                {selectedCountry && (
                  <div className="space-y-2">
                    <Label>Bank *</Label>
                    <Select value={newAccount.bankName} onValueChange={(value) => setNewAccount({...newAccount, bankName: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCountry.banks.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Account Number */}
                <div className="space-y-2">
                  <Label>Account Number *</Label>
                  <Input
                    type="text"
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                    placeholder="Enter account number"
                  />
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select value={newAccount.accountType} onValueChange={(value) => setNewAccount({...newAccount, accountType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="current">Current Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Account Name Preview */}
                {newAccount.accountNumber && newAccount.bankName && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Account Name (auto-verified)</div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      This will be verified with your bank
                    </div>
                  </div>
                )}

                <Separator />

                <Button onClick={handleAddAccount} className="w-full" disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying Account...
                    </>
                  ) : (
                    'Add Account'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Verified Accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {accounts.filter(acc => acc.isVerified).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Supported Countries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{countries.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className={account.isPrimary ? 'border-primary' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{account.bank_name}</h3>
                        {account.is_primary && (
                          <Badge className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>Primary</span>
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {account.account_number} • {account.account_name}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{account.country}</Badge>
                        <Badge variant="outline">{account.currency}</Badge>
                        {getStatusBadge(account)}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Added {new Date(account.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!account.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(account.id)}
                      >
                        Set as Primary
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove this bank account? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteAccount(account.id)}>
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {!account.is_verified && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Account verification pending</p>
                        <p className="text-yellow-700">
                          We're verifying your account details with the bank. This usually takes 1-2 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {accounts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No bank accounts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first bank account to start receiving payments
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  Add Your First Account
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>Common questions about bank accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Which banks are supported?</h4>
              <p className="text-sm text-muted-foreground">
                We support major banks in Nigeria, Ghana, Kenya, Côte d'Ivoire, and South Africa. 
                More countries and banks are being added regularly.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">How long does verification take?</h4>
              <p className="text-sm text-muted-foreground">
                Account verification typically takes 1-2 business days. You'll receive an email 
                notification once your account is verified.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Can I have multiple accounts?</h4>
              <p className="text-sm text-muted-foreground">
                Yes, you can add multiple bank accounts across different countries. 
                Set one as primary for faster conversions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}