'use client'

import { format } from 'date-fns'
import { Clock, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SubstanceGroup } from './dose-timeline-types'
import { phaseColors, phaseIcons, ROUTE_PALETTE, MOBILE_PHASES } from './dose-timeline-constants'
import { formatMinutes, phaseStart, phaseEnd, isPhasePast } from './dose-timeline-utils'
import { formatDoseAmount } from '@/lib/utils'

interface MobilePhaseBarProps {
  group: SubstanceGroup
}

/**
 * Mobile card — one per SubstanceGroup.
 * Shows a stacked list of route bars rather than a single bar.
 */
export function MobilePhaseBar({ group }: MobilePhaseBarProps) {
  const dose        = group.primary
  const colors      = phaseColors[dose.status.phase]
  const PhaseIcon   = phaseIcons[dose.status.phase]
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
            const totalFormatted = rg.uniformUnit ? formatDoseAmount(rg.totalAmount, rg.unit) : null
            return (
              <div key={rg.route} className="text-xs text-muted-foreground mt-0.5">
                <span className="font-medium" style={{ color: palette.stroke }}>
                  {rg.route}
                </span>
                {' · '}
                {totalFormatted ? `${totalFormatted.amount} ${totalFormatted.unit}` : `${rg.doses.length} doses`}
                {rg.doses.map((d) => {
                  const formattedDose = formatDoseAmount(d.amount, d.unit)
                  return (
                    <div key={d.id} className="flex items-center gap-1 pl-2">
                      <span className="opacity-50">·</span>
                      <span>{formattedDose.amount} {formattedDose.unit} @ {format(d.doseTime, 'h:mm a')}</span>
                      <span className={`ml-1 text-[10px] font-medium ${phaseColors[d.status.phase].text}`}>
                        {d.status.phase === 'not_started' ? 'upcoming' : d.status.phase}
                      </span>
                    </div>
                  )
                })}
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
        const rd      = rg.primary
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
                  const start    = phaseStart(p.key, rd.timings)
                  const end      = phaseEnd(p.key, rd.timings)
                  const dur      = end - start
                  const widthPct = (dur / rd.timings.totalDuration) * 100
                  const isActive = rd.status.phase === p.key
                  const past     = isPhasePast(p.key, rd.status.phase)

                  return (
                    <div
                      key={p.key}
                      className="rounded-sm overflow-hidden relative"
                      style={{ width: `${widthPct}%`, minWidth: 4 }}
                    >
                      <div className="absolute inset-0 bg-muted" />
                      {past && <div className="absolute inset-0" style={{ background: palette.stroke }} />}
                      {isActive && (
                        <div
                          className="absolute inset-y-0 left-0"
                          style={{ width: `${rd.status.progress}%`, background: palette.stroke }}
                        />
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
