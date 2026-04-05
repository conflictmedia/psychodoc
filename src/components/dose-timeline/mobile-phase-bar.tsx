'use client'

import { format } from 'date-fns'
import { Clock, Layers, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SubstanceGroup, EnrichedDose } from './dose-timeline-types'
import {
  phaseColors, phaseIcons, ROUTE_PALETTE, PHASE_BANDS,
  MOBILE_SVG_W, MOBILE_SVG_H, MOBILE_PL, MOBILE_PT, MOBILE_GW, MOBILE_GH,
} from './dose-timeline-constants'
import {
  formatMinutes, formatPhaseName, intensityAt, getPhaseBandRanges,
  toMobileX, toMobileY, mobileCurvePath, mobileAreaPath,
} from './dose-timeline-utils'
import { formatDoseAmount } from '@/lib/utils'
import { substances } from '@/lib/substances/index'
import { EstimatedDurationBadge } from '@/components/estimated-duration-badge'

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

interface MobilePhaseBarProps {
  group: SubstanceGroup
}

function MobileDoseMarker({
  d, hex, offsetMins, windowDuration,
}: {
  d: EnrichedDose
  hex: string
  offsetMins: number
  windowDuration: number
}) {
  const elapsedMins =
    d.status.phase === 'not_started' ? 0
    : d.status.phase === 'ended'     ? d.timings.totalDuration
    : d.timings.totalDuration - d.status.totalRemaining
  const localProgress = Math.max(0, Math.min(100, (elapsedMins / d.timings.totalDuration) * 100))
  const globalMins     = offsetMins + elapsedMins
  const globalProgress = (globalMins / windowDuration) * 100
  const mx     = toMobileX(globalProgress)
  const my     = toMobileY(intensityAt(localProgress, d.timings))
  const isEnded = d.status.phase === 'ended'

  return (
    <g opacity={isEnded ? 0.35 : 1}>
      {!isEnded && (
        <line
          x1={mx} y1={MOBILE_PT} x2={mx} y2={MOBILE_PT + MOBILE_GH}
          stroke={hex} strokeWidth={1} strokeDasharray="2,2" opacity={0.3}
        />
      )}
      <circle
        cx={mx} cy={my} r={4}
        fill={d.status.phase === 'not_started' ? 'none' : hex}
        stroke={d.status.phase === 'not_started' ? hex : '#ffffff88'}
        strokeWidth={1}
      />
    </g>
  )
}

