import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthGuard from '@/components/auth/AuthGuard';
import { Providers } from './providers';
import { AppProvider } from '@/context/AppContext';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AppProvider>
          <Providers>
            <AuthGuard>
              <ThemeProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </ThemeProvider>
            </AuthGuard>
          </Providers>
        </AppProvider>
      </body>
    </html>
  );
}
