'use client'

import { format } from 'date-fns'
import { EnrichedDose } from './dose-timeline-types'
import { PT, GH, PL, GW, SVG_W, markerHex } from './dose-timeline-constants'
import { toX, toY, intensityAt } from './dose-timeline-utils'
import { formatDoseAmount } from '@/lib/utils'

/* ================================================================== */
/*  Props                                                              */
/* ================================================================== */

interface DoseMarkerProps {
  d: EnrichedDose
  isPrimary: boolean
  // Available for gradient ID scoping and accessible labeling
  groupKey: string
  hex: string
  offsetMins: number
  windowDuration: number
  isFocused: boolean
  /** When true, show dose label below graph instead of above dot */
  isMultiDose?: boolean
  /** Global index across ALL visible routes for label y-staggering */
  doseIndex?: number
}

/* ================================================================== */
/*  Unique ID generator for gradient defs (avoids SVG id collisions)   */
/* ================================================================== */

let _gradientCounter = 0
function uniqueId(prefix: string): string {
  _gradientCounter += 1
  return `${prefix}-${_gradientCounter}`
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

export function DoseMarker({
  d,
  isPrimary,
  hex,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  groupKey,
  offsetMins,
  windowDuration,
  isFocused,
  isMultiDose = false,
  doseIndex = 0,
}: DoseMarkerProps) {
  /* ---- Timing calculations ---- */
  const elapsedMins   = d.status.phase === 'not_started' ? 0
                      : d.status.phase === 'ended'       ? d.timings.totalDuration
                      : d.timings.totalDuration - d.status.totalRemaining
  const localProgress = Math.max(0, Math.min(100, (elapsedMins / d.timings.totalDuration) * 100))

  const isEnded = d.status.phase === 'ended'
  let mx: number
  let my: number

  if (isEnded) {
    const offsetDur   = Math.max(d.timings.offsetEnd - d.timings.peakEnd, 0.01)
    const kneeMins    = d.timings.peakEnd + 0.10 * offsetDur
    const kneeProgress = (kneeMins / d.timings.totalDuration) * 100
    const kneeGlobalMins = offsetMins + kneeMins
    mx = toX((kneeGlobalMins / windowDuration) * 100)
    my = toY(intensityAt(kneeProgress, d.timings))
  } else {
    const globalMins     = offsetMins + elapsedMins
    const globalProgress = (globalMins / windowDuration) * 100
    mx = toX(globalProgress)
    my = toY(intensityAt(localProgress, d.timings))
  }

  const dotX       = Math.max(PL + 4, Math.min(PL + GW - 4, mx))

  const isHollow = d.status.phase === 'not_started'
  const radius   = isPrimary ? 6 : 4

  /* ---- Phase-aware marker color ---- */
  const phaseColor = markerHex[d.status.phase]

  /* ---- Formatted label ---- */
  const formattedDose = formatDoseAmount(d.amount, d.unit)

  /* ---- Gradient IDs ---- */
  const guideGradId = uniqueId('dm-guide')

  return (
    <g
      opacity={isEnded ? 0.35 : 1}
      role="img"
      aria-label={`${formattedDose.amount} ${formattedDose.unit} dose marker — ${d.status.phase}`}
    >
      {/* ── Inline defs: gradient for the vertical guide line ── */}
      <defs>
        <linearGradient id={guideGradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={hex} stopOpacity="0.45" />
          <stop offset="100%" stopColor={hex} stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {/* ── Vertical guide line with gradient (stays at true time position) ── */}
      {!isEnded && isPrimary && (
        <line
          x1={mx}
          y1={PT}
          x2={mx}
          y2={PT + GH}
          stroke={`url(#${guideGradId})`}
          strokeWidth={isPrimary ? 1.5 : 1}
          strokeDasharray="3,3"
        />
      )}

      {/* ── 3-ring expanding focus flash ── */}
      {isFocused && (
        <>
          {[0, 0.15, 0.3].map((delay) => (
            <circle
              key={delay}
              cx={dotX}
              cy={my}
              r={radius}
              fill="none"
              stroke={phaseColor}
              strokeWidth="2"
              opacity="0"
            >
              <animate
                attributeName="r"
                from={radius}
                to={radius + 20}
                dur="1.2s"
                begin={`${delay}s`}
                repeatCount="1"
              />
              <animate
                attributeName="opacity"
                from="0.6"
                to="0"
                dur="1.2s"
                begin={`${delay}s`}
                repeatCount="1"
              />
            </circle>
          ))}
        </>
      )}

      {/* ── Soft glow ring (phase-aware color) ── */}
      {isPrimary && !isEnded && (
        <circle
          cx={dotX}
          cy={my}
          r={11}
          fill={phaseColor}
          opacity={isFocused ? 0.25 : 0.08}
        />
      )}

      {/* ── Smooth SVG ripple animation ── */}
      {isPrimary && !isEnded && (
        <circle
          cx={dotX}
          cy={my}
          r={radius + 6}
          fill="none"
          stroke={phaseColor}
          strokeWidth="1.5"
          opacity="0"
        >
          <animate
            attributeName="r"
            from={radius}
            to={radius + 12}
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.5"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* ── Main marker dot ── */}
      <circle
        cx={dotX}
        cy={my}
        r={isFocused ? radius + 2 : radius}
        fill={isHollow ? 'none' : hex}
        stroke={isHollow ? hex : isFocused ? '#fff' : '#ffffff88'}
        strokeWidth={isFocused ? 2.5 : 1.5}
      />

      {/* ── Center highlight for primary active dots ── */}
      {isPrimary && !isHollow && !isEnded && (
        <circle cx={dotX} cy={my} r={2.5} fill="#fff" opacity="0.85" />
      )}

      {/* ── Labels for multi-dose mode (below graph at fixed y) ── */}
      {isMultiDose && !isEnded && dotX > 40 && dotX < SVG_W - 20 && (
        <g>
          {/* Connector line: always draw for multi-dose to connect dot to label */}
          <line
            x1={dotX}
            y1={my + radius + 2}
            x2={dotX}
            y2={PT + GH + 28 + doseIndex * 14}
            stroke={hex}
            strokeWidth="0.5"
            strokeDasharray="2,2"
            opacity="0.35"
          />
          <text
            x={dotX}
            y={PT + GH + 32 + doseIndex * 14}
            textAnchor="middle"
            fontSize="9"
            fontWeight={isPrimary ? '700' : '500'}
            fill={hex}
            opacity={isPrimary ? 1 : 0.8}
            aria-hidden="true"
          >
            {isPrimary
              ? `${formattedDose.amount} ${formattedDose.unit}`
              : format(d.doseTime, 'h:mm')}
          </text>
        </g>
      )}

      {/* ── Dose amount label (primary, single-dose only) ── */}
      {isPrimary && !isMultiDose && !isEnded && dotX > 60 && (
        <text
          x={dotX}
          y={my - radius - 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={hex}
          aria-hidden="true"
        >
          {formattedDose.amount} {formattedDose.unit}
        </text>
      )}
    </g>
  )
}
