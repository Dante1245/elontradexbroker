
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, BarChart, ExternalLink, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import type { User, Transaction } from "@/lib/types";

const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return [];
  const usersJson = localStorage.getItem('users');
  return usersJson ? JSON.parse(usersJson) : [];
};

const getAllTransactions = (users: User[]): Transaction[] => {
    return users.flatMap(user => user.transactions || []);
}

export function DashboardMetrics() {
    const [users, setUsers] = useState<User[]>([]);
    
    const updateMetrics = () => {
      setUsers(getUsersFromStorage());
    }

    useEffect(() => {
        updateMetrics();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'users') {
                updateMetrics();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [])

    const userCount = users.length;
    const signupsToday = users.filter(u => u.joinDate === new Date().toISOString().split('T')[0]).length;
    const allTransactions = getAllTransactions(users);
    const pendingWithdrawals = allTransactions.filter(tx => tx.type === 'Withdrawal' && tx.status === 'Pending').length;
    const totalTransactions = allTransactions.length;

    const metrics = [
        { title: "Total Users", value: userCount.toString(), icon: <Users className="h-6 w-6" /> },
        { title: "Total Signups (24h)", value: signupsToday.toString(), icon: <BarChart className="h-6 w-6" /> },
        { title: "Pending Withdrawals", value: pendingWithdrawals.toString(), icon: <ExternalLink className="h-6 w-6" /> },
        { title: "Total Transactions", value: totalTransactions.toString(), icon: <Activity className="h-6 w-6" /> },
      ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className="text-slate-500">{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
