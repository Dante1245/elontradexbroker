import Link from "next/link";
import { IconLogo } from "./icons";

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center gap-2">
            <IconLogo className="h-8 w-8" />
            <span className="font-bold text-lg">ElonTradeX</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 ElonTradeX.
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm font-medium">
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Security
          </Link>
        </nav>
      </div>
    </footer>
  );
}
