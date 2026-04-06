'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { Loader2, Pencil, Zap } from 'lucide-react'
import { formatUnit } from './dose-logger-modal'
import { substances } from '@/lib/substances/index'
import { useToast } from '@/hooks/use-toast'
import { useDoseStore } from '@/store/dose-store'
import { DoseLog, Duration } from '@/types'
import { getDurationForRoute } from '@/lib/duration-interpolation'
import { DurationOverrideFields } from '@/components/duration-override-fields'

interface EditDoseModalProps {
  dose: DoseLog
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (updated: DoseLog) => void
}

const moodOptions: ComboboxOption[] = [
  { value: 'happy', label: 'Happy' }, { value: 'relaxed', label: 'Relaxed' },
  { value: 'anxious', label: 'Anxious' }, { value: 'stressed', label: 'Stressed' },
  { value: 'sad', label: 'Sad' }, { value: 'energetic', label: 'Energetic' },
  { value: 'curious', label: 'Curious' }, { value: 'neutral', label: 'Neutral' },
  { value: 'excited', label: 'Excited' }, { value: 'bored', label: 'Bored' },
  { value: 'tired', label: 'Tired' }, { value: 'focused', label: 'Focused' },
]

const settingOptions: ComboboxOption[] = [
  { value: 'home', label: 'Home' }, { value: 'friends', label: 'With Friends' },
  { value: 'party', label: 'Party/Event' }, { value: 'nature', label: 'Nature' },
  { value: 'festival', label: 'Festival' }, { value: 'work', label: 'Work' },
  { value: 'gym', label: 'Gym' }, { value: 'concert', label: 'Concert' },
  { value: 'bar', label: 'Bar/Club' }, { value: 'travel', label: 'Traveling' },
  { value: 'other', label: 'Other' },
]

const unitOptions: ComboboxOption[] = [
  { value: 'mg', label: 'mg (milligrams)' }, { value: 'g', label: 'g (grams)' },
  { value: 'μg', label: 'μg (micrograms)' }, { value: 'ml', label: 'ml (milliliters)' },
  { value: 'drop', label: 'drop' }, { value: 'puff', label: 'puff' },
  { value: 'tab', label: 'tab' }, { value: 'capsule', label: 'capsule' },
  { value: 'hit', label: 'hit' }, { value: 'line', label: 'line' },
  { value: 'drink', label: 'drink' }, { value: 'shot', label: 'shot' },
  { value: 'joint', label: 'joint' }, { value: 'blunt', label: 'blunt' },
  { value: 'bowl', label: 'bowl' }, { value: 'blinker', label: 'blinker' },
]

