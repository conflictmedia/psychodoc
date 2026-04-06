'use client'

import { formatDoseAmount } from '@/lib/utils'

function formatUnit(unit: string, amount: number): string {
  const invariantUnits = ['mg', 'g', 'μg', 'ml', 'mL']
  if (invariantUnits.includes(unit)) return unit
  const isSingular = amount === 1 || (amount > 0 && amount < 1)
  const pluralRules: Record<string, string> = {
    'drop': 'drops', 'puff': 'puffs', 'tab': 'tabs', 'capsule': 'capsules',
    'hit': 'hits', 'line': 'lines', 'drink': 'drinks', 'shot': 'shots',
    'joint': 'joints', 'blunt': 'blunts', 'bowl': 'bowls', 'blinker': 'blinkers',
  }
  const singularRules: Record<string, string> = Object.fromEntries(
    Object.entries(pluralRules).map(([sing, plur]) => [plur, sing])
  )
  if (isSingular && singularRules[unit]) return singularRules[unit]
  if (!isSingular && pluralRules[unit]) return pluralRules[unit]
  if (!isSingular && !pluralRules[unit] && !singularRules[unit]) return unit + 's'
  return unit
}

function hasIncompletePhases(
  duration: { onset?: string; comeup?: string; peak?: string; offset?: string; total?: string } | null | undefined,
): boolean {
  if (!duration) return false
  const hasOnset  = duration.onset  && duration.onset.trim()  !== '' && duration.onset  !== '—'
  const hasTotal  = duration.total  && duration.total.trim()  !== '' && duration.total  !== '—'
  const hasComeup = duration.comeup && duration.comeup.trim() !== '' && duration.comeup !== '—'
  const hasPeak   = duration.peak   && duration.peak.trim()   !== '' && duration.peak   !== '—'
  const hasOffset = duration.offset && duration.offset.trim() !== '' && duration.offset !== '—'
  if (hasOnset && hasTotal && (!hasComeup || !hasPeak || !hasOffset)) return true
  return false
}

/* ================================================================== */
/*  Imports                                                            */
/* ================================================================== */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { format, addMinutes } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity, Timer, Loader2, ChevronDown, ChevronUp, Layers,
} from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { useDoseStore } from '@/store/dose-store'
import {
  EnrichedDose, RouteGroup, SubstanceGroup, TooltipData,
  RouteIntensitySnapshot, PhaseTimings, PhaseName,
} from './dose-timeline/dose-timeline-types'
import {
  phaseColors, phaseIcons, ROUTE_PALETTE,
  SVG_W, SVG_H, PL, PT, GW, GH, PHASE_BANDS, ENDED_DOSE_RETENTION_MINS,
  NOW_INDICATOR, markerHex,
} from './dose-timeline/dose-timeline-constants'
import {
  calculatePhaseTimings, getPhaseStatus, formatMinutes, formatPhaseName,
  getDoseCategories, intensityAt, phaseNameAt, toX, toY, areaPath, curvePath,
  buildTimeMarkers, getPhaseBandRanges,
  getNowProgress, combinedIntensityAt,
  parseDurationToMinutes, phaseStart, phaseEnd,
} from './dose-timeline/dose-timeline-utils'
import { DoseMarker } from './dose-timeline/dose-marker'
import { MobilePhaseBar } from './dose-timeline/mobile-phase-bar'
import { EstimatedDurationBadge } from '@/components/estimated-duration-badge'
import Link from 'next/link'
import { substances } from '@/lib/substances/index'

/* ================================================================== */
/*  Props Interface                                                    */
/* ================================================================== */

interface ActiveDosesTimelineProps {
  refreshTrigger?: number
}

/* ================================================================== */
/*  Helper — compute tooltip data at a given progress point            */
/* ================================================================== */

function computeTooltipAtProgress(
  progress: number,
  routes: RouteGroup[],
  windowStart: Date,
  windowDuration: number,
  primaryTimings: PhaseTimings,
): TooltipData | null {
  if (progress < 0 || progress > 100) return null

  const globalMins = (progress / 100) * windowDuration
  const routeIntensities: RouteIntensitySnapshot[] = []
  const allIntensities: number[] = []

  for (const rg of routes) {
    // Process ALL doses in this route, not just the primary one
    for (const dose of rg.doses) {
      const offsetMins = (dose.doseTime.getTime() - windowStart.getTime()) / 60_000
      const localMins = globalMins - offsetMins
      const localProgress = (localMins / dose.timings.totalDuration) * 100

      if (localProgress >= 0 && localProgress <= 100) {
        const intensity = intensityAt(localProgress, dose.timings)
        const phase = phaseNameAt(localProgress, dose.timings)
        routeIntensities.push({
          route: rg.route,
          intensity,
          phase,
          paletteIndex: rg.paletteIndex,
        })
        allIntensities.push(intensity)
      }
    }
  }

  const combined = combinedIntensityAt(allIntensities)
  const primaryPhase = routeIntensities.length > 0
    ? routeIntensities[0].phase
    : phaseNameAt(progress, primaryTimings)

  const absoluteDate = addMinutes(windowStart, globalMins)

  return {
    phase: primaryPhase,
    phaseTime: formatMinutes(globalMins),
    absoluteTime: absoluteDate,
    intensity: combined,
    progress,
    routeIntensities,
  }
}

