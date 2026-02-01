'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  const { user, signInWithDiscord } = useAuth()

  return (
    <section className="relative overflow-hidden pt-52">
      {/* Background Effects */}
      <div className="absolute inset-0 lightning-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--background))/50] to-[hsl(var(--background))]" />
      </div>

      {/* Banner Background */}
      <div className="absolute inset-0 opacity-20">
        <Image
          src="/assets/banner.png"
          alt=""
          fill
          className="object-cover object-center blur-sm"
          priority
        />
      </div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--background))/80] via-[hsl(var(--background))/90] to-[hsl(var(--background))]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="gradient-text">Premium Sports Picks</span>
            <br />
            <span className="text-[hsl(var(--foreground))]">From The Experts</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg text-[hsl(var(--muted-foreground))] sm:text-xl">
            Join our exclusive community of winners. Get access to expert analysis,
            premium picks, and real-time alerts delivered straight to your Discord.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" glow className="text-lg">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Button size="lg" glow onClick={signInWithDiscord} className="text-lg">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Get Started with Discord
              </Button>
            )}
            <Link href="/#pricing">
              <Button size="lg" variant="outline" className="text-lg">
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[hsl(var(--foreground))]">Daily Picks</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[hsl(var(--foreground))]">Instant Access</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[hsl(var(--foreground))]">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