const defaultRouteOptions: ComboboxOption[] = [
  { value: 'oral', label: 'Oral' }, { value: 'insufflation', label: 'Insufflation' },
  { value: 'inhalation', label: 'Inhalation' }, { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' }, { value: 'intramuscular', label: 'Intramuscular' },
  { value: 'transdermal', label: 'Transdermal' }, { value: 'intravenous', label: 'Intravenous' },
  { value: 'smoked', label: 'Smoked' }, { value: 'vaped', label: 'Vaped' },
]

/* ------------------------------------------------------------------ */
/*  Smart amount+unit parsing                                          */
/* ------------------------------------------------------------------ */

const KNOWN_UNITS = unitOptions.map(u => u.value)

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

function parseAmountUnit(input: string): { amount: string; unit: string | null } {
  const trimmed = input.trim()
  if (!trimmed) return { amount: '', unit: null }

  const match = trimmed.match(/^([\-\+]?\d*\.?\d+)(?:\s*([a-zA-Zμμ]+))?$/)
  if (match) {
    const amountStr = match[1]
    const unitStr = match[2]
    if (!unitStr) return { amount: amountStr, unit: null }

    const lower = unitStr.toLowerCase()
    if (KNOWN_UNITS.includes(lower)) return { amount: amountStr, unit: lower }
    if (UNIT_ALIASES[lower]) return { amount: amountStr, unit: UNIT_ALIASES[lower] }
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

function parseQuickInput(
  input: string,
  substanceList: typeof substances
): { substanceName: string; substanceId: string; amount: string; unit: string | null; route: string | null } {
  const trimmed = input.trim()
  if (!trimmed) return { substanceName: '', substanceId: '', amount: '', unit: null, route: null }

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

  // Remove route from input for further parsing
  let inputWithoutRoute = trimmed
  if (extractedRoute && routeIndex >= 0) {
    inputWithoutRoute = (trimmed.slice(0, routeIndex) + trimmed.slice(routeIndex + routeLength)).replace(/\s+/g, ' ').trim()
  }

  const amountWithUnitRegex = /(\d*\.?\d+)\s*([a-zA-Zμμ]+)?/g

  let match
  let amountStr = ''
  let unitStr: string | null = null
  let amountIndex = -1
  let amountLength = 0

  while ((match = amountWithUnitRegex.exec(inputWithoutRoute)) !== null) {
    const num = match[1]
    const unit = match[2]

    if (num.length === 1 && !unit) continue

    amountStr = num
    unitStr = unit || null
    amountIndex = match.index
    amountLength = match[0].length
    break
  }

  if (!amountStr) {
    const found = substanceList.find(s =>
      s.name.toLowerCase() === inputWithoutRoute.toLowerCase() ||
      s.commonNames?.some(cn => cn.toLowerCase() === inputWithoutRoute.toLowerCase()) ||
      s.aliases?.some(a => a.toLowerCase() === inputWithoutRoute.toLowerCase())
    )
    if (found) {
      return { substanceName: found.name, substanceId: found.id, amount: '', unit: null, route: extractedRoute }
    }
    return { substanceName: inputWithoutRoute, substanceId: '', amount: '', unit: null, route: extractedRoute }
  }

  let resolvedUnit: string | null = null
  if (unitStr) {
    const lower = unitStr.toLowerCase()
    if (KNOWN_UNITS.includes(lower)) {
      resolvedUnit = lower
    } else if (UNIT_ALIASES[lower]) {
      resolvedUnit = UNIT_ALIASES[lower]
    } else {
      resolvedUnit = lower
    }
  }

  const beforeAmount = inputWithoutRoute.slice(0, amountIndex).trim()
  const afterAmount = inputWithoutRoute.slice(amountIndex + amountLength).trim()
  let potentialSubstance = (beforeAmount + ' ' + afterAmount).trim()

  let substanceName = potentialSubstance
  let substanceId = ''

  if (potentialSubstance) {
    const lower = potentialSubstance.toLowerCase()

    const exactMatch = substanceList.find(s =>
      s.name.toLowerCase() === lower ||
      s.commonNames?.some(cn => cn.toLowerCase() === lower) ||
      s.aliases?.some(a => a.toLowerCase() === lower)
    )

    if (exactMatch) {
      substanceName = exactMatch.name
      substanceId = exactMatch.id
    } else {
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
      }
    }
  }

  return { substanceName, substanceId, amount: amountStr, unit: resolvedUnit, route: extractedRoute }
}

export function EditDoseModal({ dose, open, onOpenChange, onSaved }: EditDoseModalProps) {
  const { toast } = useToast()
  const { updateDose } = useDoseStore()
  const [loading, setLoading] = useState(false)

  // Quick input state
  const [quickInput, setQuickInput] = useState('')

  const [substanceId, setSubstanceId] = useState(dose.substanceId)
  const [substanceName, setSubstanceName] = useState(dose.substanceName)
  const [amount, setAmount] = useState(String(dose.amount))
  const [unit, setUnit] = useState(dose.unit)
  const [route, setRoute] = useState(dose.route)
  const [timestamp, setTimestamp] = useState(format(new Date(dose.timestamp), "yyyy-MM-dd'T'HH:mm"))
  const [notes, setNotes] = useState(dose.notes ?? '')
  const [mood, setMood] = useState(dose.mood ?? '')
  const [setting, setSetting] = useState(dose.setting ?? '')

  // Duration override — initialise from existing dose duration
  const [durationOverride, setDurationOverride] = useState<Duration | null>(dose.duration ?? null)

  useEffect(() => {
    setSubstanceId(dose.substanceId)
    setSubstanceName(dose.substanceName)
    setAmount(String(dose.amount))
    setUnit(dose.unit)
    setRoute(dose.route)
    setTimestamp(format(new Date(dose.timestamp), "yyyy-MM-dd'T'HH:mm"))
    setNotes(dose.notes ?? '')
    setMood(dose.mood ?? '')
    setSetting(dose.setting ?? '')
    setDurationOverride(dose.duration ?? null)
  }, [dose])

  const substanceOptions: ComboboxOption[] = substances.map(s => ({ value: s.id, label: s.name }))
  const selectedSubstance = substances.find(s => s.id === substanceId)

  // Interpolated estimate for the current substance+route combo
  const estimatedDuration = useMemo(
    () => getDurationForRoute(selectedSubstance ?? null, route),
    [selectedSubstance, route]
  )

  // When route/substance changes, reset override to null so interpolation takes over
  // (but keep existing dose.duration if the route hasn't changed)
  const prevRouteRef = useState(dose.route)
  useEffect(() => {
    if (route !== dose.route || substanceId !== dose.substanceId) {
      setDurationOverride(null)
    }
  }, [route, substanceId, dose.route, dose.substanceId])

  const resolvedDuration: Duration | null = useMemo(() => {
    if (durationOverride) return durationOverride
    if (estimatedDuration) {
      const { isEstimated, sourceRoute, estimationNote, ...plain } = estimatedDuration
      return plain
    }
    return null
  }, [durationOverride, estimatedDuration])

  const fieldBaseDuration = useMemo(() => {
    if (durationOverride) {
      return { ...durationOverride, isEstimated: false as const }
    }
    return estimatedDuration
  }, [durationOverride, estimatedDuration])

  const handleSubstanceChange = (value: string) => {
    const found = substances.find(s => s.id === value)
    if (found) {
      setSubstanceId(found.id)
      setSubstanceName(found.name)
    } else {
      setSubstanceId(`custom-${Date.now()}`)
      setSubstanceName(value)
    }
    setDurationOverride(null)
  }

  /* ── Smart amount input handler ──────────────────────────────────────── */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const parsed = parseAmountUnit(raw)
    setAmount(parsed.amount)
    if (parsed.unit) {
      setUnit(parsed.unit)
    }
  }

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

  const handleSave = async () => {
    if (!substanceName || !amount) {
      toast({ title: 'Missing fields', description: 'Substance name and amount are required.', variant: 'destructive' })
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 150))

    try {
      const updated: DoseLog = {
        ...dose,
        substanceId,
        substanceName,
        amount: parseFloat(amount),
        unit,
        route,
        timestamp: new Date(timestamp).toISOString(),
        duration: resolvedDuration,
        notes: notes || null,
        mood: mood || null,
        setting: setting || null,
        updatedAt: new Date().toISOString(),
      }

      updateDose(updated)

      toast({
        title: 'Dose updated',
        description: `${amount} ${formatUnit(unit, parseFloat(amount))} of ${substanceName}`,
      })

      if (onSaved) onSaved(updated)
      onOpenChange(false)
    } catch {
      toast({ title: 'Error', description: 'Failed to save changes.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Dose Log
          </DialogTitle>
          <DialogDescription>Correct any details for this dose entry.</DialogDescription>
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
                placeholder="e.g. &quot;Caffeine 100 mg oral&quot;, &quot;LSD 100ug sublingual&quot;, &quot;2 tabs MDMA insufflated&quot;"
                value={quickInput}
                onChange={handleQuickInputChange}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Type substance + amount + unit + route to auto-fill all fields below
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
                allowCustom
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Amount</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="e.g., 100, 2.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Unit</Label>
                <Combobox options={unitOptions} value={unit} onChange={setUnit} placeholder="Select or type custom..." allowCustom />
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
            </div>

            <div className="grid gap-2">
              <Label>Date &amp; Time</Label>
              <Input type="datetime-local" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
            </div>

            {/* ── Duration section ─────────────────────────────────────── */}
            <div className="grid gap-2 rounded-lg border border-border/60 bg-muted/20 p-3">
              <DurationOverrideFields
                baseDuration={fieldBaseDuration}
                onChange={setDurationOverride}
                defaultExpanded={true}
              />
            </div>

            <div className="grid gap-2">
              <Label>Mood (optional)</Label>
              <Combobox options={moodOptions} value={mood} onChange={setMood} placeholder="Select or type custom..." allowCustom />
            </div>

            <div className="grid gap-2">
              <Label>Setting (optional)</Label>
              <Combobox options={settingOptions} value={setting} onChange={setSetting} placeholder="Select or type custom..." allowCustom />
            </div>

            <div className="grid gap-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Any additional notes..."
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
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
