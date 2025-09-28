import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink, Shield, Zap } from 'lucide-react';

interface WalletConnectionModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const wallets = [
  {
    name: 'HashPack',
    description: 'The most popular Hedera wallet',
    icon: '🔷',
    status: 'Recommended',
    features: ['Easy to use', 'Browser extension', 'Mobile app'],
  },
  {
    name: 'Blade Wallet',
    description: 'Advanced features for power users',
    icon: '⚔️',
    status: 'Advanced',
    features: ['DeFi integration', 'NFT support', 'Multi-chain'],
  },
  {
    name: 'Kabila Wallet',
    description: 'Secure hardware wallet support',
    icon: '🛡️',
    status: 'Secure',
    features: ['Hardware support', 'Cold storage', 'Enterprise grade'],
  },
];

export function WalletConnectionModal({ open, onClose, onConnect }: WalletConnectionModalProps) {
  const handleWalletSelect = (walletName: string) => {
    // In a real implementation, this would trigger the specific wallet connection
    console.log(`Connecting to ${walletName}...`);
    onConnect();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Connect Your Wallet</span>
            <Shield className="w-5 h-5 text-primary" />
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to AfriSwap. Your wallet will be used to sign transactions securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {wallets.map((wallet) => (
            <Card 
              key={wallet.name} 
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => handleWalletSelect(wallet.name)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <div>
                      <CardTitle className="text-base">{wallet.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {wallet.description}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={wallet.status === 'Recommended' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {wallet.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {wallet.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-start space-x-3 text-sm text-muted-foreground">
            <Zap className="w-4 h-4 mt-0.5 text-primary" />
            <div>
              <p className="font-medium text-foreground">What is a wallet?</p>
              <p>A wallet is used to send, receive, and store your HBAR tokens securely on the Hedera network.</p>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open('https://docs.hedera.com/guides/getting-started/introduction', '_blank')}
          >
            Learn More About Wallets
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
}