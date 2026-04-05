
import { Duration } from '@/types'
import { Substance } from '@/lib/substances/index'

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface EstimatedDuration extends Duration {
  isEstimated: boolean
  
  sourceRoute?: string
  
  estimationNote?: string
}

// ─── ROUTE NORMALISATION ─────────────────────────────────────────────────────


const ROUTE_ALIASES: Record<string, string[]> = {
  oral:         ['oral', 'orally', 'swallow', 'swallowed', 'po', 'ingested', 'eaten', 'drink', 'drank'],
  sublingual:   ['sublingual', 'sublingually', 'under tongue', 'sl'],
  buccal:       ['buccal', 'cheek', 'gum'],
  insufflated:  ['insufflated', 'insufflation', 'nasal', 'snorted', 'snort', 'intranasal', 'in', 'insufflating'],
  inhaled:      ['inhaled', 'inhalation', 'inhal', 'smoked', 'smoking', 'smoke', 'vaporized', 'vaporised', 'vaped', 'vaping', 'vape'],
  intravenous:  ['intravenous', 'iv', 'intravenously', 'injection', 'inject', 'injected'],
  intramuscular:['intramuscular', 'im', 'intramuscularly'],
  subcutaneous: ['subcutaneous', 'sc', 'subq', 'sub-q'],
  rectal:       ['rectal', 'rectally', 'plugged', 'plugging', 'pr', 'suppository'],
  transdermal:  ['transdermal', 'patch', 'topical', 'skin'],
}

export function normaliseRoute(route: string): string | null {
  const lower = route.toLowerCase().trim()
  for (const [canonical, aliases] of Object.entries(ROUTE_ALIASES)) {
    if (aliases.some((a) => lower === a || lower.startsWith(a))) return canonical
  }
  return null
}

// ─── ROUTE PROXIMITY MAP ─────────────────────────────────────────────────────


interface RouteMultipliers {
  onset: number
  comeup: number
  peak: number
  offset: number
}

interface FallbackEntry {
  sourceRoute: string
  multipliers: RouteMultipliers
  note: string
}

