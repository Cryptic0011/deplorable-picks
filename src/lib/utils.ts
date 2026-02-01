import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDiscordAvatarUrl(
  userId: string,
  avatarHash: string | null,
  discriminator?: string
): string {
  if (avatarHash) {
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png`
  }
  // Default Discord avatar
  const index = discriminator ? parseInt(discriminator) % 5 : parseInt(userId) % 5
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
