
"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { MarketNews } from "@/components/market-news";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function MarketsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // In a real app, you would have a more robust auth check.
    // For this prototype, we check localStorage.
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('loggedInUser');
      setIsLoggedIn(!!user);
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {isLoggedIn ? <DashboardHeader /> : <LandingHeader />}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Crypto Market News</h1>
            <p className="text-muted-foreground">
              The latest headlines and analysis from the world of digital assets.
            </p>
          </div>
          <Separator />
          <MarketNews refreshKey={refreshKey} />
           <div className="text-center mt-8">
            <Button onClick={() => setRefreshKey(prev => prev + 1)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh News
            </Button>
          </div>
        </div>
      </main>
      {!isLoggedIn && <LandingFooter />}
    </div>
  );
}
