'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import {
  Crown,
  CreditCard,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshProfile()
    setRefreshing(false)
  }

  const handleManageSubscription = async () => {
    if (!profile?.stripe_customer_id) return

    setPortalLoading(true)
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    }
    setPortalLoading(false)
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
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>Please sign in to view your dashboard.</CardDescription>
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

  const isActive = profile.subscription_status === 'active'
  const isPending = profile.subscription_status === 'pending'
  const isCanceled = profile.subscription_status === 'canceled'

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Manage your account and subscription
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar
                  src={profile.avatar_url}
                  alt={profile.username || 'User'}
                  fallback={profile.username || 'U'}
                  size="lg"
                />
                <div>
                  <span>{profile.username}</span>
                  {isActive && (
                    <Badge variant="success" className="ml-2">
                      <Crown className="mr-1 h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                </div>
              </CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-[hsl(var(--muted-foreground))]">Discord ID</dt>
                  <dd className="font-mono text-sm">{profile.discord_id}</dd>
                </div>
                <div>
                  <dt className="text-sm text-[hsl(var(--muted-foreground))]">Member Since</dt>
                  <dd className="text-sm">{formatDate(profile.created_at)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className={isActive ? 'border-[hsl(var(--primary))] glow-primary-sm' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[hsl(var(--primary))]" />
                Subscription
              </CardTitle>
              <CardDescription>
                {isActive
                  ? 'Your premium membership is active'
                  : isPending
                  ? 'Payment processing...'
                  : isCanceled
                  ? 'Your subscription has ended'
                  : 'No active subscription'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">Status</span>
                  <Badge
                    variant={
                      isActive
                        ? 'success'
                        : isPending
                        ? 'warning'
                        : isCanceled
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {profile.subscription_status || 'None'}
                  </Badge>
                </div>

                {/* Plan ID */}
                {profile.plan_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[hsl(var(--muted-foreground))]">Plan</span>
                    <span className="text-sm font-medium">
                      {profile.plan_id.includes('week')
                        ? 'Weekly'
                        : profile.plan_id.includes('month')
                        ? 'Monthly'
                        : profile.plan_id.includes('year')
                        ? 'Yearly'
                        : profile.plan_id.includes('lifetime')
                        ? 'Lifetime'
                        : 'Premium'}
                    </span>
                  </div>
                )}

                {/* Role Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[hsl(var(--muted-foreground))]">
                    Discord Role
                  </span>
                  <Badge variant={profile.role_granted ? 'success' : 'secondary'}>
                    {profile.role_granted ? 'Granted' : 'Not Granted'}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                  {isActive && profile.stripe_customer_id && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={handleManageSubscription}
                      disabled={portalLoading}
                    >
                      {portalLoading ? (
                        <Spinner size="sm" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      Manage Subscription
                    </Button>
                  )}

                  {!isActive && (
                    <Link href="/checkout" className="block">
                      <Button className="w-full gap-2" glow>
                        <Crown className="h-4 w-4" />
                        Get Premium
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        {!isActive && (
          <Card className="mt-6 border-[hsl(var(--warning))] bg-[hsl(var(--warning))/0.1]">
            <CardContent className="flex items-start gap-4 pt-6">
              <AlertCircle className="h-5 w-5 shrink-0 text-[hsl(var(--warning))]" />
              <div>
                <h4 className="font-semibold text-[hsl(var(--warning))]">
                  Unlock Premium Features
                </h4>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  Subscribe to get access to all premium picks, exclusive Discord channels,
                  real-time alerts, and more!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discord Link */}
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865F2]">
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold">Join Our Discord</h4>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Connect with the community
                </p>
              </div>
            </div>
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Open Discord
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
