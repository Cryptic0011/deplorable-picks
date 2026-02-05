'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Star, Quote } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types/database'
import Image from 'next/image'

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (!error && data) {
        setReviews(data)
      }
      setLoading(false)
    }

    fetchReviews()
  }, [])

  // Placeholder reviews if none exist yet
  const placeholderReviews = [
    {
      id: '1',
      discord_user_id: '1',
      discord_username: 'BettingPro',
      discord_avatar_url: null,
      content: "Best picks service I've ever used! Up 30 units this month alone. The analysis is always on point.",
      image_urls: [],
      message_id: null,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      discord_user_id: '2',
      discord_username: 'SportsGambler',
      discord_avatar_url: null,
      content: "The community is amazing. Everyone is helpful and the picks consistently hit. Worth every penny!",
      image_urls: [],
      message_id: null,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      discord_user_id: '3',
      discord_username: 'WinningStreak',
      discord_avatar_url: null,
      content: "Started 2 months ago and already doubled my bankroll. The real-time alerts are a game changer.",
      image_urls: [],
      message_id: null,
      created_at: new Date().toISOString(),
    },
  ]

  const displayReviews = reviews.length > 0 ? reviews : placeholderReviews

  return (
    <section id="reviews" className="py-20 sm:py-32 bg-[hsl(var(--card))]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="gradient-text">What Our Members</span>{' '}
            <span className="text-[hsl(var(--foreground))]">Are Saying</span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--muted-foreground))]">
            Real reviews from real winners in our community.
          </p>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="pt-6">
                  <div className="h-24 rounded bg-[hsl(var(--muted))]" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayReviews.map((review) => (
              <Card key={review.id} hover className="relative overflow-hidden">
                {/* Images */}
                {review.image_urls && review.image_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-1">
                    {review.image_urls.slice(0, 4).map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Review image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {index === 3 && review.image_urls.length > 4 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <span className="text-lg font-bold text-white">+{review.image_urls.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <CardContent className="pt-6">
                  {/* Quote Icon */}
                  <Quote className="absolute right-4 top-4 h-8 w-8 text-[hsl(var(--primary))/0.2]" />

                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" />
                    ))}
                  </div>

                  {/* Content */}
                  {review.content && (
                    <p className="mb-6 text-[hsl(var(--muted-foreground))]">
                      &ldquo;{review.content}&rdquo;
                    </p>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={review.discord_avatar_url}
                      alt={review.discord_username}
                      fallback={review.discord_username}
                      size="sm"
                    />
                    <div>
                      <p className="font-semibold">{review.discord_username}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">Verified Member</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
