'use client'

import { formatDoseAmount } from '@/lib/utils'

/** Format a unit with proper singular/plural based on amount */
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

/** Check if duration has incomplete phase data (only onset + total, missing individual phases) */
function hasIncompletePhases(duration: { onset?: string; comeup?: string; peak?: string; offset?: string; total?: string } | null | undefined): boolean {
  if (!duration) return false
  const hasOnset = duration.onset && duration.onset.trim() !== '' && duration.onset !== '—'
  const hasTotal = duration.total && duration.total.trim() !== '' && duration.total !== '—'
  const hasComeup = duration.comeup && duration.comeup.trim() !== '' && duration.comeup !== '—'
  const hasPeak = duration.peak && duration.peak.trim() !== '' && duration.peak !== '—'
  const hasOffset = duration.offset && duration.offset.trim() !== '' && duration.offset !== '—'
  
  // Incomplete if we have onset + total but missing at least one of comeup/peak/offset
  if (hasOnset && hasTotal && (!hasComeup || !hasPeak || !hasOffset)) {
    return true
  }
  return false
}

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { format, addMinutes } from 'date-fns'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity, Timer, Clock, Loader2, Info, ChevronDown, ChevronUp, Layers, AlertTriangle,
} from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { useDoseStore } from '@/store/dose-store'

import { EnrichedDose, RouteGroup, SubstanceGroup, TooltipData } from './dose-timeline/dose-timeline-types'
import {
  phaseColors, phaseIcons, phaseDescriptions, ROUTE_PALETTE,
  SVG_W, SVG_H, PL, PT, GW, GH, PHASE_BANDS, ENDED_DOSE_RETENTION_MINS,
} from './dose-timeline/dose-timeline-constants'
import {
  calculatePhaseTimings, getPhaseStatus, formatMinutes, formatPhaseName,
  getDoseCategories, intensityAt, phaseNameAt, toX, areaPath, curvePath,
  buildTimeMarkers, getPhaseBandRanges,
} from './dose-timeline/dose-timeline-utils'
import { DoseMarker } from './dose-timeline/dose-marker'
import { MobilePhaseBar } from './dose-timeline/mobile-phase-bar'
import { EstimatedDurationBadge } from '@/components/estimated-duration-badge'
import Link from 'next/link'
import { substances } from '@/lib/substances/index'

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface ActiveDosesTimelineProps {
  refreshTrigger?: number
}

