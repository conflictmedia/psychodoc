import { format, addHours, addMinutes } from 'date-fns'
import { Duration, DoseLog } from '@/types'
import { PhaseTimings, PhaseStatus } from './dose-timeline-types'
import { PL, GW, PT, GH, MOBILE_PL, MOBILE_GW, MOBILE_PT, MOBILE_GH } from './dose-timeline-constants'

// ─── DURATION PARSING ─────────────────────────────────────────────────────────

export function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 0
  const lower = durationStr.toLowerCase()
  const rangeMatch = lower.match(/(\d+)-(\d+)\s*(minutes?|hours?|min|h)/)
  if (rangeMatch) {
    const avg = (parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2
    return rangeMatch[3].startsWith('h') ? avg * 60 : avg
  }
  const singleMatch = lower.match(/(\d+)\s*(minutes?|hours?|min|h)/)
  if (singleMatch) {
    const value = parseInt(singleMatch[1])
    return singleMatch[2].startsWith('h') ? value * 60 : value
  }
  return 0
}

// ─── PHASE TIMING CALCULATION ─────────────────────────────────────────────────

export function calculatePhaseTimings(duration: Duration): PhaseTimings {
  const onsetMins  = parseDurationToMinutes(duration.onset)
  const comeupMins = parseDurationToMinutes(duration.comeup)
  const peakMins   = parseDurationToMinutes(duration.peak)
  const offsetMins = parseDurationToMinutes(duration.offset)
  const onsetEnd   = onsetMins
  const comeupEnd  = onsetEnd + comeupMins
  const peakEnd    = comeupEnd + peakMins
  const offsetEnd  = peakEnd + offsetMins
  return { onsetEnd, comeupEnd, peakEnd, offsetEnd, totalDuration: offsetEnd }
}

// ─── PHASE STATUS ─────────────────────────────────────────────────────────────

export function getPhaseStatus(doseTime: Date, timings: PhaseTimings): PhaseStatus {
  const elapsed = (Date.now() - doseTime.getTime()) / 60_000

  if (elapsed < 0)
    return { phase: 'not_started', progress: 0, overallProgress: 0, timeInPhase: 0, timeRemaining: -elapsed, totalRemaining: timings.totalDuration }
  if (elapsed >= timings.offsetEnd)
    return { phase: 'ended', progress: 100, overallProgress: 100, timeInPhase: 0, timeRemaining: 0, totalRemaining: 0 }

  const overall = (elapsed / timings.totalDuration) * 100

  const phases: { name: PhaseStatus['phase']; start: number; end: number }[] = [
    { name: 'onset',  start: 0,               end: timings.onsetEnd  },
    { name: 'comeup', start: timings.onsetEnd, end: timings.comeupEnd },
    { name: 'peak',   start: timings.comeupEnd,end: timings.peakEnd   },
    { name: 'offset', start: timings.peakEnd,  end: timings.offsetEnd },
  ]

  for (const p of phases) {
    if (elapsed < p.end || p.name === 'offset') {
      const dur    = Math.max(p.end - p.start, 1)
      const inPhase = elapsed - p.start
      return {
        phase: p.name,
        progress: Math.min(100, (inPhase / dur) * 100),
        overallProgress: overall,
        timeInPhase: inPhase,
        timeRemaining: dur - inPhase,
        totalRemaining: timings.offsetEnd - elapsed,
      }
    }
  }

  return { phase: 'onset', progress: 0, overallProgress: overall, timeInPhase: elapsed, timeRemaining: timings.onsetEnd - elapsed, totalRemaining: timings.offsetEnd - elapsed }
}

// ─── FORMAT HELPERS ───────────────────────────────────────────────────────────