export function MobilePhaseBar({ group }: MobilePhaseBarProps) {
  const dose         = group.primary
  const colors       = phaseColors[dose.status.phase]
  const PhaseIcon    = phaseIcons[dose.status.phase]
  const isMultiRoute = group.routes.length > 1

  const knownSubstance = substances.find(
    (s) => s.id === dose.substanceId || s.name.toLowerCase() === group.substanceName.toLowerCase()
  )

  // ── Estimated duration detection ─────────────────────────────────────────
  const anyEstimated = group.routes.some(rg => rg.doses.some(d => d.durationIsEstimated))
  const estimatedSourceRoute = group.routes
    .flatMap(rg => rg.doses)
    .find(d => d.durationIsEstimated)
    ?.durationSourceRoute

  // ── Incomplete phases detection ─────────────────────────────────────────
  const anyIncompletePhases = group.routes.some(rg =>
    rg.doses.some(d => hasIncompletePhases(d.duration))
  )

  let maxEnd = 0
  for (const rg of group.routes) {
    for (const d of rg.doses) {
      const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
      maxEnd = Math.max(maxEnd, offsetMins + d.timings.totalDuration)
    }
  }
  const windowDuration = Math.max(maxEnd, group.windowDuration)

  const refRoute   = group.routes.find((r) => r.primary.status.phase !== 'ended') ?? group.routes[0]
  const refTimings = refRoute.primary.timings
  const bandRanges = getPhaseBandRanges(refTimings)

  const hours = windowDuration / 60
  const step  = hours > 6 ? 2 : 1
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
          <div className="flex items-center gap-1.5 font-semibold text-base flex-wrap">
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

            {/* ── Estimated duration badge ──────────────────────────────── */}
            {anyEstimated && (
              <EstimatedDurationBadge sourceRoute={estimatedSourceRoute} />
            )}

            {/* ── Incomplete phases badge ──────────────────────────────── */}
            {anyIncompletePhases && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full cursor-help
                bg-blue-500/15 text-blue-400 border border-blue-500/30"
                title="Duration data is incomplete. Phase timings are estimated based on onset and total duration."
              >
                <AlertTriangle className="h-2.5 w-2.5" />
                Incomplete
              </span>
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
              const totalFormatted = rg.uniformUnit ? formatDoseAmount(rg.totalAmount, rg.unit) : null
              return (
                <div key={rg.route} className="text-xs text-muted-foreground">
                  <span className="font-medium" style={{ color: palette.stroke }}>{rg.route}</span>
                  {' · '}
                  {totalFormatted ? `${totalFormatted.amount} ${totalFormatted.unit}` : `${rg.doses.length} doses`}
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
                  <linearGradient
                    key={rg.route}
                    id={`mobile-ag-${group.key}-${rg.paletteIndex}`}
                    x1="0%" y1="0%" x2="0%" y2="100%"
                  >
                    <stop offset="0%"   stopColor={palette.stroke} stopOpacity="0.35" />
                    <stop offset="60%"  stopColor={palette.stroke} stopOpacity="0.12" />
                    <stop offset="100%" stopColor={palette.stroke} stopOpacity="0.03" />
                  </linearGradient>
                )
              })}
            </defs>

            {/* Phase background bands */}
            <g opacity="0.12">
              {PHASE_BANDS.map((band, i) => {
                const { startFrac, endFrac } = bandRanges[i]
                return (
                  <rect key={band.name}
                    x={toMobileX(startFrac * 100)} y={MOBILE_PT}
                    width={(endFrac - startFrac) * MOBILE_GW} height={MOBILE_GH}
                    fill={band.fill}
                  />
                )
              })}
            </g>

            {/* Grid lines */}
            <g className="text-muted-foreground/30" stroke="currentColor" strokeWidth="0.5">
              {[0, 0.5, 1].map((f) => (
                <line key={f}
                  x1={MOBILE_PL} y1={MOBILE_PT + MOBILE_GH * f}
                  x2={MOBILE_SVG_W - 15} y2={MOBILE_PT + MOBILE_GH * f}
                  strokeDasharray={f === 1 ? undefined : '3,3'}
                />
              ))}
            </g>

            {/* Phase label strip */}
            {PHASE_BANDS.map((band, i) => {
              const { startFrac, endFrac } = bandRanges[i]
              const px = (endFrac - startFrac) * MOBILE_GW
              if (px < 10) return null
              const midProgress = ((startFrac + endFrac) / 2) * 100
              return (
                <text key={band.name}
                  x={toMobileX(midProgress)} y={MOBILE_PT - 6}
                  textAnchor="middle" fontSize="9" fontWeight="600"
                  fill={band.labelColor} opacity="0.9"
                >
                  {px < 30 ? band.name.slice(0, 1) : band.name}
                </text>
              )
            })}

            {/* Area fills */}
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              return rg.doses
                .filter((d) => d.status.phase !== 'ended')
                .map((d) => {
                  const offsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                  return (
                    <path
                      key={`area-${rg.route}-${d.id}`}
                      d={mobileAreaPath(d.timings, offsetMins, windowDuration)}
                      fill={`url(#mobile-ag-${group.key}-${rg.paletteIndex})`}
                    />
                  )
                })
            })}

            {/* Curves — dashed when estimated, dotted when incomplete */}
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              return rg.doses.map((d) => {
                const offsetMins  = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
                const curve       = mobileCurvePath(d.timings, offsetMins, windowDuration)
                const isActive    = d.status.phase !== 'ended'
                const isPrimary   = d.id === rg.primary.id
                const isEstimated = d.durationIsEstimated
                const isIncomplete = hasIncompletePhases(d.duration)
                return (
                  <path
                    key={`curve-${rg.route}-${d.id}`}
                    d={curve}
                    fill="none"
                    stroke={palette.stroke}
                    strokeWidth={isPrimary ? 2 : 1.5}
                    strokeDasharray={isEstimated ? '6,3' : isIncomplete ? '4,2' : undefined}
                    opacity={isActive ? (isPrimary ? 1 : 0.6) : 0.3}
                  />
                )
              })
            })}

            {/* Dose markers */}
            {group.routes.map((rg) => {
              const palette = ROUTE_PALETTE[rg.paletteIndex]
              return rg.doses.map((d) => {
                const doseOffsetMins = (d.doseTime.getTime() - group.windowStart.getTime()) / 60_000
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

            {/* Time axis */}
            <g fontSize="8" fill="currentColor" className="text-muted-foreground/60">
              {timeMarkers.map((m, i) => (
                <text key={i} x={toMobileX(m.progress)} y={MOBILE_SVG_H - 8} textAnchor="middle">
                  {m.label}
                </text>
              ))}
            </g>

            {/* Route legend */}
            {isMultiRoute && (
              <g>
                {group.routes.map((rg, li) => {
                  const palette = ROUTE_PALETTE[rg.paletteIndex]
                  const lx = MOBILE_PL + li * 70
                  const ly = MOBILE_SVG_H - 2
                  return (
                    <g key={rg.route}>
                      <line x1={lx} y1={ly - 4} x2={lx + 16} y2={ly - 4}
                        stroke={palette.stroke} strokeWidth={2.5} strokeLinecap="round" />
                      <circle cx={lx + 8} cy={ly - 4} r="2" fill={palette.stroke} />
                      <text x={lx + 20} y={ly} fontSize="8" fill={palette.stroke} fontWeight="600">
                        {rg.route}
                      </text>
                    </g>
                  )
                })}
              </g>
            )}
          </svg>

          {/* Disclaimer notes below graph */}
          {(anyEstimated || anyIncompletePhases) && (
            <div className="mt-1 space-y-0.5 px-0.5">
              {anyEstimated && (
                <p className="text-[10px] text-amber-400/70 flex items-center gap-1">
                  <span>⚗</span>
                  Dashed curve — duration interpolated from {estimatedSourceRoute ?? 'another route'}.
                  Actual timing may vary.
                </p>
              )}
              {anyIncompletePhases && (
                <p className="text-[10px] text-blue-400/70 flex items-center gap-1">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Dotted curve — phase timings estimated from onset and total duration.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dose breakdown list */}
      <div className="space-y-1">
        {group.routes.map((rg) => {
          const palette = ROUTE_PALETTE[rg.paletteIndex]
          return (
            <div key={rg.route} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: palette.stroke }}>{rg.route}</span>
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
                        <span>{formattedDose.amount} {formattedDose.unit}</span>
                        <span className="opacity-60">@ {format(d.doseTime, 'h:mm a')}</span>
                        <span className={`text-[10px] font-medium ${dc.text}`}>
                          {d.status.phase === 'not_started' ? 'upcoming'
                            : d.status.phase === 'ended' ? 'done'
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