const ROUTE_FALLBACKS: Record<string, FallbackEntry[]> = {
  sublingual: [
    { sourceRoute: 'oral',        multipliers: { onset: 0.5, comeup: 0.7, peak: 1.0, offset: 0.9 }, note: 'Sublingual absorbs faster than oral; onset/comeup shortened.' },
    { sourceRoute: 'insufflated', multipliers: { onset: 1.2, comeup: 1.0, peak: 1.1, offset: 1.0 }, note: 'Sublingual estimated from insufflated data.' },
  ],
  buccal: [
    { sourceRoute: 'sublingual',  multipliers: { onset: 1.1, comeup: 1.0, peak: 1.0, offset: 1.0 }, note: 'Buccal estimated from sublingual data.' },
    { sourceRoute: 'oral',        multipliers: { onset: 0.6, comeup: 0.8, peak: 1.0, offset: 0.9 }, note: 'Buccal estimated from oral data; onset shortened.' },
  ],
  insufflated: [
    { sourceRoute: 'oral',        multipliers: { onset: 0.3, comeup: 0.5, peak: 0.7, offset: 0.6 }, note: 'Insufflated absorbs significantly faster than oral.' },
    { sourceRoute: 'inhaled',     multipliers: { onset: 2.0, comeup: 1.5, peak: 1.2, offset: 1.3 }, note: 'Insufflated estimated from inhaled data; slower onset than smoking.' },
  ],
  inhaled: [
    { sourceRoute: 'insufflated', multipliers: { onset: 0.3, comeup: 0.5, peak: 0.8, offset: 0.7 }, note: 'Inhaled/smoked onset is much faster than insufflated.' },
    { sourceRoute: 'oral',        multipliers: { onset: 0.1, comeup: 0.3, peak: 0.6, offset: 0.5 }, note: 'Inhaled/smoked onset is dramatically faster than oral.' },
    { sourceRoute: 'intravenous', multipliers: { onset: 1.5, comeup: 1.5, peak: 1.0, offset: 1.1 }, note: 'Inhaled estimated from IV data; slightly slower onset.' },
  ],
  intravenous: [
    { sourceRoute: 'inhaled',     multipliers: { onset: 0.5, comeup: 0.4, peak: 0.8, offset: 0.9 }, note: 'IV onset is near-instant; faster than inhaled.' },
    { sourceRoute: 'insufflated', multipliers: { onset: 0.2, comeup: 0.3, peak: 0.7, offset: 0.8 }, note: 'IV onset dramatically faster than insufflated.' },
    { sourceRoute: 'oral',        multipliers: { onset: 0.1, comeup: 0.2, peak: 0.6, offset: 0.7 }, note: 'IV onset dramatically faster than oral.' },
  ],
  intramuscular: [
    { sourceRoute: 'intravenous', multipliers: { onset: 3.0, comeup: 2.0, peak: 1.0, offset: 1.1 }, note: 'IM onset slower than IV; similar duration.' },
    { sourceRoute: 'insufflated', multipliers: { onset: 1.2, comeup: 1.0, peak: 1.0, offset: 1.0 }, note: 'IM estimated from insufflated data.' },
    { sourceRoute: 'oral',        multipliers: { onset: 0.4, comeup: 0.6, peak: 0.9, offset: 0.9 }, note: 'IM estimated from oral data; faster onset.' },
  ],
  subcutaneous: [
    { sourceRoute: 'intramuscular', multipliers: { onset: 1.5, comeup: 1.2, peak: 1.0, offset: 1.0 }, note: 'Subcutaneous absorbs slightly slower than IM.' },
    { sourceRoute: 'intravenous',   multipliers: { onset: 4.0, comeup: 2.5, peak: 1.0, offset: 1.1 }, note: 'Subcutaneous estimated from IV; much slower onset.' },
    { sourceRoute: 'oral',          multipliers: { onset: 0.5, comeup: 0.7, peak: 0.9, offset: 0.9 }, note: 'Subcutaneous estimated from oral data.' },
  ],
  rectal: [
    { sourceRoute: 'oral',        multipliers: { onset: 0.5, comeup: 0.6, peak: 1.1, offset: 1.0 }, note: 'Rectal (plugging) has faster onset and slightly higher bioavailability than oral.' },
    { sourceRoute: 'insufflated', multipliers: { onset: 1.5, comeup: 1.2, peak: 1.2, offset: 1.1 }, note: 'Rectal estimated from insufflated data.' },
  ],
  transdermal: [
    { sourceRoute: 'oral',        multipliers: { onset: 3.0, comeup: 2.5, peak: 1.5, offset: 2.0 }, note: 'Transdermal absorption is very slow; onset/duration much longer than oral.' },
  ],
  oral: [
    { sourceRoute: 'sublingual',  multipliers: { onset: 2.0, comeup: 1.4, peak: 1.0, offset: 1.1 }, note: 'Oral estimated from sublingual data; slower onset.' },
    { sourceRoute: 'insufflated', multipliers: { onset: 3.0, comeup: 2.0, peak: 1.4, offset: 1.5 }, note: 'Oral estimated from insufflated data; significantly slower.' },
    { sourceRoute: 'rectal',      multipliers: { onset: 2.0, comeup: 1.6, peak: 0.9, offset: 1.0 }, note: 'Oral estimated from rectal data; slightly slower onset.' },
  ],
}

// ─── PARSING / FORMATTING ────────────────────────────────────────────────────

function parseMins(str: string | undefined): number | null {
  if (!str || str === '—' || str.trim() === '') return null
  const lower = str.toLowerCase()
  // Range: "30-60 minutes" / "1-2 hours"
  const rangeMatch = lower.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*(min|hour|h\b)/)
  if (rangeMatch) {
    const avg = (parseFloat(rangeMatch[1]) + parseFloat(rangeMatch[2])) / 2
    return rangeMatch[3].startsWith('h') ? avg * 60 : avg
  }
  // Single: "45 minutes" / "1.5 hours"
  const singleMatch = lower.match(/(\d+(?:\.\d+)?)\s*(min|hour|h\b)/)
  if (singleMatch) {
    const val = parseFloat(singleMatch[1])
    return singleMatch[2].startsWith('h') ? val * 60 : val
  }
  return null
}

