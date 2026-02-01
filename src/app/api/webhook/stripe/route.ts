import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createServerClient } from '@supabase/ssr'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

function getSupabaseAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}

async function notifyBot(
  discordId: string,
  subscriptionStatus: string,
  actionContext: string,
  username?: string,
  stripeCustomerId?: string,
  oldStatus?: string
) {
  const botApiUrl = process.env.BOT_API_URL
  const sharedSecret = process.env.EDGE_SHARED_SECRET

  if (!botApiUrl || !sharedSecret) {
    console.warn('Bot API not configured, skipping notification')
    return
  }

  try {
    await fetch(`${botApiUrl}/api/role-sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discord_id: discordId,
        subscription_status: subscriptionStatus,
        action_context: actionContext,
        old_status: oldStatus,
        username,
        stripe_customer_id: stripeCustomerId,
        secret: sharedSecret,
      }),
    })
  } catch (error) {
    console.error('Failed to notify bot:', error)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.supabase_user_id
        const discordId = session.metadata?.discord_id
        const username = session.metadata?.username

        if (!userId) {
          console.error('No user ID in session metadata')
          break
        }

        let subscriptionId: string | null = null
        let planId: string | null = null

        if (session.mode === 'subscription' && session.subscription) {
          subscriptionId = session.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          planId = subscription.items.data[0]?.price.id || null
        } else if (session.mode === 'payment') {
          planId = 'lifetime'
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase as any)
          .from('profiles')
          .update({
            subscription_status: 'active',
            stripe_subscription_id: subscriptionId,
            plan_id: planId,
            stripe_customer_id: session.customer as string,
          })
          .eq('id', userId)

        if (updateError) {
          console.error('Error updating profile:', updateError)
        }

        if (discordId) {
          await notifyBot(
            discordId,
            'active',
            'checkout_completed',
            username || undefined,
            session.customer as string
          )
        }

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        const customerId = subscription.customer as string
        const status = subscription.status

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('id, discord_id, username, subscription_status')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        const newStatus = status === 'active' ? 'active' : 'canceled'
        const oldStatus = profile.subscription_status

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('profiles')
          .update({
            subscription_status: newStatus,
            plan_id: subscription.items.data[0]?.price.id || null,
          })
          .eq('id', profile.id)

        if (profile.discord_id && oldStatus !== newStatus) {
          await notifyBot(
            profile.discord_id,
            newStatus,
            'subscription_updated',
            profile.username || undefined,
            customerId,
            oldStatus || undefined
          )
        }

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const customerId = subscription.customer as string

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('id, discord_id, username, subscription_status')
          .eq('stripe_customer_id', customerId)
          .single()

        if (!profile) {
          console.error('No profile found for customer:', customerId)
          break
        }

        const oldStatus = profile.subscription_status

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            stripe_subscription_id: null,
          })
          .eq('id', profile.id)

        if (profile.discord_id) {
          await notifyBot(
            profile.discord_id,
            'canceled',
            'subscription_deleted',
            profile.username || undefined,
            customerId,
            oldStatus || undefined
          )
        }

        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        const customerId = invoice.customer as string

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('id, discord_id, username')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile?.discord_id) {
          console.log('Payment failed for user:', profile.id)
        }

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
