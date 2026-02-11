import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { SupportBot } from '@/components/support-bot';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ElonTradeX',
  description: 'The most secure and intuitive platform to buy, sell, and manage your cryptocurrency portfolio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <FirebaseClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen w-full">
              {children}
            </div>
            <Toaster />
            <SupportBot />
            <FirebaseErrorListener />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
