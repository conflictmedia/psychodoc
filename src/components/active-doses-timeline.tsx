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
  Layers,
} from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { useDoseStore } from '@/store/dose-store'
import { DoseLog, Duration } from '@/types'

// ─── DURATION PARSING ─────────────────────────────────────────────────────────

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

// ─── PHASE TIMING CALCULATION ─────────────────────────────────────────────────

interface PhaseTimings {
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
  return { onsetEnd, comeupEnd, peakEnd, offsetEnd, totalDuration: offsetEnd }
}

// ─── PHASE STATUS ─────────────────────────────────────────────────────────────

interface PhaseStatus {
  phase: 'not_started' | 'onset' | 'comeup' | 'peak' | 'offset' | 'ended'
  progress: number
  overallProgress: number
  timeInPhase: number
  timeRemaining: number
  totalRemaining: number
}

function getPhaseStatus(doseTime: Date, timings: PhaseTimings): PhaseStatus {
  const elapsed = (Date.now() - doseTime.getTime()) / 60_000

  if (elapsed < 0)
    return { phase: 'not_started', progress: 0, overallProgress: 0, timeInPhase: 0, timeRemaining: -elapsed, totalRemaining: timings.totalDuration }
  if (elapsed >= timings.offsetEnd)
    return { phase: 'ended', progress: 100, overallProgress: 100, timeInPhase: 0, timeRemaining: 0, totalRemaining: 0 }

  const overall = (elapsed / timings.totalDuration) * 100

  const phases: { name: PhaseStatus['phase']; start: number; end: number }[] = [
    { name: 'onset', start: 0, end: timings.onsetEnd },
    { name: 'comeup', start: timings.onsetEnd, end: timings.comeupEnd },
    { name: 'peak', start: timings.comeupEnd, end: timings.peakEnd },
    { name: 'offset', start: timings.peakEnd, end: timings.offsetEnd },
  ]

  for (const p of phases) {
    if (elapsed < p.end || p.name === 'offset') {
      const dur = Math.max(p.end - p.start, 1)
      const inPhase = elapsed - p.start
      return {
        phase: p.name,
        progress: Math.min(100, (inPhase / dur) * 100),
        overallProgress: overall,
        timeInPhase: inPhase,
        timeRemaining: dur - inPhase,
        totalRemaining: timings.offsetEnd - elapsed,
      }
    }
  }

  return { phase: 'onset', progress: 0, overallProgress: overall, timeInPhase: elapsed, timeRemaining: timings.onsetEnd - elapsed, totalRemaining: timings.offsetEnd - elapsed }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatMinutes(minutes: number): string {
  if (minutes < 0) return '0m'
  if (minutes < 60) return `${Math.round(minutes)}m`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function getDoseCategories(dose: DoseLog): string[] {
  if (Array.isArray(dose.categories)) return dose.categories
  const legacy = (dose as any).category as string | undefined
  if (legacy && legacy !== 'unknown') return [legacy]
  return []
}

// ─── THEME CONSTANTS ──────────────────────────────────────────────────────────

const phaseColors = {
  not_started: { bg: 'bg-slate-500', text: 'text-slate-400', fill: 'bg-slate-500/20', border: 'border-slate-500/30', bar: 'bg-slate-400' },
  onset:       { bg: 'bg-blue-500',  text: 'text-blue-400',  fill: 'bg-blue-500/20',  border: 'border-blue-500/30',  bar: 'bg-blue-500' },
  comeup:      { bg: 'bg-amber-500', text: 'text-amber-400', fill: 'bg-amber-500/20', border: 'border-amber-500/30', bar: 'bg-amber-500' },
  peak:        { bg: 'bg-purple-500',text: 'text-purple-400',fill: 'bg-purple-500/20',border: 'border-purple-500/30',bar: 'bg-purple-500' },
  offset:      { bg: 'bg-cyan-500',  text: 'text-cyan-400',  fill: 'bg-cyan-500/20',  border: 'border-cyan-500/30',  bar: 'bg-cyan-500' },
  ended:       { bg: 'bg-gray-500',  text: 'text-gray-400',  fill: 'bg-gray-500/20',  border: 'border-gray-500/30',  bar: 'bg-gray-400' },
} as const

/** SVG fill hex values keyed by phase — used for dose markers */
const markerHex: Record<PhaseStatus['phase'], string> = {
  not_started: '#94a3b8',
  onset:       '#3b82f6',
  comeup:      '#f59e0b',
  peak:        '#a855f7',
  offset:      '#06b6d4',
  ended:       '#9ca3af',
}

const phaseIcons = {
  not_started: Sunrise,
  onset: Zap,
  comeup: TrendingUp,
  peak: Mountain,
  offset: TrendingDown,
  ended: Clock,
}

const phaseDescriptions: Record<PhaseStatus['phase'], string> = {
  not_started: 'Effects have not yet begun',
  onset: 'Initial effects are beginning to be felt',
  comeup: 'Effects are rapidly increasing in intensity',
  peak: 'Maximum effects are being experienced',
  offset: 'Effects are gradually declining',
  ended: 'The primary experience has ended',
}

// ─── ROUTE COLORS — distinct palette for overlaid route curves ────────────────
// Each route gets a unique hue so curves can be told apart at a glance.

const ROUTE_PALETTE = [
  { stroke: '#a855f7', fill: '#a855f7' },  // purple  (first / most common)
  { stroke: '#22d3ee', fill: '#22d3ee' },  // cyan
  { stroke: '#fb923c', fill: '#fb923c' },  // orange
  { stroke: '#4ade80', fill: '#4ade80' },  // green
  { stroke: '#f472b6', fill: '#f472b6' },  // pink
  { stroke: '#facc15', fill: '#facc15' },  // yellow
]

// ─── SVG GRAPH CONSTANTS ──────────────────────────────────────────────────────

const SVG_W = 800
const SVG_H = 180          // slightly taller to accommodate the legend
const PL = 40
const PR = 20
const PT = 25
const PB = 40              // extra bottom padding for route legend
const GW = SVG_W - PL - PR
const GH = SVG_H - PT - PB

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface EnrichedDose extends DoseLog {
  timings: PhaseTimings
  status: PhaseStatus
  doseTime: Date
}

/**
 * RouteGroup — all doses of a single (substance, route) pair.
 * Replaces the old DoseGroup which mixed routes together.
 */
interface RouteGroup {
  route: string
  doses: EnrichedDose[]
  primary: EnrichedDose          // the furthest-along active dose
  totalAmount: number
  unit: string
  uniformUnit: boolean
  paletteIndex: number           // which ROUTE_PALETTE entry to use
}

/**
 * SubstanceGroup — one card per substance, containing 1-N RouteGroups.
 */
interface SubstanceGroup {
  key: string                    // lowercased substance name
  substanceName: string
  categories: string[]
  routes: RouteGroup[]
  primary: EnrichedDose          // representative dose for phase badge, etc.
  /** Shared time window: max offsetEnd across all routes (in minutes) */
  windowDuration: number
  /** Earliest doseTime across all routes — x-axis origin */
  windowStart: Date
}

interface TooltipData {
  phase: string
  phaseTime: string
  absoluteTime: Date
  intensity: number
  progress: number
}

// ─── INTENSITY CURVE MATH ─────────────────────────────────────────────────────

function intensityAt(progress: number, t: PhaseTimings): number {
  const mins = (progress / 100) * t.totalDuration

  if (mins <= t.onsetEnd) {
    const frac = t.onsetEnd > 0 ? mins / t.onsetEnd : 1
    return 5 + 10 * (1 - Math.cos((frac * Math.PI) / 2))
  }
  if (mins <= t.comeupEnd) {
    const frac = (mins - t.onsetEnd) / Math.max(t.comeupEnd - t.onsetEnd, 1)
    return 15 + 77 * (1 - Math.cos((frac * Math.PI) / 2))
  }
  if (mins <= t.peakEnd) {
    const frac = (mins - t.comeupEnd) / Math.max(t.peakEnd - t.comeupEnd, 1)
    return 92 + 8 * Math.sin(frac * Math.PI)
  }
  const frac = (mins - t.peakEnd) / Math.max(t.offsetEnd - t.peakEnd, 1)
  return 92 * Math.pow(1 - frac, 1.5)
}

function phaseNameAt(progress: number, t: PhaseTimings): string {
  const mins = (progress / 100) * t.totalDuration
  if (mins <= t.onsetEnd) return 'Onset'
  if (mins <= t.comeupEnd) return 'Comeup'
  if (mins <= t.peakEnd) return 'Peak'
  return 'Offset'
}

// ─── SVG PATH GENERATORS ─────────────────────────────────────────────────────
// These now take windowDuration so every route is plotted on the same time axis.

const toX = (progress: number) => PL + (progress / 100) * GW
const toY = (intensity: number) => PT + GH - (intensity / 100) * GH

/**
 * Build a curve path for a single dose on a shared time axis.
 * @param t        the dose's own PhaseTimings
 * @param offsetMs ms between windowStart and this dose's doseTime
 * @param windowMs total time window in ms
 */
function curvePath(t: PhaseTimings, offsetMins: number, windowDuration: number): string {
  const pts: { x: number; y: number }[] = []

  // Plot 201 points spanning [offsetMins, offsetMins + t.totalDuration]
  for (let i = 0; i <= 200; i++) {
    const localProgress = (i / 200) * 100
    const localMins = (localProgress / 100) * t.totalDuration
    const globalMins = offsetMins + localMins
    const globalProgress = (globalMins / windowDuration) * 100
    pts.push({ x: toX(globalProgress), y: toY(intensityAt(localProgress, t)) })
  }

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const c = pts[i]
    const n = pts[i + 1]
    if (n) {
      d += ` Q ${c.x.toFixed(1)},${c.y.toFixed(1)} ${((c.x + n.x) / 2).toFixed(1)},${((c.y + n.y) / 2).toFixed(1)}`
    } else {
      d += ` L ${c.x.toFixed(1)},${c.y.toFixed(1)}`
    }
  }
  return d
}

function areaPath(t: PhaseTimings, offsetMins: number, windowDuration: number): string {
  const curve = curvePath(t, offsetMins, windowDuration)
  const startX = toX((offsetMins / windowDuration) * 100).toFixed(1)
  const endX   = toX(((offsetMins + t.totalDuration) / windowDuration) * 100).toFixed(1)
  const baseY  = (PT + GH).toFixed(1)
  return `${curve} L ${endX},${baseY} L ${startX},${baseY} Z`
}

// ─── MOBILE PHASE BAR ────────────────────────────────────────────────────────

const MOBILE_PHASES = [
  { key: 'onset', label: 'Onset', barColor: 'bg-blue-500' },
  { key: 'comeup', label: 'Comeup', barColor: 'bg-amber-500' },
  { key: 'peak', label: 'Peak', barColor: 'bg-purple-500' },
  { key: 'offset', label: 'Offset', barColor: 'bg-cyan-500' },
] as const

function phaseEnd(key: string, t: PhaseTimings): number {
  if (key === 'onset') return t.onsetEnd
  if (key === 'comeup') return t.comeupEnd
  if (key === 'peak') return t.peakEnd
  return t.offsetEnd
}

function phaseStart(key: string, t: PhaseTimings): number {
  if (key === 'onset') return 0
  if (key === 'comeup') return t.onsetEnd
  if (key === 'peak') return t.comeupEnd
  return t.peakEnd
}

const PHASE_ORDER = ['onset', 'comeup', 'peak', 'offset'] as const

function isPhasePast(check: string, current: string): boolean {
  const ci = PHASE_ORDER.indexOf(check as any)
  const cu = PHASE_ORDER.indexOf(current as any)
  return ci >= 0 && cu >= 0 && ci < cu
}

/**
 * Mobile card — one per SubstanceGroup.
 * Shows a stacked list of route bars rather than a single bar.
 */
function MobilePhaseBar({ group }: { group: SubstanceGroup }) {
  const dose = group.primary
  const colors = phaseColors[dose.status.phase]
  const PhaseIcon = phaseIcons[dose.status.phase]
  const isMultiRoute = group.routes.length > 1

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-semibold text-base">
            {group.substanceName}
            {isMultiRoute && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
                <Layers className="h-3 w-3" />
                {group.routes.length} routes
              </span>
            )}
          </div>
          {group.routes.map((rg) => {
            const palette = ROUTE_PALETTE[rg.paletteIndex]
            return (
              <div key={rg.route} className="text-xs text-muted-foreground mt-0.5">
                <span className="font-medium" style={{ color: palette.stroke }}>
                  {rg.route}
                </span>
                {' · '}
                {rg.uniformUnit
                  ? `${rg.totalAmount} ${rg.unit}`
                  : `${rg.doses.length} doses`}
                {rg.doses.map((d) => (
                  <div key={d.id} className="flex items-center gap-1 pl-2">
                    <span className="opacity-50">·</span>
                    <span>
                      {d.amount} {d.unit} @ {format(d.doseTime, 'h:mm a')}
                    </span>
                    <span className={`ml-1 text-[10px] font-medium ${phaseColors[d.status.phase].text}`}>
                      {d.status.phase === 'not_started' ? 'upcoming' : d.status.phase}
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        <Badge className={`${colors.bg} text-white text-xs shrink-0`}>
          <PhaseIcon className="h-3 w-3 mr-1" />
          {dose.status.phase === 'not_started'
            ? 'Upcoming'
            : dose.status.phase.charAt(0).toUpperCase() + dose.status.phase.slice(1)}
        </Badge>
      </div>

      {/* One segmented bar per route */}
      {group.routes.map((rg) => {
        const rd = rg.primary
        if (rd.status.phase === 'ended') return null
        const palette = ROUTE_PALETTE[rg.paletteIndex]
        return (
          <div key={rg.route} className="space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-medium" style={{ color: palette.stroke }}>{rg.route}</span>
              <span className="text-muted-foreground">{formatMinutes(rd.status.totalRemaining)} left</span>
            </div>
            <div className="space-y-1">
              <div className="flex text-[10px] text-muted-foreground justify-between">
                {MOBILE_PHASES.map((p) => (
                  <span key={p.key} className={rd.status.phase === p.key ? 'text-foreground font-medium' : ''}>
                    {p.label}
                  </span>
                ))}
              </div>
              <div className="flex gap-0.5 h-2 rounded-full overflow-hidden">
                {MOBILE_PHASES.map((p) => {
                  const start = phaseStart(p.key, rd.timings)
                  const end = phaseEnd(p.key, rd.timings)
                  const dur = end - start
                  const widthPct = (dur / rd.timings.totalDuration) * 100
                  const isActive = rd.status.phase === p.key
                  const past = isPhasePast(p.key, rd.status.phase)

                  return (
                    <div key={p.key} className="rounded-sm overflow-hidden relative" style={{ width: `${widthPct}%`, minWidth: 4 }}>
                      <div className="absolute inset-0 bg-muted" />
                      {past && <div className="absolute inset-0" style={{ background: palette.stroke }} />}
                      {isActive && (
                        <div className="absolute inset-y-0 left-0" style={{ width: `${rd.status.progress}%`, background: palette.stroke }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}

      {dose.status.phase === 'ended' && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Experience concluded
        </p>
      )}
    </div>
  )
}

// ─── DOSE MARKER (SVG sub-component) ─────────────────────────────────────────

interface DoseMarkerProps {
  d: EnrichedDose
  isPrimary: boolean
  groupKey: string
  hex: string
  offsetMins: number
  windowDuration: number
  isFocused: boolean
}

function DoseMarker({ d, isPrimary, groupKey, hex, offsetMins, windowDuration, isFocused }: DoseMarkerProps) {
  const localProgress = d.status.phase === 'not_started' ? 0 : d.status.overallProgress
  const localMins = (localProgress / 100) * d.timings.totalDuration
  const globalMins = offsetMins + localMins
  const globalProgress = (globalMins / windowDuration) * 100

  const mx = toX(globalProgress)
  const my = toY(intensityAt(localProgress, d.timings))
  const isHollow = d.status.phase === 'not_started'
  const isEnded = d.status.phase === 'ended'
  const radius = isPrimary ? 6 : 4

  return (
    <g opacity={isEnded ? 0.35 : 1}>
      {/* Vertical guide line */}
      {!isEnded && (
        <line
          x1={mx} y1={PT} x2={mx} y2={PT + GH}
          stroke={hex}
          strokeWidth={isPrimary ? 1.5 : 1}
          strokeDasharray="3,3"
          opacity={isPrimary ? 0.45 : 0.25}
        />
      )}
      {/* Focus flash ring — animates when dose chip is clicked */}
      {isFocused && (
        <circle cx={mx} cy={my} r={18} fill="none" stroke={hex} strokeWidth="2" opacity="0.7"
          className="animate-ping" />
      )}
      {/* Subtle glow ring for primary only */}
      {isPrimary && !isEnded && (
        <circle cx={mx} cy={my} r={11} fill={hex} opacity={isFocused ? 0.25 : 0.08} />
      )}
      {/* Main dot */}
      <circle
        cx={mx}
        cy={my}
        r={isFocused ? radius + 2 : radius}
        fill={isHollow ? 'none' : hex}
        stroke={isHollow ? hex : isFocused ? '#fff' : '#ffffff88'}
        strokeWidth={isFocused ? 2.5 : 1.5}
        className={isPrimary && !isEnded ? 'animate-pulse' : ''}
      />
      {/* Inner white dot for primary */}
      {isPrimary && !isHollow && !isEnded && (
        <circle cx={mx} cy={my} r={2.5} fill="#fff" opacity={0.85} />
      )}
    </g>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface ActiveDosesTimelineProps {
  refreshTrigger?: number
}

export function ActiveDosesTimeline({ refreshTrigger }: ActiveDosesTimelineProps) {
  const { doses, isLoaded } = useDoseStore()
  const [tick, setTick] = useState(0)
  const [tooltips, setTooltips] = useState<Record<string, TooltipData>>({})
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  // key = substanceKey, value = route string that is isolated (null = all visible)
  const [selectedRoutes, setSelectedRoutes] = useState<Record<string, string | null>>({})
  // id of dose chip that was just clicked — used to flash its marker
  const [focusedDoseId, setFocusedDoseId] = useState<string | null>(null)
  const svgRefs = useRef<Record<string, SVGSVGElement | null>>({})
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  // ── Enrich doses ─────────────────────────────────────────────────────────
  const enriched = useMemo<EnrichedDose[]>(() => {
    return doses
      .filter((d) => d.duration)
      .map((d) => {
        const timings = calculatePhaseTimings(d.duration!)
        const doseTime = new Date(d.timestamp)
        const status = getPhaseStatus(doseTime, timings)
        return { ...d, timings, status, doseTime }
      })
      .filter((d) => {
        if (d.status.phase !== 'ended') return true
        const sinceEnd = (Date.now() - d.doseTime.getTime()) / 60_000 - d.timings.totalDuration
        return sinceEnd < 720
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doses, tick, refreshTrigger])

  // ── Group by substance only, then sub-group by route ─────────────────────
  const groups = useMemo<SubstanceGroup[]>(() => {
    // 1. Bucket by substance name
    const substanceMap = new Map<string, EnrichedDose[]>()
    for (const d of enriched) {
      const key = d.substanceName.toLowerCase()
      const arr = substanceMap.get(key)
      if (arr) arr.push(d)
      else substanceMap.set(key, [d])
    }

    return Array.from(substanceMap.entries()).map(([substanceKey, items]) => {
      // 2. Sub-bucket by route
      const routeMap = new Map<string, EnrichedDose[]>()
      for (const d of items) {
        const rk = d.route.toLowerCase()
        const arr = routeMap.get(rk)
        if (arr) arr.push(d)
        else routeMap.set(rk, [d])
      }

      // 3. Build RouteGroups, assigning palette indices in insertion order
      let paletteIndex = 0
      const routes: RouteGroup[] = Array.from(routeMap.entries()).map(([, routeDoses]) => {
        const sorted = [...routeDoses].sort((a, b) => a.doseTime.getTime() - b.doseTime.getTime())
        const primary = sorted.find((d) => d.status.phase !== 'ended') ?? sorted[sorted.length - 1]
        const units = [...new Set(sorted.map((d) => d.unit))]
        const uniformUnit = units.length === 1
        return {
          route: primary.route,
          doses: sorted,
          primary,
          totalAmount: uniformUnit ? sorted.reduce((s, d) => s + d.amount, 0) : 0,
          unit: units[0] ?? '',
          uniformUnit,
          paletteIndex: paletteIndex++,
        }
      })

      // 4. Compute shared window: earliest start → latest end (in minutes from windowStart)
      const windowStart = new Date(Math.min(...items.map((d) => d.doseTime.getTime())))
      let maxEnd = 0
      for (const d of items) {
        const offsetMins = (d.doseTime.getTime() - windowStart.getTime()) / 60_000
        maxEnd = Math.max(maxEnd, offsetMins + d.timings.totalDuration)
      }

      // 5. Pick representative primary (most-active dose across all routes)
      const allSorted = [...items].sort((a, b) => a.doseTime.getTime() - b.doseTime.getTime())
      const substancePrimary = allSorted.find((d) => d.status.phase !== 'ended') ?? allSorted[allSorted.length - 1]

      return {
        key: substanceKey,
        substanceName: substancePrimary.substanceName,
        categories: substancePrimary.categories ?? [],
        routes,
        primary: substancePrimary,
        windowDuration: maxEnd,
        windowStart,
      }
    })
  }, [enriched])

  // ── SVG interaction ──────────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (groupKey: string, e: React.MouseEvent<SVGSVGElement>, windowDuration: number, windowStart: Date) => {
      if (rafRef.current !== null) return
      const { clientX } = e
      const svgEl = e.currentTarget
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        // Use getScreenCTM so the mapping is correct even with preserveAspectRatio letterboxing
        const ctm = svgEl.getScreenCTM()
        const svgX = ctm ? (clientX - ctm.e) / ctm.a : 0
        const progress = Math.max(0, Math.min(100, ((svgX - PL) / GW) * 100))
        const mins = (progress / 100) * windowDuration
        // Find the primary route's timings for phase labelling
        const group = groups.find((g) => g.key === groupKey)
        const refTimings = group?.routes[0]?.primary.timings
        setTooltips((prev) => ({
          ...prev,
          [groupKey]: {
            phase: refTimings ? phaseNameAt(progress, refTimings) : '',
            phaseTime: formatMinutes(mins),
            absoluteTime: addMinutes(windowStart, mins),
            intensity: refTimings ? intensityAt(progress, refTimings) : 0,
            progress,
          },
        }))
      })
    },
    [groups],
  )

  const handleMouseLeave = useCallback((key: string) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setTooltips((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  // Toggle route isolation: click same route again to deselect
  const handleRouteClick = useCallback((substanceKey: string, route: string) => {
    setSelectedRoutes((prev) => ({
      ...prev,
      [substanceKey]: prev[substanceKey] === route ? null : route,
    }))
  }, [])

  // Focus a dose: flash its marker by setting focusedDoseId, then clear after animation
  const handleDoseChipClick = useCallback((doseId: string, substanceKey: string) => {
    setFocusedDoseId(doseId)
    // Scroll the SVG into view
    const svg = svgRefs.current[substanceKey]
    if (svg) svg.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => setFocusedDoseId(null), 1800)
  }, [])

  // ── Time markers — based on shared window ────────────────────────────────

  const timeMarkers = useCallback((windowDuration: number, windowStart: Date) => {
    const hours = windowDuration / 60
    const step = hours > 8 ? 2 : 1
    const marks: { progress: number; label: string }[] = []
    for (let h = 0; h <= hours; h += step) {
      const p = ((h * 60) / windowDuration) * 100
      if (p <= 100) marks.push({ progress: p, label: format(addHours(windowStart, h), 'h:mm') })
    }
    return marks
  }, [])

  // ── Category color helper ────────────────────────────────────────────────

  const getCategoryColor = (cat: string) =>
    categoryColors[cat as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'

  // ── Rendering ────────────────────────────────────────────────────────────

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (groups.length === 0) return null

  return (
    <>
      {/* ── Mobile ──────────────────────────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-semibold">Active doses</h3>
        </div>
        {groups.map((g) => (
          <MobilePhaseBar key={g.key} group={g} />
        ))}
      </div>

      {/* ── Desktop ─────────────────────────────────────────────────────── */}
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
        <CardContent className="space-y-4">
          {groups.map((group) => {
            const dose = group.primary
            const colors = phaseColors[dose.status.phase]
            const PhaseIcon = phaseIcons[dose.status.phase]
            const isMultiRoute = group.routes.length > 1
            const isExpanded = expandedGroup === group.key
            const tip = tooltips[group.key]
            const marks = timeMarkers(group.windowDuration, group.windowStart)

            // Phase labels are driven by the earliest-starting active route
            const refRoute = group.routes.find((r) => r.primary.status.phase !== 'ended') ?? group.routes[0]
            const refTimings = refRoute.primary.timings
            const phaseLabels = [
              { name: 'Onset',  s: 0, e: (refTimings.onsetEnd  / refTimings.totalDuration) * 100, color: '#60a5fa' },
              { name: 'Comeup', s: (refTimings.onsetEnd  / refTimings.totalDuration) * 100, e: (refTimings.comeupEnd / refTimings.totalDuration) * 100, color: '#fbbf24' },
              { name: 'Peak',   s: (refTimings.comeupEnd / refTimings.totalDuration) * 100, e: (refTimings.peakEnd   / refTimings.totalDuration) * 100, color: '#c084fc' },
              { name: 'Offset', s: (refTimings.peakEnd   / refTimings.totalDuration) * 100, e: 100, color: '#22d3ee' },
            ]

            // Phase background rects (from ref route, in global coords)
            const phaseRects = [
              { start: 0,                  end: refTimings.onsetEnd,  fill: '#3b82f6' },
              { start: refTimings.onsetEnd, end: refTimings.comeupEnd, fill: '#f59e0b' },
              { start: refTimings.comeupEnd,end: refTimings.peakEnd,   fill: '#a855f7' },
              { start: refTimings.peakEnd,  end: refTimings.offsetEnd, fill: '#06b6d4' },
            ]

            const allActive = group.routes.some((r) => r.primary.status.phase !== 'ended')
            const selectedRoute = selectedRoutes[group.key] ?? null

            return (
              <div
                key={group.key}
                className={`rounded-lg border border-border/50 bg-gradient-to-br from-background to-muted/20 p-4 space-y-4 ${!allActive ? 'opacity-80' : ''}`}
              >
                {/* ── Header ───────────────────────────────────────────── */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{group.substanceName}</span>
                    {isMultiRoute && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full border border-border/50">
                        <Layers className="h-3 w-3" />
                        {group.routes.length} routes
                        {selectedRoute && (
                          <button
                            onClick={() => handleRouteClick(group.key, selectedRoute)}
                            className="ml-1 text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                          >
                            show all
                          </button>
                        )}
                      </span>
                    )}
                    {getDoseCategories(dose).map((cat) => (
                      <Badge key={cat} variant="outline" className={getCategoryColor(cat)}>
                        {cat}
                      </Badge>
                    ))}
                    <Badge className={`${colors.bg} text-white text-xs shadow-sm`}>
                      <PhaseIcon className="h-3 w-3 mr-1" />
                      {dose.status.phase === 'not_started'
                        ? 'Upcoming'
                        : dose.status.phase.charAt(0).toUpperCase() + dose.status.phase.slice(1)}
                    </Badge>
                  </div>
                  {/* Route summary pills — clickable to isolate */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {group.routes.map((rg) => {
                      const palette = ROUTE_PALETTE[rg.paletteIndex]
                      const dc = phaseColors[rg.primary.status.phase]
                      const isActive = selectedRoute === null || selectedRoute === rg.route
                      const timeLeft = rg.primary.status.phase === 'not_started'
                        ? null
                        : rg.primary.status.phase === 'ended'
                          ? null
                          : formatMinutes(rg.primary.status.totalRemaining)
                      return (
                        <button
                          key={rg.route}
                          onClick={() => handleRouteClick(group.key, rg.route)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer"
                          style={{
                            borderColor: palette.stroke,
                            color: isActive ? palette.stroke : palette.stroke + '55',
                            background: selectedRoute === rg.route
                              ? palette.stroke + '30'
                              : isActive ? palette.stroke + '1a' : 'transparent',
                            opacity: isActive ? 1 : 0.45,
                            outline: selectedRoute === rg.route ? `2px solid ${palette.stroke}44` : 'none',
                            outlineOffset: '2px',
                          }}
                          title={selectedRoute === rg.route ? 'Click to show all routes' : 'Click to isolate this route'}
                        >
                          {rg.route}
                          <span className="opacity-40 font-normal">·</span>
                          {rg.uniformUnit ? `${rg.totalAmount} ${rg.unit}` : `${rg.doses.length}×`}
                          {timeLeft && (
                            <>
                              <span className="opacity-40 font-normal">·</span>
                              <span className={`text-[10px] font-medium ${dc.text}`}>{timeLeft}</span>
                            </>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ── Dose breakdown table — one row per route, chips clickable */}
                {group.routes.some((rg) => rg.doses.length > 1) && (
                  <div className="space-y-1.5">
                    {group.routes.map((rg) => {
                      const palette = ROUTE_PALETTE[rg.paletteIndex]
                      const isRouteActive = selectedRoute === null || selectedRoute === rg.route
                      return (
                        <div
                          key={rg.route}
                          className="flex items-start gap-3 transition-opacity duration-200"
                          style={{ opacity: isRouteActive ? 1 : 0.35 }}
                        >
                          {/* Route label — clickable */}
                          <button
                            className="text-xs font-semibold w-20 shrink-0 pt-0.5 text-left hover:underline transition-opacity"
                            style={{ color: palette.stroke }}
                            onClick={() => handleRouteClick(group.key, rg.route)}
                          >
                            {rg.route}
                          </button>
                          {/* Dose chips — clickable to focus marker */}
                          <div className="flex flex-wrap gap-1.5">
                            {rg.doses.map((d) => {
                              const dc = phaseColors[d.status.phase]
                              const isFocused = focusedDoseId === d.id
                              return (
                                <button
                                  key={d.id}
                                  onClick={() => handleDoseChipClick(d.id, group.key)}
                                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-all duration-150 cursor-pointer
                                    ${dc.fill} ${dc.border}
                                    ${isFocused ? 'ring-2 ring-offset-1 ring-offset-background scale-105' : 'hover:brightness-125 hover:scale-[1.03]'}
                                  `}
                                  style={isFocused ? { ringColor: palette.stroke } : undefined}
                                  title="Click to highlight on graph"
                                >
                                  <span className="font-medium text-foreground">{d.amount} {d.unit}</span>
                                  <span className="text-muted-foreground">@ {format(d.doseTime, 'h:mm a')}</span>
                                  <span className={`font-medium ${dc.text}`}>
                                    {d.status.phase === 'not_started'
                                      ? 'upcoming'
                                      : d.status.phase === 'ended'
                                        ? '✓'
                                        : `${formatMinutes(d.status.totalRemaining)}`}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* ── SVG Graph — all routes overlaid ──────────────────── */}
                {allActive && (
                  <div className="relative w-full overflow-hidden">
                    <svg
                      ref={(el) => { svgRefs.current[group.key] = el }}
                      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                      className="w-full h-auto max-h-56 cursor-crosshair"
                      preserveAspectRatio="xMidYMid meet"
                      onMouseMove={(e) => handleMouseMove(group.key, e, group.windowDuration, group.windowStart)}
                      onMouseLeave={() => handleMouseLeave(group.key)}
                    >
                      <defs>
                        {group.routes.map((rg) => {
                          const palette = ROUTE_PALETTE[rg.paletteIndex]
                          return (
                            <g key={rg.route}>
                              {/* Area fill gradient per route */}
                              <linearGradient id={`ag-${group.key}-${rg.paletteIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%"   stopColor={palette.stroke} stopOpacity="0.35" />
                                <stop offset="60%"  stopColor={palette.stroke} stopOpacity="0.12" />
                                <stop offset="100%" stopColor={palette.stroke} stopOpacity="0.03" />
                              </linearGradient>
                              {/* Glow filter per route */}
                              <filter id={`glow-${group.key}-${rg.paletteIndex}`} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                  <feMergeNode in="blur" />
                                  <feMergeNode in="SourceGraphic" />
                                </feMerge>
                              </filter>
                            </g>
                          )
                        })}
                        <filter id={`ds-${group.key}`} x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#a855f7" floodOpacity="0.5" />
                        </filter>
                      </defs>

                      {/* Phase background bands (from ref route) */}
                      <g opacity="0.12">
                        {phaseRects.map((r, i) => (
                          <rect
                            key={i}
                            x={toX((r.start / refTimings.totalDuration) * 100)}
                            y={PT}
                            width={((r.end - r.start) / refTimings.totalDuration) * GW}
                            height={GH}
                            fill={r.fill}
                          />
                        ))}
                      </g>

                      {/* Grid lines */}
                      <g className="text-muted-foreground/30" stroke="currentColor" strokeWidth="1">
                        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                          <line
                            key={f}
                            x1={PL}
                            y1={PT + GH * f}
                            x2={SVG_W - PR}
                            y2={PT + GH * f}
                            strokeDasharray={f === 1 ? undefined : '4,4'}
                          />
                        ))}
                      </g>

                      {/* Phase label strip (top) */}
                      {phaseLabels.map((lbl, i) => {
                        const px = ((lbl.e - lbl.s) / 100) * GW
                        if (px < 12) return null   // only hide if truly invisible
                        return (
                          <text
                            key={i}
                            x={toX((lbl.s + lbl.e) / 2)}
                            y={PT - 8}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="600"
                            fill={lbl.color}
                            opacity="0.9"
                          >
                            {px < 40 ? lbl.name.slice(0, 1) : px < 70 ? lbl.name.slice(0, 2) : lbl.name}
                          </text>
                        )
                      })}

                      {/* ── Per-route area fills (drawn first, behind curves) */}
                      {group.routes.map((rg) => {
                        const palette = ROUTE_PALETTE[rg.paletteIndex]
                        const rPrimary = rg.primary
                        if (rPrimary.status.phase === 'ended') return null
                        const offsetMins = (rPrimary.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                        const area = areaPath(rPrimary.timings, offsetMins, group.windowDuration)
                        const isIsolated = selectedRoute !== null && selectedRoute !== rg.route
                        return (
                          <path
                            key={rg.route + '-area'}
                            d={area}
                            fill={`url(#ag-${group.key}-${rg.paletteIndex})`}
                            opacity={isIsolated ? 0.08 : 0.65}
                            style={{ transition: 'opacity 0.25s ease' }}
                          />
                        )
                      })}

                      {/* ── Per-route stroke curves */}
                      {group.routes.map((rg) => {
                        const palette = ROUTE_PALETTE[rg.paletteIndex]
                        const rPrimary = rg.primary
                        if (rPrimary.status.phase === 'ended') return null
                        const offsetMins = (rPrimary.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                        const curve = curvePath(rPrimary.timings, offsetMins, group.windowDuration)
                        const isSelected = selectedRoute === rg.route
                        const isIsolated = selectedRoute !== null && !isSelected
                        return (
                          <path
                            key={rg.route + '-curve'}
                            d={curve}
                            fill="none"
                            stroke={palette.stroke}
                            strokeWidth={isSelected ? 4.5 : isIsolated ? 1.5 : 3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={isIsolated ? 0.2 : 1}
                            filter={!isIsolated ? `url(#glow-${group.key}-${rg.paletteIndex})` : undefined}
                            style={{ transition: 'stroke-width 0.2s ease, opacity 0.25s ease' }}
                          />
                        )
                      })}

                      {/* ── Dose markers — dot per dose, colored by route */}
                      {group.routes.map((rg) => {
                        const palette = ROUTE_PALETTE[rg.paletteIndex]
                        const isIsolated = selectedRoute !== null && selectedRoute !== rg.route
                        return rg.doses.map((d) => {
                          const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                          return (
                            <g key={d.id} opacity={isIsolated ? 0.15 : 1} style={{ transition: 'opacity 0.25s ease' }}>
                              <DoseMarker
                                d={d}
                                isPrimary={d.id === rg.primary.id}
                                groupKey={group.key}
                                hex={palette.stroke}
                                offsetMins={offsetMins}
                                windowDuration={group.windowDuration}
                                isFocused={focusedDoseId === d.id}
                              />
                            </g>
                          )
                        })
                      })}

                      {/* Y-axis labels */}
                      <g fill="currentColor" className="text-muted-foreground" fontSize="11">
                        <text x={PL - 8} y={PT + 4} textAnchor="end">100</text>
                        <text x={PL - 8} y={PT + GH * 0.5 + 4} textAnchor="end">50</text>
                        <text x={PL - 8} y={PT + GH + 4} textAnchor="end">0</text>
                      </g>

                      {/* X-axis time labels */}
                      <g fill="currentColor" className="text-muted-foreground" fontSize="11">
                        {marks.map((m, i) => (
                          <text key={i} x={toX(m.progress)} y={SVG_H - PB + 14} textAnchor="middle">
                            {m.label}
                          </text>
                        ))}
                      </g>

                      {/* ── Route legend (bottom of SVG) — clickable */}
                      {isMultiRoute && (
                        <g>
                          {group.routes.map((rg, li) => {
                            const palette = ROUTE_PALETTE[rg.paletteIndex]
                            const lx = PL + li * 120
                            const ly = SVG_H - 7
                            const isSelected = selectedRoute === rg.route
                            const isIsolated = selectedRoute !== null && !isSelected
                            return (
                              <g
                                key={rg.route}
                                onClick={() => handleRouteClick(group.key, rg.route)}
                                className="cursor-pointer"
                                opacity={isIsolated ? 0.35 : 1}
                                style={{ transition: 'opacity 0.2s ease' }}
                              >
                                {/* Wider click target */}
                                <rect x={lx - 2} y={ly - 14} width={90} height={16} fill="transparent" />
                                <line x1={lx} y1={ly - 5} x2={lx + 26} y2={ly - 5}
                                  stroke={palette.stroke} strokeWidth={isSelected ? 4 : 3.5} strokeLinecap="round" />
                                <circle cx={lx + 13} cy={ly - 5} r="3" fill={palette.stroke} />
                                <text x={lx + 32} y={ly} fontSize="11" fill={palette.stroke}
                                  fontWeight={isSelected ? '700' : '600'}>
                                  {rg.route}
                                </text>
                              </g>
                            )
                          })}
                        </g>
                      )}

                      {/* Hover crosshair */}
                      {tip && (
                        <line
                          x1={toX(tip.progress)} y1={PT}
                          x2={toX(tip.progress)} y2={PT + GH}
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeDasharray="4,4"
                          opacity="0.5"
                        />
                      )}
                    </svg>

                    {/* Tooltip — per-route intensity breakdown */}
                    {tip && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg text-sm border border-border/50 backdrop-blur-sm space-y-2">
                        {/* Time header */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              tip.phase === 'Onset'  ? 'text-blue-400'
                              : tip.phase === 'Comeup' ? 'text-amber-400'
                              : tip.phase === 'Peak'   ? 'text-purple-400'
                              : 'text-cyan-400'
                            }`}>
                              {tip.phase}
                            </span>
                            <span className="text-muted-foreground">{tip.phaseTime} from start</span>
                          </div>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(tip.absoluteTime, 'h:mm a')}
                          </span>
                        </div>
                        {/* Per-route intensity bars */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pb-0.5">
                            <span>Estimated effect intensity at this moment</span>
                            <span>0 → max</span>
                          </div>
                          {group.routes.map((rg) => {
                            if (rg.primary.status.phase === 'ended') return null
                            const palette = ROUTE_PALETTE[rg.paletteIndex]
                            const offsetMins = (rg.primary.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                            const hoverMins = (tip.progress / 100) * group.windowDuration
                            const localMins = hoverMins - offsetMins
                            const localProgress = Math.max(0, Math.min(100, (localMins / rg.primary.timings.totalDuration) * 100))
                            const intensity = localMins < 0 || localMins > rg.primary.timings.totalDuration
                              ? 0
                              : Math.round(intensityAt(localProgress, rg.primary.timings))
                            return (
                              <div key={rg.route} className="flex items-center gap-2">
                                <span className="text-xs font-semibold w-20 shrink-0" style={{ color: palette.stroke }}>{rg.route}</span>
                                <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${intensity}%`, background: palette.stroke }}
                                  />
                                </div>
                                <span className="text-xs font-medium w-10 text-right" style={{ color: palette.stroke }}>
                                  {intensity}%
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Footer ───────────────────────────────────────────── */}
                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                      <>
                        <span className={`${colors.text} font-medium`}>
                          <Timer className="h-3 w-3 inline mr-1" />
                          {formatMinutes(dose.status.totalRemaining)} remaining
                        </span>
                        <span className="text-muted-foreground">
                          Phase: {formatMinutes(dose.status.timeRemaining)} left
                        </span>
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
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : group.key)}
                      className="p-1 hover:bg-muted/50 rounded transition-colors"
                      aria-label={isExpanded ? 'Collapse phase details' : 'Expand phase details'}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded phase details ───────────────────────────── */}
                {isExpanded && (
                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {(
                        [
                          { label: 'Onset',  time: dose.duration?.onset,  pc: phaseColors.onset },
                          { label: 'Comeup', time: dose.duration?.comeup, pc: phaseColors.comeup },
                          { label: 'Peak',   time: dose.duration?.peak,   pc: phaseColors.peak },
                          { label: 'Offset', time: dose.duration?.offset, pc: phaseColors.offset },
                        ] as const
                      ).map((p) => (
                        <div key={p.label} className={`p-2.5 rounded-lg ${p.pc.fill} border ${p.pc.border}`}>
                          <div className={`font-semibold ${p.pc.text}`}>{p.label}</div>
                          <div className="mt-0.5 text-foreground">{p.time || '—'}</div>
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
        </CardContent>
      </Card>
    </>
  )
}
