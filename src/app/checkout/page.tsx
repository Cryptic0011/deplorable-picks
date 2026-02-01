'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Check, AlertCircle, ArrowLeft, Zap, Crown } from 'lucide-react'
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

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [checkingMembership, setCheckingMembership] = useState(false)
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const planParam = searchParams.get('plan')
    if (planParam && plans.some((p) => p.id === planParam)) {
      setSelectedPlan(planParam)
    } else {
      setSelectedPlan('monthly')
    }
  }, [searchParams])

  useEffect(() => {
    async function checkMembership() {
      if (!profile?.discord_id) return

      setCheckingMembership(true)
      try {
        const response = await fetch('/api/check-membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ discord_id: profile.discord_id }),
        })

        const data = await response.json()
        setIsMember(data.isMember)
      } catch (err) {
        console.error('Error checking membership:', err)
        setIsMember(null)
      }
      setCheckingMembership(false)
    }

    if (profile?.discord_id) {
      checkMembership()
    }
  }, [profile?.discord_id])

  const handleCheckout = async () => {
    if (!selectedPlan || !profile) return

    const plan = plans.find((p) => p.id === selectedPlan)
    if (!plan?.priceId) {
      setError('Invalid plan selected')
      return
    }

    setCheckoutLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: plan.priceId }),
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Failed to create checkout session. Please try again.')
    }

    setCheckoutLoading(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in with Discord to purchase a subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (profile.subscription_status === 'active') {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Card className="max-w-md border-[hsl(var(--success))]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--success))]">
              <Crown className="h-5 w-5" />
              Already Subscribed
            </CardTitle>
            <CardDescription>
              You already have an active subscription!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentPlan = plans.find((p) => p.id === selectedPlan)

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Plan Selection */}
          <div className="lg:col-span-2">
            <h1 className="mb-2 text-3xl font-bold">Choose Your Plan</h1>
            <p className="mb-8 text-[hsl(var(--muted-foreground))]">
              Select the plan that works best for you
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan === plan.id
                      ? 'border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary))]'
                      : 'hover:border-[hsl(var(--primary))/50]'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      {plan.badge && <Badge variant="success">{plan.badge}</Badge>}
                      {plan.popular && (
                        <Badge className="gap-1">
                          <Zap className="h-3 w-3" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold gradient-text">${plan.price}</span>
                      <span className="text-[hsl(var(--muted-foreground))]">{plan.period}</span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-[hsl(var(--primary))]" />
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li className="text-sm text-[hsl(var(--muted-foreground))]">
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentPlan && (
                  <>
                    <div className="flex items-center justify-between">
                      <span>{currentPlan.name} Plan</span>
                      <span className="font-semibold">${currentPlan.price}</span>
                    </div>
                    <div className="border-t border-[hsl(var(--border))] pt-4">
                      <div className="flex items-center justify-between font-semibold">
                        <span>Total</span>
                        <span className="gradient-text">${currentPlan.price}</span>
                      </div>
                      <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                        {currentPlan.period === 'one-time'
                          ? 'One-time payment'
                          : `Billed ${currentPlan.id}`}
                      </p>
                    </div>
                  </>
                )}

                {/* Membership Check */}
                {checkingMembership ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Spinner size="sm" />
                    Checking Discord membership...
                  </div>
                ) : isMember === false ? (
                  <div className="rounded-lg bg-[hsl(var(--warning))/0.1] p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 shrink-0 text-[hsl(var(--warning))]" />
                      <div>
                        <p className="text-sm font-semibold text-[hsl(var(--warning))]">
                          Join Discord First
                        </p>
                        <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                          You must be a member of our Discord server before subscribing.
                        </p>
                        <a
                          href={process.env.NEXT_PUBLIC_DISCORD_INVITE || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs font-semibold text-[hsl(var(--primary))] hover:underline"
                        >
                          Join Discord →
                        </a>
                      </div>
                    </div>
                  </div>
                ) : isMember === true ? (
                  <div className="flex items-center gap-2 text-sm text-[hsl(var(--success))]">
                    <Check className="h-4 w-4" />
                    Discord membership verified
                  </div>
                ) : null}

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg bg-[hsl(var(--destructive))/0.1] p-3">
                    <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  glow
                  onClick={handleCheckout}
                  disabled={checkoutLoading || !isMember || !selectedPlan}
                >
                  {checkoutLoading ? (
                    <>
                      <Spinner size="sm" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Crown className="h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Spinner size="lg" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
