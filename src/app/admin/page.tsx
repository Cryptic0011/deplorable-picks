'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Spinner } from '@/components/ui/Spinner'
import { Input } from '@/components/ui/Input'
import {
  Users,
  Crown,
  Search,
  RefreshCw,
  Shield,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import type { Profile } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function AdminPage() {
  const { profile, loading } = useAuth()
  const [users, setUsers] = useState<Profile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    canceled: 0,
    pending: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        const profiles = data as Profile[]
        setUsers(profiles)
        setFilteredUsers(profiles)

        // Calculate stats
        setStats({
          total: profiles.length,
          active: profiles.filter((u) => u.subscription_status === 'active').length,
          canceled: profiles.filter((u) => u.subscription_status === 'canceled').length,
          pending: profiles.filter((u) => u.subscription_status === 'pending').length,
        })
      }

      setLoadingUsers(false)
    }

    fetchUsers()
  }, [supabase])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (u) =>
            u.username?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query) ||
            u.discord_id?.includes(query)
        )
      )
    }
  }, [searchQuery, users])

  const handleRefresh = async () => {
    setLoadingUsers(true)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const profiles = data as Profile[]
      setUsers(profiles)
      setFilteredUsers(profiles)
      setStats({
        total: profiles.length,
        active: profiles.filter((u) => u.subscription_status === 'active').length,
        canceled: profiles.filter((u) => u.subscription_status === 'canceled').length,
        pending: profiles.filter((u) => u.subscription_status === 'pending').length,
      })
    }

    setLoadingUsers(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Spinner size="lg" />
      </div>
    )
  }

  // Admin check is handled by middleware, but double-check here
  const adminIds = process.env.NEXT_PUBLIC_ADMIN_DISCORD_IDS?.split(',') || []
  const isAdmin = profile?.discord_id && adminIds.includes(profile.discord_id)

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[hsl(var(--destructive))]">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <Shield className="h-8 w-8 text-[hsl(var(--primary))]" />
              Admin Panel
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Manage users and view statistics
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={loadingUsers} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loadingUsers ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))/0.2]">
                <Users className="h-6 w-6 text-[hsl(var(--primary))]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-[hsl(var(--success))]">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--success))/0.2]">
                <Crown className="h-6 w-6 text-[hsl(var(--success))]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[hsl(var(--success))]">{stats.active}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Active Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--warning))/0.2]">
                <TrendingUp className="h-6 w-6 text-[hsl(var(--warning))]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--destructive))/0.2]">
                <DollarSign className="h-6 w-6 text-[hsl(var(--destructive))]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.canceled}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Canceled</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
            <Input
              placeholder="Search by username, email, or Discord ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>All registered users and their subscription status</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-[hsl(var(--muted-foreground))]">
                No users found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))]">
                      <th className="pb-4 text-left text-sm font-semibold">User</th>
                      <th className="pb-4 text-left text-sm font-semibold">Discord ID</th>
                      <th className="pb-4 text-left text-sm font-semibold">Status</th>
                      <th className="pb-4 text-left text-sm font-semibold">Role</th>
                      <th className="pb-4 text-left text-sm font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[hsl(var(--border))] last:border-0"
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={user.avatar_url}
                              alt={user.username || 'User'}
                              fallback={user.username || 'U'}
                              size="sm"
                            />
                            <div>
                              <p className="font-medium">{user.username || 'Unknown'}</p>
                              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {user.email || 'No email'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <code className="text-xs">{user.discord_id || 'N/A'}</code>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              user.subscription_status === 'active'
                                ? 'success'
                                : user.subscription_status === 'pending'
                                ? 'warning'
                                : user.subscription_status === 'canceled'
                                ? 'destructive'
                                : 'secondary'
                            }
                          >
                            {user.subscription_status || 'None'}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge variant={user.role_granted ? 'success' : 'outline'}>
                            {user.role_granted ? 'Granted' : 'Not Granted'}
                          </Badge>
                        </td>
                        <td className="py-4 text-sm text-[hsl(var(--muted-foreground))]">
                          {formatDate(user.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
