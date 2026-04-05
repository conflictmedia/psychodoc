'use client'

import { useState, useEffect } from 'react'
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
import { DoseLog } from '@/types'

interface EditDoseModalProps {
  dose: DoseLog
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (updated: DoseLog) => void
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

// Unit options for dose editing (values are singular form for consistent storage)
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

// Default route options for dose editing
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

export function EditDoseModal({ dose, open, onOpenChange, onSaved }: EditDoseModalProps) {
  const { toast } = useToast()
  const { updateDose } = useDoseStore()
  const [loading, setLoading] = useState(false)

  const [substanceId, setSubstanceId] = useState(dose.substanceId)
  const [substanceName, setSubstanceName] = useState(dose.substanceName)
  const [amount, setAmount] = useState(String(dose.amount))
  const [unit, setUnit] = useState(dose.unit)
  const [route, setRoute] = useState(dose.route)
  const [timestamp, setTimestamp] = useState(
    format(new Date(dose.timestamp), "yyyy-MM-dd'T'HH:mm")
  )
  const [notes, setNotes] = useState(dose.notes ?? '')
  const [mood, setMood] = useState(dose.mood ?? '')
  const [setting, setSetting] = useState(dose.setting ?? '')

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
  }, [dose])

  const substanceOptions: ComboboxOption[] = substances.map((s) => ({
    value: s.id,
    label: s.name,
  }))

  const selectedSubstance = substances.find((s) => s.id === substanceId)

  const handleSubstanceChange = (value: string) => {
    const found = substances.find((s) => s.id === value)
    if (found) {
      setSubstanceId(found.id)
      setSubstanceName(found.name)
    } else {
      setSubstanceId(`custom-${Date.now()}`)
      setSubstanceName(value)
    }
  }

  const handleSave = async () => {
    if (!substanceName || !amount) {
      toast({
        title: 'Missing fields',
        description: 'Substance name and amount are required.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 150))

    try {
      const duration =
        selectedSubstance?.routeData?.[route]?.duration ?? dose.duration

      const updated: DoseLog = {
        ...dose,
        substanceId,
        substanceName,
        amount: parseFloat(amount),
        unit,
        route,
        timestamp: new Date(timestamp).toISOString(),
        duration,
        notes: notes || null,
        mood: mood || null,
        setting: setting || null,
        updatedAt: new Date().toISOString(),
      }

      // Update via Zustand store instead of local storage directly
      updateDose(updated)

      toast({
        title: 'Dose updated',
        description: `Successfully updated ${amount} ${formatUnit(unit, parseFloat(amount))} of ${substanceName}`,
      })

      if (onSaved) onSaved(updated)
      onOpenChange(false)
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save changes.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Dose Log
          </DialogTitle>
          <DialogDescription>
            Correct any details for this dose entry.
          </DialogDescription>
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
            <p className="text-xs text-muted-foreground">Select from list or type a custom substance</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Unit</Label>
              <Combobox
                options={unitOptions}
                value={unit}
                onChange={setUnit}
                placeholder="Select or type custom..."
                allowCustom
              />
              <p className="text-xs text-muted-foreground">Type a custom unit if needed</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Route of Administration</Label>
            <Combobox
              options={selectedSubstance?.routeData ? Object.keys(selectedSubstance.routeData).map(r => ({ value: r, label: r })) : defaultRouteOptions}
              value={route}
              onChange={setRoute}
              placeholder="Select or type custom..."
              allowCustom
            />
            <p className="text-xs text-muted-foreground">Type a custom route if needed</p>
          </div>

          <div className="grid gap-2">
            <Label>Date &amp; Time</Label>
            <Input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Mood (optional)</Label>
            <Combobox
              options={moodOptions}
              value={mood}
              onChange={setMood}
              placeholder="Select or type custom..."
              allowCustom
            />
            <p className="text-xs text-muted-foreground">Select or type a custom mood</p>
          </div>

          <div className="grid gap-2">
            <Label>Setting (optional)</Label>
            <Combobox
              options={settingOptions}
              value={setting}
              onChange={setSetting}
              placeholder="Select or type custom..."
              allowCustom
            />
            <p className="text-xs text-muted-foreground">Select or type a custom setting</p>
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
