'use client'

import { useState, useEffect, useMemo } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Loader2, AlertTriangle } from 'lucide-react'
import { substances } from '@/lib/substances/index'
import { useToast } from '@/hooks/use-toast'
import { useDoseStore } from '@/store/dose-store'
import { DoseLog } from '@/types'
import { calculatePhaseTimings, getPhaseStatus } from '@/components/dose-timeline/dose-timeline-utils'

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

export function DoseLoggerModal({
  onLogCreated,
  trigger,
  preselectedSubstanceId,
  preselectedSubstanceName,
  preselectedCategory,
  preselectedRoute,
}: DoseLoggerModalProps) {
  const[open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // 2. Extract doses from the store
  const { doses, addDose } = useDoseStore()

  const [substanceId, setSubstanceId] = useState(preselectedSubstanceId || '')
  const [substanceName, setSubstanceName] = useState(preselectedSubstanceName || '')
  const [categories, setCategories] = useState<string[]>(
    Array.isArray(preselectedCategory) ? preselectedCategory
    : preselectedCategory ? [preselectedCategory]
    : []
  )
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('mg')
  const [route, setRoute] = useState(preselectedRoute || 'Oral')
  const [timestamp, setTimestamp] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState('')
  const [setting, setSetting] = useState('')
  const [intensity] = useState([5])

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
    if (preselectedRoute) {
      setRoute(preselectedRoute)
    }
  }, [preselectedSubstanceId, preselectedSubstanceName, preselectedCategory, preselectedRoute])

  const selectedSubstance = substances.find(s => s.id === substanceId)

  const activeDoses = useMemo(() => {
    return doses.filter(dose => {
      if (!dose.duration) return false;
      const timings = calculatePhaseTimings(dose.duration);
      const status = getPhaseStatus(new Date(dose.timestamp), timings);
      return status.phase !== 'ended';
    });
  }, [doses]);

  const interactingSubstances = useMemo(() => {
    if (!selectedSubstance) return[];
    
    const interactions = new Set<string>();
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    for (const dose of activeDoses) {
      if (dose.substanceId === selectedSubstance.id) continue;
      
      const activeSubstance = substances.find(s => s.id === dose.substanceId || s.name === dose.substanceName);
      
      if (!activeSubstance) {
        // Fallback for custom active substances
        const activeNameLower = dose.substanceName.toLowerCase();
        const selectedInteractsWithActive = selectedSubstance.interactions?.some(i => {
          const iLower = i.toLowerCase();
          try {
            return new RegExp(`\\b${escapeRegExp(activeNameLower)}\\b`, 'i').test(iLower);
          } catch {
            return iLower.includes(activeNameLower);
          }
        });
        if (selectedInteractsWithActive) {
          interactions.add(dose.substanceName);
        }
        continue;
      }
      
      const getKeywords = (sub: any) =>[
        sub.name, sub.class, ...(sub.categories || []), ...(sub.commonNames ||[]), ...(sub.aliases ||[])
      ].filter(Boolean).map((s: string) => s.toLowerCase()).filter((s: string) => s !== 'other' && s.length > 2);
      
      const activeKeywords = getKeywords(activeSubstance);
      const selectedKeywords = getKeywords(selectedSubstance);
      
      const selectedInteractsWithActive = selectedSubstance.interactions?.some(i => {
        const iLower = i.toLowerCase();
        return activeKeywords.some(k => {
          try {
            return new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(iLower);
          } catch {
            return iLower.includes(k);
          }
        });
      });
      
      const activeInteractsWithSelected = activeSubstance.interactions?.some(i => {
        const iLower = i.toLowerCase();
        return selectedKeywords.some(k => {
          try {
            return new RegExp(`\\b${escapeRegExp(k)}\\b`, 'i').test(iLower);
          } catch {
            return iLower.includes(k);
          }
        });
      });
      
      if (selectedInteractsWithActive || activeInteractsWithSelected) {
        interactions.add(activeSubstance.name);
      }
    }
    
    return Array.from(interactions);
  }, [selectedSubstance, activeDoses]);

  const substanceOptions: ComboboxOption[] = substances.map(s => ({
    value: s.id,
    label: s.name
  }))

  const handleSubmit = async () => {
    if (!substanceName || !amount) {
      toast({
        title: 'Missing fields',
        description: 'Please select a substance and enter an amount',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    // Simulate a brief loading state for UX
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      const now = new Date().toISOString()

      // Get duration info from substance routeData if available
      const duration = (selectedSubstance?.routeData && selectedSubstance.routeData[route]?.duration)
        ? selectedSubstance.routeData[route].duration
        : null

      const newLog: DoseLog = {
        id: `dose_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        substanceId: substanceId || `custom-${Date.now()}`,
        substanceName,
        categories,
        amount: parseFloat(amount),
        unit,
        route,
        timestamp: new Date(timestamp).toISOString(),
        duration,
        notes: notes || null,
        mood: mood || null,
        setting: setting || null,
        intensity: intensity[0],
        createdAt: now,
        updatedAt: now,
      }

      // 1-liner to add the dose to the global store, sync to local storage, and trigger re-renders!
      addDose(newLog)

      toast({
        title: 'Dose logged',
        description: `Successfully logged ${amount}${unit} of ${substanceName}`
      })

      setOpen(false)
      resetForm()
      onLogCreated?.()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log dose',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    if (!preselectedSubstanceId) {
      setSubstanceId('')
      setSubstanceName('')
      setCategories([])
    }
    setAmount('')
    setUnit('mg')
    if (!preselectedRoute) {
      setRoute('oral')
    }
    setTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    setNotes('')
    setMood('')
    setSetting('')
  }

  const getRoutesForSubstance = () => {
    if (selectedSubstance?.routeData) {
      return Object.keys(selectedSubstance.routeData)
    }
    return ['oral', 'insufflation', 'inhalation', 'sublingual', 'rectal', 'transdermal', 'intravenous', 'smoked', 'vaped', 'intramuscular']
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
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log a Dose</DialogTitle>
          <DialogDescription>
            Record your substance use for tracking and harm reduction purposes.
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
              placeholder="Select or type a substance..."
              allowCustom={true}
            />
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
                type="number"
                step="0.1"
                placeholder="e.g., 100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['mg', 'g', 'μg', 'ml', 'drops', 'puffs', 'tabs', 'capsules', 'hits', 'lines', 'drinks', 'shots'].map(u => (
                    <SelectItem key={u} value={u}> {u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Route of Administration</Label>
            <Select value={route} onValueChange={setRoute}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {getRoutesForSubstance().map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Date & Time</Label>
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
              placeholder="Select or type a mood..."
              allowCustom={true}
            />
          </div>

          <div className="grid gap-2">
            <Label>Setting (optional)</Label>
            <Combobox
              options={settingOptions}
              value={setting}
              onChange={setSetting}
              placeholder="Select or type a setting..."
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
