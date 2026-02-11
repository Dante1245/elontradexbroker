import { IconLogo } from "@/components/icons";
import Link from "next/link";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
       <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl opacity-10 animate-pulse"></div>
      <div className="w-full max-w-sm z-10">
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
            <IconLogo className="h-10 w-10" />
            <span>ElonTradeX</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
