import { Card, CardContent } from '@/components/ui/Card'
import {
  Trophy,
  Bell,
  BarChart3,
  Users,
  MessageSquare,
  Shield,
  Zap,
  Clock,
} from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: 'Expert Picks',
    description: 'Get winning picks from experienced handicappers with proven track records.',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    description: 'Receive instant notifications on Discord when new picks drop.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Analysis',
    description: 'Every pick comes with in-depth reasoning and statistical backing.',
  },
  {
    icon: Users,
    title: 'Active Community',
    description: 'Join a thriving community of sports bettors sharing insights.',
  },
  {
    icon: MessageSquare,
    title: 'Discord Access',
    description: 'Exclusive Discord server with premium channels and support.',
  },
  {
    icon: Shield,
    title: 'Verified Results',
    description: 'Transparent tracking of all picks with documented results.',
  },
  {
    icon: Zap,
    title: 'Multiple Sports',
    description: 'Coverage across NFL, NBA, MLB, NHL, MMA, and more.',
  },
  {
    icon: Clock,
    title: '24/7 Access',
    description: 'Access picks and analysis anytime, anywhere.',
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Why Choose</span>{' '}
            <span className="text-[hsl(var(--foreground))]">Deplorable Picks?</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            We provide everything you need to elevate your sports betting game.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} hover className="group">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--primary))/0.2] transition-colors group-hover:bg-[hsl(var(--primary))]">
                  <feature.icon className="h-6 w-6 text-[hsl(var(--primary))] transition-colors group-hover:text-[hsl(var(--primary-foreground))]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
