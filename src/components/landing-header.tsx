
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { IconLogo } from "./icons";

export function LandingHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // In a real app, you would have a more robust auth check.
    // For this prototype, we check localStorage.
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('loggedInUser');
      setIsLoggedIn(!!user);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <IconLogo className="h-8 w-8" />
          <span className="font-bold text-lg">ElonTradeX</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-base font-medium">
          <Link
            href="#features"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/markets"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            News
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="#contact"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Button asChild>
                <Link href="/dashboard">Portfolio</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <IconLogo className="h-8 w-8" />
                  <span className="font-bold">ElonTradeX</span>
                </Link>
                <Link href="/#features" className="text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="/markets" className="text-muted-foreground hover:text-foreground">
                  News
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
                <div className="flex flex-col gap-4 mt-4">
                  {isLoggedIn ? (
                     <Button asChild>
                        <Link href="/dashboard">Portfolio</Link>
                      </Button>
                  ) : (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/login">Log In</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
