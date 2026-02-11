
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { CryptoMarketData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export function MarketTable() {
  const [data, setData] = useState<CryptoMarketData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/market-data`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result: CryptoMarketData[] = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch crypto data:", error);
      setError("Could not load market data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderPriceChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={cn(isPositive ? "text-green-400" : "text-red-400")}>
        {isPositive ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
      </span>
    );
  };

  return (
    <div className="overflow-x-auto w-full">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Asset</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead className="text-right">24h Change</TableHead>
          <TableHead className="text-right">Trade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading &&
          Array.from({ length: 7 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right py-4 px-2">
                <Skeleton className="h-4 w-24 ml-auto" />
              </TableCell>
              <TableCell className="text-right py-4 px-2">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-20 ml-auto rounded-md" />
              </TableCell>
            </TableRow>
          ))}
        {!loading && error && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-10">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <AlertTriangle className="h-8 w-8" />
                <p className="font-medium">Error loading data</p>
                <p className="text-sm">{error}</p>
                 <Button variant="outline" size="sm" onClick={fetchData} className="mt-4">
                  Try Again
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
        {!loading &&
          !error &&
          data &&
          data.map((coin) => {
            return (
              <TableRow key={coin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image src={coin.image} alt={coin.name} width={24} height={24} />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {coin.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium py-4 px-2">
                  ${coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap py-4 px-2">
                  {renderPriceChange(coin.price_change_percentage_24h)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
                      <Link href="/dashboard">Trade</Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
    </div>
  );
}
