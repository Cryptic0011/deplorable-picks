'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    id: 'weekly',
    name: 'Weekly',
    price: 25,
    period: '/week',
    description: 'Perfect for trying us out',
    features: [
      'All premium picks',
      'Discord access',
      'Real-time alerts',
      'Basic analysis',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEK,
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: 75,
    period: '/month',
    description: 'Most popular choice',
    popular: true,
    features: [
      'All premium picks',
      'Discord access',
      'Real-time alerts',
      'Detailed analysis',
      'Priority support',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTH,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 750,
    period: '/year',
    description: 'Save 17% vs monthly',
    badge: 'Best Value',
    features: [
      'All premium picks',
      'Discord access',
      'Real-time alerts',
      'Detailed analysis',
      'Priority support',
      'Exclusive VIP channel',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEAR,
  },
]

export function Pricing() {
  const { user, profile, signInWithDiscord } = useAuth()
  const isSubscribed = profile?.subscription_status === 'active'

  return (
    <section id="pricing" className="py-20 sm:py-32 lightning-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Simple, Transparent</span>{' '}
            <span className="text-[hsl(var(--foreground))]">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            Choose the plan that works best for you. Cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="mt-16 mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              hover
              className={`relative ${plan.popular ? 'border-[hsl(var(--primary))] electric-border' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant={plan.popular ? 'default' : 'success'}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gap-1">
                    <Zap className="h-3 w-3" />
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold gradient-text">${plan.price}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">{plan.period}</span>
                </div>

                <ul className="space-y-3 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--primary))]" />
                      <span className="text-sm text-[hsl(var(--muted-foreground))]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isSubscribed ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : user ? (
                  <Link href={`/checkout?plan=${plan.id}`} className="w-full">
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                      glow={plan.popular}
                    >
                      Get Started
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    glow={plan.popular}
                    onClick={signInWithDiscord}
                  >
                    Sign in to Subscribe
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