function formatMins(mins: number): string {
  if (mins < 1) return '< 1 minute'
  const low  = Math.round(mins * 0.85)
  const high = Math.round(mins * 1.15)
  if (high >= 90) {
    const lowH  = (low  / 60).toFixed(1).replace(/\.0$/, '')
    const highH = (high / 60).toFixed(1).replace(/\.0$/, '')
    return `${lowH}–${highH} hours`
  }
  return `${low}–${high} minutes`
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export function interpolateDuration(
  substance: Substance,
  targetRoute: string,
): EstimatedDuration | null {
  if (!substance.routeData) return null

  const availableRoutes = Object.keys(substance.routeData)
  if (availableRoutes.length === 0) return null

  if (substance.routeData[targetRoute]?.duration) {
    const d = substance.routeData[targetRoute].duration
    return { ...d, isEstimated: false }
  }

  const normTarget = normaliseRoute(targetRoute)

  const normAvailable: Map<string, string> = new Map()
  for (const r of availableRoutes) {
    const norm = normaliseRoute(r)
    if (norm) normAvailable.set(norm, r)
  }

  const fallbacks = normTarget ? (ROUTE_FALLBACKS[normTarget] ?? []) : []

  for (const fallback of fallbacks) {
    const actualSourceKey = normAvailable.get(fallback.sourceRoute)
    if (!actualSourceKey) continue

    const sourceDuration = substance.routeData[actualSourceKey]?.duration
    if (!sourceDuration) continue

    const onsetMins  = parseMins(sourceDuration.onset)
    const comeupMins = parseMins(sourceDuration.comeup)
    const peakMins   = parseMins(sourceDuration.peak)
    const offsetMins = parseMins(sourceDuration.offset)

    if (onsetMins === null || peakMins === null) continue

    const m = fallback.multipliers
    const estOnset  = onsetMins  * m.onset
    const estComeup = (comeupMins ?? onsetMins * 0.5) * m.comeup
    const estPeak   = peakMins   * m.peak
    const estOffset = (offsetMins ?? peakMins * 0.8) * m.offset
    const estTotal  = estOnset + estComeup + estPeak + estOffset

    return {
      onset:  formatMins(estOnset),
      comeup: formatMins(estComeup),
      peak:   formatMins(estPeak),
      offset: formatMins(estOffset),
      total:  formatMins(estTotal),
      isEstimated:     true,
      sourceRoute:     actualSourceKey,
      estimationNote:  fallback.note,
    }
  }

  const firstRoute = availableRoutes[0]
  const firstDuration = substance.routeData[firstRoute]?.duration
  if (!firstDuration) return null

  const onsetMins  = parseMins(firstDuration.onset)
  const comeupMins = parseMins(firstDuration.comeup)
  const peakMins   = parseMins(firstDuration.peak)
  const offsetMins = parseMins(firstDuration.offset)

  if (onsetMins === null || peakMins === null) return null

  const estTotal = onsetMins + (comeupMins ?? 0) + peakMins + (offsetMins ?? 0)

  return {
    onset:  firstDuration.onset,
    comeup: firstDuration.comeup ?? '—',
    peak:   firstDuration.peak,
    offset: firstDuration.offset ?? '—',
    total:  firstDuration.total ?? formatMins(estTotal),
    isEstimated:    true,
    sourceRoute:    firstRoute,
    estimationNote: `No pharmacokinetic data found for ${targetRoute}. Duration copied from ${firstRoute} data as a rough reference only — actual values may differ significantly.`,
  }
}

export function getDurationForRoute(
  substance: Substance | undefined | null,
  route: string,
): EstimatedDuration | null {
  if (!substance) return null
  return interpolateDuration(substance, route)
}
