
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Edit } from "lucide-react";

const initialWallets: { [key: string]: { name: string; address: string } } = {
  btc: { name: "Bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
  eth: { name: "Ethereum", address: "0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B" },
  usdt: { name: "Tether", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
  xrp: { name: "Ripple", address: "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh" },
  sol: { name: "Solana", address: "So11111111111111111111111111111111111111112" },
  doge: { name: "Dogecoin", address: "D7bA4w4zL1N7k1M3fQ5cZ6eP9aB8iGfT3k" },
};

const getWalletsFromStorage = (): typeof initialWallets => {
    if (typeof window === 'undefined') return initialWallets;
    const storedWallets = localStorage.getItem('siteDepositWallets');
    return storedWallets ? JSON.parse(storedWallets) : initialWallets;
};

const saveWalletsToStorage = (wallets: typeof initialWallets) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('siteDepositWallets', JSON.stringify(wallets));
    }
};

export function SiteSettings() {
    const { toast } = useToast();
    const [wallets, setWallets] = useState(initialWallets);
    const [isLoading, setIsLoading] = useState(false);    const inputRefs = useRef<{[key: string]: HTMLInputElement | null}>({});
    
    useEffect(() => {
        setWallets(getWalletsFromStorage());
    }, []);

    const handleAddressChange = (asset: string, value: string) => {
        setWallets(prev => ({
            ...prev,
            [asset]: { ...prev[asset], address: value }
        }));
    };
    
    const handleFocusInput = (assetKey: string) => {
        inputRefs.current[assetKey]?.focus();
    };

    const handleSave = async () => {
        setIsLoading(true);
        saveWalletsToStorage(wallets);
        
        toast({
            title: "Settings Saved",
            description: "The main wallet deposit addresses have been updated.",
        });

        setIsLoading(false);
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site-wide Settings</CardTitle>
        <CardDescription>
          Manage the main deposit addresses for each cryptocurrency offered on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(wallets).map(([key, wallet]) => (
            <div key={key} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-2">
                        <Label htmlFor={`deposit-address-${key}`} className="font-semibold text-base">{wallet.name} ({key.toUpperCase()})</Label>
                        <Input 
                            id={`deposit-address-${key}`}
                            ref={(el) => {
 inputRefs.current[key] = el;
 }}
                            value={wallet.address}
                            onChange={(e) => handleAddressChange(key, e.target.value)}
                            className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                            This is the primary address displayed for all user deposits for {key.toUpperCase()}.
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-muted/50 p-4 rounded-lg space-y-3">
                        <p className="text-xs font-semibold">Live QR Code</p>
                        <div className="p-2 rounded-lg border bg-background shadow-sm">
                        {wallet.address && (
                            <Image
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${wallet.address}`}
                                alt={`${wallet.name} Deposit QR Code`}
                                width={150}
                                height={150}
                                className="rounded-md"
                                key={wallet.address}
                            />
                        )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleFocusInput(key)}>
                           <Edit className="h-3 w-3 mr-2"/>
                           Change Address
                        </Button>
                    </div>
                </div>
                <Separator className="last:hidden"/>
            </div>
        ))}
        <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save All Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
