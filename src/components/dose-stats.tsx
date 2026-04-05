'use client'

import { useMemo } from 'react'
import { format, subDays, isAfter } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  TrendingUp,
  Calendar,
  Clock,
} from 'lucide-react'
import { useDoseStore } from '@/store/dose-store'

// No props needed — reads directly from the Zustand store, which already
// handles localStorage sync + cross-tab updates via storage events.
export function DoseStats() {
  const doses = useDoseStore((s) => s.doses)
  const isLoaded = useDoseStore((s) => s.isLoaded)

  const stats = useMemo(() => {
    if (!doses.length) return null

    const now = new Date()
    const last7Days = doses.filter(d => isAfter(new Date(d.timestamp), subDays(now, 7)))
    const last30Days = doses.filter(d => isAfter(new Date(d.timestamp), subDays(now, 30)))

    // Most used substances
    const substanceCounts: Record<string, number> = {}
    doses.forEach(d => {
      substanceCounts[d.substanceName] = (substanceCounts[d.substanceName] || 0) + 1
    })
    const topSubstances = Object.entries(substanceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    // Most common category
    const categoryCounts: Record<string, number> = {}
    doses.forEach(d => {
      const cats = Array.isArray(d.categories)
        ? d.categories
        : ((d as any).category && (d as any).category !== 'unknown' ? [(d as any).category as string] : [])
      cats.forEach((cat: string) => {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      })
    })
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

    // Days since last dose
    const sortedDoses = [...doses].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const lastDose = sortedDoses[0]
    const daysSinceLast = lastDose
      ? Math.floor((now.getTime() - new Date(lastDose.timestamp).getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Rest days
    const uniqueDaysWithDoses = new Set(
      last30Days.map(d => format(new Date(d.timestamp), 'yyyy-MM-dd'))
    )
    const restDays = 30 - uniqueDaysWithDoses.size

    return {
      total: doses.length,
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      daysSinceLast,
      restDays,
      activeDays: uniqueDaysWithDoses.size,
      topSubstances,
      sortedCategories,
    }
  }, [doses])

  if (!isLoaded || !stats) return null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Logs</CardDescription>
          <CardTitle className="text-3xl">{stats.total}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>{stats.last7Days} in last 7 days</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Rest Days (30d)</CardDescription>
          <CardTitle className="text-3xl">{stats.restDays}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{stats.activeDays} active days</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Since Last Dose</CardDescription>
          <CardTitle className="text-3xl">{stats.daysSinceLast ?? '-'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {stats.daysSinceLast === 0
                ? 'Today'
                : stats.daysSinceLast === 1
                  ? 'Yesterday'
                  : 'days ago'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Last 30 Days</CardDescription>
          <CardTitle className="text-3xl">{stats.last30Days}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>total logs</span>
          </div>
        </CardContent>
      </Card>

      {stats.topSubstances.length > 0 && (
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardDescription>Most Logged</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topSubstances.map(([name, count], i) => (
                <Badge key={name} variant={i === 0 ? 'default' : 'secondary'}>
                  {name} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stats.sortedCategories.length > 0 && (
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardDescription>Categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.sortedCategories.map(([cat, count]) => (
                <Badge key={cat} variant="outline" className="capitalize">
                  {cat} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
