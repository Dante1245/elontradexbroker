

"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transaction, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

function getTransactionsFromClient(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const storedUser = localStorage.getItem('loggedInUser');
  if (storedUser) {
    try {
      const user: User = JSON.parse(storedUser);
      // Sort transactions by date descending
      return user.transactions?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ?? [];
    } catch (e) {
      console.error("Failed to parse user from localStorage for transactions", e);
      return [];
    }
  }
  return [];
}

export function Transactions({ onHistoryPage = false }: { onHistoryPage?: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const updateTransactions = () => {
    setTransactions(getTransactionsFromClient());
  }
  
  useEffect(() => {
    updateTransactions();
    setLoading(false);

    window.addEventListener('storage', updateTransactions);
    return () => {
      window.removeEventListener('storage', updateTransactions);
    }
  }, []);

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
      case "Approved":
        return "bg-green-500/20 text-green-700 dark:text-green-400";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400";
      case "Processing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400";
      case "Declined":
        return "bg-red-500/20 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(`${dateString}T00:00:00Z`);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'
    }).format(date);
  }

  const formatAmount = (amount: number, asset: string) => {
    const fixedDecimalPlaces = asset === 'USDT' ? 2 : 6;
    const formattedAmount = amount.toFixed(fixedDecimalPlaces);
    if (asset === 'USDT') {
      return `$${formattedAmount}`;
    }
    return formattedAmount;
  };
  
  if (loading) {
    const skeletonCount = onHistoryPage ? 10 : 5;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>A log of your recent account activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <div key={i} className="flex items-center py-2">
                            <div className="ml-4 space-y-2 w-full">
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-3/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
  }


  const displayedTransactions = onHistoryPage ? transactions : transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          {onHistoryPage
            ? "A complete record of all your account activity."
            : "A log of your recent account activity."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            You have no transactions yet.
          </div>
        ) : (
          <>
            {/* Responsive view for mobile */}
            <div className="md:hidden">
              <div className="space-y-4">
                {displayedTransactions.map((tx, index) => (
                  <div key={tx.id} className={`border-b pb-4 ${index === displayedTransactions.length - 1 ? 'border-0 pb-0' : ''} space-y-2`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{tx.type} - {tx.asset}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(tx.date)}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(tx.status)}>{tx.status}</Badge>
                    </div>
                    <div className="mt-2 text-right">
                      <p className="font-mono text-lg">{tx.type !== "Bonus" && (tx.type === "Deposit" || tx.status === "Declined") ? "+ " : "- "}{formatAmount(tx.amount, tx.asset)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table view for larger screens */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[100px]">Asset</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right w-[120px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-medium">{tx.type}</TableCell>
                      <TableCell>{tx.asset}</TableCell>
                      <TableCell className="text-right font-mono">{tx.type !== "Bonus" && (tx.type === "Deposit" || tx.status === 'Declined') ? "+ " : "- "}{formatAmount(tx.amount, tx.asset)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getStatusColor(tx.status)}>{tx.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatDate(tx.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {!onHistoryPage && transactions.length > 5 && (
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link href="/history">View All Transactions</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
