
"use client";

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
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
import { Check, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Transaction, User } from "@/lib/types";

const getWithdrawalRequests = (): (Transaction & { userId: string, userName: string })[] => {
    if (typeof window === 'undefined') return [];
    const usersJson = localStorage.getItem('users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    const requests: (Transaction & { userId: string, userName: string })[] = [];
    users.forEach(user => {
        const userWithdrawals = user.transactions?.filter(tx => tx.type === 'Withdrawal') || [];
        userWithdrawals.forEach(tx => {
            requests.push({ ...tx, userId: user.id, userName: user.name });
        });
    });
    return requests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const updateRequestStatusInStorage = (userId: string, txId: string, status: "Approved" | "Declined") => {
    if (typeof window === 'undefined') return;
    const usersJson = localStorage.getItem('users');
    let users: User[] = usersJson ? JSON.parse(usersJson) : [];
    
    let userWasUpdated = false;
    users = users.map(user => {
        if (user.id === userId) {
            let transactionWasUpdated = false;
            const updatedTransactions = user.transactions?.map(tx => {
                if (tx.id === txId) {
                    transactionWasUpdated = true;
                    return { ...tx, status };
                }
                return tx;
            });
            if (transactionWasUpdated) {
              userWasUpdated = true;
              return { ...user, transactions: updatedTransactions };
            }
        }
        return user;
    });

    if (userWasUpdated) {
      localStorage.setItem('users', JSON.stringify(users));
      window.dispatchEvent(new StorageEvent('storage', { key: 'users' }));
    }
}

  export function WithdrawalRequests() {
    const [withdrawalRequests, setWithdrawalRequests] = useState<(Transaction & { userId: string, userName: string })[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const refreshRequests = () => {
        setWithdrawalRequests(getWithdrawalRequests());
    }

    useEffect(() => {
        refreshRequests();
        window.addEventListener('storage', refreshRequests);
        return () => window.removeEventListener('storage', refreshRequests);
    }, []);

    const handleUpdateStatus = (userId: string, txId: string, status: "Approved" | "Declined") => {
      setProcessingId(txId);
      // Simulate network delay
      setTimeout(() => {
        updateRequestStatusInStorage(userId, txId, status);
        // The storage event listener will trigger a refresh
        setProcessingId(null);
      }, 500);
    };

    const handleApprove = (userId: string, txId: string) => handleUpdateStatus(userId, txId, "Approved");
    const handleDecline = (userId: string, txId: string) => handleUpdateStatus(userId, txId, "Declined");

    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>Review and process pending withdrawal requests.</CardDescription>
        </CardHeader>
        <CardContent>
          {withdrawalRequests.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No withdrawal requests.
            </div>
           ) : (
            <>
                {/* Responsive List for Mobile */}
                <div className="md:hidden space-y-4">
                    {withdrawalRequests.map((req) => (
                      <div key={req.id} className="border-b pb-4 last:border-0 last:pb-0 space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{req.amount} {req.asset}</span>
                                <span className="text-xs text-muted-foreground ml-2">to {req.userName}</span>
                            </div>
                              <Badge variant={req.status === 'Pending' ? 'default' : 'outline'} className={req.status === 'Pending' ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : ""}>{req.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono truncate" title={req.address}>{req.address}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>{req.date}</span>
                              <span className="font-mono">{req.id}</span>
                          </div>
                          {req.status === 'Pending' && (
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-400/10 text-green-400 border-green-400/30 hover:bg-green-400/20"
                                    onClick={() => handleApprove(req.userId, req.id)}
                                    disabled={processingId === req.id}
                                >
                                    {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                                    {processingId === req.id ? 'Processing...' : 'Approve'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-400/10 text-red-400 border-red-400/30 hover:bg-red-400/20"
                                    onClick={() => handleDecline(req.userId, req.id)}
                                    disabled={processingId === req.id}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Decline
                                </Button>
                            </div>
                          )}
                      </div>
                    ))}
                </div>

                {/* Table for Desktop */}
                <div className="hidden md:block">
                  <Table>
                      <TableHeader>
                      <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Asset</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                      </TableHeader>
                      <TableBody>
                      {withdrawalRequests.map((req) => (
                          <TableRow key={req.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">{req.id}</TableCell>
                          <TableCell>{req.userName}</TableCell>
                          <TableCell>{req.asset}</TableCell>
                          <TableCell className="text-right">{req.amount}</TableCell>
                          <TableCell className="font-mono text-xs">{req.address}</TableCell>
                          <TableCell>
                              <Badge variant={req.status === 'Pending' ? 'default' : 'outline'} className={req.status === 'Pending' ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : ""}>{req.status}</Badge>
                          </TableCell>
                          <TableCell>{req.date}</TableCell>
                          <TableCell className="text-right">
                          {req.status === 'Pending' && (
                            <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-400/10 text-green-400 border-green-400/30 hover:bg-green-400/20"
                                    onClick={() => handleApprove(req.userId, req.id)}
                                    disabled={processingId === req.id}
                                  >
                                    {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve'}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-400/10 text-red-400 border-red-400/30 hover:bg-red-400/20"
                                    onClick={() => handleDecline(req.userId, req.id)}
                                    disabled={processingId === req.id}
                                  >
                                    Decline
                                  </Button>
                              </div>
                            )}
                          </TableCell>
                          </TableRow>
                      ))}
                      </TableBody>
                  </Table>
                </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }
