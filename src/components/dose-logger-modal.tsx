'use client'

import { useState } from 'react'
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
// import { Slider } from '@/components/ui/slider' // Shelved: Intensity slider
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'
import { Plus, Loader2 } from 'lucide-react'
import { substances, type Substance } from '@/lib/substances-data'
import { useToast } from '@/hooks/use-toast'

interface DoseLoggerModalProps {
  onLogCreated?: () => void
  trigger?: React.ReactNode
  preselectedSubstanceId?: string
  preselectedSubstanceName?: string
  preselectedCategory?: string
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
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const [substanceId, setSubstanceId] = useState(preselectedSubstanceId || '')
  const [substanceName, setSubstanceName] = useState(preselectedSubstanceName || '')
  const [category, setCategory] = useState(preselectedCategory || '')
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('mg')
  const [route, setRoute] = useState(preselectedRoute || 'Oral')
  const [timestamp, setTimestamp] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState('')
  const [setting, setSetting] = useState('')
  const [intensity] = useState([5])

  const selectedSubstance = substances.find(s => s.id === substanceId)
  
  // Get substance options for combobox
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
      // Save to localStorage
      const existingLogs = JSON.parse(localStorage.getItem('drugucopia-dose-logs') || '[]')
      const now = new Date().toISOString()
      
      // Get duration info from substance if available
      const duration = selectedSubstance?.duration || null
      
      const newLog = {
        id: `dose_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        substanceId: substanceId || `custom-${Date.now()}`,
        substanceName,
        category: category || 'unknown',
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
      
      const updatedLogs = [newLog, ...existingLogs].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      
      localStorage.setItem('drugucopia-dose-logs', JSON.stringify(updatedLogs))

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
      setCategory('')
    }
    setAmount('')
    setUnit('mg')
    setRoute('Oral')
    setTimestamp(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    setNotes('')
    setMood('')
    setSetting('')
  }

  const getRoutesForSubstance = () => {
    if (selectedSubstance?.routes) {
      return selectedSubstance.routes
    }
    return ['Oral', 'Insufflation', 'Inhalation', 'Sublingual', 'Rectal', 'Transdermal', 'Intravenous', 'Smoked', 'Vaped']
  }

  const handleSubstanceChange = (value: string) => {
    const found = substances.find(s => s.id === value)
    if (found) {
      setSubstanceId(found.id)
      setSubstanceName(found.name)
      setCategory(found.category)
    } else {
      // Custom substance
      setSubstanceId(`custom-${Date.now()}`)
      setSubstanceName(value)
      setCategory('unknown')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        
        <div className="grid gap-4 py-4">
          {/* Substance Selection */}
          <div className="grid gap-2">
            <Label>Substance</Label>
            <Combobox
              options={substanceOptions}
              value={substanceId}
              onChange={handleSubstanceChange}
              placeholder="Select or type a substance..."
              disabled={!!preselectedSubstanceId}
              allowCustom={true}
            />
          </div>

          {/* Amount and Unit */}
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
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mg">mg</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                  <SelectItem value="μg">μg</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="drops">drops</SelectItem>
                  <SelectItem value="puffs">puffs</SelectItem>
                  <SelectItem value="tabs">tabs</SelectItem>
                  <SelectItem value="capsules">capsules</SelectItem>
                  <SelectItem value="hits">hits</SelectItem>
                  <SelectItem value="lines">lines</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Route */}
          <div className="grid gap-2">
            <Label>Route of Administration</Label>
            <Select value={route} onValueChange={setRoute}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getRoutesForSubstance().map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timestamp */}
          <div className="grid gap-2">
            <Label>Date & Time</Label>
            <Input 
              type="datetime-local" 
              value={timestamp} 
              onChange={(e) => setTimestamp(e.target.value)}
            />
          </div>

          {/* Mood */}
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

          {/* Setting */}
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

          {/* Notes */}
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
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Dose
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