export function formatMinutes(minutes: number): string {
  if (minutes < 0) return '0m'
  if (minutes < 60) return `${Math.round(minutes)}m`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

/**
 * Returns a display-ready capitalised phase name.
 * e.g. 'not_started' → 'Upcoming', 'comeup' → 'Comeup'
 */
export function formatPhaseName(phase: PhaseStatus['phase']): string {
  if (phase === 'not_started') return 'Upcoming'
  return phase.charAt(0).toUpperCase() + phase.slice(1)
}

export function getDoseCategories(dose: DoseLog): string[] {
  if (Array.isArray(dose.categories)) return dose.categories
  const legacy = (dose as any).category as string | undefined
  if (legacy && legacy !== 'unknown') return [legacy]
  return []
}

// ─── INTENSITY CURVE MATH ─────────────────────────────────────────────────────

/**
 * Returns the estimated effect intensity at a given point in the dose's lifecycle.
 *
 * @param progress - How far through the dose we are, as a value from 0 to 100.
 * @param t        - Phase timing boundaries for this dose.
 * @returns        Intensity on a scale of 0–100, where 100 represents peak effect.
 */
export function intensityAt(progress: number, t: PhaseTimings): number {
  const mins = (progress / 100) * t.totalDuration

  if (mins <= t.onsetEnd) {
    const frac = t.onsetEnd > 0 ? mins / t.onsetEnd : 1
    return 5 + 10 * (1 - Math.cos((frac * Math.PI) / 2))
  }
  if (mins <= t.comeupEnd) {
    const frac = (mins - t.onsetEnd) / Math.max(t.comeupEnd - t.onsetEnd, 1)
    return 15 + 77 * (1 - Math.cos((frac * Math.PI) / 2))
  }
  if (mins <= t.peakEnd) {
    const frac = (mins - t.comeupEnd) / Math.max(t.peakEnd - t.comeupEnd, 1)
    return 92 + 8 * Math.sin(frac * Math.PI)
  }
  const frac = (mins - t.peakEnd) / Math.max(t.offsetEnd - t.peakEnd, 1)
  return 92 * Math.pow(1 - frac, 1.5)
}

export function phaseNameAt(progress: number, t: PhaseTimings): string {
  const mins = (progress / 100) * t.totalDuration
  if (mins <= t.onsetEnd)  return 'Onset'
  if (mins <= t.comeupEnd) return 'Comeup'
  if (mins <= t.peakEnd)   return 'Peak'
  return 'Offset'
}

// ─── PHASE BAR HELPERS ────────────────────────────────────────────────────────

export function phaseEnd(key: string, t: PhaseTimings): number {
  if (key === 'onset')  return t.onsetEnd
  if (key === 'comeup') return t.comeupEnd
  if (key === 'peak')   return t.peakEnd
  return t.offsetEnd
}

export function phaseStart(key: string, t: PhaseTimings): number {
  if (key === 'onset')  return 0
  if (key === 'comeup') return t.onsetEnd
  if (key === 'peak')   return t.comeupEnd
  return t.peakEnd
}

export function isPhasePast(check: string, current: string): boolean {
  const order = ['onset', 'comeup', 'peak', 'offset']
  return order.indexOf(check) < order.indexOf(current)
}

// ─── SVG COORDINATE HELPERS (DESKTOP) ────────────────────────────────────────

export const toX = (progress: number)  => PL + (progress / 100) * GW
export const toY = (intensity: number) => PT + GH - (intensity / 100) * GH

// ─── SVG COORDINATE HELPERS (MOBILE) ──────────────────────────────────────────

export const toMobileX = (progress: number)  => MOBILE_PL + (progress / 100) * MOBILE_GW
export const toMobileY = (intensity: number) => MOBILE_PT + MOBILE_GH - (intensity / 100) * MOBILE_GH

// ─── SVG PATH GENERATORS ─────────────────────────────────────────────────────

export function curvePath(t: PhaseTimings, offsetMins: number, windowDuration: number): string {
  const pts: { x: number; y: number }[] = []

  for (let i = 0; i <= 200; i++) {
    const localProgress  = (i / 200) * 100
    const localMins      = (localProgress / 100) * t.totalDuration
    const globalMins     = offsetMins + localMins
    const globalProgress = (globalMins / windowDuration) * 100
    pts.push({ x: toX(globalProgress), y: toY(intensityAt(localProgress, t)) })
  }

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const c = pts[i]
    const n = pts[i + 1]
    if (n) {
      d += ` Q ${c.x.toFixed(1)},${c.y.toFixed(1)} ${((c.x + n.x) / 2).toFixed(1)},${((c.y + n.y) / 2).toFixed(1)}`
    } else {
      d += ` L ${c.x.toFixed(1)},${c.y.toFixed(1)}`
    }
  }
  return d
}

