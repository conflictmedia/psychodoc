'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { format, addMinutes, addHours } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Timer,
  Clock,
  Loader2,
  Zap,
  TrendingUp,
  Mountain,
  TrendingDown,
  Sunrise,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { categoryColors } from '@/lib/categories'

interface Duration {
  onset: string
  comeup: string
  peak: string
  offset: string
  total: string
}

interface DoseLog {
  id: string
  substanceId: string
  substanceName: string
  categories: string[]
  amount: number
  unit: string
  route: string
  timestamp: string
  duration: Duration | null
  notes: string | null
  mood: string | null
  setting: string | null
  intensity: number | null
  createdAt: string
}

interface ActiveDosesTimelineProps {
  refreshTrigger?: number
}

const STORAGE_KEY = 'drugucopia-dose-logs'
const DOSE_CHANGE_EVENT = 'drugucopia-dose-change'

export function notifyDoseChange() {
  window.dispatchEvent(new CustomEvent(DOSE_CHANGE_EVENT))
}

function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 0
  const lower = durationStr.toLowerCase()
  const rangeMatch = lower.match(/(\d+)-(\d+)\s*(minutes?|hours?|min|h)/)
  if (rangeMatch) {
    const avg = (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2
    return rangeMatch[3].startsWith('h') ? avg * 60 : avg
  }
  const singleMatch = lower.match(/(\d+)\s*(minutes?|hours?|min|h)/)
  if (singleMatch) {
    const value = parseInt(singleMatch[1])
    return singleMatch[2].startsWith('h') ? value * 60 : value
  }
  return 0
}

interface PhaseTimings {
  onsetStart: number
  onsetEnd: number
  comeupEnd: number
  peakEnd: number
  offsetEnd: number
  totalDuration: number
}

function calculatePhaseTimings(duration: Duration): PhaseTimings {
  const onsetMins = parseDurationToMinutes(duration.onset)
  const comeupMins = parseDurationToMinutes(duration.comeup)
  const peakMins = parseDurationToMinutes(duration.peak)
  const offsetMins = parseDurationToMinutes(duration.offset)
  const onsetEnd = onsetMins
  const comeupEnd = onsetEnd + comeupMins
  const peakEnd = comeupEnd + peakMins
  const offsetEnd = peakEnd + offsetMins
  return { onsetStart: 0, onsetEnd, comeupEnd, peakEnd, offsetEnd, totalDuration: offsetEnd }
}

interface PhaseStatus {
  phase: 'not_started' | 'onset' | 'comeup' | 'peak' | 'offset' | 'ended'
  progress: number
  overallProgress: number
  timeInPhase: number
  timeRemaining: number
  totalRemaining: number
}

function getPhaseStatus(doseTime: Date, timings: PhaseTimings): PhaseStatus {
  const now = new Date()
  const elapsedMinutes = (now.getTime() - doseTime.getTime()) / (1000 * 60)

  if (elapsedMinutes < 0) {
    return { phase: 'not_started', progress: 0, overallProgress: 0, timeInPhase: 0, timeRemaining: Math.abs(elapsedMinutes), totalRemaining: timings.totalDuration }
  }
  if (elapsedMinutes >= timings.offsetEnd) {
    return { phase: 'ended', progress: 100, overallProgress: 100, timeInPhase: 0, timeRemaining: 0, totalRemaining: 0 }
  }

  const overall = (elapsedMinutes / timings.totalDuration) * 100

  if (elapsedMinutes >= timings.peakEnd) {
    const dur = timings.offsetEnd - timings.peakEnd
    const elapsed = elapsedMinutes - timings.peakEnd
    return { phase: 'offset', progress: Math.min(100, (elapsed / dur) * 100), overallProgress: overall, timeInPhase: elapsed, timeRemaining: dur - elapsed, totalRemaining: timings.offsetEnd - elapsedMinutes }
  }
  if (elapsedMinutes >= timings.comeupEnd) {
    const dur = timings.peakEnd - timings.comeupEnd
    const elapsed = elapsedMinutes - timings.comeupEnd
    return { phase: 'peak', progress: Math.min(100, (elapsed / dur) * 100), overallProgress: overall, timeInPhase: elapsed, timeRemaining: dur - elapsed, totalRemaining: timings.offsetEnd - elapsedMinutes }
  }
  if (elapsedMinutes >= timings.onsetEnd) {
    const dur = timings.comeupEnd - timings.onsetEnd
    const elapsed = elapsedMinutes - timings.onsetEnd
    return { phase: 'comeup', progress: Math.min(100, (elapsed / dur) * 100), overallProgress: overall, timeInPhase: elapsed, timeRemaining: dur - elapsed, totalRemaining: timings.offsetEnd - elapsedMinutes }
  }

  const dur = timings.onsetEnd > 0 ? timings.onsetEnd : 1
  return { phase: 'onset', progress: Math.min(100, (elapsedMinutes / dur) * 100), overallProgress: overall, timeInPhase: elapsedMinutes, timeRemaining: dur - elapsedMinutes, totalRemaining: timings.offsetEnd - elapsedMinutes }
}