/* ================================================================== */
/*  PhaseSparkline — mini intensity curve for expanded phase details   */
/* ================================================================== */

function PhaseSparkline({
  timings,
  phase,
  isActive,
}: {
  timings: PhaseTimings
  phase: string
  isActive: boolean
}) {
  const pStart = phaseStart(phase, timings)
  const pEnd = phaseEnd(phase, timings)
  const pDuration = pEnd - pStart

  if (pDuration <= 0) return null

  const width = 48
  const height = 18
  const points: string[] = []

  for (let i = 0; i <= 12; i++) {
    const frac = i / 12
    const globalProgress = ((pStart + frac * pDuration) / timings.totalDuration) * 100
    const intensity = intensityAt(globalProgress, timings)
    const x = frac * width
    const y = height - (intensity / 100) * height
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`)
  }

  return (
    <svg
      width={width}
      height={height}
      className="shrink-0"
      style={{ opacity: isActive ? 0.8 : 0.4 }}
      aria-hidden="true"
    >
      <path
        d={points.join(' ')}
        fill="none"
        stroke={isActive ? '#a855f7' : '#71717a'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ================================================================== */
/*  ActiveDosesTimeline — main component                               */
/* ================================================================== */

export function ActiveDosesTimeline({ refreshTrigger }: ActiveDosesTimelineProps) {
  /* ---------------------------------------------------------------- */
  /*  Store & state                                                    */
  /* ---------------------------------------------------------------- */

  const { doses, isLoaded } = useDoseStore()
  const [tick, setTick] = useState(0)
  const [tooltips, setTooltips] = useState<Record<string, TooltipData>>({})
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [selectedRoutes, setSelectedRoutes] = useState<Record<string, string | null>>({})
  const [selectedDoses, setSelectedDoses] = useState<Record<string, string | null>>({}) // dose isolation
  const [tooltipX, setTooltipX] = useState<Record<string, number>>({})

  const svgRefs = useRef<Record<string, SVGSVGElement | null>>({})
  const rafRefs = useRef<Record<string, number | null>>({})

  /* ---------------------------------------------------------------- */
  /*  Effects                                                          */
  /* ---------------------------------------------------------------- */

  // Re-render every minute to keep "now" indicator and timings current
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Memos — data pipeline                                            */
  /* ---------------------------------------------------------------- */

  // Step 1: filter to doses that have a meaningful total duration, then enrich
  const baseDoses = useMemo(() => {
    return doses
      .filter(d => {
        if (!d.duration) return false
        const totalMins = parseDurationToMinutes(d.duration.total ?? '')
        return totalMins > 0
      })
      .map(d => {
        const timings = calculatePhaseTimings(d.duration!)
        const doseTime = new Date(d.timestamp)
        const status = getPhaseStatus(doseTime, timings)
        const enriched: EnrichedDose = {
          ...d,
          timings,
          status,
          doseTime,
        }
        return enriched
      })
      .sort((a, b) => a.doseTime.getTime() - b.doseTime.getTime())
  }, [doses, tick, refreshTrigger])

  // Step 2: remove ended doses that have exceeded the retention window
  const enriched = useMemo(() => {
    const now = Date.now()
    return baseDoses.filter(d => {
      if (d.status.phase === 'ended') {
        const endedAt = d.doseTime.getTime() + d.timings.afterglowEnd * 60_000
        if (now - endedAt > ENDED_DOSE_RETENTION_MINS * 60_000) return false
      }
      return true
    })
  }, [baseDoses, tick])

  // Step 3: group by substance → route, compute display window
  const groups = useMemo(() => {
    const bySubstance = new Map<string, EnrichedDose[]>()

    for (const d of enriched) {
      const key = d.substanceName.toLowerCase()
      if (!bySubstance.has(key)) bySubstance.set(key, [])
      bySubstance.get(key)!.push(d)
    }

    const result: SubstanceGroup[] = []

    for (const [, substanceDoses] of bySubstance) {
      // Group by route
      const byRoute = new Map<string, EnrichedDose[]>()
      for (const d of substanceDoses) {
        const routeKey = d.route.toLowerCase()
        if (!byRoute.has(routeKey)) byRoute.set(routeKey, [])
        byRoute.get(routeKey)!.push(d)
      }

      const routes: RouteGroup[] = []
      let routeIdx = 0
      for (const [route, routeDoses] of byRoute) {
        const primary = routeDoses[0]
        const totalAmount = routeDoses.reduce((sum, d) => sum + d.amount, 0)
        const uniformUnit = routeDoses.every(d => d.unit === primary.unit)

        routes.push({
          route,
          doses: routeDoses,
          primary,
          totalAmount,
          unit: primary.unit,
          uniformUnit,
          paletteIndex: routeIdx,
        })
        routeIdx++
      }

      // Compute display window: 5 min before earliest dose, 10 min after last ends
      const earliest = substanceDoses[0]
      const latestEnd = substanceDoses.reduce((max, d) => {
        const end = d.doseTime.getTime() + d.timings.totalDuration * 60_000
        return Math.max(max, end)
      }, 0)

      const windowStart = new Date(earliest.doseTime.getTime() - 5 * 60_000)
      const windowEnd = new Date(latestEnd + 10 * 60_000)
      const windowDuration = (windowEnd.getTime() - windowStart.getTime()) / 60_000

      result.push({
        key: earliest.substanceName.toLowerCase(),
        substanceName: earliest.substanceName,
        categories: getDoseCategories(earliest),
        routes,
        primary: earliest,
        windowDuration,
        windowStart,
      })
    }

    // Sort groups by earliest dose time
    result.sort((a, b) => a.primary.doseTime.getTime() - b.primary.doseTime.getTime())
    return result
  }, [enriched])

  /* ---------------------------------------------------------------- */
  /*  Handlers                                                         */
  /* ---------------------------------------------------------------- */

  // Hover: rAF-throttled tooltip computation + screen-X storage (#10)
  const handleMouseMove = useCallback((
    e: React.MouseEvent<SVGSVGElement>,
    groupKey: string,
    routes: RouteGroup[],
    windowStart: Date,
    windowDuration: number,
    primaryTimings: PhaseTimings,
  ) => {
    const svgEl = svgRefs.current[groupKey]
    if (!svgEl) return

    const rect = svgEl.getBoundingClientRect()
    const clientX = e.clientX
    const scaleX = SVG_W / rect.width
    const mouseX = (clientX - rect.left) * scaleX
    const progress = ((mouseX - PL) / GW) * 100

    if (progress < 0 || progress > 100) {
      setTooltipX(prev => {
        const next = { ...prev }
        delete next[groupKey]
        return next
      })
      setTooltips(prev => {
        const next = { ...prev }
        delete next[groupKey]
        return next
      })
      return
    }

    // Store screen-space X position for tooltip positioning (#2, #10)
    const screenX = clientX - rect.left
    setTooltipX(prev => ({ ...prev, [groupKey]: screenX }))

    // Throttle tooltip computation via rAF
    if (rafRefs.current[groupKey] !== null) {
      cancelAnimationFrame(rafRefs.current[groupKey]!)
    }

    rafRefs.current[groupKey] = requestAnimationFrame(() => {
      const data = computeTooltipAtProgress(progress, routes, windowStart, windowDuration, primaryTimings)
      if (data) {
        setTooltips(prev => ({ ...prev, [groupKey]: data }))
      }
    })
  }, [])

  // Clear tooltip on mouse leave
  const handleMouseLeave = useCallback((groupKey: string) => {
    setTooltipX(prev => {
      const next = { ...prev }
      delete next[groupKey]
      return next
    })
    setTooltips(prev => {
      const next = { ...prev }
      delete next[groupKey]
      return next
    })
  }, [])

  // Toggle route isolation
  const handleRouteClick = useCallback((groupKey: string, route: string) => {
    setSelectedRoutes(prev => {
      const current = prev[groupKey]
      if (current === route) {
        return { ...prev, [groupKey]: null }
      }
      return { ...prev, [groupKey]: route }
    })
    // Clear dose isolation when changing route
    setSelectedDoses(prev => ({ ...prev, [groupKey]: null }))
  }, [])

  // Toggle dose isolation (click to isolate, click again to show all)
  const handleDoseChipClick = useCallback((groupKey: string, doseId: string) => {
    // If shift is held, do the old focus behavior instead
    setSelectedDoses(prev => {
      const current = prev[groupKey]
      if (current === doseId) {
        return { ...prev, [groupKey]: null }
      }
      return { ...prev, [groupKey]: doseId }
    })
    // Clear route isolation when isolating a dose
    setSelectedRoutes(prev => ({ ...prev, [groupKey]: null }))
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                          */
  /* ---------------------------------------------------------------- */

  const getCategoryColor = useCallback((categories: string[]): string => {
    if (categories.length === 0) return 'hsl(var(--muted-foreground))'
    const primary = categories[0]
    return categoryColors[primary] ?? 'hsl(var(--muted-foreground))'
  }, [])

  /* ---------------------------------------------------------------- */
  /*  Loading / empty states                                           */
  /* ---------------------------------------------------------------- */

  if (!isLoaded) {
    return (
      <Card className="hidden md:block">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading active doses…</span>
        </CardContent>
      </Card>
    )
  }

  if (groups.length === 0) {
    return (
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Active Timeline
          </CardTitle>
          <CardDescription>No active doses to display</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Layers className="h-10 w-10 mb-3 opacity-40" />
          <p className="text-sm">Log a dose to see the intensity timeline</p>
        </CardContent>
      </Card>
    )
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <>
      {/* ── Mobile view ── */}
      <div className="md:hidden space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-semibold">Active doses</h3>
        </div>
        {groups.map(g => (
          <MobilePhaseBar key={g.key} group={g} />
        ))}
      </div>

      {/* ── Desktop Card ── */}
      <Card className="hidden md:block">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Active Timeline
          </CardTitle>
          <CardDescription>
            Real-time intensity curves for {groups.length} substance{groups.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {groups.map(group => {
            const isExpanded = expandedGroup === group.key
            const tooltip = tooltips[group.key]
            const tooltipScreenX = tooltipX[group.key]
            const selectedRoute = selectedRoutes[group.key]
            const selectedDose = selectedDoses[group.key]

            // Filter by route or by specific dose
            const visibleRoutes = (() => {
              if (selectedDose) {
                // Find the route that contains the selected dose
                return group.routes
                  .map(rg => ({
                    ...rg,
                    doses: rg.doses.filter(d => (d.id ?? d.doseTime.getTime().toString()) === selectedDose),
                  }))
                  .filter(rg => rg.doses.length > 0)
              }
              if (selectedRoute) {
                return group.routes.filter(r => r.route.toLowerCase() === selectedRoute)
              }
              return group.routes
            })()

            const bandTimings = visibleRoutes.length > 0
              ? visibleRoutes[0].primary.timings
              : group.primary.timings

            const allActive = group.routes.some(rg =>
              rg.doses.some(d => d.status.phase !== 'ended' && d.status.phase !== 'not_started'),
            )

            const primaryDose = group.primary
            const isMultiRoute = group.routes.length > 1
            const totalDoses = group.routes.reduce((sum, rg) => sum + rg.doses.length, 0)
            const isMultiDose = totalDoses > 1

            const nowProgress = (() => {
              if (!allActive) return -1
              // Find any active dose and compute its global progress the same way DoseMarker does
              const activeDose = group.routes
                .flatMap(rg => rg.doses)
                .find(d => d.status.phase !== 'ended' && d.status.phase !== 'not_started')
              if (!activeDose) return -1
              const elapsedMins = activeDose.timings.totalDuration - activeDose.status.totalRemaining
              const doseOffsetMins = (activeDose.doseTime.getTime() - group.windowStart.getTime()) / 60_000
              return (doseOffsetMins + elapsedMins) / group.windowDuration * 100
            })()
            const timeMarkers = buildTimeMarkers(group.windowDuration, group.windowStart)

            // Current combined intensity for the header badge (#3)
            const currentCombinedIntensity = (() => {
              if (!allActive || nowProgress <= 0 || nowProgress >= 100) return null
              const activeDoses = group.routes
                .flatMap(rg => rg.doses)
                .filter(d => d.status.phase !== 'ended' && d.status.phase !== 'not_started')
              if (activeDoses.length === 0) return null
              const intensities = activeDoses.map(d => {
                const elapsed = d.timings.totalDuration - d.status.totalRemaining
                const prog = (elapsed / d.timings.totalDuration) * 100
                return intensityAt(prog, d.timings)
              })
              return Math.round(combinedIntensityAt(intensities))
            })()

            // Substance link slug (optional — degrades gracefully if not found)
            const substanceEntry = substances?.find?.(
              (s: { name?: string }) =>
                s.name?.toLowerCase() === group.substanceName.toLowerCase(),
            )

            // Category accent color
            const catColor = getCategoryColor(group.categories)

            /* ====================================================== */
            /*  Per-group render                                       */
            /* ====================================================== */

            return (
              <div key={group.key} className="space-y-3">
                {/* ── Header: substance name, badges, combined intensity ── */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category dot */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: catColor }}
                    />

                    {/* Substance name (linked if we have a slug) */}
                    <h3 className="font-semibold text-base">
                      {substanceEntry?.id ? (
                        <Link
                          href={`/?substance=${substanceEntry.id}`}
                          className="hover:underline underline-offset-4"
                        >
                          {group.substanceName}
                        </Link>
                      ) : (
                        group.substanceName
                      )}
                    </h3>

                    {/* Phase badge */}
                    <Badge
                      variant="outline"
                      className={`${phaseColors[primaryDose.status.phase].border} ${phaseColors[primaryDose.status.phase].text} text-[10px] px-1.5 py-0`}
                    >
                      {(() => {
                        const PhaseIcon = phaseIcons[primaryDose.status.phase]
                        return <PhaseIcon className="h-3 w-3 mr-0.5" />
                      })()}
                      {formatPhaseName(primaryDose.status.phase)}
                    </Badge>

                    {/* Estimated duration badge (when phases are incomplete) */}
                    {hasIncompletePhases(primaryDose.duration) && (
                      <EstimatedDurationBadge />
                    )}

                    {/* #3 — Combined intensity display in header */}
                    {allActive && currentCombinedIntensity !== null && (
                      <Badge variant="outline" className="text-xs font-mono">
                        <Activity className="h-3 w-3 mr-1 text-purple-400" />
                        {currentCombinedIntensity}%
                      </Badge>
                    )}
                  </div>

                  {/* Remaining time */}
                  {allActive && primaryDose.status.totalRemaining > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      {formatMinutes(primaryDose.status.totalRemaining)} remaining
                    </span>
                  )}
                </div>

                {/* ── Route pills (multi-route groups) ── */}
                {isMultiRoute && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground mr-1">Routes:</span>
                    {group.routes.map(rg => {
                      const palette = ROUTE_PALETTE[rg.paletteIndex % ROUTE_PALETTE.length]
                      const isSelected = selectedRoute === rg.route.toLowerCase()
                      const pillClasses = isSelected
                        ? 'ring-1 ring-offset-1 ring-offset-background'
                        : 'opacity-60 hover:opacity-100'
                      return (
                        <button
                          key={rg.route}
                          onClick={() => handleRouteClick(group.key, rg.route.toLowerCase())}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${pillClasses}`}
                          style={{
                            borderColor: palette.stroke,
                            color: palette.stroke,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: palette.fill }}
                          />
                          {rg.route}
                        </button>
                      )
                    })}
                    {selectedRoute && (
                      <button
                        onClick={() => handleRouteClick(group.key, selectedRoute)}
                        className="text-[10px] text-muted-foreground hover:text-foreground ml-1"
                      >
                        Show all
                      </button>
                    )}
                  </div>
                )}

                {/* ── Dose breakdown chips with phase progress indicators (#5) ── */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {group.routes.map(rg => {
                    const palette = ROUTE_PALETTE[rg.paletteIndex % ROUTE_PALETTE.length]
                    return rg.doses.map(d => {
                      const doseId = d.id ?? d.doseTime.getTime().toString()
                      const isIsolated = selectedDose === doseId
                      const formatted = formatDoseAmount(d.amount, d.unit)
                      const isDoseActive = d.status.phase !== 'not_started' && d.status.phase !== 'ended'

                      return (
                        <button
                          key={`${rg.route}-${doseId}`}
                          onClick={() => handleDoseChipClick(group.key, doseId)}
                          className={`relative inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                            isIsolated
                              ? 'ring-2 ring-purple-500/50 border-purple-500/50 bg-purple-500/10'
                              : 'border-border hover:border-border/80'
                          }`}
                          style={{ color: palette.stroke }}
                        >
                          {/* Route-colored dot */}
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: palette.fill,
                              opacity: isDoseActive ? 1 : 0.4,
                            }}
                          />
                          <span>{formatted.amount}{formatUnit(formatted.unit, d.amount)}</span>
                          <span className="text-muted-foreground">{rg.route}</span>

                          {/* #5 — Phase progress indicator bar at bottom of chip */}
                          {isDoseActive && (
                            <div
                              className="absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${d.status.progress}%`,
                                background: palette.stroke,
                                opacity: 0.6,
                              }}
                            />
                          )}
                        </button>
                      )
                    })
                  })}
                  {/* Show all button when a dose is isolated */}
                  {selectedDose && (
                    <button
                      onClick={() => handleDoseChipClick(group.key, selectedDose)}
                      className="text-[10px] text-muted-foreground hover:text-foreground ml-1"
                    >
                      Show all
                    </button>
                  )}
                </div>

                {/* ── SVG Graph ── */}
                <div className="relative">
                  <svg
                    ref={el => { svgRefs.current[group.key] = el }}
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="w-full h-auto select-none"
                    role="img"
                    aria-label={`Intensity timeline for ${group.substanceName}`}
                    tabIndex={0}
                    onMouseMove={e => handleMouseMove(e, group.key, visibleRoutes, group.windowStart, group.windowDuration, group.primary.timings)}
                    onMouseLeave={() => handleMouseLeave(group.key)}
                    onKeyDown={e => {
                      // #7 — Keyboard accessibility: arrow keys move tooltip, Escape clears
                      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                        e.preventDefault()
                        const step = 2
                        const currentTip = tooltips[group.key]
                        const newProgress = currentTip
                          ? Math.max(0, Math.min(100, currentTip.progress + (e.key === 'ArrowRight' ? step : -step)))
                          : 50
                        const data = computeTooltipAtProgress(newProgress, visibleRoutes, group.windowStart, group.windowDuration, group.primary.timings)
                        if (data) {
                          setTooltips(prev => ({ ...prev, [group.key]: data }))
                          // Compute screen-space X for the tooltip div
                          const svgEl = svgRefs.current[group.key]
                          if (svgEl) {
                            const rect = svgEl.getBoundingClientRect()
                            const scaleX = SVG_W / rect.width
                            const svgXPos = toX(newProgress)
                            const screenXPos = svgXPos / scaleX
                            setTooltipX(prev => ({ ...prev, [group.key]: screenXPos }))
                          }
                        }
                      }
                      if (e.key === 'Escape') {
                        handleMouseLeave(group.key)
                      }
                    }}
                  >
                    {/* ── Defs: per-route area-fill gradients ── */}
                    <defs>
                      {visibleRoutes.map((rg, ri) => {
                        const palette = ROUTE_PALETTE[rg.paletteIndex % ROUTE_PALETTE.length]
                        return (
                          <linearGradient
                            key={`area-grad-${group.key}-${ri}`}
                            id={`area-grad-${group.key}-${ri}`}
                            x1="0" y1="0" x2="0" y2="1"
                          >
                            <stop offset="0%" stopColor={palette.fill} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={palette.fill} stopOpacity="0.02" />
                          </linearGradient>
                        )
                      })}
                    </defs>

                    {/* ── Graph area background ── */}
                    <rect
                      x={PL}
                      y={PT}
                      width={GW}
                      height={GH}
                      fill="currentColor"
                      className="text-muted/30"
                      rx="4"
                    />

                    {/* ── Phase bands (background color regions) ── */}
                    {(() => {
                      const bands = getPhaseBandRanges(bandTimings)
                      const NARROW_PX = 50  // threshold for "narrow" bands (pixels)

                      const narrowBoundaryTicks: { x: number; color: string }[] = []

                      const bandElements = bands.map((band) => {
                        const phaseBand = PHASE_BANDS.find(b => b.phase === band.phase)
                        if (!phaseBand) return null
                        const x1 = toX(band.startFrac * 100)
                        const x2 = toX(band.endFrac * 100)
                        const bandWidth = x2 - x1

                        if (bandWidth > 0 && bandWidth < NARROW_PX) {
                          narrowBoundaryTicks.push({ x: x2, color: phaseBand.fill })
                        }

                        const bandOpacity = bandWidth < 10 ? 0.25
                          : bandWidth < NARROW_PX ? 0.12
                          : 0.06

                        return (
                          <rect
                            key={band.phase}
                            x={x1}
                            y={PT}
                            width={Math.max(0, bandWidth)}
                            height={GH}
                            fill={phaseBand.fill}
                            opacity={bandOpacity}
                            rx="2"
                          />
                        )
                      })

                      const tickElements = narrowBoundaryTicks.map((tick, i) => (
                        <line
                          key={`narrow-tick-${i}`}
                          x1={tick.x}
                          y1={PT}
                          x2={tick.x}
                          y2={PT + GH}
                          stroke={tick.color}
                          strokeWidth="1.5"
                          strokeDasharray="3,3"
                          opacity="0.4"
                        />
                      ))

                      return [...bandElements, ...tickElements]
                    })()}

                    {/* ── Phase band labels (above graph) ── */}
                    {(() => {
                      const bands = getPhaseBandRanges(bandTimings)
                      const NARROW_PX = 50  // match the band rendering threshold

                      return bands.map((band, bandIdx) => {
                        const phaseBand = PHASE_BANDS.find(b => b.phase === band.phase)
                        if (!phaseBand) return null
                        const x1 = toX(band.startFrac * 100)
                        const x2 = toX(band.endFrac * 100)
                        const bandWidth = x2 - x1

                        // Wide band: centered label (current behavior)
                        if (bandWidth >= NARROW_PX) {
                          const midX = (x1 + x2) / 2
                          return (
                            <text
                              key={`label-${band.phase}`}
                              x={midX}
                              y={PT - 8}
                              textAnchor="middle"
                              fontSize="9"
                              fontWeight="500"
                              fill={phaseBand.labelColor}
                              opacity="0.7"
                            >
                              {phaseBand.name}
                            </text>
                          )
                        }

                        if (bandWidth <= 0) return null

                        let narrowCount = 0
                        for (let j = 0; j < bandIdx; j++) {
                          const prevX1 = toX(bands[j].startFrac * 100)
                          const prevX2 = toX(bands[j].endFrac * 100)
                          if (prevX2 - prevX1 > 0 && prevX2 - prevX1 < NARROW_PX) narrowCount++
                        }

                        const labelX = x2 + 6 + narrowCount * 42

                        return (
                          <g key={`label-${band.phase}`}>
                            {/* Colored dot at the phase boundary */}
                            <circle
                              cx={x2}
                              cy={PT - 5}
                              r="2.5"
                              fill={phaseBand.fill}
                              opacity="0.9"
                            />
                            {/* Thin line connecting dot to label */}
                            <line
                              x1={x2 + 2}
                              y1={PT - 5}
                              x2={labelX - 1}
                              y2={PT - 5}
                              stroke={phaseBand.fill}
                              strokeWidth="0.5"
                              opacity="0.5"
                            />
                            {/* Compact label positioned right of boundary */}
                            <text
                              x={labelX}
                              y={PT - 2}
                              textAnchor="start"
                              fontSize="8"
                              fontWeight="600"
                              fill={phaseBand.labelColor}
                              opacity="0.85"
                            >
                              {phaseBand.name}
                            </text>
                          </g>
                        )
                      })
                    })()}

                    {/* ── Intensity Y-axis labels ── */}
                    {[0, 50, 100].map(val => (
                      <text
                        key={`y-label-${val}`}
                        x={PL - 6}
                        y={toY(val) + 3}
                        textAnchor="end"
                        fontSize="9"
                        fill="currentColor"
                        className="text-muted-foreground"
                      >
                        {val}%
                      </text>
                    ))}

                    {/* ── Horizontal grid lines ── */}
                    {[25, 50, 75].map(val => (
                      <line
                        key={`grid-${val}`}
                        x1={PL}
                        y1={toY(val)}
                        x2={PL + GW}
                        y2={toY(val)}
                        stroke="currentColor"
                        className="text-muted-foreground/20"
                        strokeWidth="0.5"
                        strokeDasharray="4,4"
                      />
                    ))}

                    {/* ── Time markers (X axis ticks + labels) ── */}
                    {timeMarkers.map(marker => {
                      const mx = toX(marker.progress)
                      return (
                        <g key={marker.label}>
                          <line
                            x1={mx}
                            y1={PT + GH}
                            x2={mx}
                            y2={PT + GH + 6}
                            stroke="currentColor"
                            className="text-muted-foreground/40"
                            strokeWidth="1"
                          />
                          <text
                            x={mx}
                            y={PT + GH + 18}
                            textAnchor="middle"
                            fontSize="9"
                            fill="currentColor"
                            className="text-muted-foreground"
                          >
                            {marker.label}
                          </text>
                        </g>
                      )
                    })}

                    {/* ── Intensity curves + area fills per route ── */}
                    {(() => {
                      let globalDoseIdx = 0
                      const globalTotal = visibleRoutes.reduce((s, r) => s + r.doses.length, 0)

                      return visibleRoutes.map(rg => {
                        const palette = ROUTE_PALETTE[rg.paletteIndex % ROUTE_PALETTE.length]
                        const ri = group.routes.indexOf(rg)

                        return (
                          <g key={rg.route}>
                            {rg.doses.map((d, doseIdx) => {
                              const doseId = d.id ?? d.doseTime.getTime()
                              const doseOffset = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                              const curve = curvePath(d.timings, doseOffset, group.windowDuration)
                              const area = areaPath(d.timings, doseOffset, group.windowDuration)
                              const isPrimary = d === rg.primary
                              const isEnded = d.status.phase === 'ended'
                              const currentGlobalIdx = globalDoseIdx++
                              // When a dose is isolated, treat it as primary for styling
                              const isIsolated = selectedDose === doseId.toString()
                              const shouldBeBright = isPrimary || isIsolated || (selectedDose && globalTotal === 1)

                              return (
                                <g key={doseId} opacity={isEnded ? 0.35 : 1}>
                                  <path d={area} fill={`url(#area-grad-${group.key}-${ri})`} />
                                  <path
                                    d={curve}
                                    fill="none"
                                    stroke={palette.stroke}
                                    strokeWidth={shouldBeBright ? 2.5 : 1.5}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity={shouldBeBright ? 0.9 : 0.5}
                                  />
                                  <DoseMarker
                                    d={d}
                                    isPrimary={shouldBeBright}
                                    groupKey={group.key}
                                    hex={palette.stroke}
                                    offsetMins={doseOffset}
                                    windowDuration={group.windowDuration}
                                    isFocused={selectedDose === doseId.toString()}
                                    isMultiDose={globalTotal > 1}
                                    doseIndex={currentGlobalIdx}
                                  />
                                </g>
                              )
                            })}
                          </g>
                        )
                      })
                    })()}

                    {/* ── Hover crosshair ── */}
                    {tooltip && (() => {
                      const hx = toX(tooltip.progress)
                      const hy = toY(tooltip.intensity)
                      return (
                        <g>
                          <line
                            x1={hx}
                            y1={PT}
                            x2={hx}
                            y2={PT + GH}
                            stroke="#ffffff44"
                            strokeWidth="1"
                            strokeDasharray="4,4"
                          />
                          <circle
                            cx={hx}
                            cy={hy}
                            r="5"
                            fill="#fff"
                            stroke="#a855f7"
                            strokeWidth="2"
                          />
                        </g>
                      )
                    })()}

                    {/* #1 — Now indicator: pulsing vertical line at current time */}
                    {allActive && (() => {
                      if (nowProgress < 0 || nowProgress > 100) return null
                      const nx = toX(nowProgress)
                      return (
                        <g>
                          <line
                            x1={nx}
                            y1={PT - 4}
                            x2={nx}
                            y2={PT + GH}
                            stroke={NOW_INDICATOR.color}
                            strokeWidth={NOW_INDICATOR.strokeWidth}
                            strokeDasharray={NOW_INDICATOR.dashArray}
                            opacity="0.6"
                          />
                          <circle
                            cx={nx}
                            cy={PT - 6}
                            r={NOW_INDICATOR.dotRadius}
                            fill={NOW_INDICATOR.color}
                          >
                            <animate
                              attributeName="opacity"
                              values="1;0.3;1"
                              dur={`${NOW_INDICATOR.pulseDurationMs}ms`}
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      )
                    })()}
                  </svg>

                  {tooltip && tooltipScreenX !== undefined && (
                    <div
                      className="absolute z-20 pointer-events-none"
                      style={{
                        left: `${tooltipScreenX}px`,
                        top: '0',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div
                        className="rounded-lg border border-white/20 bg-black/70 backdrop-blur-xl px-3 py-2.5 shadow-2xl min-w-[200px] max-w-[280px]"
                        role="tooltip"
                      >
                        {/* Header: phase name + time + optional NOW badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-semibold"
                            style={{
                              color: markerHex[tooltip.phase as keyof typeof markerHex] ?? '#a855f7',
                            }}
                          >
                            {formatPhaseName(tooltip.phase)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {/* Small "NOW" badge when hovering near the current time */}
                            {(() => {
                              const isNearNow = Math.abs(tooltip.progress - nowProgress) < 3
                              if (!isNearNow) return null
                              return (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[9px] font-bold bg-rose-500/30 text-rose-300">
                                  <span className="w-1 h-1 rounded-full bg-rose-400 animate-pulse" />
                                  NOW
                                </span>
                              )
                            })()}
                            <span className="text-[10px] text-white/60">
                              {format(tooltip.absoluteTime, 'h:mm a')}
                            </span>
                          </div>
                        </div>

                        {/* #4 — Combined intensity bar (highlighted) */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-semibold text-white/50 w-20 shrink-0">
                            Combined
                          </span>
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                              style={{ width: `${Math.round(tooltip.intensity)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold w-10 text-right text-purple-300">
                            {Math.round(tooltip.intensity)}%
                          </span>
                        </div>

                        {/* Per-route intensity bars */}
                        {tooltip.routeIntensities && tooltip.routeIntensities.length > 1 && (
                          <div className="space-y-1">
                            {tooltip.routeIntensities.map((ri, idx) => {
                              const palette = ROUTE_PALETTE[ri.paletteIndex % ROUTE_PALETTE.length]
                              return (
                                <div key={`${ri.route}-${idx}`} className="flex items-center gap-2">
                                  <span className="text-[10px] font-medium text-white/50 w-20 shrink-0 truncate capitalize">
                                    {ri.route}
                                  </span>
                                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{
                                        width: `${Math.round(ri.intensity)}%`,
                                        backgroundColor: palette.stroke,
                                      }}
                                    />
                                  </div>
                                  <span className="text-[10px] w-10 text-right text-white/70">
                                    {Math.round(ri.intensity)}%
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Bottom: intensity + time-in summary */}
                        <div className="mt-2 pt-1.5 border-t border-white/10 flex items-baseline gap-2">
                          <span className="text-base font-bold text-white">
                            {Math.round(tooltip.intensity)}%
                          </span>
                          <span className="text-[10px] text-white/50">
                            intensity · {tooltip.phaseTime} in
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Footer: dose count + expand toggle ── */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>
                    {visibleRoutes.length} route{visibleRoutes.length !== 1 ? 's' : ''} ·{' '}
                    {totalDoses} dose{totalDoses !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : group.key)}
                    className="flex items-center gap-1 hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        Phase details
                      </>
                    )}
                  </button>
                </div>

                {/* #6 — Enhanced expanded phase details */}
                {isExpanded && (
                  <div className="mt-2 space-y-2">
                    {visibleRoutes.map(rg => {
                      const palette = ROUTE_PALETTE[rg.paletteIndex % ROUTE_PALETTE.length]
                      return (
                        <div key={rg.route} className="space-y-1.5">
                          {/* Route header */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: palette.fill }}
                            />
                            <span className="text-xs font-medium capitalize">{rg.route}</span>
                            {rg.uniformUnit && (
                              <span className="text-[10px] text-muted-foreground">
                                {rg.totalAmount}{rg.unit} total
                              </span>
                            )}
                          </div>

                          {/* Dose cards */}
                          {rg.doses.map(d => {
                            const doseId = d.id ?? d.doseTime.getTime()
                            const PhaseIcon = phaseIcons[d.status.phase]

                            const phases: { key: string; end: number }[] = [
                              { key: 'onset',     end: d.timings.onsetEnd  },
                              { key: 'comeup',    end: d.timings.comeupEnd },
                              { key: 'peak',      end: d.timings.peakEnd   },
                              { key: 'offset',    end: d.timings.offsetEnd },
                              ...(d.timings.afterglowEnd > d.timings.offsetEnd
                                ? [{ key: 'afterglow', end: d.timings.afterglowEnd }]
                                : []),
                            ]

                            const phaseOrder = ['onset', 'comeup', 'peak', 'offset', 'afterglow']

                            return (
                              <div key={doseId} className="ml-4 space-y-1">
                                {/* Dose amount header */}
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                  <span className="font-medium text-foreground">
                                    {formatDoseAmount(d.amount, d.unit).amount}
                                    {formatUnit(d.unit, d.amount)}
                                  </span>
                                  <span>·</span>
                                  <span>{format(d.doseTime, 'h:mm a')}</span>
                                  <span className={`inline-flex items-center gap-0.5 ${phaseColors[d.status.phase].text}`}>
                                    <PhaseIcon className="h-3 w-3" />
                                    {formatPhaseName(d.status.phase)}
                                  </span>
                                </div>

                                {/* Phase detail cards */}
                                {phases.map((p, pi) => {
                                  const start = pi === 0 ? 0 : phases[pi - 1].end
                                  const duration = Math.max(0, Math.round(p.end - start))
                                  const isActive = d.status.phase === p.key
                                  const currentPhaseIdx = phaseOrder.indexOf(d.status.phase)
                                  const isPast = d.status.phase !== 'not_started' && d.status.phase !== 'ended'
                                    ? currentPhaseIdx > pi
                                    : false

                                  // Intensity at the end of this phase
                                  const phaseEndProgress = (p.end / d.timings.totalDuration) * 100
                                  const phasePeakIntensity = intensityAt(phaseEndProgress, d.timings)

                                  return (
                                    <div
                                      key={p.key}
                                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all ${
                                        isActive
                                          ? 'ring-1 ring-purple-500/30 bg-purple-500/5'
                                          : isPast
                                            ? 'opacity-50'
                                            : 'opacity-30'
                                      }`}
                                    >
                                      {(() => {
                                        const phaseKey = p.key as PhaseName
                                        const PhaseIcon = phaseIcons[phaseKey]
                                        const pc = phaseColors[phaseKey]
                                        return (
                                          <>
                                            {/* Phase icon */}
                                            <PhaseIcon className={`h-3.5 w-3.5 shrink-0 ${pc.text}`} />

                                            {/* Phase name + duration in parentheses */}
                                            <span className={`font-medium w-16 ${pc.text}`}>
                                              {formatPhaseName(phaseKey)}
                                            </span>
                                          </>
                                        )
                                      })()}
                                      <span className="text-[10px] text-muted-foreground">
                                        ({formatMinutes(duration)})
                                      </span>

                                      {/* Mini sparkline showing intensity curve shape (#6) */}
                                      <PhaseSparkline
                                        timings={d.timings}
                                        phase={p.key}
                                        isActive={isActive}
                                      />

                                      {/* Small intensity gauge bar (#6) */}
                                      <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden max-w-[60px]">
                                        <div
                                          className="h-full rounded-full transition-all"
                                          style={{
                                            width: `${Math.round(phasePeakIntensity)}%`,
                                            backgroundColor: palette.fill,
                                            opacity: isActive ? 0.8 : 0.3,
                                          }}
                                        />
                                      </div>

                                      {/* Intensity value */}
                                      <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
                                        {Math.round(phasePeakIntensity)}%
                                      </span>

                                      {/* Pulsing dot for current phase (#6 highlight) */}
                                      {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
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
