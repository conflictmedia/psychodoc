'use client'

import { format } from 'date-fns'
import { Clock, Layers } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SubstanceGroup, EnrichedDose } from './dose-timeline-types'
import {
  phaseColors,
  phaseIcons,
  ROUTE_PALETTE,
  PHASE_BANDS,
  MOBILE_SVG_W,
  MOBILE_SVG_H,
  MOBILE_PL,
  MOBILE_PT,
  MOBILE_GW,
  MOBILE_GH,
} from './dose-timeline-constants'
import {
  formatMinutes,
  formatPhaseName,
  intensityAt,
  getPhaseBandRanges,
  toMobileX,
  toMobileY,
  mobileCurvePath,
  mobileAreaPath,
} from './dose-timeline-utils'
import { formatDoseAmount } from '@/lib/utils'
import { substances } from '@/lib/substances/index'

interface MobilePhaseBarProps {
  group: SubstanceGroup
}

/**
 * Mobile dose marker component for the timeline graph
 */
function MobileDoseMarker({
  d,
  hex,
  offsetMins,
  windowDuration,
}: {
  d: EnrichedDose
  hex: string
  offsetMins: number
  windowDuration: number
}) {
  // Calculate current position
  const elapsedMins =
    d.status.phase === 'not_started'
      ? 0
      : d.status.phase === 'ended'
        ? d.timings.totalDuration
        : d.timings.totalDuration - d.status.totalRemaining
  const localProgress = Math.max(0, Math.min(100, (elapsedMins / d.timings.totalDuration) * 100))

  const globalMins = offsetMins + elapsedMins
  const globalProgress = (globalMins / windowDuration) * 100

  const mx = toMobileX(globalProgress)
  const my = toMobileY(intensityAt(localProgress, d.timings))
  const isEnded = d.status.phase === 'ended'
  const radius = 4

  return (
    <g opacity={isEnded ? 0.35 : 1}>
      {/* Vertical guide line */}
      {!isEnded && (
        <line
          x1={mx}
          y1={MOBILE_PT}
          x2={mx}
          y2={MOBILE_PT + MOBILE_GH}
          stroke={hex}
          strokeWidth={1}
          strokeDasharray="2,2"
          opacity={0.3}
        />
      )}

      {/* Main dot */}
      <circle
        cx={mx}
        cy={my}
        r={radius}
        fill={d.status.phase === 'not_started' ? 'none' : hex}
        stroke={d.status.phase === 'not_started' ? hex : '#ffffff88'}
        strokeWidth={1}
      />
    </g>
  )
}

/**
 * Mobile card — one per SubstanceGroup.
 * Shows a full timeline graph with multiple dose curves per route.
 */
