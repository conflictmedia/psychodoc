'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Loader2, AlertTriangle, Zap } from 'lucide-react'
import { substances } from '@/lib/substances/index'
import { useToast } from '@/hooks/use-toast'
import { useDoseStore } from '@/store/dose-store'
import { DoseLog, Duration } from '@/types'
import { calculatePhaseTimings, getPhaseStatus } from '@/components/dose-timeline/dose-timeline-utils'
import { getDurationForRoute } from '@/lib/duration-interpolation'
import { DurationOverrideFields } from '@/components/duration-override-fields'

interface DoseLoggerModalProps {
  onLogCreated?: () => void
  trigger?: React.ReactNode
  preselectedSubstanceId?: string
  preselectedSubstanceName?: string
  preselectedCategory?: string | string[]
  preselectedRoute?: string
}

const moodOptions: ComboboxOption[] = [
  { value: 'happy', label: 'Happy' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'stressed', label: 'Stressed' },
  { value: 'sad', label: 'Sad' },
  { value: 'energetic', label: 'Energetic' },
  { value: 'curious', label: 'Curious' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'excited', label: 'Excited' },
  { value: 'bored', label: 'Bored' },
  { value: 'tired', label: 'Tired' },
  { value: 'focused', label: 'Focused' },
]

const settingOptions: ComboboxOption[] = [
  { value: 'home', label: 'Home' },
  { value: 'friends', label: 'With Friends' },
  { value: 'party', label: 'Party/Event' },
  { value: 'nature', label: 'Nature' },
  { value: 'festival', label: 'Festival' },
  { value: 'work', label: 'Work' },
  { value: 'gym', label: 'Gym' },
  { value: 'concert', label: 'Concert' },
  { value: 'bar', label: 'Bar/Club' },
  { value: 'travel', label: 'Traveling' },
  { value: 'other', label: 'Other' },
]

const unitOptions: ComboboxOption[] = [
  { value: 'mg', label: 'mg (milligrams)' },
  { value: 'g', label: 'g (grams)' },
  { value: 'μg', label: 'μg (micrograms)' },
  { value: 'ml', label: 'ml (milliliters)' },
  { value: 'drop', label: 'drop' },
  { value: 'puff', label: 'puff' },
  { value: 'tab', label: 'tab' },
  { value: 'capsule', label: 'capsule' },
  { value: 'hit', label: 'hit' },
  { value: 'line', label: 'line' },
  { value: 'drink', label: 'drink' },
  { value: 'shot', label: 'shot' },
  { value: 'joint', label: 'joint' },
  { value: 'blunt', label: 'blunt' },
  { value: 'bowl', label: 'bowl' },
  { value: 'blinker', label: 'blinker' },
]

const defaultRouteOptions: ComboboxOption[] = [
  { value: 'oral', label: 'Oral' },
  { value: 'insufflation', label: 'Insufflation' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'intramuscular', label: 'Intramuscular' },
  { value: 'transdermal', label: 'Transdermal' },
  { value: 'intravenous', label: 'Intravenous' },
  { value: 'smoked', label: 'Smoked' },
  { value: 'vaped', label: 'Vaped' },
]

/* ------------------------------------------------------------------ */
/*  Smart amount+unit parsing                                          */
/* ------------------------------------------------------------------ */

/** All known unit values for auto-matching */
const KNOWN_UNITS = unitOptions.map(u => u.value)

/** Aliases: full words or common variations → canonical unit */
const UNIT_ALIASES: Record<string, string> = {
  'micrograms': 'μg', 'microgram': 'μg', 'mcg': 'μg', 'ug': 'μg',
  'milligrams': 'mg', 'milligram': 'mg',
  'grams': 'g', 'gram': 'g',
  'milliliters': 'ml', 'milliliter': 'ml', 'mls': 'ml',
  'drops': 'drop', 'puffs': 'puff', 'tabs': 'tab', 'tablets': 'tab',
  'capsules': 'capsule', 'pills': 'capsule', 'hits': 'hit',
  'lines': 'line', 'drinks': 'drink', 'shots': 'shot',
  'joints': 'joint', 'blunts': 'blunt', 'bowls': 'bowl', 'blinkers': 'blinker',
}

