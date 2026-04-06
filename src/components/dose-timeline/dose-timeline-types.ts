import { DoseLog } from '@/types'

/* ------------------------------------------------------------------ */
/*  Core Phase Types                                                   */
/* ------------------------------------------------------------------ */

export interface PhaseTimings {
  onsetEnd: number
  comeupEnd: number
  peakEnd: number
  offsetEnd: number
  afterglowDuration: number
  afterglowEnd: number
  totalDuration: number
}

export type PhaseName = 'onset' | 'comeup' | 'peak' | 'offset' | 'afterglow'

export interface PhaseStatus {
  phase: 'not_started' | PhaseName | 'ended'
  /** Whether this dose has an afterglow phase (used for UI hints) */
  hasAfterglow?: boolean
  /** During afterglow: the peak-end intensity to fade from (for smooth rendering) */
  offsetPeakIntensity?: number
  progress: number
  overallProgress: number
  timeInPhase: number
  timeRemaining: number
  totalRemaining: number
}

/* ------------------------------------------------------------------ */
/*  Enriched Dose                                                      */
/* ------------------------------------------------------------------ */

export interface EnrichedDose extends DoseLog {
  timings: PhaseTimings
  status: PhaseStatus
  doseTime: Date
}

/* ------------------------------------------------------------------ */
/*  Route & Substance Grouping                                         */
/* ------------------------------------------------------------------ */

export interface RouteGroup {
  route: string
  doses: EnrichedDose[]
  primary: EnrichedDose
  totalAmount: number
  unit: string
  uniformUnit: boolean
  paletteIndex: number
}

/** Per-route intensity snapshot used in multi-route tooltip display */
export interface RouteIntensitySnapshot {
  route: string
  intensity: number
  phase: PhaseName
  paletteIndex: number
}

export interface SubstanceGroup {
  key: string
  substanceName: string
  categories: string[]
  routes: RouteGroup[]
  primary: EnrichedDose
  windowDuration: number
  windowStart: Date
  /** Precomputed combined intensity across all routes for this substance */
  combinedIntensityCurve?: CombinedIntensityPoint[]
}

/* ------------------------------------------------------------------ */
/*  Time Marker (graph axis tick)                                      */
/* ------------------------------------------------------------------ */

export interface TimeMarker {
  /** 0-100 position on the graph's time axis */
  progress: number
  /** Formatted display label, e.g. "3:45 PM" */
  label: string
  /** Absolute Date for this tick */
  date: Date
}

/* ------------------------------------------------------------------ */
/*  Phase Band Ranges (background coloring behind curves)              */
/* ------------------------------------------------------------------ */

export interface PhaseBandRange {
  /** Start fraction 0-1 across the dose timeline */
  startFrac: number
  /** End fraction 0-1 across the dose timeline */
  endFrac: number
  /** Phase this band represents */
  phase: PhaseName
}

/* ------------------------------------------------------------------ */
/*  Phase Band Configuration                                           */
/* ------------------------------------------------------------------ */

export interface PhaseBand {
  name: string
  /** CSS hex fill color */
  fill: string
  /** CSS hex color for labels */
  labelColor: string
  /** Gradient top color (lighter) — used for SVG linearGradient stops */
  gradientTop: string
  /** Gradient bottom color (darker / more transparent) */
  gradientBottom: string
  /** Phase key this band maps to */
  phase: PhaseName
}

/* ------------------------------------------------------------------ */
/*  Combined Intensity Point (dose-stacking)                           */
/* ------------------------------------------------------------------ */

/** A single sample point on a combined intensity curve */
export interface CombinedIntensityPoint {
  /** Minutes from the window start */
  minutes: number
  /** Combined intensity 0-100 */
  intensity: number
  /** 0-100 progress on the graph's time axis */
  progress: number
}

/* ------------------------------------------------------------------ */
/*  Tooltip Data                                                       */
/* ------------------------------------------------------------------ */

export interface TooltipData {
  phase: PhaseName
  phaseTime: string
  absoluteTime: Date
  intensity: number
  progress: number
  /** Per-route intensity breakdown (multi-route hover) */
  routeIntensities?: RouteIntensitySnapshot[]
}
