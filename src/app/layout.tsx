import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Deplorable Picks | Premium Sports Betting Picks',
  description: 'Join our exclusive community of winners. Get access to expert analysis, premium picks, and real-time alerts delivered straight to your Discord.',
  keywords: ['sports betting', 'picks', 'premium', 'discord', 'betting tips'],
  openGraph: {
    title: 'Deplorable Picks | Premium Sports Betting Picks',
    description: 'Join our exclusive community of winners. Get access to expert analysis, premium picks, and real-time alerts.',
    images: ['/assets/banner.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deplorable Picks | Premium Sports Betting Picks',
    description: 'Join our exclusive community of winners.',
    images: ['/assets/banner.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/assets/logo.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
