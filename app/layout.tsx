import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "next-themes"
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/providers/query-provider'
import { CartSheet } from '@/components/cart/cart-sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { Footer } from '@/components/footer'
import { Providers } from "@/components/providers"
import Link from 'next/link'
import { AuthProvider } from '@/lib/auth/auth-context'
import { ProfileButton } from "@/components/auth/profile-button"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoParts B2B Platform',
  description: 'Comprehensive B2B platform for automobile parts wholesaling',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="/styles/globals.css" 
          as="style"
          type="text/css"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
                <div className="min-h-screen flex flex-col">
                  <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
                    <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                      <h1 className="text-lg md:text-xl font-bold">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                          AutoParts B2B
                        </Link>
                      </h1>
                      <div className="flex items-center gap-2 md:gap-4">
                        <ThemeToggle />
                        <CartSheet />
                        <ProfileButton />
                      </div>
                    </div>
                  </header>
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
                <Toaster position="bottom-right" />
              </QueryProvider>
            </ThemeProvider>
          </Providers>
        </AuthProvider>
      </body>
    </html>
  )
}