'use client'

import { formatDoseAmount } from '@/lib/utils'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { format, addMinutes } from 'date-fns'
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
  Info,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { useDoseStore } from '@/store/dose-store'

import { EnrichedDose, RouteGroup, SubstanceGroup, TooltipData } from './dose-timeline/dose-timeline-types'
import {
  phaseColors,
  phaseIcons,
  phaseDescriptions,
  ROUTE_PALETTE,
  SVG_W,
  SVG_H,
  PL,
  PT,
  GW,
  GH,
} from './dose-timeline/dose-timeline-constants'
import {
  calculatePhaseTimings,
  getPhaseStatus,
  formatMinutes,
  getDoseCategories,
  intensityAt,
  phaseNameAt,
  toX,
  areaPath,
  curvePath,
  buildTimeMarkers,
} from './dose-timeline/dose-timeline-utils'
import { DoseMarker } from './dose-timeline/dose-marker'
import { MobilePhaseBar } from './dose-timeline/mobile-phase-bar'

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
  const svgRefs = useRef<Record<string, SVGSVGElement | null>>({})
  const rafRef  = useRef<number | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  // ── Enrich doses ─────────────────────────────────────────────────────────
  const enriched = useMemo<EnrichedDose[]>(() => {
    return doses
      .filter((d) => d.duration)
      .map((d) => {
        const timings  = calculatePhaseTimings(d.duration!)
        const doseTime = new Date(d.timestamp)
        const status   = getPhaseStatus(doseTime, timings)
        return { ...d, timings, status, doseTime }
      })
      .filter((d) => {
        if (d.status.phase !== 'ended') return true
        const sinceEnd = (Date.now() - d.doseTime.getTime()) / 60_000 - d.timings.totalDuration
        return sinceEnd < 720
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doses, tick, refreshTrigger])

  // ── Group by substance, then sub-group by route ───────────────────────────
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

      // Base the window only on active doses so ended doses don't skew the time axis.
      // Fall back to all doses only when everything has ended.
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

  // ── SVG mouse interaction ─────────────────────────────────────────────────

  const handleMouseMove = useCallback(
    (groupKey: string, e: React.MouseEvent<SVGSVGElement>, windowDuration: number, windowStart: Date) => {
      if (rafRef.current !== null) return
      const { clientX } = e
      const svgEl = e.currentTarget
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        // getScreenCTM gives the correct mapping even with preserveAspectRatio letterboxing
        const ctm      = svgEl.getScreenCTM()
        const svgX     = ctm ? (clientX - ctm.e) / ctm.a : 0
        const progress = Math.max(0, Math.min(100, ((svgX - PL) / GW) * 100))
        const mins     = (progress / 100) * windowDuration
        const group    = groups.find((g) => g.key === groupKey)
        const refTimings = group?.routes[0]?.primary.timings
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

  const handleRouteClick = useCallback((substanceKey: string, route: string) => {
    setSelectedRoutes((prev) => ({
      ...prev,
      [substanceKey]: prev[substanceKey] === route ? null : route,
    }))
  }, [])

  const handleDoseChipClick = useCallback((doseId: string, substanceKey: string) => {
    setFocusedDoseId(doseId)
    const svg = svgRefs.current[substanceKey]
    if (svg) svg.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    setTimeout(() => setFocusedDoseId(null), 1800)
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getCategoryColor = (cat: string) =>
    categoryColors[cat as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'

  // ── Render ────────────────────────────────────────────────────────────────

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
            const tip          = tooltips[group.key]
            const marks        = buildTimeMarkers(group.windowDuration, group.windowStart)

            // Phase labels + background rects driven by earliest active route
            const refRoute   = group.routes.find((r) => r.primary.status.phase !== 'ended') ?? group.routes[0]
            const refTimings = refRoute.primary.timings
            const phaseLabels = [
              { name: 'Onset',  s: 0,                                                       e: (refTimings.onsetEnd  / refTimings.totalDuration) * 100, color: '#60a5fa' },
              { name: 'Comeup', s: (refTimings.onsetEnd  / refTimings.totalDuration) * 100, e: (refTimings.comeupEnd / refTimings.totalDuration) * 100, color: '#fbbf24' },
              { name: 'Peak',   s: (refTimings.comeupEnd / refTimings.totalDuration) * 100, e: (refTimings.peakEnd   / refTimings.totalDuration) * 100, color: '#c084fc' },
              { name: 'Offset', s: (refTimings.peakEnd   / refTimings.totalDuration) * 100, e: 100,                                                     color: '#22d3ee' },
            ]
            const phaseRects = [
              { start: 0,                    end: refTimings.onsetEnd,  fill: '#3b82f6' },
              { start: refTimings.onsetEnd,  end: refTimings.comeupEnd, fill: '#f59e0b' },
              { start: refTimings.comeupEnd, end: refTimings.peakEnd,   fill: '#a855f7' },
              { start: refTimings.peakEnd,   end: refTimings.offsetEnd, fill: '#06b6d4' },
            ]

            const allActive    = group.routes.some((r) => r.primary.status.phase !== 'ended')
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
                              return `${formatted.amount} ${formatted.unit}`
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
                                      return `${formatted.amount} ${formatted.unit}`
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
                        {phaseRects.map((r, i) => (
                          <rect key={i}
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
                          <line key={f} x1={PL} y1={PT + GH * f} x2={SVG_W - 20} y2={PT + GH * f}
                            strokeDasharray={f === 1 ? undefined : '4,4'} />
                        ))}
                      </g>

                      {/* Phase label strip (top) */}
                      {phaseLabels.map((lbl, i) => {
                        const px = ((lbl.e - lbl.s) / 100) * GW
                        if (px < 12) return null
                        return (
                          <text key={i} x={toX((lbl.s + lbl.e) / 2)} y={PT - 8}
                            textAnchor="middle" fontSize="11" fontWeight="600" fill={lbl.color} opacity="0.9">
                            {px < 40 ? lbl.name.slice(0, 1) : px < 70 ? lbl.name.slice(0, 2) : lbl.name}
                          </text>
                        )
                      })}

                      {/* Per-route area fills (behind curves) */}
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

                      {/* Per-route curves */}
                      {group.routes.map((rg) => {
                        const palette    = ROUTE_PALETTE[rg.paletteIndex]
                        const isIsolated = selectedRoute !== null && selectedRoute !== rg.route
                        return rg.doses
                          .filter((d) => d.status.phase !== 'ended')
                          .map((d, di) => {
                            const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                            const curve      = curvePath(d.timings, offsetMins, group.windowDuration)
                            // Dim non-primary curves slightly so the latest active stands out
                            const isPrimary  = d.id === rg.primary.id
                            return (
                              <path key={`curve-${rg.route}-${d.id}`} d={curve}
                                fill="none"
                                stroke={palette.stroke}
                                strokeWidth={selectedRoute === rg.route ? 3 : 2.5}
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

                      {/* Time axis labels */}
                      <g fontSize="10" fill="currentColor" className="text-muted-foreground/60">
                        {marks.map((m, i) => (
                          <text key={i} x={toX(m.progress)} y={SVG_H - 40 + 14} textAnchor="middle">
                            {m.label}
                          </text>
                        ))}
                      </g>

                      {/* Route legend (bottom) — clickable */}
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
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded phase details ────────────────────────────── */}
                {isExpanded && (
                  <div className="pt-3 border-t border-border/50 space-y-3">
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
