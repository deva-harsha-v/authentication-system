"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 min-h-screen antialiased`}>
        <SessionProvider>
          {/* We use 'flex justify-center' here. 
              'py-10' (padding vertical) ensures that if the dashboard is tall, 
              it doesn't touch the very top or bottom of the screen.
          */}
          <main className="flex min-h-screen w-full justify-center items-center py-10 px-4">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}