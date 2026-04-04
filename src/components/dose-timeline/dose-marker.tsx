import { EnrichedDose } from './dose-timeline-types'
import { PT, GH } from './dose-timeline-constants'
import { toX, toY, intensityAt } from './dose-timeline-utils'
import { formatDoseAmount } from '@/lib/utils'

interface DoseMarkerProps {
  d: EnrichedDose
  isPrimary: boolean
  groupKey: string
  hex: string
  offsetMins: number
  windowDuration: number
  isFocused: boolean
}

export function DoseMarker({ d, isPrimary, hex, offsetMins, windowDuration, isFocused }: DoseMarkerProps) {
  const localProgress  = d.status.phase === 'not_started' ? 0 : d.status.overallProgress
  const localMins      = (localProgress / 100) * d.timings.totalDuration
  const globalMins     = offsetMins + localMins
  const globalProgress = (globalMins / windowDuration) * 100

  const mx       = toX(globalProgress)
  const my       = toY(intensityAt(localProgress, d.timings))
  const isHollow = d.status.phase === 'not_started'
  const isEnded  = d.status.phase === 'ended'
  const radius   = isPrimary ? 6 : 4

  // Format dose with unit conversion
  const formattedDose = formatDoseAmount(d.amount, d.unit)

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
