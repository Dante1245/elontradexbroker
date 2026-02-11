"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { AuthLayout } from "./auth-layout";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { countries } from "@/lib/countries";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().default(false).optional(),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().min(1, { message: "Phone number is required." }),
  country: z.string().min(1, { message: "Please select a country." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export function AuthForm({ type }: { type: "login" | "signup" }) {
  const router = useRouter();
  const isLogin = type === "login";
  const schema = isLogin ? loginSchema : signupSchema;
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: isLogin 
      ? { email: "", password: "", rememberMe: false } 
      : { name: "", username: "", email: "", phoneNumber: "", country: "", password: "", confirmPassword: "" },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    // Mock authentication for the prototype
    setTimeout(() => {
      if (isLogin) {
        if (values.email === "admin@elontradex.live" && values.password === "admin123") {
            const adminUser = {
                id: "admin_1",
                name: "Admin User",
                username: "admin",
                email: "admin@elontradex.live",
                balance: 1000000,
                joinDate: "2024-01-01",
                isAdmin: true
            };
            localStorage.setItem('loggedInUser', JSON.stringify(adminUser));
            router.push("/admin");
            return;
        }

        const usersJson = localStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : [];
        const user = users.find((u: any) => u.email === values.email && u.password === values.password);

        if (user) {
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          router.push("/dashboard");
        } else {
          setError("Invalid email or password.");
          setIsLoading(false);
        }
      } else {
        const signupValues = values as z.infer<typeof signupSchema>;
        const newUser = {
          id: `user_${Math.random().toString(36).substr(2, 9)}`,
          ...signupValues,
          balance: 200.00,
          joinDate: new Date().toISOString().split('T')[0],
          transactions: [
              {
                  id: `txn_${Math.random().toString(36).substr(2, 9)}`,
                  type: "Bonus",
                  asset: "USDT",
                  amount: 200,
                  status: "Completed",
                  date: new Date().toISOString().split('T')[0]
              }
          ]
        };

        const usersJson = localStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : [];
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', JSON.stringify(newUser));
        localStorage.setItem('showBonusPopup', 'true');
        
        router.push("/dashboard");
      }
    }, 1500);
  };
  
  return (
    <AuthLayout>
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20 w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create an Account"}</CardTitle>
          <CardDescription>{isLogin ? "Sign in to access your dashboard." : "Enter your details to get started."}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Elon Musk" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem><FormLabel>Username</FormLabel><FormControl><Input placeholder="elon" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                      <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl>
                        <SelectContent><ScrollArea className="h-72">{countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>
                        ))}</ScrollArea></SelectContent>
                      </Select><FormMessage /></FormItem>
                    )} />
                  </div>
                </>
              )}
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="user@example.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div></FormControl><FormMessage /></FormItem>
              )} />
              {!isLogin && <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-center text-sm text-muted-foreground">
            {isLogin ? (<>Don&apos;t have an account? <Link href="/signup" className="font-medium text-primary hover:underline">Sign Up</Link></>) : (<>Already have an account? <Link href="/login" className="font-medium text-primary hover:underline">Sign In</Link></>)}
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