export function areaPath(t: PhaseTimings, offsetMins: number, windowDuration: number): string {
  const curve  = curvePath(t, offsetMins, windowDuration)
  const startX = toX((offsetMins / windowDuration) * 100).toFixed(1)
  const endX   = toX(((offsetMins + t.totalDuration) / windowDuration) * 100).toFixed(1)
  const baseY  = (PT + GH).toFixed(1)
  return `${curve} L ${endX},${baseY} L ${startX},${baseY} Z`
}

// ─── MOBILE SVG PATH GENERATORS ──────────────────────────────────────────────

export function mobileCurvePath(t: PhaseTimings, offsetMins: number, windowDuration: number): string {
  const pts: { x: number; y: number }[] = []

  for (let i = 0; i <= 100; i++) {
    const localProgress  = (i / 100) * 100
    const localMins      = (localProgress / 100) * t.totalDuration
    const globalMins     = offsetMins + localMins
    const globalProgress = (globalMins / windowDuration) * 100
    pts.push({ x: toMobileX(globalProgress), y: toMobileY(intensityAt(localProgress, t)) })
  }

  let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const c = pts[i]
    const n = pts[i + 1]
    if (n) {
      d += ` Q ${c.x.toFixed(1)},${c.y.toFixed(1)} ${((c.x + n.x) / 2).toFixed(1)},${((c.y + n.y) / 2).toFixed(1)}`
    } else {
      d += ` L ${c.x.toFixed(1)},${c.y.toFixed(1)}`
    }
  }
  return d
}

export function mobileAreaPath(t: PhaseTimings, offsetMins: number, windowDuration: number): string {
  const curve  = mobileCurvePath(t, offsetMins, windowDuration)
  const startX = toMobileX((offsetMins / windowDuration) * 100).toFixed(1)
  const endX   = toMobileX(((offsetMins + t.totalDuration) / windowDuration) * 100).toFixed(1)
  const baseY  = (MOBILE_PT + MOBILE_GH).toFixed(1)
  return `${curve} L ${endX},${baseY} L ${startX},${baseY} Z`
}

// ─── TIME MARKERS ─────────────────────────────────────────────────────────────

export function buildTimeMarkers(windowDuration: number, windowStart: Date) {
  const hours = windowDuration / 60
  const step  = hours > 8 ? 2 : 1
  const marks: { progress: number; label: string }[] = []
  for (let h = 0; h <= hours; h += step) {
    const p = ((h * 60) / windowDuration) * 100
    if (p <= 100) marks.push({ progress: p, label: format(addHours(windowStart, h), 'h:mm') })
  }
  return marks
}

// ─── PHASE BAND BOUNDARIES ────────────────────────────────────────────────────
/**
 * Computes normalised start/end fractions (0–1) for each phase band
 * given a set of phase timings. Used to render both phase background
 * rects and phase label text in a single pass.
 */
export function getPhaseBandRanges(t: PhaseTimings) {
  const total = t.totalDuration
  return [
    { startFrac: 0,                    endFrac: t.onsetEnd  / total },
    { startFrac: t.onsetEnd  / total,  endFrac: t.comeupEnd / total },
    { startFrac: t.comeupEnd / total,  endFrac: t.peakEnd   / total },
    { startFrac: t.peakEnd   / total,  endFrac: 1                   },
  ]
}
