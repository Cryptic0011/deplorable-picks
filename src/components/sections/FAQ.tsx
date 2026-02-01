'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'How do I receive the picks?',
    answer:
      'All picks are delivered through our exclusive Discord server. Once you subscribe, you\'ll automatically get access to premium channels where picks are posted in real-time.',
  },
  {
    question: 'What sports do you cover?',
    answer:
      'We cover all major sports including NFL, NBA, MLB, NHL, College Football, College Basketball, Soccer, Tennis, and MMA/UFC. Our experts specialize in different sports to ensure quality coverage.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes, you can cancel your subscription at any time through your dashboard or Stripe customer portal. Your access will remain active until the end of your billing period.',
  },
  {
    question: 'Do I need to join the Discord server first?',
    answer:
      'Yes, you must be a member of our Discord server before purchasing a subscription. This ensures smooth role assignment and immediate access to premium channels.',
  },
  {
    question: 'How quickly will I get access after purchasing?',
    answer:
      'Access is granted automatically within minutes of your payment being processed. Our bot will assign your premium role and you\'ll have immediate access.',
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer:
      'Yes, you can change your plan at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the next billing cycle.',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Frequently Asked</span>{' '}
            <span className="text-[hsl(var(--foreground))]">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            Everything you need to know about Deplorable Picks.
          </p>
        </div>

        {/* FAQ List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]"
            >
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-[hsl(var(--primary))] transition-transform duration-200',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'grid transition-all duration-200',
                  openIndex === index ? 'grid-rows-[1fr] pb-4' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden px-4">
                  <p className="text-[hsl(var(--muted-foreground))]">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-[hsl(var(--muted-foreground))]">
            Still have questions?{' '}
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_INVITE || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[hsl(var(--primary))] hover:underline"
            >
              Join our Discord
            </a>{' '}
            and ask us directly!
          </p>
        </div>
      </div>
    </section>
  )
}
