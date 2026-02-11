
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash2 } from "lucide-react";
import type { User } from "@/lib/types";
import { EditUserDialog } from "./edit-user-dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return [];
  const usersJson = localStorage.getItem('users');
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsersToStorage = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(users));
        // Dispatch a storage event to notify other tabs
        window.dispatchEvent(new Event('storage'));
    }
};

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const updateUserList = () => {
        setUsers(getUsersFromStorage());
    }
    
    updateUserList();

    const handleStorageChange = (e: StorageEvent) => {
        // Check if the event is for the 'users' key or if it's a generic storage event
        if (e.key === 'users' || e.key === null) {
            updateUserList();
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    if (typeof window !== 'undefined') {
        const loggedInUserJson = localStorage.getItem('loggedInUser');
        if (loggedInUserJson) {
            const loggedInUser = JSON.parse(loggedInUserJson);
            if (loggedInUser.id === updatedUser.id) {
                localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event('storage'));
            }
        }
    }
    
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setIsDeleting(true);
    const userToDelete = users.find(user => user.id === userId);
    if (!userToDelete) {
        toast({ title: "Error", description: "User not found.", variant: "destructive" });
        setIsDeleting(false);
        return;
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);
    
    toast({
      title: "User Deleted",
      description: `User ${userToDelete.name} has been successfully deleted.`,
    });
    setIsDeleting(false);
  };

  return (
    <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View, search, and edit user information.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or email..."
              className="pl-8 w-full sm:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
            {filteredUsers.length === 0 ? (
                 <div className="text-center text-muted-foreground py-10">
                    No users found matching your search.
                 </div>
            ) : (
                <>
                    {/* Responsive List for Mobile */}
                    <div className="md:hidden space-y-4">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className="border-b pb-4 last:border-0 last:pb-0 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 overflow-hidden">
                                    <Avatar>
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{user.name} <span className="text-muted-foreground">(@{user.username})</span></p>
                                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                        <p className="text-sm font-mono">${user.balance.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditingUser(user)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the user account for {user.name}.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)} disabled={isDeleting}>
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Table for Desktop */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                                <TableHead>Join Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>@{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-right">${user.balance.toFixed(2)}</TableCell>
                                <TableCell>{user.joinDate}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setEditingUser(user)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the user account for {user.name}.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)} disabled={isDeleting}>
                                                {isDeleting ? "Deleting..." : "Delete"}
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    </div>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                </>
           )}
        </CardContent>
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}
    </Card>
  );
}
