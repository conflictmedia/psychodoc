'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Loader2, Pencil } from 'lucide-react'
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

function parseAmountUnit(input: string): { amount: string; unit: string | null } {
  const trimmed = input.trim()
  if (!trimmed) return { amount: '', unit: null }

  const match = trimmed.match(/^([\-\+]?\d*\.?\d+)(?:\s*([a-zA-Zμ]+))?$/)
  if (match) {
    const amountStr = match[1]
    const unitStr = match[2]
    if (!unitStr) return { amount: amountStr, unit: null }

    const lower = unitStr.toLowerCase()
    
    // Direct match
    if (KNOWN_UNITS.includes(lower)) return { amount: amountStr, unit: lower }
    
    // Alias match
    if (UNIT_ALIASES[lower]) return { amount: amountStr, unit: UNIT_ALIASES[lower] }
    
    // Fuzzy match for partial units (e.g., "join" → "joint", "blun" → "blunt")
    const fuzzyMatch = resolveUnitFuzzy(lower)
    if (fuzzyMatch) return { amount: amountStr, unit: fuzzyMatch }
    
    return { amount: amountStr, unit: lower }
  }

  return { amount: trimmed, unit: null }
}

export function EditDoseModal({ dose, open, onOpenChange, onSaved }: EditDoseModalProps) {
  const { toast } = useToast()
  const { updateDose } = useDoseStore()
  const [loading, setLoading] = useState(false)

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
      // Auto-set route if this unit implies one
      if (UNIT_TO_ROUTE[parsed.unit]) {
        setRoute(UNIT_TO_ROUTE[parsed.unit])
      }
    }
  }

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
                  step="0.1"
                  placeholder="e.g., 100 or 5 mg"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <p className="text-xs text-muted-foreground">Type a unit after the amount (e.g. &quot;5 mg&quot;) to auto-select it</p>
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
