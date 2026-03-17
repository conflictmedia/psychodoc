'use client'

import { useState, useEffect } from 'react'
import { format, subDays, startOfDay, isAfter } from 'date-fns'
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
  Loader2
} from 'lucide-react'

interface DoseLog {
  id: string
  substanceId: string
  substanceName: string
  category: string
  amount: number
  unit: string
  route: string
  timestamp: string
  intensity: number | null
}

interface DoseStatsProps {
  refreshTrigger?: number
}

const STORAGE_KEY = 'psychodoc-dose-logs'

export function DoseStats({ refreshTrigger }: DoseStatsProps) {
  const [doses, setDoses] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDoses = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const logs = stored ? JSON.parse(stored) : []
        setDoses(logs)
      } catch (error) {
        console.error('Error loading dose logs:', error)
        setDoses([])
      } finally {
        setLoading(false)
      }
    }
    loadDoses()
  }, [refreshTrigger])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (doses.length === 0) {
    return null
  }

  // Calculate statistics
  const now = new Date()
  const last7Days = doses.filter(d => isAfter(new Date(d.timestamp), subDays(now, 7)))
  const last30Days = doses.filter(d => isAfter(new Date(d.timestamp), subDays(now, 30)))
  
  // Most used substances
  const substanceCounts: { [key: string]: number } = {}
  doses.forEach(d => {
    substanceCounts[d.substanceName] = (substanceCounts[d.substanceName] || 0) + 1
  })
  const topSubstances = Object.entries(substanceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  // Shelved: Average intensity calculation
  // const dosesWithIntensity = doses.filter(d => d.intensity !== null)
  // const avgIntensity = dosesWithIntensity.length > 0
  //   ? (dosesWithIntensity.reduce((acc, d) => acc + (d.intensity || 0), 0) / dosesWithIntensity.length).toFixed(1)
  //   : null

  // Most common category
  const categoryCounts: { [key: string]: number } = {}
  doses.forEach(d => {
    if (d.category && d.category !== 'unknown') {
      categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1
    }
  })
  const topCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]

  // Days since last dose
  const lastDose = doses[0]
  const daysSinceLast = lastDose
    ? Math.floor((now.getTime() - new Date(lastDose.timestamp).getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Rest days (days without any dose in last 30)
  const uniqueDaysWithDoses = new Set(
    last30Days.map(d => format(new Date(d.timestamp), 'yyyy-MM-dd'))
  )
  const restDays = 30 - uniqueDaysWithDoses.size

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Doses */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Logs</CardDescription>
          <CardTitle className="text-3xl">{doses.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span>{last7Days.length} in last 7 days</span>
          </div>
        </CardContent>
      </Card>

      {/* Rest Days */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Rest Days (30d)</CardDescription>
          <CardTitle className="text-3xl">{restDays}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{uniqueDaysWithDoses.size} active days</span>
          </div>
        </CardContent>
      </Card>

      {/* Days Since Last */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Since Last Dose</CardDescription>
          <CardTitle className="text-3xl">{daysSinceLast ?? '-'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{daysSinceLast === 0 ? 'Today' : daysSinceLast === 1 ? 'Yesterday' : 'days ago'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Last 30 Days */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Last 30 Days</CardDescription>
          <CardTitle className="text-3xl">{last30Days.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>total logs</span>
          </div>
        </CardContent>
      </Card>

      {/* Shelved: Average Intensity card
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Avg Intensity</CardDescription>
          <CardTitle className="text-3xl">{avgIntensity ?? '-'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>out of 10</span>
          </div>
        </CardContent>
      </Card>
      */}

      {/* Top Substances */}
      {topSubstances.length > 0 && (
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardDescription>Most Logged</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topSubstances.map(([name, count], i) => (
                <Badge key={name} variant={i === 0 ? 'default' : 'secondary'}>
                  {name} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Category */}
      {topCategory && (
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardDescription>Top Category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {topCategory[0]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({topCategory[1]} logs)
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