export function ActiveDosesTimeline({ refreshTrigger }: ActiveDosesTimelineProps) {
  const { doses, isLoaded } = useDoseStore()
  const [tick, setTick]                     = useState(0)
  const [tooltips, setTooltips]             = useState<Record<string, TooltipData>>({})
  const [expandedGroup, setExpandedGroup]   = useState<string | null>(null)
  const [selectedRoutes, setSelectedRoutes] = useState<Record<string, string | null>>({})
  const [focusedDoseId, setFocusedDoseId]   = useState<string | null>(null)
  const svgRefs    = useRef<Record<string, SVGSVGElement | null>>({})
  const rafRefs    = useRef<Record<string, number | null>>({})
  const focusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    return () => {
      if (focusTimerRef.current !== null) clearTimeout(focusTimerRef.current)
    }
  }, [])

  const baseDoses = useMemo(() => {
    return doses
      .filter((d) => d.duration)
      .map((d) => {
        const timings  = calculatePhaseTimings(d.duration!)
        const doseTime = new Date(d.timestamp)
        return { ...d, timings, doseTime }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doses, refreshTrigger])

  const enriched = useMemo<EnrichedDose[]>(() => {
    return baseDoses
      .map((d) => ({ ...d, status: getPhaseStatus(d.doseTime, d.timings) }))
      .filter((d) => {
        if (d.status.phase !== 'ended') return true
        const sinceEnd = (Date.now() - d.doseTime.getTime()) / 60_000 - d.timings.totalDuration
        return sinceEnd < ENDED_DOSE_RETENTION_MINS
      })
  }, [baseDoses, tick])

  const groups = useMemo<SubstanceGroup[]>(() => {
    const substanceMap = new Map<string, EnrichedDose[]>()
    for (const d of enriched) {
      const key = d.substanceName.toLowerCase()
      const arr = substanceMap.get(key)
      if (arr) arr.push(d)
      else substanceMap.set(key, [d])
    }

    return Array.from(substanceMap.entries()).map(([substanceKey, items]) => {
      const routeMap = new Map<string, EnrichedDose[]>()
      for (const d of items) {
        const rk  = d.route.toLowerCase()
        const arr = routeMap.get(rk)
        if (arr) arr.push(d)
        else routeMap.set(rk, [d])
      }

      let paletteIndex = 0
      const routes: RouteGroup[] = Array.from(routeMap.entries()).map(([, routeDoses]) => {
        const sorted      = [...routeDoses].sort((a, b) => a.doseTime.getTime() - b.doseTime.getTime())
        const primary     = sorted.find((d) => d.status.phase !== 'ended') ?? sorted[sorted.length - 1]
        const units       = [...new Set(sorted.map((d) => d.unit))]
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

      const activeItems = items.filter((d) => d.status.phase !== 'ended')
      const windowItems = activeItems.length > 0 ? activeItems : items
      const windowStart = new Date(Math.min(...windowItems.map((d) => d.doseTime.getTime())))
      let maxEnd = 0
      for (const d of windowItems) {
        const offsetMins = (d.doseTime.getTime() - windowStart.getTime()) / 60_000
        maxEnd = Math.max(maxEnd, offsetMins + d.timings.totalDuration)
      }

      const allSorted        = [...items].sort((a, b) => a.doseTime.getTime() - b.doseTime.getTime())
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

  const handleMouseMove = useCallback(
    (groupKey: string, e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>, windowDuration: number, windowStart: Date) => {
      const pendingRaf = rafRefs.current[groupKey]
      if (pendingRaf !== null && pendingRaf !== undefined) cancelAnimationFrame(pendingRaf)

      const clientX = 'touches' in e ? e.touches[0]?.clientX ?? 0 : e.clientX
      const svgEl = e.currentTarget

      rafRefs.current[groupKey] = requestAnimationFrame(() => {
        rafRefs.current[groupKey] = null
        const ctm      = svgEl.getScreenCTM()
        const svgX     = ctm ? (clientX - ctm.e) / ctm.a : 0
        const progress = Math.max(0, Math.min(100, ((svgX - PL) / GW) * 100))
        const mins     = (progress / 100) * windowDuration
        const group    = groups.find((g) => g.key === groupKey)

        const hoverMins = mins
        let closestRoute = group?.routes[0]
        if (group) {
          let minDist = Infinity
          for (const rg of group.routes) {
            if (rg.primary.status.phase === 'ended') continue
            const offsetMins = (rg.primary.doseTime.getTime() - group.windowStart.getTime()) / 60_000
            const routeMidMins = offsetMins + rg.primary.timings.totalDuration / 2
            const dist = Math.abs(hoverMins - routeMidMins)
            if (dist < minDist) { minDist = dist; closestRoute = rg }
          }
        }
        const refTimings = closestRoute?.primary.timings

        setTooltips((prev) => ({
          ...prev,
          [groupKey]: {
            phase:        refTimings ? phaseNameAt(progress, refTimings) : '',
            phaseTime:    formatMinutes(mins),
            absoluteTime: addMinutes(windowStart, mins),
            intensity:    refTimings ? intensityAt(progress, refTimings) : 0,
            progress,
          },
        }))
      })
    },
    [groups],
  )

  const handleMouseLeave = useCallback((key: string) => {
    const pendingRaf = rafRefs.current[key]
    if (pendingRaf !== null && pendingRaf !== undefined) {
      cancelAnimationFrame(pendingRaf)
      rafRefs.current[key] = null
    }
    setTooltips((prev) => { const next = { ...prev }; delete next[key]; return next })
  }, [])

  const handleRouteClick = useCallback((substanceKey: string, route: string) => {
    setSelectedRoutes((prev) => ({ ...prev, [substanceKey]: prev[substanceKey] === route ? null : route }))
  }, [])

  const handleDoseChipClick = useCallback((doseId: string, substanceKey: string) => {
    setFocusedDoseId(doseId)
    const svg = svgRefs.current[substanceKey]
    if (svg) svg.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    if (focusTimerRef.current !== null) clearTimeout(focusTimerRef.current)
    focusTimerRef.current = setTimeout(() => setFocusedDoseId(null), 1800)
  }, [])

  const getCategoryColor = (cat: string) =>
    categoryColors[cat as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'

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
            const dose         = group.primary
            const colors       = phaseColors[dose.status.phase]
            const PhaseIcon    = phaseIcons[dose.status.phase]
            const isMultiRoute = group.routes.length > 1
            const isExpanded   = expandedGroup === group.key
            const expandedId   = `expanded-${group.key}`
            const tip          = tooltips[group.key]
            const marks        = buildTimeMarkers(group.windowDuration, group.windowStart)

            const refRoute   = group.routes.find((r) => r.primary.status.phase !== 'ended') ?? group.routes[0]
            const refTimings = refRoute.primary.timings
            const bandRanges = getPhaseBandRanges(refTimings)

            const allActive     = group.routes.some((r) => r.primary.status.phase !== 'ended')
            const selectedRoute = selectedRoutes[group.key] ?? null

            const knownSubstance = substances.find(
              s => s.id === dose.substanceId || s.name.toLowerCase() === group.substanceName.toLowerCase()
            )

            const anyEstimated = group.routes.some(rg =>
              rg.doses.some(d => d.durationIsEstimated)
            )
            // Use the first estimated dose's sourceRoute for the badge tooltip
            const estimatedSourceRoute = group.routes
              .flatMap(rg => rg.doses)
              .find(d => d.durationIsEstimated)
              ?.durationSourceRoute

            // Check if any dose has incomplete phase data
            const anyIncompletePhases = group.routes.some(rg =>
              rg.doses.some(d => hasIncompletePhases(d.duration))
            )

            return (
              <div
                key={group.key}
                className={`rounded-lg border border-border/50 bg-gradient-to-br from-background to-muted/20 p-4 space-y-4 ${!allActive ? 'opacity-80' : ''}`}
              >
                {/* ── Header ───────────────────────────────────────────── */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {knownSubstance ? (
                      <Link
                        href={`/?substance=${knownSubstance.id}`}
                        className="font-semibold text-foreground hover:underline hover:text-primary transition-colors"
                      >
                        {group.substanceName}
                      </Link>
                    ) : (
                      <span className="font-semibold text-foreground">{group.substanceName}</span>
                    )}

                    {/* ── Estimated duration badge ──────────────────────── */}
                    {anyEstimated && (
                      <EstimatedDurationBadge sourceRoute={estimatedSourceRoute} />
                    )}

                    {/* ── Incomplete phases badge ──────────────────────── */}
                    {anyIncompletePhases && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full cursor-help
                        bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        title="Duration data is incomplete. Phase timings are estimated based on onset and total duration."
                      >
                        <AlertTriangle className="h-2.5 w-2.5" />
                        Incomplete data
                      </span>
                    )}

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
                      {formatPhaseName(dose.status.phase)}
                    </Badge>
                  </div>

                  {/* Route summary pills */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {group.routes.map((rg) => {
                      const palette  = ROUTE_PALETTE[rg.paletteIndex]
                      const dc       = phaseColors[rg.primary.status.phase]
                      const isActive = selectedRoute === null || selectedRoute === rg.route
                      const timeLeft = rg.primary.status.phase === 'not_started' || rg.primary.status.phase === 'ended'
                        ? null
                        : formatMinutes(rg.primary.status.totalRemaining)
                      return (
                        <button
                          key={rg.route}
                          onClick={() => handleRouteClick(group.key, rg.route)}
                          aria-pressed={selectedRoute === rg.route}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer"
                          style={{
                            borderColor:   palette.stroke,
                            color:         isActive ? palette.stroke : palette.stroke + '55',
                            background:    selectedRoute === rg.route ? palette.stroke + '30' : isActive ? palette.stroke + '1a' : 'transparent',
                            opacity:       isActive ? 1 : 0.45,
                            outline:       selectedRoute === rg.route ? `2px solid ${palette.stroke}44` : 'none',
                            outlineOffset: '2px',
                          }}
                          title={selectedRoute === rg.route ? 'Click to show all routes' : 'Click to isolate this route'}
                        >
                          {rg.route}
                          <span className="opacity-40 font-normal">·</span>
                          {(() => {
                            if (rg.uniformUnit) {
                              const formatted = formatDoseAmount(rg.totalAmount, rg.unit)
                              return `${formatted.amount} ${formatUnit(formatted.unit, formatted.amount)}`
                            }
                            return `${rg.doses.length}×`
                          })()}
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

                {/* ── Dose breakdown table ──────────────────────────────── */}
                {group.routes.some((rg) => rg.doses.length > 1) && (
                  <div className="space-y-1.5">
                    {group.routes.map((rg) => {
                      const palette       = ROUTE_PALETTE[rg.paletteIndex]
                      const isRouteActive = selectedRoute === null || selectedRoute === rg.route
                      return (
                        <div
                          key={rg.route}
                          className="flex items-start gap-3 transition-opacity duration-200"
                          style={{ opacity: isRouteActive ? 1 : 0.35 }}
                        >
                          <button
                            className="text-xs font-semibold w-20 shrink-0 pt-0.5 text-left hover:underline transition-opacity"
                            style={{ color: palette.stroke }}
                            onClick={() => handleRouteClick(group.key, rg.route)}
                          >
                            {rg.route}
                          </button>
                          <div className="flex flex-wrap gap-1.5">
                            {rg.doses.map((d) => {
                              const dc        = phaseColors[d.status.phase]
                              const isFocused = focusedDoseId === d.id
                              return (
                                <button
                                  key={d.id}
                                  onClick={() => handleDoseChipClick(d.id, group.key)}
                                  aria-pressed={isFocused}
                                  aria-describedby={`${group.key}-graph`}
                                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-all duration-150 cursor-pointer
                                    ${dc.fill} ${dc.border}
                                    ${isFocused ? 'ring-2 ring-offset-1 ring-offset-background scale-105' : 'hover:brightness-125 hover:scale-[1.03]'}
                                  `}
                                  style={isFocused ? { ringColor: palette.stroke } : undefined}
                                  title="Click to highlight on graph"
                                >
                                  <span className="font-medium text-foreground">
                                    {(() => {
                                      const formatted = formatDoseAmount(d.amount, d.unit)
                                      return `${formatted.amount} ${formatUnit(formatted.unit, formatted.amount)}`
                                    })()}
                                  </span>
                                  <span className="text-muted-foreground">@ {format(d.doseTime, 'h:mm a')}</span>
                                  <span className={`font-medium ${dc.text}`}>
                                    {d.status.phase === 'not_started' ? 'upcoming'
                                      : d.status.phase === 'ended' ? '✓'
                                      : formatMinutes(d.status.totalRemaining)}
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

                {/* ── SVG Graph ─────────────────────────────────────────── */}
                {allActive && (
                  <div className="relative w-full overflow-hidden">
                    <svg
                      id={`${group.key}-graph`}
                      ref={(el) => { svgRefs.current[group.key] = el }}
                      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                      className="w-full h-auto max-h-56 cursor-crosshair"
                      preserveAspectRatio="xMidYMid meet"
                      role="img"
                      aria-label={`Effect intensity timeline for ${group.substanceName}`}
                      onMouseMove={(e) => handleMouseMove(group.key, e, group.windowDuration, group.windowStart)}
                      onMouseLeave={() => handleMouseLeave(group.key)}
                      onTouchMove={(e) => handleMouseMove(group.key, e, group.windowDuration, group.windowStart)}
                      onTouchEnd={() => handleMouseLeave(group.key)}
                    >
                      <title>Effect intensity timeline for {group.substanceName}</title>

                      <defs>
                        {group.routes.map((rg) => {
                          const palette = ROUTE_PALETTE[rg.paletteIndex]
                          return (
                            <g key={rg.route}>
                              <linearGradient id={`ag-${group.key}-${rg.paletteIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%"   stopColor={palette.stroke} stopOpacity="0.35" />
                                <stop offset="60%"  stopColor={palette.stroke} stopOpacity="0.12" />
                                <stop offset="100%" stopColor={palette.stroke} stopOpacity="0.03" />
                              </linearGradient>
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

                      {/* Phase background bands */}
                      <g opacity="0.12">
                        {PHASE_BANDS.map((band, i) => {
                          const { startFrac, endFrac } = bandRanges[i]
                          return (
                            <rect key={band.name}
                              x={toX(startFrac * 100)} y={PT}
                              width={(endFrac - startFrac) * GW} height={GH}
                              fill={band.fill}
                            />
                          )
                        })}
                      </g>

                      {/* Grid lines */}
                      <g className="text-muted-foreground/30" stroke="currentColor" strokeWidth="1">
                        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                          <line key={f} x1={PL} y1={PT + GH * f} x2={SVG_W - 20} y2={PT + GH * f}
                            strokeDasharray={f === 1 ? undefined : '4,4'} />
                        ))}
                      </g>

                      {/* Phase label strip */}
                      {PHASE_BANDS.map((band, i) => {
                        const { startFrac, endFrac } = bandRanges[i]
                        const px = (endFrac - startFrac) * GW
                        if (px < 12) return null
                        const midProgress = ((startFrac + endFrac) / 2) * 100
                        return (
                          <text key={band.name} x={toX(midProgress)} y={PT - 8}
                            textAnchor="middle" fontSize="11" fontWeight="600" fill={band.labelColor} opacity="0.9">
                            {px < 40 ? band.name.slice(0, 1) : px < 70 ? band.name.slice(0, 2) : band.name}
                          </text>
                        )
                      })}

                      {/* Area fills */}
                      {group.routes.map((rg) => {
                        const palette    = ROUTE_PALETTE[rg.paletteIndex]
                        const isIsolated = selectedRoute !== null && selectedRoute !== rg.route
                        return rg.doses
                          .filter((d) => d.status.phase !== 'ended')
                          .map((d) => {
                            const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                            const area       = areaPath(d.timings, offsetMins, group.windowDuration)
                            return (
                              <path key={`area-${rg.route}-${d.id}`} d={area}
                                fill={`url(#ag-${group.key}-${rg.paletteIndex})`}
                                opacity={isIsolated ? 0.1 : 1}
                                style={{ transition: 'opacity 0.2s ease' }}
                              />
                            )
                          })
                      })}

                      {/* Curves */}
                      {group.routes.map((rg) => {
                        const palette    = ROUTE_PALETTE[rg.paletteIndex]
                        const isIsolated = selectedRoute !== null && selectedRoute !== rg.route
                        return rg.doses
                          .filter((d) => d.status.phase !== 'ended')
                          .map((d) => {
                            const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                            const curve      = curvePath(d.timings, offsetMins, group.windowDuration)
                            const isPrimary  = d.id === rg.primary.id
                            // Dashed stroke for estimated durations
                            const isEstimated = d.durationIsEstimated
                            // Dotted stroke for incomplete phases
                            const isIncomplete = hasIncompletePhases(d.duration)
                            return (
                              <path key={`curve-${rg.route}-${d.id}`} d={curve}
                                fill="none"
                                stroke={palette.stroke}
                                strokeWidth={selectedRoute === rg.route ? 3 : 2.5}
                                strokeDasharray={isEstimated ? '8,4' : isIncomplete ? '4,2' : undefined}
                                filter={`url(#glow-${group.key}-${rg.paletteIndex})`}
                                opacity={isIsolated ? 0.15 : isPrimary ? 1 : 0.5}
                                style={{ transition: 'opacity 0.2s ease' }}
                              />
                            )
                          })
                      })}

                      {/* Dose markers */}
                      {group.routes.map((rg) => {
                        const palette    = ROUTE_PALETTE[rg.paletteIndex]
                        const isIsolated = selectedRoute !== null && selectedRoute !== rg.route
                        return (
                          <g key={`markers-${rg.route}`} opacity={isIsolated ? 0.2 : 1} style={{ transition: 'opacity 0.2s ease' }}>
                            {rg.doses.filter((d) => d.status.phase !== 'ended').map((d, di) => {
                              const doseOffsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                              return (
                                <DoseMarker
                                  key={d.id}
                                  d={d}
                                  isPrimary={di === 0}
                                  groupKey={group.key}
                                  hex={palette.stroke}
                                  offsetMins={doseOffsetMins}
                                  windowDuration={group.windowDuration}
                                  isFocused={focusedDoseId === d.id}
                                />
                              )
                            })}
                          </g>
                        )
                      })}

                      {/* Time axis */}
                      <g fontSize="10" fill="currentColor" className="text-muted-foreground/60">
                        {marks.map((m, i) => (
                          <text key={i} x={toX(m.progress)} y={SVG_H - 40 + 14} textAnchor="middle">
                            {m.label}
                          </text>
                        ))}
                      </g>

                      {/* Route legend */}
                      {isMultiRoute && (
                        <g>
                          {group.routes.map((rg, li) => {
                            const palette    = ROUTE_PALETTE[rg.paletteIndex]
                            const lx         = PL + li * 120
                            const ly         = SVG_H - 7
                            const isSelected = selectedRoute === rg.route
                            const isIsolated = selectedRoute !== null && !isSelected
                            return (
                              <g key={rg.route}
                                onClick={() => handleRouteClick(group.key, rg.route)}
                                role="button"
                                aria-pressed={isSelected}
                                aria-label={`${isSelected ? 'Deselect' : 'Isolate'} ${rg.route} route`}
                                className="cursor-pointer"
                                opacity={isIsolated ? 0.35 : 1}
                                style={{ transition: 'opacity 0.2s ease' }}
                              >
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
                          stroke="#fff" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.5"
                        />
                      )}
                    </svg>

                    {/* Hover tooltip */}
                    {tip && (
                      <div className="mt-2 p-3 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg text-sm border border-border/50 backdrop-blur-sm space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              tip.phase === 'Onset'   ? 'text-blue-400'
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
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pb-0.5">
                            <span>Estimated effect intensity at this moment</span>
                            <span>0 → max</span>
                          </div>
                          {group.routes.map((rg) => {
                            if (rg.primary.status.phase === 'ended') return null
                            const palette       = ROUTE_PALETTE[rg.paletteIndex]
                            const offsetMins    = (rg.primary.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                            const hoverMins     = (tip.progress / 100) * group.windowDuration
                            const localMins     = hoverMins - offsetMins
                            const localProgress = Math.max(0, Math.min(100, (localMins / rg.primary.timings.totalDuration) * 100))
                            const intensity     = localMins < 0 || localMins > rg.primary.timings.totalDuration
                              ? 0
                              : Math.round(intensityAt(localProgress, rg.primary.timings))
                            return (
                              <div key={rg.route} className="flex items-center gap-2">
                                <span className="text-xs font-semibold w-20 shrink-0" style={{ color: palette.stroke }}>{rg.route}</span>
                                <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all"
                                    style={{ width: `${intensity}%`, background: palette.stroke }} />
                                </div>
                                <span className="text-xs font-medium w-10 text-right" style={{ color: palette.stroke }}>
                                  {intensity}%
                                </span>
                              </div>
                            )
                          })}
                        </div>
                        {/* Estimated duration note in tooltip */}
                        {anyEstimated && (
                          <p className="text-[10px] text-amber-400/70 border-t border-border/30 pt-2 flex items-center gap-1">
                            <span>⚗</span>
                            Timeline curve is based on interpolated duration data — actual timing may vary.
                          </p>
                        )}
                        {/* Incomplete phases note in tooltip */}
                        {anyIncompletePhases && (
                          <p className="text-[10px] text-blue-400/70 border-t border-border/30 pt-2 flex items-center gap-1">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Phase timings are estimated from onset and total duration — individual phases may differ.
                          </p>
                        )}
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
                      aria-expanded={isExpanded}
                      aria-controls={expandedId}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded phase details ────────────────────────────── */}
                {isExpanded && (
                  <div id={expandedId} className="pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {([
                        { label: 'Onset',  time: dose.duration?.onset,  pc: phaseColors.onset  },
                        { label: 'Comeup', time: dose.duration?.comeup, pc: phaseColors.comeup },
                        { label: 'Peak',   time: dose.duration?.peak,   pc: phaseColors.peak   },
                        { label: 'Offset', time: dose.duration?.offset, pc: phaseColors.offset },
                      ] as const).map((p) => (
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
                    {/* Estimated duration detail in expanded section */}
                    {anyEstimated && (
                      <div className="text-xs flex items-start gap-1.5 bg-amber-500/8 border border-amber-500/20 p-2 rounded">
                        <span className="text-amber-400 shrink-0">⚗</span>
                        <span className="text-amber-300/80">
                          Duration interpolated from <span className="font-medium">{estimatedSourceRoute}</span> route data.
                          Timeline is an estimate — actual phases may differ.
                        </span>
                      </div>
                    )}
                    {/* Incomplete phases disclaimer in expanded section */}
                    {anyIncompletePhases && (
                      <div className="text-xs flex items-start gap-1.5 bg-blue-500/8 border border-blue-500/20 p-2 rounded">
                        <AlertTriangle className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-blue-300/80">
                          <span className="font-medium text-blue-400">Incomplete duration data.</span> Only onset and total duration were provided.
                          Phase timings (comeup, peak, offset) are estimated proportionally and may not reflect actual experience.
                        </span>
                      </div>
                    )}
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
