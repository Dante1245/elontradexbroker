
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { User, Transaction } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { AddTransactionForm } from "./add-transaction-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export function EditUserDialog({ user: initialUser, isOpen, onClose, onUpdate }: EditUserDialogProps) {
  const { toast } = useToast();
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const handleSave = () => {
    onUpdate(user);
    toast({
      title: "User Updated",
      description: `${user.name}'s details have been updated.`,
    });
    onClose();
  };
  
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const transactionToAdd: Transaction = {
      ...newTx,
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
    };
    setUser(prevUser => ({
        ...prevUser,
        transactions: [transactionToAdd, ...(prevUser.transactions ?? [])]
    }))
  };

  const handleRemoveTransaction = (txId: string) => {
    setUser(prevUser => ({
        ...prevUser,
        transactions: prevUser.transactions?.filter(tx => tx.id !== txId)
    }))
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit User: {user.name}</DialogTitle>
          <DialogDescription>
            Modify user details for {user.email}. Changes are applied immediately upon saving.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          
          <div className="space-y-4 p-4 rounded-lg border bg-card/50">
            <h4 className="font-medium text-foreground">User Details</h4>
            <div className="grid md:grid-cols-1 gap-6">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="balance">Balance (USD)</Label>
                    <Input
                        id="balance"
                        type="number"
                        value={user.balance}
                        onChange={(e) => setUser(prev => ({...prev, balance: parseFloat(e.target.value) || 0}))}
                    />
                </div>
            </div>
          </div>
          
           <div className="space-y-4 p-4 rounded-lg border bg-card/50">
            <h4 className="font-medium text-foreground">Manage Transactions</h4>
             <AddTransactionForm onSubmit={handleAddTransaction} />
              <div className="mt-6">
                <h5 className="font-medium text-foreground mb-2">Transaction History</h5>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                         <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {user.transactions?.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">No transactions found.</TableCell>
                        </TableRow>
                      )}
                      {user.transactions?.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{tx.type}</TableCell>
                          <TableCell>{tx.asset}</TableCell>
                          <TableCell>{tx.amount}</TableCell>
                          <TableCell><Badge variant="outline">{tx.status}</Badge></TableCell>
                           <TableCell>{tx.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="destructive" size="icon" onClick={() => handleRemoveTransaction(tx.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
           </div>
        </div>

        <DialogFooter className="bg-background p-4 rounded-b-lg -m-6 mt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
           <Button onClick={handleSave}>Save User Details</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