export function MobilePhaseBar({ group }: MobilePhaseBarProps) {
  const dose = group.primary
  const colors = phaseColors[dose.status.phase]
  const PhaseIcon = phaseIcons[dose.status.phase]
  const isMultiRoute = group.routes.length > 1

  // Check if it's a known substance
  const knownSubstance = substances.find(
    (s) =>
      s.id === dose.substanceId ||
      s.name.toLowerCase() === group.substanceName.toLowerCase()
  )

  // Calculate window duration that includes all doses
  let maxEnd = 0
  for (const rg of group.routes) {
    for (const d of rg.doses) {
      const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
      maxEnd = Math.max(maxEnd, offsetMins + d.timings.totalDuration)
    }
  }
  const windowDuration = Math.max(maxEnd, group.windowDuration)

  // Phase band ranges based on primary route timings
  const refRoute =
    group.routes.find((r) => r.primary.status.phase !== 'ended') ?? group.routes[0]
  const refTimings = refRoute.primary.timings
  const bandRanges = getPhaseBandRanges(refTimings)

  // Build time markers for mobile
  const hours = windowDuration / 60
  const step = hours > 6 ? 2 : 1
  const timeMarkers: { progress: number; label: string }[] = []
  for (let h = 0; h <= hours; h += step) {
    const p = ((h * 60) / windowDuration) * 100
    if (p <= 100) {
      timeMarkers.push({
        progress: p,
        label: format(new Date(group.windowStart.getTime() + h * 60 * 60 * 1000), 'h:mm'),
      })
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-semibold text-base">
            {knownSubstance ? (
              <Link
                href={`/?substance=${knownSubstance.id}`}
                className="hover:underline hover:text-primary transition-colors"
              >
                {group.substanceName}
              </Link>
            ) : (
              <span>{group.substanceName}</span>
            )}
            {isMultiRoute && (
              <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-full">
                <Layers className="h-3 w-3" />
                {group.routes.length} routes
              </span>
            )}
          </div>

          {/* Dose summary per route */}
          <div className="mt-1 space-y-0.5">
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              const totalFormatted = rg.uniformUnit
                ? formatDoseAmount(rg.totalAmount, rg.unit)
                : null
              return (
                <div key={rg.route} className="text-xs text-muted-foreground">
                  <span className="font-medium" style={{ color: palette.stroke }}>
                    {rg.route}
                  </span>
                  {' · '}
                  {totalFormatted
                    ? `${totalFormatted.amount} ${totalFormatted.unit}`
                    : `${rg.doses.length} doses`}
                </div>
              )
            })}
          </div>
        </div>

        <Badge className={`${colors.bg} text-white text-xs shrink-0`}>
          <PhaseIcon className="h-3 w-3 mr-1" />
          {formatPhaseName(dose.status.phase)}
        </Badge>
      </div>

      {/* Timeline SVG Graph */}
      {group.routes.some((rg) => rg.primary.status.phase !== 'ended') && (
        <div className="relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${MOBILE_SVG_W} ${MOBILE_SVG_H}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label={`Effect intensity timeline for ${group.substanceName}`}
          >
            <title>Effect intensity timeline for {group.substanceName}</title>

            <defs>
              {group.routes.map((rg) => {
                const palette = ROUTE_PALETTE[rg.paletteIndex]
                return (
                  <g key={rg.route}>
                    <linearGradient
                      id={`mobile-ag-${group.key}-${rg.paletteIndex}`}
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor={palette.stroke} stopOpacity="0.35" />
                      <stop offset="60%" stopColor={palette.stroke} stopOpacity="0.12" />
                      <stop offset="100%" stopColor={palette.stroke} stopOpacity="0.03" />
                    </linearGradient>
                  </g>
                )
              })}
            </defs>

            {/* Phase background bands */}
            <g opacity="0.12">
              {PHASE_BANDS.map((band, i) => {
                const { startFrac, endFrac } = bandRanges[i]
                return (
                  <rect
                    key={band.name}
                    x={toMobileX(startFrac * 100)}
                    y={MOBILE_PT}
                    width={(endFrac - startFrac) * MOBILE_GW}
                    height={MOBILE_GH}
                    fill={band.fill}
                  />
                )
              })}
            </g>

            {/* Grid lines */}
            <g className="text-muted-foreground/30" stroke="currentColor" strokeWidth="0.5">
              {[0, 0.5, 1].map((f) => (
                <line
                  key={f}
                  x1={MOBILE_PL}
                  y1={MOBILE_PT + MOBILE_GH * f}
                  x2={MOBILE_SVG_W - 15}
                  y2={MOBILE_PT + MOBILE_GH * f}
                  strokeDasharray={f === 1 ? undefined : '3,3'}
                />
              ))}
            </g>

            {/* Phase label strip (top) */}
            {PHASE_BANDS.map((band, i) => {
              const { startFrac, endFrac } = bandRanges[i]
              const px = (endFrac - startFrac) * MOBILE_GW
              if (px < 10) return null
              const midProgress = ((startFrac + endFrac) / 2) * 100
              return (
                <text
                  key={band.name}
                  x={toMobileX(midProgress)}
                  y={MOBILE_PT - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="600"
                  fill={band.labelColor}
                  opacity="0.9"
                >
                  {px < 30 ? band.name.slice(0, 1) : band.name}
                </text>
              )
            })}

            {/* Per-route area fills (behind curves) */}
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              return rg.doses
                .filter((d) => d.status.phase !== 'ended')
                .map((d) => {
                  const offsetMins =
                    (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                  const area = mobileAreaPath(d.timings, offsetMins, windowDuration)
                  return (
                    <path
                      key={`area-${rg.route}-${d.id}`}
                      d={area}
                      fill={`url(#mobile-ag-${group.key}-${rg.paletteIndex})`}
                    />
                  )
                })
            })}

            {/* Per-route curves - ALL doses per route */}
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              return rg.doses.map((d) => {
                const offsetMins =
                  (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                const curve = mobileCurvePath(d.timings, offsetMins, windowDuration)
                const isActive = d.status.phase !== 'ended'
                const isPrimary = d.id === rg.primary.id
                return (
                  <path
                    key={`curve-${rg.route}-${d.id}`}
                    d={curve}
                    fill="none"
                    stroke={palette.stroke}
                    strokeWidth={isPrimary ? 2 : 1.5}
                    opacity={isActive ? (isPrimary ? 1 : 0.6) : 0.3}
                  />
                )
              })
            })}

            {/* Dose markers for all doses */}
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              return rg.doses.map((d) => {
                const doseOffsetMins =
                  (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                return (
                  <MobileDoseMarker
                    key={`marker-${d.id}`}
                    d={d}
                    hex={palette.stroke}
                    offsetMins={doseOffsetMins}
                    windowDuration={windowDuration}
                  />
                )
              })
            })}

            {/* Time axis labels */}
            <g fontSize="8" fill="currentColor" className="text-muted-foreground/60">
              {timeMarkers.map((m, i) => (
                <text key={i} x={toMobileX(m.progress)} y={MOBILE_SVG_H - 8} textAnchor="middle">
                  {m.label}
                </text>
              ))}
            </g>

            {/* Route legend (if multi-route) */}
            {isMultiRoute && (
              <g>
                {group.routes.map((rg, li) => {
                  const palette = ROUTE_PALETTE[rg.paletteIndex]
                  const lx = MOBILE_PL + li * 70
                  const ly = MOBILE_SVG_H - 2
                  return (
                    <g key={rg.route}>
                      <line
                        x1={lx}
                        y1={ly - 4}
                        x2={lx + 16}
                        y2={ly - 4}
                        stroke={palette.stroke}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                      />
                      <circle cx={lx + 8} cy={ly - 4} r="2" fill={palette.stroke} />
                      <text
                        x={lx + 20}
                        y={ly}
                        fontSize="8"
                        fill={palette.stroke}
                        fontWeight="600"
                      >
                        {rg.route}
                      </text>
                    </g>
                  )
                })}
              </g>
            )}
          </svg>
        </div>
      )}

      {/* Dose breakdown list */}
      <div className="space-y-1">
        {group.routes.map((rg) => {
          const palette = ROUTE_PALETTE[rg.paletteIndex]
          return (
            <div key={rg.route} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: palette.stroke }}>
                  {rg.route}
                </span>
                {rg.primary.status.phase !== 'ended' && rg.primary.status.phase !== 'not_started' && (
                  <span className="text-muted-foreground">
                    {formatMinutes(rg.primary.status.totalRemaining)} left
                  </span>
                )}
              </div>
              {rg.doses.length > 1 && (
                <div className="mt-0.5 pl-2 space-y-0.5">
                  {rg.doses.map((d) => {
                    const formattedDose = formatDoseAmount(d.amount, d.unit)
                    const dc = phaseColors[d.status.phase]
                    return (
                      <div key={d.id} className="flex items-center gap-1 text-muted-foreground">
                        <span className="opacity-50">·</span>
                        <span>
                          {formattedDose.amount} {formattedDose.unit}
                        </span>
                        <span className="opacity-60">@ {format(d.doseTime, 'h:mm a')}</span>
                        <span className={`text-[10px] font-medium ${dc.text}`}>
                          {d.status.phase === 'not_started'
                            ? 'upcoming'
                            : d.status.phase === 'ended'
                              ? 'done'
                              : formatMinutes(d.status.totalRemaining)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {dose.status.phase === 'ended' && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Experience concluded
        </p>
      )}
    </div>
  )
}