/** Units that imply a specific route of administration */
const UNIT_TO_ROUTE: Record<string, string> = {
  'joint': 'smoked',
  'blunt': 'smoked',
  'bowl': 'smoked',
  'bong': 'smoked',
  'dab': 'smoked',
  'blinker': 'smoked',
  'puff': 'smoked',
  'pill': 'oral',
  'capsule': 'oral',
  'tablet': 'oral',
  'line': 'insufflated',
  
}

/**
 * Try to resolve a partial unit string to a known unit.
 * Fuzzy matches prefixes like "join" → "joint", "blun" → "blunt".
 */
function resolveUnitFuzzy(typed: string): string | null {
  const lower = typed.toLowerCase().trim()
  if (!lower || lower.length < 2) return null

  // Direct match
  if (KNOWN_UNITS.includes(lower)) return lower

  // Alias match
  if (UNIT_ALIASES[lower]) return UNIT_ALIASES[lower]

  // Fuzzy: check if typed is a prefix of any known unit
  // Prioritize shorter matches (e.g., "bow" matches "bowl" not "blinker")
  const prefixMatches = KNOWN_UNITS.filter(u => u.startsWith(lower))
  if (prefixMatches.length === 1) {
    return prefixMatches[0]
  }
  if (prefixMatches.length > 1) {
    // Sort by length and return the shortest match
    prefixMatches.sort((a, b) => a.length - b.length)
    return prefixMatches[0]
  }

  // Fuzzy: check if typed is a prefix of any alias value
  for (const [alias, canonical] of Object.entries(UNIT_ALIASES)) {
    if (alias.startsWith(lower)) {
      return canonical
    }
  }

  return null
}

/**
 * Parse "5 mg", "100μg", "2.5 g" → { amount: "5", unit: "mg" }.
 * Returns unit as null when only a number is typed.
 */
function parseAmountUnit(input: string): { amount: string; unit: string | null } {
  const trimmed = input.trim()
  if (!trimmed) return { amount: '', unit: null }

  // Match: numeric value (int, decimal) + optional trailing alphabetic unit
  const match = trimmed.match(/^([\-\+]?\d*\.?\d+)(?:\s*([a-zA-Zμμ]+))?$/)
  if (match) {
    const amountStr = match[1]
    const unitStr = match[2]
    if (!unitStr) return { amount: amountStr, unit: null }

    const lower = unitStr.toLowerCase()

    // Direct match
    if (KNOWN_UNITS.includes(lower)) return { amount: amountStr, unit: lower }

    // Alias match
    if (UNIT_ALIASES[lower]) return { amount: amountStr, unit: UNIT_ALIASES[lower] }

    // Fuzzy match for partial units (e.g., "join" → "joint")
    const fuzzyMatch = resolveUnitFuzzy(lower)
    if (fuzzyMatch) return { amount: amountStr, unit: fuzzyMatch }

    // No match — return as custom unit
    return { amount: amountStr, unit: lower }
  }

  return { amount: trimmed, unit: null }
}

/* ------------------------------------------------------------------ */
/*  Quick Input Parser - Extract substance, amount, unit from string   */
/* ------------------------------------------------------------------ */

/** Known routes for auto-matching */
const KNOWN_ROUTES = ['oral', 'insufflation', 'inhalation', 'sublingual', 'rectal', 'intramuscular', 'transdermal', 'intravenous', 'smoked', 'vaped', 'snorted', 'nasal', 'subq', 'subcutaneous']

/** Route aliases */
const ROUTE_ALIASES: Record<string, string> = {
  'snorted': 'insufflation',
  'nasal': 'insufflation',
  'nose': 'insufflation',
  'smoked': 'smoked',
  'vaped': 'vaped',
  'vape': 'vaped',
  'iv': 'intravenous',
  'im': 'intramuscular',
  'subq': 'sublingual',
  'subcutaneous': 'sublingual',
  'under tongue': 'sublingual',
  'anal': 'rectal',
  'boofed': 'rectal',
  'boof': 'rectal',
  'patch': 'transdermal',
  'eat': 'oral',
  'eaten': 'oral',
  'drink': 'oral',
  'drank': 'oral',
}

