import React from 'react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import '@/app/globals.css';

import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Watch me'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased bg-zinc-800',
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
