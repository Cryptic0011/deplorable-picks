import { Card, CardContent } from '@/components/ui/Card'
import { LogIn, CreditCard, Zap } from 'lucide-react'

const steps = [
  {
    icon: LogIn,
    step: '1',
    title: 'Sign in with Discord',
    description: 'Connect your Discord account to get started. Make sure you\'ve joined our Discord server first.',
  },
  {
    icon: CreditCard,
    step: '2',
    title: 'Choose Your Plan',
    description: 'Select the subscription that works best for you. Weekly, monthly, yearly, or lifetime access.',
  },
  {
    icon: Zap,
    step: '3',
    title: 'Instant Access',
    description: 'Your premium Discord role is granted automatically. Get immediate access to all picks and channels.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">How It</span>{' '}
            <span className="text-[hsl(var(--foreground))]">Works</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            Get started in minutes with our simple 3-step process.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.title} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))/0.3] md:block" />
              )}

              <Card hover className="relative z-10 text-center">
                <CardContent className="pt-8 pb-8">
                  {/* Step Number */}
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[hsl(var(--primary))] bg-[hsl(var(--background))]">
                    <div className="flex flex-col items-center">
                      <item.icon className="h-8 w-8 text-[hsl(var(--primary))]" />
                      <span className="mt-1 text-xs font-bold text-[hsl(var(--primary))]">STEP {item.step}</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="text-[hsl(var(--muted-foreground))]">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            No manual setup required. Everything syncs automatically with your Discord account.
          </p>
        </div>
      </div>
    </section>
  )
}
