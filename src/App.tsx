import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ConversionDashboard } from './components/ConversionDashboard';
import { TransactionHistory } from './components/TransactionHistory';
import { PriceAlerts } from './components/PriceAlerts';
import { BankAccounts } from './components/BankAccounts';
import { AdminDashboard } from './components/AdminDashboard';
import { WalletConnectionModal } from './components/WalletConnectionModal';
import { Toaster } from './components/ui/sonner';
import { useRealTimeRates, useAuth } from './utils/supabase/hooks';
import { ThemeProvider } from './utils/theme';

// Wallet context with real user integration
interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: number;
  userId: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const WalletContext = React.createContext<WalletContextType>({
  isConnected: false,
  address: null,
  balance: 0,
  userId: null,
  connect: () => {},
  disconnect: () => {},
});

// Export the real-time rates hook
export const useRates = () => {
  const { rates, lastUpdate, loading, error } = useRealTimeRates();
  
  return {
    ...rates,
    lastUpdate,
    loading,
    error,
  };
};

export default function App() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState(1250.75); // Mock HBAR balance - in real app, fetch from Hedera
  const [showWalletModal, setShowWalletModal] = useState(false);

  const connect = () => {
    // In a real app, this would connect to HashPack/Blade wallet
    // For demo, we'll simulate connection and create/link user account
    setIsConnected(true);
    const mockAddress = '0.0.123456';
    setAddress(mockAddress);
    setShowWalletModal(false);
    
    // In real implementation, you'd create/link user with wallet address
    console.log('Wallet connected:', mockAddress);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  const walletValue = {
    isConnected,
    address,
    balance,
    userId: user?.id || 'demo-user-' + address, // Use real user ID or demo ID
    connect,
    disconnect,
  };

  return (
    <ThemeProvider>
      <WalletContext.Provider value={walletValue}>
        <Router>
          <div className="min-h-screen bg-background">
            <Header onConnectWallet={() => setShowWalletModal(true)} />
            
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<ConversionDashboard />} />
                <Route path="/history" element={<TransactionHistory />} />
                <Route path="/alerts" element={<PriceAlerts />} />
                <Route path="/accounts" element={<BankAccounts />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <WalletConnectionModal 
              open={showWalletModal} 
              onClose={() => setShowWalletModal(false)}
              onConnect={connect}
            />
            
            <Toaster />
          </div>
        </Router>
      </WalletContext.Provider>
    </ThemeProvider>
  );
}