/**
 * Parse a quick input string like "Caffeine 100 mg oral", "100mg LSD sublingual", "2 tabs MDMA insufflation"
 * Returns extracted substance name, amount, unit, and route.
 */
function parseQuickInput(
  input: string,
  substanceList: typeof substances
): { substanceName: string; substanceId: string; amount: string; unit: string | null; route: string | null; categories: string[] } {
  const trimmed = input.trim()
  if (!trimmed) return { substanceName: '', substanceId: '', amount: '', unit: null, route: null, categories: [] }

  // First, try to extract route from the input
  let extractedRoute: string | null = null
  let routeIndex = -1
  let routeLength = 0

  // Check for known routes in the input (case-insensitive)
  const lowerTrimmed = trimmed.toLowerCase()
  for (const knownRoute of [...KNOWN_ROUTES, ...Object.keys(ROUTE_ALIASES)]) {
    const regex = new RegExp(`\\b${knownRoute}\\b`, 'i')
    const routeMatch = lowerTrimmed.match(regex)
    if (routeMatch && routeMatch.index !== undefined) {
      // Prefer longer matches (e.g., "insufflation" over "nasal")
      if (routeMatch[0].length > routeLength) {
        extractedRoute = ROUTE_ALIASES[knownRoute] || knownRoute
        routeIndex = routeMatch.index
        routeLength = routeMatch[0].length
      }
    }
  }

  // Track unit-implied route (will be used if no explicit route found)
  let unitImpliedRoute: string | null = null

  // Remove route from input for further parsing
  let inputWithoutRoute = trimmed
  if (extractedRoute && routeIndex >= 0) {
    inputWithoutRoute = (trimmed.slice(0, routeIndex) + trimmed.slice(routeIndex + routeLength)).replace(/\s+/g, ' ').trim()
  }

  // Pattern: Try to find a numeric amount with optional unit anywhere in the string
  // Match patterns like: "100", "100mg", "2.5g", "2 tabs", etc.
  const amountWithUnitRegex = /(\d*\.?\d+)\s*([a-zA-Zμ]+)?/g

  let match
  let amountStr = ''
  let unitStr: string | null = null
  let amountIndex = -1
  let amountLength = 0

  // Find the first numeric pattern (likely the dose)
  while ((match = amountWithUnitRegex.exec(inputWithoutRoute)) !== null) {
    const num = match[1]
    const unit = match[2]

    // Skip very short numbers that might be part of a substance name (like "2C-B")
    if (num.length === 1 && !unit) continue

    amountStr = num
    unitStr = unit || null
    amountIndex = match.index
    amountLength = match[0].length
    break
  }

  if (!amountStr) {
    // No amount found, treat entire input as substance name
    const found = substanceList.find(s =>
      s.name.toLowerCase() === inputWithoutRoute.toLowerCase() ||
      s.commonNames?.some(cn => cn.toLowerCase() === inputWithoutRoute.toLowerCase()) ||
      s.aliases?.some(a => a.toLowerCase() === inputWithoutRoute.toLowerCase())
    )
    if (found) {
      const raw = found as any
      const cats: string[] = Array.isArray(raw.categories) && raw.categories.length > 0
        ? raw.categories
        : typeof raw.category === 'string' && raw.category && raw.category !== 'unknown'
        ? [raw.category]
        : []
      return { substanceName: found.name, substanceId: found.id, amount: '', unit: null, route: extractedRoute, categories: cats }
    }
    return { substanceName: inputWithoutRoute, substanceId: '', amount: '', unit: null, route: extractedRoute, categories: [] }
  }

  // Resolve unit with fuzzy matching
  let resolvedUnit: string | null = null
  if (unitStr) {
    const lower = unitStr.toLowerCase()
    // Direct match
    if (KNOWN_UNITS.includes(lower)) {
      resolvedUnit = lower
    } else if (UNIT_ALIASES[lower]) {
      resolvedUnit = UNIT_ALIASES[lower]
    } else {
      // Fuzzy match for partial units (e.g., "join" → "joint", "blun" → "blunt")
      const fuzzyMatch = resolveUnitFuzzy(lower)
      if (fuzzyMatch) {
        resolvedUnit = fuzzyMatch
      } else {
        resolvedUnit = lower
      }
    }
    
    // Check if this unit implies a route
    if (resolvedUnit && UNIT_TO_ROUTE[resolvedUnit]) {
      unitImpliedRoute = UNIT_TO_ROUTE[resolvedUnit]
    }
  }

  // Extract substance name by removing the amount+unit part
  const beforeAmount = inputWithoutRoute.slice(0, amountIndex).trim()
  const afterAmount = inputWithoutRoute.slice(amountIndex + amountLength).trim()

  // Combine before and after parts to get substance name
  let potentialSubstance = (beforeAmount + ' ' + afterAmount).trim()

  // Try to match against substance list
  let substanceName = potentialSubstance
  let substanceId = ''
  let categories: string[] = []

  if (potentialSubstance) {
    const lower = potentialSubstance.toLowerCase()

    // Try exact match first
    const exactMatch = substanceList.find(s =>
      s.name.toLowerCase() === lower ||
      s.commonNames?.some(cn => cn.toLowerCase() === lower) ||
      s.aliases?.some(a => a.toLowerCase() === lower)
    )

    if (exactMatch) {
      substanceName = exactMatch.name
      substanceId = exactMatch.id
      const raw = exactMatch as any
      categories = Array.isArray(raw.categories) && raw.categories.length > 0
        ? raw.categories
        : typeof raw.category === 'string' && raw.category && raw.category !== 'unknown'
        ? [raw.category]
        : []
    } else {
      // Try partial match (substance name contains the input or vice versa)
      const partialMatch = substanceList.find(s => {
        const nameLower = s.name.toLowerCase()
        return nameLower.includes(lower) || lower.includes(nameLower) ||
          s.commonNames?.some(cn => {
            const cnLower = cn.toLowerCase()
            return cnLower.includes(lower) || lower.includes(cnLower)
          }) ||
          s.aliases?.some(a => {
            const aLower = a.toLowerCase()
            return aLower.includes(lower) || lower.includes(aLower)
          })
      })

      if (partialMatch) {
        substanceName = partialMatch.name
        substanceId = partialMatch.id
        const raw = partialMatch as any
        categories = Array.isArray(raw.categories) && raw.categories.length > 0
          ? raw.categories
          : typeof raw.category === 'string' && raw.category && raw.category !== 'unknown'
          ? [raw.category]
          : []
      }
    }
  }

  return { substanceName, substanceId, amount: amountStr, unit: resolvedUnit, route: extractedRoute || unitImpliedRoute, categories }
}

