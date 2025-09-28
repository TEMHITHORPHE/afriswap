import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { WalletContext } from '../App';
import { useTheme } from '../utils/theme';
import { Menu, X, Wallet, LogOut, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onConnectWallet: () => void;
}

export function Header({ onConnectWallet }: HeaderProps) {
  const { isConnected, address, balance, disconnect } = useContext(WalletContext);
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'History', href: '/history' },
    { name: 'Alerts', href: '/alerts' },
    { name: 'Accounts', href: '/accounts' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-foreground">AfriSwap</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle & Wallet Connection */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 p-0"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Balance</div>
                  <div className="font-semibold">{balance.toFixed(2)} HBAR</div>
                </div>
                <Badge variant="secondary" className="hidden sm:flex">
                  {address?.substring(0, 8)}...
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={onConnectWallet}
                className="flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Theme Toggle */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start px-3 py-2 mt-2"
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 mr-2" />
                    Switch to Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 mr-2" />
                    Switch to Dark Mode
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}