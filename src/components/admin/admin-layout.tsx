import { IconLogo } from "@/components/icons";
import Link from "next/link";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40 text-foreground">
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link href="/admin" className="flex items-center gap-3 text-xl font-bold">
            <IconLogo className="h-8 w-8" />
            <span>ElonTradeX Admin</span>
          </Link>
          <nav>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Main Site
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="container mx-auto">
            {children}
        </div>
      </main>
      <footer className="bg-background/80 border-t p-4">
        <p className="text-center text-xs text-muted-foreground">© 2024 ElonTradeX Administration Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}