/** Format a unit with proper singular/plural based on amount */
export function formatUnit(unit: string, amount: number): string {
  const invariantUnits = ['mg', 'g', 'μg', 'ml', 'mL']
  if (invariantUnits.includes(unit)) return unit

  const isSingular = amount === 1 || (amount > 0 && amount < 1)

  const pluralRules: Record<string, string> = {
    'drop': 'drops', 'puff': 'puffs', 'tab': 'tabs', 'capsule': 'capsules',
    'hit': 'hits', 'line': 'lines', 'drink': 'drinks', 'shot': 'shots',
    'joint': 'joints', 'blunt': 'blunts', 'bowl': 'bowls', 'blinker': 'blinkers',
  }
  const singularRules: Record<string, string> = Object.fromEntries(
    Object.entries(pluralRules).map(([sing, plur]) => [plur, sing])
  )

  if (isSingular && singularRules[unit]) return singularRules[unit]
  if (!isSingular && pluralRules[unit]) return pluralRules[unit]
  if (!isSingular && !pluralRules[unit] && !singularRules[unit]) return unit + 's'
  return unit
}

export function DoseLoggerModal({
  onLogCreated,
  trigger,
  preselectedSubstanceId,
  preselectedSubstanceName,
  preselectedCategory,
  preselectedRoute,
}: DoseLoggerModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { doses, addDose } = useDoseStore()

  // Quick input state - single field that can parse substance + amount + unit
  const [quickInput, setQuickInput] = useState('')

  const [substanceId, setSubstanceId] = useState(preselectedSubstanceId || '')
  const [substanceName, setSubstanceName] = useState(preselectedSubstanceName || '')
  const [categories, setCategories] = useState<string[]>(
    Array.isArray(preselectedCategory) ? preselectedCategory
    : preselectedCategory ? [preselectedCategory]
    : []
  )
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('mg')
  const [route, setRoute] = useState(preselectedRoute || 'oral')
  const [timestamp, setTimestamp] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState('')
  const [setting, setSetting] = useState('')
  const [intensity] = useState([5])

  // Duration override state — null means "use whatever interpolation gives us"
  const [durationOverride, setDurationOverride] = useState<Duration | null>(null)

  useEffect(() => {
    if (preselectedSubstanceId) setSubstanceId(preselectedSubstanceId)
    if (preselectedSubstanceName) setSubstanceName(preselectedSubstanceName)
    if (preselectedSubstanceId) {
      const found = substances.find(s => s.id === preselectedSubstanceId)
      if (found) {
        const raw = found as any
        const cats: string[] = Array.isArray(raw.categories) && raw.categories.length > 0
          ? raw.categories
          : typeof raw.category === 'string' && raw.category && raw.category !== 'unknown'
          ? [raw.category]
          : []
        setCategories(cats)
      }
    } else if (preselectedCategory) {
      setCategories(Array.isArray(preselectedCategory) ? preselectedCategory : [preselectedCategory])
    }
    if (preselectedRoute) setRoute(preselectedRoute)
  }, [preselectedSubstanceId, preselectedSubstanceName, preselectedCategory, preselectedRoute])

  /* ── Quick Input handler - parses substance + amount + unit from single string ─── */
  const handleQuickInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuickInput(value)

    // Parse the input
    const parsed = parseQuickInput(value, substances)

    // Update all relevant fields
    if (parsed.substanceName) {
      setSubstanceName(parsed.substanceName)
      setSubstanceId(parsed.substanceId || `custom-${Date.now()}`)
      setCategories(parsed.categories)
    }
    if (parsed.amount) {
      setAmount(parsed.amount)
    }
    if (parsed.unit) {
      setUnit(parsed.unit)
    }
    if (parsed.route) {
      setRoute(parsed.route)
    }
  }, [])

  const selectedSubstance = substances.find(s => s.id === substanceId)

  // ── Duration resolution ──────────────────────────────────────────────────
  // Priority: user override > real routeData > interpolated estimate > null
  const estimatedDuration = useMemo(
    () => getDurationForRoute(selectedSubstance ?? null, route),
    [selectedSubstance, route]
  )

  // The duration we'll actually save — override wins if provided
  const resolvedDuration: Duration | null = useMemo(() => {
    if (durationOverride) return durationOverride
    if (estimatedDuration) {
      // Strip the EstimatedDuration-specific fields before saving
      const { isEstimated, sourceRoute, estimationNote, ...plain } = estimatedDuration
      return plain
    }
    return null
  }, [durationOverride, estimatedDuration])

  // Reset override when route or substance changes
  useEffect(() => {
    setDurationOverride(null)
  }, [substanceId, route])

  // ── Interaction detection ────────────────────────────────────────────────
  const activeDoses = useMemo(() => {
    return doses.filter(dose => {
      if (!dose.duration) return false
      const timings = calculatePhaseTimings(dose.duration)
      const status = getPhaseStatus(new Date(dose.timestamp), timings)
      return status.phase !== 'ended'
    })
  }, [doses])

  const interactingSubstances = useMemo(() => {
    if (!selectedSubstance) return []
    const interactions = new Set<string>()
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    // Flatten all interaction strings from the new structured format
    const flatInteractions = (sub: any): string[] => {
      if (!sub?.interactions) return []
      return [
        ...(sub.interactions.dangerous || []),
        ...(sub.interactions.unsafe || []),
        ...(sub.interactions.uncertain || []),
      ]
    }

    const matchAny = (interactionList: string[], keywords: string[]): boolean => {
      return interactionList.some(i => keywords.some(k => {
        try { return new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(i.toLowerCase()) }
        catch { return i.toLowerCase().includes(k) }
      }))
    }

    for (const dose of activeDoses) {
      if (dose.substanceId === selectedSubstance.id) continue
      const activeSubstance = substances.find(s => s.id === dose.substanceId || s.name === dose.substanceName)

      if (!activeSubstance) {
        const activeNameLower = dose.substanceName.toLowerCase()
        const hits = matchAny(flatInteractions(selectedSubstance), [activeNameLower])
        if (hits) interactions.add(dose.substanceName)
        continue
      }

      const keywords = (sub: any) => [sub.name, sub.class, ...(sub.categories || []), ...(sub.commonNames || []), ...(sub.aliases || [])]
        .filter(Boolean).map((s: string) => s.toLowerCase()).filter((s: string) => s !== 'other' && s.length > 2)

      const activeKw    = keywords(activeSubstance)
      const selectedKw  = keywords(selectedSubstance)

      const fwd = matchAny(flatInteractions(selectedSubstance), activeKw)
      const rev = matchAny(flatInteractions(activeSubstance), selectedKw)

      if (fwd || rev) interactions.add(activeSubstance.name)
    }
    return Array.from(interactions)
  }, [selectedSubstance, activeDoses])

  const substanceOptions: ComboboxOption[] = substances.map(s => ({ value: s.id, label: s.name }))

  /* ── Smart amount input handler ──────────────────────────────────────── */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const parsed = parseAmountUnit(raw)
    setAmount(parsed.amount)
    if (parsed.unit) {
      setUnit(parsed.unit)
      // Auto-set route if this unit implies one
      if (UNIT_TO_ROUTE[parsed.unit]) {
        setRoute(UNIT_TO_ROUTE[parsed.unit])
      }
    }
  }

  const handleSubmit = async () => {
    if (!substanceName || !amount) {
      toast({ title: 'Missing fields', description: 'Please select a substance and enter an amount', variant: 'destructive' })
      return
    }
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      const now = new Date().toISOString()

      // Attach estimation metadata to notes if we used an estimate
      let finalNotes = notes || null
      if (!durationOverride && estimatedDuration?.isEstimated) {
        const disclaimer = `[Duration estimated from ${estimatedDuration.sourceRoute} route data — verify before relying on timeline]`
        finalNotes = notes ? `${notes}\n${disclaimer}` : disclaimer
      }

      const usingEstimate = !durationOverride && !!estimatedDuration?.isEstimated

      const newLog: DoseLog = {
        id: `dose_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        substanceId: substanceId || `custom-${Date.now()}`,
        substanceName,
        categories,
        amount: parseFloat(amount),
        unit,
        route,
        timestamp: new Date(timestamp).toISOString(),
        duration: resolvedDuration,
        durationIsEstimated: usingEstimate || undefined,
        durationSourceRoute: usingEstimate ? estimatedDuration?.sourceRoute : undefined,
        notes: finalNotes,
        mood: mood || null,
        setting: setting || null,
        intensity: intensity[0],
        createdAt: now,
        updatedAt: now,
      }

      addDose(newLog)

      toast({
        title: 'Dose logged',
        description: `${amount} ${formatUnit(unit, parseFloat(amount))} of ${substanceName}${estimatedDuration?.isEstimated && !durationOverride ? ' (estimated timeline)' : ''}`,
      })

      setOpen(false)
      resetForm()
      onLogCreated?.()
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to log dose', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setQuickInput('')
    if (!preselectedSubstanceId) {
      setSubstanceId('')
      setSubstanceName('')
      setCategories([])
    }
    setAmount('')
    setUnit('mg')
    if (!preselectedRoute) setRoute('oral')
    setTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    setNotes('')
    setMood('')
    setSetting('')
    setDurationOverride(null)
  }

  const handleSubstanceChange = (value: string) => {
    const found = substances.find(s => s.id === value)
    if (found) {
      setSubstanceId(found.id)
      setSubstanceName(found.name)
      const raw = found as any
      const cats: string[] = Array.isArray(raw.categories) && raw.categories.length > 0
        ? raw.categories
        : typeof raw.category === 'string' && raw.category && raw.category !== 'unknown'
        ? [raw.category]
        : []
      setCategories(cats)
    } else {
      setSubstanceId(value)
      setSubstanceName(value)
      setCategories([])
    }
    setDurationOverride(null)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isOpen) setTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
      setOpen(isOpen)
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Log Dose
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log a Dose</DialogTitle>
          <DialogDescription>
            Record your substance use for tracking and harm reduction purposes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            {/* ── Quick Input Field ─────────────────────────────────────── */}
            <div className="grid gap-2">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Quick Input
              </Label>
              <Input
                type="text"
                placeholder="e.g. &quot;THC 1 joint&quot;, &quot;Caffeine 100 mg oral&quot;, &quot;2 tabs LSD&quot;"
                value={quickInput}
                onChange={handleQuickInputChange}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Type substance + amount + unit (+ optional route) to auto-fill all fields below
              </p>
            </div>

            {/* ── Divider when quick input has content ───────────────────── */}
            {quickInput && (substanceName || amount) && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" />
                <span>Auto-filled from quick input</span>
                <div className="h-px flex-1 bg-border" />
              </div>
            )}

            <div className="grid gap-2">
              <Label>Substance</Label>
              <Combobox
                options={substanceOptions}
                value={substanceId}
                onChange={handleSubstanceChange}
                placeholder="Select from list or type custom..."
                allowCustom={true}
              />
              <p className="text-xs text-muted-foreground">Select from list or type a custom substance</p>
            </div>

            {interactingSubstances.length > 0 && (
              <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Potential Interaction Warning</AlertTitle>
                <AlertDescription>
                  This substance may interact with your currently active dose(s) of: <strong>{interactingSubstances.join(', ')}</strong>.
                  Please exercise caution and research potential interactions.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="e.g., 100 or 5 mg"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <p className="text-xs text-muted-foreground">Type a unit after the amount (e.g. &quot;5 mg&quot;, &quot;100μg&quot;) to auto-select it</p>
              </div>
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Combobox
                  options={unitOptions}
                  value={unit}
                  onChange={setUnit}
                  placeholder="Select or type custom..."
                  allowCustom={true}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Route of Administration</Label>
              <Combobox
                options={selectedSubstance?.routeData
                  ? Object.keys(selectedSubstance.routeData).map(r => ({ value: r, label: r }))
                  : defaultRouteOptions}
                value={route}
                onChange={setRoute}
                placeholder="Select or type custom..."
                allowCustom
              />
              <p className="text-xs text-muted-foreground">Type a custom route if needed</p>
            </div>

            <div className="grid gap-2">
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
            </div>

            {/* ── Duration section ─────────────────────────────────────── */}
            <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
              <DurationOverrideFields
                baseDuration={estimatedDuration}
                onChange={setDurationOverride}
              />
            </div>

            <div className="grid gap-2">
              <Label>Mood (optional)</Label>
              <Combobox
                options={moodOptions}
                value={mood}
                onChange={setMood}
                placeholder="Select or type custom..."
                allowCustom={true}
              />
            </div>

            <div className="grid gap-2">
              <Label>Setting (optional)</Label>
              <Combobox
                options={settingOptions}
                value={setting}
                onChange={setSetting}
                placeholder="Select or type custom..."
                allowCustom={true}
              />
            </div>

            <div className="grid gap-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Any additional notes about this experience..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log Dose
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
