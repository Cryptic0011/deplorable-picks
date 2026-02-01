import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

interface Profile {
  id: string
  stripe_customer_id: string | null
  subscription_status: string | null
}

// Price hierarchy for determining upgrade vs downgrade
const priceHierarchy: Record<string, number> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEK!]: 1,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTH!]: 2,
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_YEAR!]: 3,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id, subscription_status')
      .eq('id', user.id)
      .single()

    const profile = data as Profile | null

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    if (!profile.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    const { newPriceId } = await request.json()

    if (!newPriceId) {
      return NextResponse.json({ error: 'New price ID is required' }, { status: 400 })
    }

    // Get current subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    const subscription = subscriptions.data[0]
    const currentPriceId = subscription.items.data[0].price.id

    if (currentPriceId === newPriceId) {
      return NextResponse.json({ error: 'Already on this plan' }, { status: 400 })
    }

    const currentTier = priceHierarchy[currentPriceId] || 0
    const newTier = priceHierarchy[newPriceId] || 0
    const isUpgrade = newTier > currentTier

    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      // Upgrades: prorate immediately
      // Downgrades: apply at end of billing period
      proration_behavior: isUpgrade ? 'create_prorations' : 'none',
      billing_cycle_anchor: isUpgrade ? 'unchanged' : 'unchanged',
      // For downgrades, schedule the change for the next billing cycle
      ...(isUpgrade ? {} : {
        cancel_at_period_end: false,
      }),
    })

    // If downgrade, we need to schedule it differently
    if (!isUpgrade) {
      // Create a schedule to change at period end
      await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'none',
      })
    }

    return NextResponse.json({
      success: true,
      isUpgrade,
      message: isUpgrade
        ? 'Subscription upgraded! You have been charged the prorated difference.'
        : 'Subscription will be downgraded at the end of your current billing period.',
      subscription: {
        id: updatedSubscription.id,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
      },
    })
  } catch (error) {
    console.error('Update subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}
