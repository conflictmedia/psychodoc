import {
  Clock,
  Zap,
  TrendingUp,
  Mountain,
  TrendingDown,
  Sunrise,
} from 'lucide-react'
import { PhaseStatus } from './dose-timeline-types'

// ─── PHASE UI THEME ───────────────────────────────────────────────────────────

export const phaseColors = {
  not_started: { bg: 'bg-slate-500', text: 'text-slate-400', fill: 'bg-slate-500/20', border: 'border-slate-500/30', bar: 'bg-slate-400' },
  onset:       { bg: 'bg-blue-500',  text: 'text-blue-400',  fill: 'bg-blue-500/20',  border: 'border-blue-500/30',  bar: 'bg-blue-500' },
  comeup:      { bg: 'bg-amber-500', text: 'text-amber-400', fill: 'bg-amber-500/20', border: 'border-amber-500/30', bar: 'bg-amber-500' },
  peak:        { bg: 'bg-purple-500',text: 'text-purple-400',fill: 'bg-purple-500/20',border: 'border-purple-500/30',bar: 'bg-purple-500' },
  offset:      { bg: 'bg-cyan-500',  text: 'text-cyan-400',  fill: 'bg-cyan-500/20',  border: 'border-cyan-500/30',  bar: 'bg-cyan-500' },
  ended:       { bg: 'bg-gray-500',  text: 'text-gray-400',  fill: 'bg-gray-500/20',  border: 'border-gray-500/30',  bar: 'bg-gray-400' },
} as const

/** SVG fill hex values keyed by phase — used for dose markers */
export const markerHex: Record<PhaseStatus['phase'], string> = {
  not_started: '#94a3b8',
  onset:       '#3b82f6',
  comeup:      '#f59e0b',
  peak:        '#a855f7',
  offset:      '#06b6d4',
  ended:       '#9ca3af',
}

export const phaseIcons = {
  not_started: Sunrise,
  onset: Zap,
  comeup: TrendingUp,
  peak: Mountain,
  offset: TrendingDown,
  ended: Clock,
}

export const phaseDescriptions: Record<PhaseStatus['phase'], string> = {
  not_started: 'Effects have not yet begun',
  onset: 'Initial effects are beginning to be felt',
  comeup: 'Effects are rapidly increasing in intensity',
  peak: 'Maximum effects are being experienced',
  offset: 'Effects are gradually declining',
  ended: 'The primary experience has ended',
}

// ─── ROUTE PALETTE ────────────────────────────────────────────────────────────
// Each route gets a unique hue so curves can be told apart at a glance.

export const ROUTE_PALETTE = [
  { stroke: '#a855f7', fill: '#a855f7' },  // purple  (first / most common)
  { stroke: '#22d3ee', fill: '#22d3ee' },  // cyan
  { stroke: '#fb923c', fill: '#fb923c' },  // orange
  { stroke: '#4ade80', fill: '#4ade80' },  // green
  { stroke: '#f472b6', fill: '#f472b6' },  // pink
  { stroke: '#facc15', fill: '#facc15' },  // yellow
]

// ─── SVG GRAPH DIMENSIONS (DESKTOP) ────────────────────────────────────────────

export const SVG_W = 800
export const SVG_H = 180   // slightly taller to accommodate the legend
export const PL = 40
export const PR = 20
export const PT = 25
export const PB = 40       // extra bottom padding for route legend
export const GW = SVG_W - PL - PR
export const GH = SVG_H - PT - PB

// ─── SVG GRAPH DIMENSIONS (MOBILE) ─────────────────────────────────────────────
// Smaller dimensions optimized for mobile screens with touch-friendly targets

export const MOBILE_SVG_W = 400
export const MOBILE_SVG_H = 140
export const MOBILE_PL = 30     // left padding (time labels)
export const MOBILE_PR = 15     // right padding
export const MOBILE_PT = 20     // top padding (phase labels)
export const MOBILE_PB = 25     // bottom padding (route legend)
export const MOBILE_GW = MOBILE_SVG_W - MOBILE_PL - MOBILE_PR
export const MOBILE_GH = MOBILE_SVG_H - MOBILE_PT - MOBILE_PB

// ─── MOBILE PHASE DEFINITIONS ────────────────────────────────────────────────

export const MOBILE_PHASES = [
  { key: 'onset',  label: 'Onset',  barColor: 'bg-blue-500'   },
  { key: 'comeup', label: 'Comeup', barColor: 'bg-amber-500'  },
  { key: 'peak',   label: 'Peak',   barColor: 'bg-purple-500' },
  { key: 'offset', label: 'Offset', barColor: 'bg-cyan-500'   },
] as const

export const PHASE_ORDER = ['onset', 'comeup', 'peak', 'offset'] as const

// ─── PHASE BOUNDARY DATA ─────────────────────────────────────────────────────
// Combines fill color + label color into a single array to avoid duplication.

export const PHASE_BANDS = [
  { name: 'Onset',  fill: '#3b82f6', labelColor: '#60a5fa' },
  { name: 'Comeup', fill: '#f59e0b', labelColor: '#fbbf24' },
  { name: 'Peak',   fill: '#a855f7', labelColor: '#c084fc' },
  { name: 'Offset', fill: '#06b6d4', labelColor: '#22d3ee' },
] as const

// ─── RETENTION WINDOW ────────────────────────────────────────────────────────
// How long after a dose ends (in minutes) it remains visible on the timeline.

export const ENDED_DOSE_RETENTION_MINS = 720 // 12 hours
