

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/lib/types";

const profileSchema = z.object({
  username: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

async function getUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null;
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
        try {
            return JSON.parse(storedUser);
        } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            return null;
        }
    }
    return null;
}

export function ProfileForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      phoneNumber: "",
      country: ""
    },
  });

  useEffect(() => {
    async function loadUser() {
        const userData = await getUser();
        if (userData) {
            setUser(userData);
            form.reset({
                username: userData.username,
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                country: userData.country
            });
             if (userData.avatar) {
              setAvatarPreview(userData.avatar);
            }
        }
    }
    loadUser();
  }, [form]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (values: ProfileFormValues) => {
    setIsSubmitting(true);
    
    if (user) {
        const updatedUser = { ...user, ...values, avatar: avatarPreview };
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        
        // Also update the master user list
        const usersJson = localStorage.getItem('users');
        let allUsers: User[] = usersJson ? JSON.parse(usersJson) : [];
        const userIndex = allUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          allUsers[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(allUsers));
        }

        setUser(updatedUser);
        toast({
            title: "Profile Updated",
            description: "Your profile information has been saved.",
        });
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
        This information will be displayed publicly so be careful what you share.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
              <div className="flex items-center gap-4 pt-2">
                <Avatar className="h-20 w-20 flex-shrink-0">
                  <AvatarImage src={avatarPreview} alt={form.watch('name')} data-ai-hint="person face" />
                  <AvatarFallback>{form.watch('name')?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button variant="outline" type="button" onClick={handleAvatarButtonClick}>Change Avatar</Button>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username" {...field} readOnly disabled />
                      </FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Your country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
