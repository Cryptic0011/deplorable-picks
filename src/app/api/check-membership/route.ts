import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { discord_id } = await request.json()

    if (!discord_id) {
      return NextResponse.json({ error: 'Discord ID is required' }, { status: 400 })
    }

    const botApiUrl = process.env.BOT_API_URL
    const sharedSecret = process.env.EDGE_SHARED_SECRET

    if (!botApiUrl || !sharedSecret) {
      // If bot API is not configured, assume member (for development)
      console.warn('Bot API not configured, assuming member')
      return NextResponse.json({ isMember: true })
    }

    // Call the bot API to check membership
    const response = await fetch(`${botApiUrl}/api/check-membership`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        discord_id,
        secret: sharedSecret,
      }),
    })

    if (!response.ok) {
      console.error('Bot API error:', response.status, response.statusText)
      // If bot API fails, assume member (graceful degradation)
      return NextResponse.json({ isMember: true })
    }

    const data = await response.json()

    return NextResponse.json({ isMember: data.isMember ?? false })
  } catch (error) {
    console.error('Membership check error:', error)
    // Graceful degradation - assume member if check fails
    return NextResponse.json({ isMember: true })
  }
}
