'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Trophy, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { WinningSlip } from '@/types/database'
import Image from 'next/image'

export function WinningSlips() {
  const [slips, setSlips] = useState<WinningSlip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSlips() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('winning_slips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4)

      if (!error && data) {
        setSlips(data)
      }
      setLoading(false)
    }

    fetchSlips()
  }, [])

  if (loading) {
    return (
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="gradient-text">Recent</span>{' '}
              <span className="text-[hsl(var(--foreground))]">Winners</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-48 rounded bg-[hsl(var(--muted))]" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (slips.length === 0) {
    return null
  }

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-[hsl(var(--primary))]" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">Recent</span>{' '}
            <span className="text-[hsl(var(--foreground))]">Winners</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            Real winning slips from our community members.
          </p>
        </div>

        {/* Slips Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {slips.map((slip) => (
            <Card key={slip.id} hover className="overflow-hidden">
              {/* Image */}
              {slip.image_urls && slip.image_urls.length > 0 && (
                <div className="relative aspect-square w-full">
                  <Image
                    src={slip.image_urls[0]}
                    alt="Winning slip"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <CardContent className="pt-4">
                {/* Content */}
                {slip.content && (
                  <p className="mb-4 line-clamp-2 text-sm text-[hsl(var(--muted-foreground))]">
                    {slip.content}
                  </p>
                )}

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={slip.discord_avatar_url}
                      alt={slip.discord_username}
                      fallback={slip.discord_username}
                      size="sm"
                    />
                    <span className="text-sm font-medium">{slip.discord_username}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
