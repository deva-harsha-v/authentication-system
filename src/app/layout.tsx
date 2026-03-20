"use client"

import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <SessionProvider>
          {/* Main wrapper to center the auth cards globally */}
          <main className="flex min-h-screen items-center justify-center p-4">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}