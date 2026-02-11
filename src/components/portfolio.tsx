"use client";

import { DollarSign, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

export function Portfolio() {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const userDocRef = user && db ? doc(db, "users", user.uid) : null;
  const { data: userData, loading: docLoading } = useDoc(userDocRef);

  if (authLoading || docLoading) {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    );
  }

  const balance = userData?.balance ?? 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <p className="text-xs text-muted-foreground">+0.0% from last month</p>
        <div className="mt-4 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">USDT Balance:</span>
          <span className="text-sm">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          <Badge variant="secondary">Active</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