function formatMinutes(minutes: number): string {
  if (minutes < 0) return '0m'
  if (minutes < 60) return `${Math.round(minutes)}m`
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

const phaseColors = {
  not_started: { bg: 'bg-slate-500', text: 'text-slate-400', fill: 'bg-slate-500/20', border: 'border-slate-500/30', gradient: 'from-slate-500/30 to-slate-500/10', bar: 'bg-slate-400' },
  onset: { bg: 'bg-blue-500', text: 'text-blue-400', fill: 'bg-blue-500/20', border: 'border-blue-500/30', gradient: 'from-blue-500/30 to-blue-500/5', bar: 'bg-blue-500' },
  comeup: { bg: 'bg-amber-500', text: 'text-amber-400', fill: 'bg-amber-500/20', border: 'border-amber-500/30', gradient: 'from-amber-500/30 to-amber-500/5', bar: 'bg-amber-500' },
  peak: { bg: 'bg-purple-500', text: 'text-purple-400', fill: 'bg-purple-500/20', border: 'border-purple-500/30', gradient: 'from-purple-500/30 to-purple-500/5', bar: 'bg-purple-500' },
  offset: { bg: 'bg-cyan-500', text: 'text-cyan-400', fill: 'bg-cyan-500/20', border: 'border-cyan-500/30', gradient: 'from-cyan-500/30 to-cyan-500/5', bar: 'bg-cyan-500' },
  ended: { bg: 'bg-gray-500', text: 'text-gray-400', fill: 'bg-gray-500/20', border: 'border-gray-500/30', gradient: 'from-gray-500/30 to-gray-500/5', bar: 'bg-gray-400' },
}

const phaseIcons = {
  not_started: Sunrise,
  onset: Zap,
  comeup: TrendingUp,
  peak: Mountain,
  offset: TrendingDown,
  ended: Clock,
}

const phaseDescriptions = {
  not_started: 'Effects have not yet begun',
  onset: 'Initial effects are beginning to be felt',
  comeup: 'Effects are rapidly increasing in intensity',
  peak: 'Maximum effects are being experienced',
  offset: 'Effects are gradually declining',
  ended: 'The primary experience has ended',
}

// ─── SVG graph constants ──────────────────────────────────────────────────────
const SVG_WIDTH = 800
const SVG_HEIGHT = 160
const PADDING_LEFT = 40
const PADDING_RIGHT = 20
const PADDING_TOP = 25
const PADDING_BOTTOM = 25
const GRAPH_WIDTH = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT
const GRAPH_HEIGHT = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM

interface TooltipData {
  phase: string
  phaseTime: string
  absoluteTime: Date
  intensity: number
  progress: number
}

// ─── MOBILE PROGRESS BAR COMPONENT ───────────────────────────────────────────

function MobilePhaseBar({
  dose,
}: {
  dose: {
    id: string
    substanceName: string
    categories: string[]
    amount: number
    unit: string
    route: string
    doseTime: Date
    status: PhaseStatus
    timings: PhaseTimings
    duration: Duration | null
  }
}) {
  const colors = phaseColors[dose.status.phase]
  const PhaseIcon = phaseIcons[dose.status.phase]

  const phases = [
    { key: 'onset', label: 'Onset', end: dose.timings.onsetEnd },
    { key: 'comeup', label: 'Comeup', end: dose.timings.comeupEnd },
    { key: 'peak', label: 'Peak', end: dose.timings.peakEnd },
    { key: 'offset', label: 'Offset', end: dose.timings.offsetEnd },
  ] as const

  const phaseBarColors = {
    onset: 'bg-blue-500',
    comeup: 'bg-amber-500',
    peak: 'bg-purple-500',
    offset: 'bg-cyan-500',
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-base">{dose.substanceName}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {dose.amount} {dose.unit} · {dose.route} · {format(dose.doseTime, 'h:mm a')}
          </div>
        </div>
        <Badge className={`${colors.bg} text-white text-xs shrink-0`}>
          <PhaseIcon className="h-3 w-3 mr-1" />
          {dose.status.phase === 'not_started' ? 'Upcoming' : dose.status.phase.charAt(0).toUpperCase() + dose.status.phase.slice(1)}
        </Badge>
      </div>

      {/* Segmented progress bar */}
      {dose.status.phase !== 'ended' && (
        <>
          <div className="space-y-1.5">
            {/* Phase labels */}
            <div className="flex text-[10px] text-muted-foreground justify-between">
              {phases.map((p) => (
                <span
                  key={p.key}
                  className={
                    dose.status.phase === p.key
                      ? 'text-foreground font-medium'
                      : ''
                  }
                >
                  {p.label}
                </span>
              ))}
            </div>

            {/* Segmented track */}
            <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
              {phases.map((p, i) => {
                const prevEnd = i === 0 ? 0 : phases[i - 1].end
                const phaseDuration = p.end - prevEnd
                const widthPct = (phaseDuration / dose.timings.totalDuration) * 100
                const isActive = dose.status.phase === p.key
                const isPast =
                  (p.key === 'onset' && ['comeup', 'peak', 'offset'].includes(dose.status.phase)) ||
                  (p.key === 'comeup' && ['peak', 'offset'].includes(dose.status.phase)) ||
                  (p.key === 'peak' && dose.status.phase === 'offset')

                return (
                  <div
                    key={p.key}
                    className="rounded-sm overflow-hidden relative"
                    style={{ width: `${widthPct}%`, minWidth: '4px' }}
                  >
                    <div className="absolute inset-0 bg-muted" />
                    {isPast && (
                      <div className={`absolute inset-0 ${phaseBarColors[p.key]}`} />
                    )}
                    {isActive && (
                      <div
                        className={`absolute inset-y-0 left-0 ${phaseBarColors[p.key]}`}
                        style={{ width: `${dose.status.progress}%` }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs">
            <span className={`${colors.text} font-medium flex items-center gap-1`}>
              <Timer className="h-3 w-3" />
              {formatMinutes(dose.status.totalRemaining)} remaining
            </span>
            {dose.status.phase !== 'not_started' && (
              <span className="text-muted-foreground">
                Phase ends in {formatMinutes(dose.status.timeRemaining)}
              </span>
            )}
          </div>
        </>
      )}

      {dose.status.phase === 'ended' && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Experience concluded · Total {dose.duration?.total}
        </p>
      )}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function ActiveDosesTimeline({ refreshTrigger }: ActiveDosesTimelineProps) {
  const [doses, setDoses] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTick] = useState(0)
  const [tooltip, setTooltip] = useState<{ [key: string]: TooltipData }>({})
  const [expandedDose, setExpandedDose] = useState<string | null>(null)
  const [showGraphFor, setShowGraphFor] = useState<Set<string>>(new Set())

  const lastKnownDataRef = useRef<string>('')

  const readAndUpdateDoses = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || '[]'
      if (stored === lastKnownDataRef.current) return
      lastKnownDataRef.current = stored
      const logs: DoseLog[] = JSON.parse(stored)
      setDoses(logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()))
    } catch {
      setDoses([])
    }
  }, [])

  useEffect(() => { readAndUpdateDoses(); setLoading(false) }, [readAndUpdateDoses])
  useEffect(() => { readAndUpdateDoses() }, [refreshTrigger, readAndUpdateDoses])

  useEffect(() => {
    const handler = () => readAndUpdateDoses()
    window.addEventListener(DOSE_CHANGE_EVENT, handler)
    return () => window.removeEventListener(DOSE_CHANGE_EVENT, handler)
  }, [readAndUpdateDoses])

  useEffect(() => {
    const handler = (e: StorageEvent) => { if (e.key === STORAGE_KEY) readAndUpdateDoses() }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [readAndUpdateDoses])

  useEffect(() => {
    const interval = setInterval(() => readAndUpdateDoses(), 2000)
    return () => clearInterval(interval)
  }, [readAndUpdateDoses])

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000)
    return () => clearInterval(interval)
  }, [])

  const activeDoses = useMemo(() => {
    return doses
      .filter((dose) => dose.duration)
      .map((dose) => {
        const timings = calculatePhaseTimings(dose.duration!)
        const doseTime = new Date(dose.timestamp)
        const status = getPhaseStatus(doseTime, timings)
        return { ...dose, timings, status, doseTime }
      })
      .filter((dose) => {
        if (dose.status.phase !== 'ended') return true
        const elapsed = (new Date().getTime() - dose.doseTime.getTime()) / (1000 * 60)
        return elapsed - dose.timings.totalDuration < 12 * 60
      })
  }, [doses])

  const getCategoryColor = (category: string) =>
    categoryColors[category as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'

  const getDoseCategories = (dose: DoseLog): string[] => {
    if (Array.isArray(dose.categories)) return dose.categories
    const legacy = (dose as any).category as string | undefined
    if (legacy && legacy !== 'unknown') return [legacy]
    return []
  }

  // ── SVG graph helpers (desktop) ──────────────────────────────────────────

  const getIntensityAtProgress = (progress: number, timings: PhaseTimings): number => {
    const minutes = (progress / 100) * timings.totalDuration
    if (minutes <= timings.onsetEnd) {
      if (timings.onsetEnd === 0) return 5
      return 5 + 10 * (1 - Math.cos((minutes / timings.onsetEnd) * Math.PI / 2))
    } else if (minutes <= timings.comeupEnd) {
      const t = (minutes - timings.onsetEnd) / (timings.comeupEnd - timings.onsetEnd || 1)
      return 15 + 77 * (1 - Math.cos(t * Math.PI / 2))
    } else if (minutes <= timings.peakEnd) {
      const t = (minutes - timings.comeupEnd) / (timings.peakEnd - timings.comeupEnd || 1)
      return 92 + 8 * Math.sin(t * Math.PI) * 0.5 + 4
    } else {
      const t = (minutes - timings.peakEnd) / (timings.offsetEnd - timings.peakEnd || 1)
      return 92 * Math.pow(1 - t, 1.5)
    }
  }

  const getPhaseAtProgress = (progress: number, timings: PhaseTimings): string => {
    const minutes = (progress / 100) * timings.totalDuration
    if (minutes <= timings.onsetEnd) return 'Onset'
    if (minutes <= timings.comeupEnd) return 'Comeup'
    if (minutes <= timings.peakEnd) return 'Peak'
    return 'Offset'
  }

  const progressToX = (progress: number) => PADDING_LEFT + (progress / 100) * GRAPH_WIDTH
  const intensityToY = (intensity: number) => PADDING_TOP + GRAPH_HEIGHT - (intensity / 100) * GRAPH_HEIGHT

  const generateCurvePath = (timings: PhaseTimings): string => {
    const points = Array.from({ length: 101 }, (_, i) => ({
      x: progressToX((i / 100) * 100),
      y: intensityToY(getIntensityAtProgress((i / 100) * 100, timings)),
    }))
    let path = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`
    for (let i = 1; i < points.length; i++) {
      const curr = points[i]
      const next = points[i + 1]
      if (next) {
        path += ` Q ${curr.x.toFixed(2)},${curr.y.toFixed(2)} ${((curr.x + next.x) / 2).toFixed(2)},${((curr.y + next.y) / 2).toFixed(2)}`
      } else {
        path += ` L ${curr.x.toFixed(2)},${curr.y.toFixed(2)}`
      }
    }
    return path
  }

  const generateAreaPath = (timings: PhaseTimings): string => {
    const curve = generateCurvePath(timings)
    return `${curve} L ${progressToX(100).toFixed(2)},${(PADDING_TOP + GRAPH_HEIGHT).toFixed(2)} L ${progressToX(0).toFixed(2)},${(PADDING_TOP + GRAPH_HEIGHT).toFixed(2)} Z`
  }

  const rafRef = useRef<number | null>(null)

  const handleGraphMouseMove = useCallback(
    (doseId: string, e: React.MouseEvent<SVGSVGElement>, timings: PhaseTimings, doseTime: Date) => {
      if (rafRef.current !== null) return
      const clientX = e.clientX
      const rect = e.currentTarget.getBoundingClientRect()
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const svgX = ((clientX - rect.left) / rect.width) * SVG_WIDTH
        const progress = Math.max(0, Math.min(100, ((svgX - PADDING_LEFT) / GRAPH_WIDTH) * 100))
        const minutesFromDose = (progress / 100) * timings.totalDuration
        setTooltip((prev) => ({
          ...prev,
          [doseId]: {
            phase: getPhaseAtProgress(progress, timings),
            phaseTime: formatMinutes(minutesFromDose),
            absoluteTime: addMinutes(doseTime, minutesFromDose),
            intensity: getIntensityAtProgress(progress, timings),
            progress,
          },
        }))
      })
    },
    []
  )

  const handleGraphMouseLeave = useCallback((doseId: string) => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
    setTooltip((prev) => { const n = { ...prev }; delete n[doseId]; return n })
  }, [])

  const generateTimeMarkers = (timings: PhaseTimings, doseTime: Date) => {
    const totalHours = timings.totalDuration / 60
    const interval = totalHours > 8 ? 2 : 1
    const markers = []
    for (let h = 0; h <= totalHours; h += interval) {
      const progress = (h * 60 / timings.totalDuration) * 100
      if (progress <= 100) markers.push({ progress, time: addHours(doseTime, h), label: format(addHours(doseTime, h), 'h:mm') })
    }
    return markers
  }

  const generatePhaseBoundaries = (timings: PhaseTimings) => {
    const b = []
    if (timings.onsetEnd > 0) b.push({ x: progressToX((timings.onsetEnd / timings.totalDuration) * 100) })
    if (timings.comeupEnd > timings.onsetEnd) b.push({ x: progressToX((timings.comeupEnd / timings.totalDuration) * 100) })
    if (timings.peakEnd > timings.comeupEnd) b.push({ x: progressToX((timings.peakEnd / timings.totalDuration) * 100) })
    return b
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (activeDoses.length === 0) return null

  return (
    <>
      {/* ── Mobile: simplified progress bars (shown below md) ─────────────── */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2 px-0">
          <Activity className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-semibold">Active doses</h3>
        </div>
        {activeDoses.map((dose) => (
          <MobilePhaseBar key={dose.id} dose={dose} />
        ))}
      </div>

      {/* ── Desktop: full SVG graph view (hidden below md) ────────────────── */}
      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Active Timeline
          </CardTitle>
          <CardDescription>
            Real-time view of your active doses. Hover over the graph for details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeDoses.map((dose) => {
              const colors = phaseColors[dose.status.phase]
              const PhaseIcon = phaseIcons[dose.status.phase]
              const timeMarkers = generateTimeMarkers(dose.timings, dose.doseTime)
              const phaseBoundaries = generatePhaseBoundaries(dose.timings)
              const isExpanded = expandedDose === dose.id
              const currentTooltip = tooltip[dose.id]
              const curvePath = generateCurvePath(dose.timings)
              const areaPath = generateAreaPath(dose.timings)
              const currentX = progressToX(dose.status.overallProgress)
              const currentY = intensityToY(getIntensityAtProgress(dose.status.overallProgress, dose.timings))

              return (
                <div
                  key={dose.id}
                  className={`rounded-lg border border-border/50 bg-gradient-to-br from-background to-muted/20 p-4 ${dose.status.phase === 'ended' ? 'opacity-80' : ''} space-y-4`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{dose.substanceName}</span>
                      {getDoseCategories(dose).map((cat) => (
                        <Badge key={cat} variant="outline" className={getCategoryColor(cat)}>{cat}</Badge>
                      ))}
                      <Badge className={`${colors.bg} text-white text-xs shadow-sm`}>
                        <PhaseIcon className="h-3 w-3 mr-1" />
                        {dose.status.phase === 'not_started' ? 'Upcoming' : dose.status.phase.charAt(0).toUpperCase() + dose.status.phase.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{dose.amount} {dose.unit} · {dose.route}</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(dose.doseTime, 'h:mm a')}
                      </div>
                    </div>
                  </div>

                  {/* SVG Graph */}
                  {dose.status.phase !== 'ended' && (
                    <div className="relative w-full overflow-hidden">
                      <svg
                        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                        className="w-full h-auto max-h-48 cursor-crosshair"
                        preserveAspectRatio="xMidYMid meet"
                        onMouseMove={(e) => handleGraphMouseMove(dose.id, e, dose.timings, dose.doseTime)}
                        onMouseLeave={() => handleGraphMouseLeave(dose.id)}
                      >
                        <defs>
                          <linearGradient id={`areaGradient-${dose.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                          </linearGradient>
                          <linearGradient id={`curveGradient-${dose.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="25%" stopColor="#f59e0b" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="75%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                          <filter id={`glow-${dose.id}`} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                          </filter>
                          <filter id={`dropshadow-${dose.id}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.5"/>
                          </filter>
                        </defs>

                        {/* Phase background fills */}
                        <g opacity="0.15">
                          <rect x={PADDING_LEFT} y={PADDING_TOP} width={(dose.timings.onsetEnd / dose.timings.totalDuration) * GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="#3b82f6" />
                          <rect x={progressToX((dose.timings.onsetEnd / dose.timings.totalDuration) * 100)} y={PADDING_TOP} width={((dose.timings.comeupEnd - dose.timings.onsetEnd) / dose.timings.totalDuration) * GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="#f59e0b" />
                          <rect x={progressToX((dose.timings.comeupEnd / dose.timings.totalDuration) * 100)} y={PADDING_TOP} width={((dose.timings.peakEnd - dose.timings.comeupEnd) / dose.timings.totalDuration) * GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="#a855f7" />
                          <rect x={progressToX((dose.timings.peakEnd / dose.timings.totalDuration) * 100)} y={PADDING_TOP} width={((dose.timings.offsetEnd - dose.timings.peakEnd) / dose.timings.totalDuration) * GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="#06b6d4" />
                        </g>

                        {/* Grid lines */}
                        <g className="text-muted-foreground/30" stroke="currentColor" strokeWidth="1">
                          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                            <line key={f} x1={PADDING_LEFT} y1={PADDING_TOP + GRAPH_HEIGHT * f} x2={SVG_WIDTH - PADDING_RIGHT} y2={PADDING_TOP + GRAPH_HEIGHT * f} strokeDasharray={f === 1 ? undefined : '4,4'} />
                          ))}
                        </g>

                        {/* Phase boundary lines */}
                        {phaseBoundaries.map((b, i) => (
                          <line key={i} x1={b.x} y1={PADDING_TOP} x2={b.x} y2={PADDING_TOP + GRAPH_HEIGHT} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4,4" className="text-muted-foreground/30" />
                        ))}

                        {/* Area fill + curve */}
                        <path d={areaPath} fill={`url(#areaGradient-${dose.id})`} />
                        <path d={curvePath} fill="none" stroke={`url(#curveGradient-${dose.id})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter={`url(#glow-${dose.id})`} />

                        {/* Y-axis labels */}
                        <g fill="currentColor" className="text-muted-foreground" fontSize="11">
                          <text x={PADDING_LEFT - 8} y={PADDING_TOP + 4} textAnchor="end">100</text>
                          <text x={PADDING_LEFT - 8} y={PADDING_TOP + GRAPH_HEIGHT * 0.5 + 4} textAnchor="end">50</text>
                          <text x={PADDING_LEFT - 8} y={PADDING_TOP + GRAPH_HEIGHT + 4} textAnchor="end">0</text>
                        </g>

                        {/* Time markers */}
                        <g fill="currentColor" className="text-muted-foreground" fontSize="11">
                          {timeMarkers.map((m, i) => (
                            <text key={i} x={progressToX(m.progress)} y={SVG_HEIGHT - 6} textAnchor="middle">{m.label}</text>
                          ))}
                        </g>

                        {/* Phase labels */}
                        {[
                          { name: 'Onset', s: 0, e: (dose.timings.onsetEnd / dose.timings.totalDuration) * 100, color: '#60a5fa' },
                          { name: 'Comeup', s: (dose.timings.onsetEnd / dose.timings.totalDuration) * 100, e: (dose.timings.comeupEnd / dose.timings.totalDuration) * 100, color: '#fbbf24' },
                          { name: 'Peak', s: (dose.timings.comeupEnd / dose.timings.totalDuration) * 100, e: (dose.timings.peakEnd / dose.timings.totalDuration) * 100, color: '#c084fc' },
                          { name: 'Offset', s: (dose.timings.peakEnd / dose.timings.totalDuration) * 100, e: 100, color: '#22d3ee' },
                        ].map((label, i) => {
                          const px = ((label.e - label.s) / 100) * GRAPH_WIDTH
                          if (px < 30) return null
                          return (
                            <text key={i} x={progressToX((label.s + label.e) / 2)} y={PADDING_TOP - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill={label.color} opacity="0.9">
                              {px < 60 ? label.name.slice(0, 2) : label.name}
                            </text>
                          )
                        })}

                        {/* Current position marker */}
                        {dose.status.phase !== 'not_started' && (
                          <g>
                            <line x1={currentX} y1={PADDING_TOP} x2={currentX} y2={PADDING_TOP + GRAPH_HEIGHT} stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
                            <circle cx={currentX} cy={currentY} r="6" fill="#a855f7" stroke="#fff" strokeWidth="2" filter={`url(#dropshadow-${dose.id})`} className="animate-pulse" />
                            <circle cx={currentX} cy={currentY} r="3" fill="#fff" opacity="0.9" />
                          </g>
                        )}

                        {/* Hover crosshair */}
                        {currentTooltip && (
                          <line x1={progressToX(currentTooltip.progress)} y1={PADDING_TOP} x2={progressToX(currentTooltip.progress)} y2={PADDING_TOP + GRAPH_HEIGHT} stroke="#fff" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5" />
                        )}
                      </svg>

                      {/* Tooltip */}
                      {currentTooltip && (
                        <div className="mt-2 p-3 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg text-sm border border-border/50 backdrop-blur-sm">
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${currentTooltip.phase === 'Onset' ? 'text-blue-400' : currentTooltip.phase === 'Comeup' ? 'text-amber-400' : currentTooltip.phase === 'Peak' ? 'text-purple-400' : 'text-cyan-400'}`}>
                                {currentTooltip.phase}
                              </span>
                              <span className="text-muted-foreground">{currentTooltip.phaseTime} from dose</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(currentTooltip.absoluteTime, 'h:mm a')}
                              </span>
                              <span className="font-medium text-purple-400">{Math.round(currentTooltip.intensity)}% intensity</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                    <div className="flex items-center gap-4">
                      {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                        <>
                          <span className={`${colors.text} font-medium`}>
                            <Timer className="h-3 w-3 inline mr-1" />
                            {formatMinutes(dose.status.totalRemaining)} remaining
                          </span>
                          <span className="text-muted-foreground">Phase: {formatMinutes(dose.status.timeRemaining)} left</span>
                        </>
                      )}
                      {dose.status.phase === 'not_started' && (
                        <span className="text-slate-400">
                          <Sunrise className="h-3 w-3 inline mr-1" />
                          Starts in {formatMinutes(dose.status.timeRemaining)}
                        </span>
                      )}
                      {dose.status.phase === 'ended' && (
                        <span className="text-gray-400 font-medium">
                          <Clock className="h-3 w-3 inline mr-1" />
                          Experience concluded
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Total: {dose.duration?.total}</span>
                      <button onClick={() => setExpandedDose(isExpanded ? null : dose.id)} className="p-1 hover:bg-muted/50 rounded transition-colors">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded phase details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-border/50 space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {[
                          { label: 'Onset', time: dose.duration?.onset, color: phaseColors.onset },
                          { label: 'Comeup', time: dose.duration?.comeup, color: phaseColors.comeup },
                          { label: 'Peak', time: dose.duration?.peak, color: phaseColors.peak },
                          { label: 'Offset', time: dose.duration?.offset, color: phaseColors.offset },
                        ].map((phase) => (
                          <div key={phase.label} className={`p-2.5 rounded-lg ${phase.color.fill} border ${phase.color.border}`}>
                            <div className={`font-semibold ${phase.color.text}`}>{phase.label}</div>
                            <div className="mt-0.5 text-foreground">{phase.time || '—'}</div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/30 p-2 rounded">
                        <Info className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{phaseDescriptions[dose.status.phase]}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
