'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithDiscord: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const initializedRef = useRef(false)
  const codeExchangeAttemptedRef = useRef(false)

  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  }, [supabase])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id)
      setProfile(profileData)
    }
  }, [user, fetchProfile])

  // Handle OAuth code exchange when code appears in URL (fallback for when
  // Supabase redirects to a page other than /auth/callback)
  useEffect(() => {
    const code = searchParams.get('code')

    // Skip if no code, already attempted, or we're on the callback route (handled server-side)
    if (!code || codeExchangeAttemptedRef.current || pathname === '/auth/callback') {
      return
    }

    codeExchangeAttemptedRef.current = true

    const exchangeCodeAndRedirect = async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('Error exchanging code for session:', error)
          // Clean up the URL even on error
          router.replace(pathname)
          return
        }

        // Successfully exchanged code - redirect to dashboard
        // The auth state listener will update the UI
        router.replace('/dashboard')
      } catch (err) {
        console.error('Failed to exchange code:', err)
        router.replace(pathname)
      }
    }

    exchangeCodeAndRedirect()
  }, [searchParams, pathname, supabase, router])

  useEffect(() => {
    // Set up auth state listener FIRST to catch the INITIAL_SESSION event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        // Update state with current session info
        setSession(currentSession)
        setUser(currentSession?.user ?? null)

        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }

        // Handle specific events
        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }

        // When user signs in (e.g., after OAuth callback), refresh the router
        // to ensure Next.js server components are in sync with the new session
        if (event === 'SIGNED_IN' && initializedRef.current) {
          router.refresh()
        }

        // Mark loading as complete after receiving INITIAL_SESSION event
        // This ensures we don't show stale UI before auth state is determined
        if (event === 'INITIAL_SESSION') {
          initializedRef.current = true
          setLoading(false)
        }
      }
    )

    // Fallback: if INITIAL_SESSION doesn't fire within 2 seconds, set loading to false
    // This prevents the UI from being stuck in loading state if something goes wrong
    const timeoutId = setTimeout(() => {
      if (!initializedRef.current) {
        initializedRef.current = true
        setLoading(false)
      }
    }, 2000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [supabase, fetchProfile, router])

  const signInWithDiscord = async () => {
    const redirectUrl = `${window.location.origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: redirectUrl,
        scopes: 'identify email guilds',
      },
    })

    if (error) {
      console.error('Error signing in with Discord:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signInWithDiscord,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
