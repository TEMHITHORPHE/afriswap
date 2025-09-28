import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ConversionWidget } from './ConversionWidget';
import { useRates, WalletContext } from '../App';
import { TrendingUp, Shield, Clock, Users, ArrowRight, Zap, Globe, DollarSign } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function LandingPage() {
  const rates = useRates();
  const { isConnected } = useContext(WalletContext);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Conversions',
      description: 'Convert HBAR to African currencies in seconds with real-time rates',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure & Trustless',
      description: 'Built on Hedera Hashgraph with enterprise-grade security',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Currency Support',
      description: 'Support for NGN, GHS, KES, XOF, and ZAR with more coming',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Connect Wallet',
      description: 'Connect your HashPack or Blade wallet to get started',
    },
    {
      step: '02',
      title: 'Enter Amount',
      description: 'Specify how much HBAR you want to convert',
    },
    {
      step: '03',
      title: 'Receive Funds',
      description: 'Get local currency directly in your bank account',
    },
  ];

  const stats = [
    { label: 'Total Volume', value: '$2.4M+', icon: <DollarSign className="w-5 h-5" /> },
    { label: 'Transactions', value: '15,847', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Active Users', value: '3,241', icon: <Users className="w-5 h-5" /> },
    { label: 'Avg. Time', value: '< 5 min', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Live Rate Ticker */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                LIVE
              </Badge>
              <span className="text-sm">Real-time rates:</span>
            </div>
            {Object.entries(rates).slice(0, -1).map(([currency, rate]) => (
              <div key={currency} className="flex items-center space-x-1 whitespace-nowrap">
                <span className="text-sm font-medium">1 HBAR = {typeof rate === 'number' ? rate.toFixed(2) : rate} {currency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Convert HBAR to
                  <span className="text-primary"> African Currencies</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  The fastest and most secure way to convert your HBAR tokens to Nigerian Naira, 
                  Ghanaian Cedi, Kenyan Shilling, and other African currencies.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isConnected ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto">
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Learn More
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-2 text-primary mb-1">
                      {stat.icon}
                      <span className="font-bold text-lg">{stat.value}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Widget */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <ConversionWidget />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose AfriSwap?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for the African market with local payment integrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How it Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple, fast, and secure in just 3 steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Converting?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users already using AfriSwap for seamless HBAR to fiat conversions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Connect Wallet
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">A</span>
                </div>
                <span className="text-xl font-bold">AfriSwap</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The leading Web3 offramp for African currencies. Convert HBAR to local fiat seamlessly.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">Twitter</Button>
                <Button variant="ghost" size="sm">Discord</Button>
                <Button variant="ghost" size="sm">Telegram</Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                <li><Link to="/history" className="hover:text-foreground">History</Link></li>
                <li><Link to="/alerts" className="hover:text-foreground">Price Alerts</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Button variant="ghost" size="sm" className="p-0 h-auto hover:text-foreground">Help Center</Button></li>
                <li><Button variant="ghost" size="sm" className="p-0 h-auto hover:text-foreground">Contact Us</Button></li>
                <li><Button variant="ghost" size="sm" className="p-0 h-auto hover:text-foreground">Status</Button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 AfriSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}