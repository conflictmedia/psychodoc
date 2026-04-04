'use client'

import { formatDoseAmount } from '@/lib/utils'
import { useState, useRef } from 'react'
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Trash2, Calendar, Clock, Droplets, Activity, Loader2, Download, Upload, Cloud, CloudOff, Lock, CheckCircle2, RotateCcw, Pencil, FileJson, FileText, ChevronDown, AlertTriangle } from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { substances } from '@/lib/substances/index'
import { useToast } from '@/hooks/use-toast'
import { EditDoseModal } from './edit-dose-modal'
import { useDoseStore } from '@/store/dose-store'
import { useSync } from '@/contexts/sync-context'
import { DoseLog } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'



type ImportResult =
  | { ok: true; doses: DoseLog[] }
  | { ok: false; error: string }

type ConflictStrategy = 'skip' | 'overwrite'

interface ImportPreview {
  doses: DoseLog[]
  fileName: string
  duplicateCount: number
  newCount: number
}


function findSubstanceMatch(name: string): { name: string; categories: string[] } | null {
  const searchName = name.toLowerCase().trim()

  for (const substance of substances) {
    // Check main name
    if (substance.name.toLowerCase() === searchName) {
      return {
        name: substance.name,
        categories: substance.categories
      }
    }

    // Check ID (for exact matches like "mdma" -> "MDMA")
    if (substance.id.toLowerCase() === searchName) {
      return {
        name: substance.name,
        categories: substance.categories
      }
    }

    // Check common names
    if (substance.commonNames?.some(cn => cn.toLowerCase() === searchName)) {
      return {
        name: substance.name,
        categories: substance.categories
      }
    }

    // Check aliases
    if (substance.aliases?.some(alias => alias.toLowerCase() === searchName)) {
      return {
        name: substance.name,
        categories: substance.categories
      }
    }
  }

  return null
}

function validateDose(raw: Record<string, unknown>, index: number): DoseLog {
  const requiredString = (key: string) => {
    const v = raw[key]
    if (typeof v !== 'string' || v.trim() === '') {
      throw new Error(`Row ${index + 1}: "${key}" must be a non-empty string (got ${JSON.stringify(v)})`)
    }
    return v.trim()
  }

  const id = typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : crypto.randomUUID()
  const timestamp = requiredString('timestamp')
  if (isNaN(Date.parse(timestamp))) {
    throw new Error(`Row ${index + 1}: "timestamp" is not a valid date ("${timestamp}")`)
  }

  const amount = Number(raw.amount)
  if (isNaN(amount) || amount <= 0) {
    throw new Error(`Row ${index + 1}: "amount" must be a positive number (got ${JSON.stringify(raw.amount)})`)
  }

  return {
    id,
    timestamp,
    substanceName: requiredString('substanceName'),
    amount,
    unit: requiredString('unit'),
    route: requiredString('route'),
    categories: Array.isArray(raw.categories)
      ? (raw.categories as unknown[]).map(String)
      : typeof raw.categories === 'string' && raw.categories.trim()
        ? raw.categories.split(';').map((c) => c.trim()).filter(Boolean)
        : [],
    duration: raw.duration != null && typeof raw.duration === 'object'
      ? (raw.duration as DoseLog['duration'])
      : undefined,
    mood: typeof raw.mood === 'string' && raw.mood.trim() ? raw.mood.trim() : undefined,
    setting: typeof raw.setting === 'string' && raw.setting.trim() ? raw.setting.trim() : undefined,
    notes: typeof raw.notes === 'string' && raw.notes.trim() ? raw.notes.trim() : undefined,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  }
}


function parseJSON(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'File is not valid JSON.' }
  }

  const rawDoses: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as Record<string, unknown>)?.doses)
      ? ((parsed as Record<string, unknown>).doses as unknown[])
      : []

  if (rawDoses.length === 0) {
    return { ok: false, error: 'No dose entries found in the JSON file.' }
  }

  const doses: DoseLog[] = []
  for (let i = 0; i < rawDoses.length; i++) {
    try {
      doses.push(validateDose(rawDoses[i] as Record<string, unknown>, i))
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  }

  return { ok: true, doses }
}


function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote inside a quoted field
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current)
  return fields
}

/** Parse a CSV export file produced by exportToCSV. */
function parseCSV(text: string): ImportResult {
  // Normalise line endings
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter((l) => l.trim())

  if (lines.length < 2) {
    return { ok: false, error: 'CSV file must have a header row and at least one data row.' }
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase())

  // Column index lookup — tolerant of extra/missing optional columns
  const col = (name: string) => headers.indexOf(name)

  const requiredHeaders = ['date', 'time', 'substance', 'amount', 'unit', 'route']
  const missing = requiredHeaders.filter((h) => col(h) === -1)
  if (missing.length > 0) {
    return { ok: false, error: `CSV is missing required column(s): ${missing.join(', ')}` }
  }

  const doses: DoseLog[] = []

  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i])
    const get = (name: string) => (col(name) !== -1 ? (fields[col(name)] ?? '').trim() : '')

    const dateStr = get('date')
    const timeStr = get('time')
    const timestampStr = `${dateStr}T${timeStr || '00:00:00'}`

    const raw: Record<string, unknown> = {
      // id is not in the CSV export so always generate a fresh one
      id: crypto.randomUUID(),
      timestamp: timestampStr,
      substanceName: get('substance'),
      amount: get('amount'),
      unit: get('unit'),
      route: get('route'),
      // categories column uses "; " as separator (matches exportToCSV)
      categories: get('category')
        .split(';')
        .map((c) => c.trim())
        .filter(Boolean),
      mood: get('mood'),
      setting: get('setting'),
      notes: get('notes'),
    }

    try {
      doses.push(validateDose(raw, i - 1))
    } catch (err) {
      return { ok: false, error: (err as Error).message }
    }
  }

  if (doses.length === 0) {
    return { ok: false, error: 'No valid dose rows found in the CSV file.' }
  }

  return { ok: true, doses }
}


function parsePsyloJSON(text: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'File is not valid JSON.' }
  }

  const root = parsed as Record<string, unknown>
  if (!Array.isArray(root?.doses)) {
    return { ok: false, error: 'Not a valid Psylo export — expected a top-level "doses" array.' }
  }

  const rawDoses = root.doses as Record<string, unknown>[]
  if (rawDoses.length === 0) {
    return { ok: false, error: 'No dose entries found in the Psylo export.' }
  }

  const doses: DoseLog[] = []

  for (let i = 0; i < rawDoses.length; i++) {
    const raw = rawDoses[i]
    const rowLabel = `Row ${i + 1}`

    const substance = typeof raw.substance === 'string' && raw.substance.trim()
      ? raw.substance.trim()
      : null
    if (!substance) {
      return { ok: false, error: `${rowLabel}: "substance" must be a non-empty string.` }
    }

    const amount = Number(raw.amount)
    if (isNaN(amount) || amount <= 0) {
      return { ok: false, error: `${rowLabel}: "amount" must be a positive number (got ${JSON.stringify(raw.amount)}).` }
    }

    const unit = typeof raw.unit === 'string' && raw.unit.trim() ? raw.unit.trim() : null
    if (!unit) {
      return { ok: false, error: `${rowLabel}: "unit" must be a non-empty string.` }
    }

    const route = typeof raw.route === 'string' && raw.route.trim() ? raw.route.trim() : null
    if (!route) {
      return { ok: false, error: `${rowLabel}: "route" must be a non-empty string.` }
    }

    const timestamp = typeof raw.timestamp === 'string' ? raw.timestamp : null
    if (!timestamp || isNaN(Date.parse(timestamp))) {
      return { ok: false, error: `${rowLabel}: "timestamp" is not a valid date.` }
    }



    const id = raw.id != null
      ? `psylo-${raw.id}`
      : crypto.randomUUID()


    const notesArr = Array.isArray(raw.notes) ? raw.notes as Array<{ text?: string }> : []
    const notesStr = notesArr
      .map((n) => (typeof n.text === 'string' ? n.text.trim() : ''))
      .filter(Boolean)
      .join(' | ') || undefined


    let duration: DoseLog['duration'] = undefined
    if (raw.onsetAt || raw.peakAt || raw.offsetAt) {
      const onset = raw.onsetAt ? new Date(raw.onsetAt as string) : null
      const peak = raw.peakAt ? new Date(raw.peakAt as string) : null
      const offset = raw.offsetAt ? new Date(raw.offsetAt as string) : null
      const start = new Date(timestamp)

      const minsStr = (from: Date | null, to: Date | null) =>
        from && to ? `${Math.round((to.getTime() - from.getTime()) / 60_000)} min` : '—'

      duration = {
        onset: minsStr(start, onset),
        comeup: minsStr(onset, peak),
        peak: minsStr(peak, offset),
        offset: '—',
        total: minsStr(start, offset ?? peak ?? onset),
      }
    }

    // Try to match the substance against the repository
    const matchedSubstance = findSubstanceMatch(substance)
    const finalSubstanceName = matchedSubstance?.name ?? substance
    const finalCategories = matchedSubstance?.categories ?? []

    doses.push({
      id,
      substanceName: finalSubstanceName,
      categories: finalCategories,
      amount,
      unit,
      route,
      timestamp,
      duration: duration ?? null,
      notes: notesStr,
      mood: undefined,
      setting: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return { ok: true, doses }
}



export function DoseHistory() {
  const { doses, isLoaded, deleteDose, addDose } = useDoseStore()
  const { syncStatus, roomId, password, setRoomId, setPassword, connectToSync, disconnectSync } = useSync()
  const { toast } = useToast()

  const [deleting, setDeleting] = useState<string | null>(null)
  const [redosing, setRedosing] = useState<string | null>(null)
  const [editingDose, setEditingDose] = useState<DoseLog | null>(null)
  const [showSyncPanel, setShowSyncPanel] = useState(false)
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  // Delete all state
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  const csvInputRef = useRef<HTMLInputElement>(null)
  const jsonInputRef = useRef<HTMLInputElement>(null)
  const psyloJsonInputRef = useRef<HTMLInputElement>(null)
  const redosingRef = useRef(false)

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }



  const triggerDownload = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }


  const buildPreview = (parsed: DoseLog[], fileName: string): ImportPreview => {
    const existingIds = new Set(doses.map((d) => d.id))
    const duplicateCount = parsed.filter((d) => existingIds.has(d.id)).length
    return {
      doses: parsed,
      fileName,
      duplicateCount,
      newCount: parsed.length - duplicateCount,
    }
  }



  const exportToCSV = () => {
    if (doses.length === 0) return toast({ title: 'Nothing to export', variant: 'destructive' })
    const headers = ['Date', 'Time', 'Substance', 'Category', 'Amount', 'Unit', 'Route', 'Total Duration', 'Mood', 'Setting', 'Notes']
    const escapeCSV = (value: unknown) => value == null ? '""' : `"${String(value).replace(/"/g, '""')}"`
    const rows = doses.map((d) => {
      const dateObj = new Date(d.timestamp)
      return [
        format(dateObj, 'yyyy-MM-dd'), format(dateObj, 'HH:mm:ss'),
        d.substanceName, (d.categories || []).join('; '),
        d.amount, d.unit, d.route, d.duration?.total || '',
        d.mood || '', d.setting || '', d.notes || '',
      ].map(escapeCSV).join(',')
    })
    triggerDownload(
      [headers.map(escapeCSV).join(','), ...rows].join('\n'),
      `dose-history-${format(new Date(), 'yyyy-MM-dd')}.csv`,
      'text/csv;charset=utf-8;',
    )
    toast({ title: 'CSV exported', description: `${doses.length} dose(s) exported.` })
  }

  const exportToJSON = () => {
    if (doses.length === 0) return toast({ title: 'Nothing to export', variant: 'destructive' })
    const exportData = {
      exportedAt: new Date().toISOString(),
      exportedAtFormatted: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      totalDoses: doses.length,
      doses: doses.map((d) => ({
        id: d.id,
        timestamp: d.timestamp,
        timestampFormatted: format(new Date(d.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        substanceName: d.substanceName,
        categories: d.categories ?? [],
        amount: d.amount,
        unit: d.unit,
        route: d.route,
        duration: d.duration ?? null,
        mood: d.mood ?? null,
        setting: d.setting ?? null,
        notes: d.notes ?? null,
        createdAt: d.createdAt ?? null,
        updatedAt: d.updatedAt ?? null,
      })),
    }
    triggerDownload(
      JSON.stringify(exportData, null, 2),
      `dose-history-${format(new Date(), 'yyyy-MM-dd')}.json`,
      'application/json;charset=utf-8;',
    )
    toast({ title: 'JSON exported', description: `${doses.length} dose(s) exported.` })
  }




  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'csv' | 'json' | 'psylo',
  ) => {
    const file = e.target.files?.[0]
    // Reset so selecting the same file again re-triggers onChange
    e.target.value = ''

    if (!file) return

    const text = await file.text()
    const result = type === 'json' ? parseJSON(text) : type === 'psylo' ? parsePsyloJSON(text) : parseCSV(text)

    if (!result.ok) {
      toast({
        title: 'Import failed',
        description: result.error,
        variant: 'destructive',
      })
      return
    }

    setImportPreview(buildPreview(result.doses, file.name))
  }




  const confirmImport = async (strategy: ConflictStrategy) => {
    if (!importPreview) return
    setIsImporting(true)

    const existingIds = new Set(doses.map((d) => d.id))
    let added = 0
    let skipped = 0
    let overwritten = 0

    for (const dose of importPreview.doses) {
      if (existingIds.has(dose.id)) {
        if (strategy === 'skip') {
          skipped++
          continue
        }
        // overwrite: remove old record first
        deleteDose(dose.id)
        overwritten++
      }
      addDose(dose)
      added++
    }

    setIsImporting(false)
    setImportPreview(null)

    const parts: string[] = []
    if (added > 0) parts.push(`${added} added`)
    if (overwritten > 0) parts.push(`${overwritten} overwritten`)
    if (skipped > 0) parts.push(`${skipped} skipped`)

    toast({
      title: 'Import complete',
      description: parts.join(', ') + '.',
    })
  }



  const handleDeleteAll = async () => {
    if (deleteConfirmText !== 'DELETE') return

    setIsDeletingAll(true)

    const doseCount = doses.length
    const doseIds = doses.map((d) => d.id)

    // Delete all doses
    for (const id of doseIds) {
      deleteDose(id)
    }

    setIsDeletingAll(false)
    setShowDeleteAllDialog(false)
    setDeleteConfirmText('')

    toast({
      title: 'All doses deleted',
      description: `${doseCount} dose${doseCount !== 1 ? 's' : ''} permanently deleted.`,
    })
  }

  const openDeleteAllDialog = () => {
    setDeleteConfirmText('')
    setShowDeleteAllDialog(true)
  }



  const handleDelete = async (id: string) => {
    setDeleting(id)
    deleteDose(id)
    setDeleting(null)
    toast({ title: 'Dose deleted', description: 'The dose log has been removed.' })
  }

  const handleRedose = async (dose: DoseLog) => {
    if (redosingRef.current) return // Synchronous guard — safe on mobile double-tap
    redosingRef.current = true
    setRedosing(dose.id)

    try {
      const now = new Date().toISOString()
      const result = addDose({
        id: crypto.randomUUID(),
        timestamp: now,
        createdAt: now,
        updatedAt: now,
        substanceId: dose.substanceId,
        substanceName: dose.substanceName,
        categories: dose.categories,
        amount: dose.amount,
        unit: dose.unit,
        route: dose.route,
        duration: dose.duration,
        intensity: dose.intensity,
        mood: dose.mood,
        setting: dose.setting,
        notes: dose.notes ? `Redose — ${dose.notes}` : 'Redose',
      })

      // Handle if addDose returns a promise (async storage)
      if (result instanceof Promise) {
        await result
      }

      toast({ title: 'Redose logged', description: `${dose.substanceName} logged again.` })
    } catch (error) {
      console.error('Redose failed:', error)
      toast({
        title: 'Redose failed',
        description: 'Could not log redose. Please try again.',
        variant: 'destructive'
      })
    } finally {
      redosingRef.current = false
      setRedosing(null)
    }
  }

  const groupDosesByDate = (doses: DoseLog[]) => {
    const groups: { [key: string]: DoseLog[] } = {}
    doses.forEach((dose) => {
      const date = new Date(dose.timestamp)
      const key = isToday(date) ? 'Today'
        : isYesterday(date) ? 'Yesterday'
          : isThisWeek(date) ? 'This Week'
            : isThisMonth(date) ? 'This Month'
              : format(date, 'MMMM yyyy')
      if (!groups[key]) groups[key] = []
      groups[key].push(dose)
    })
    return groups
  }

  const getCategoryColor = (category: string) =>
    categoryColors[category as keyof typeof categoryColors] ||
    'text-gray-500 bg-gray-500/10 border-gray-500/20'



  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between pb-4 flex-wrap gap-4">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />Dose History
            </CardTitle>
            <CardDescription>Your logged substance doses</CardDescription>
          </div>

          <div className="flex gap-2 shrink-0 flex-wrap">
            {/* Sync button */}
            <Button
              variant={syncStatus === 'synced' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowSyncPanel(!showSyncPanel)}
              className={syncStatus === 'synced' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {syncStatus === 'synced'
                ? <Cloud className="mr-2 h-4 w-4" />
                : <CloudOff className="mr-2 h-4 w-4" />}
              {syncStatus === 'synced' ? 'Synced' : 'Sync'}
            </Button>

            {/* Export dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />Export
                  <ChevronDown className="ml-2 h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportToCSV} className="gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToJSON} className="gap-2 cursor-pointer">
                  <FileJson className="h-4 w-4" />Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Import dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />Import
                  <ChevronDown className="ml-2 h-3 w-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => csvInputRef.current?.click()}
                >
                  <FileText className="h-4 w-4" />Import from CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => jsonInputRef.current?.click()}
                >
                  <FileJson className="h-4 w-4" />Import from JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => psyloJsonInputRef.current?.click()}
                >
                  <FileJson className="h-4 w-4" />Import from Psylo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete All button */}
            <Button
              variant="outline"
              size="sm"
              onClick={openDeleteAllDialog}
              disabled={doses.length === 0}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All
            </Button>

            {/* Hidden file inputs — one per accepted type for cleaner accept= */}
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => handleFileSelected(e, 'csv')}
            />
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => handleFileSelected(e, 'json')}
            />
            <input
              ref={psyloJsonInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(e) => handleFileSelected(e, 'psylo')}
            />
          </div>
        </CardHeader>

        {/* Sync panel */}
        {showSyncPanel && (
          <div className="px-6 pb-4">
            <div className="bg-muted p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-semibold">End-to-End Encrypted Sync</h4>
              </div>
              {syncStatus === 'synced' ? (
                <div className="flex items-center justify-between bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-md border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Connected to Room: {roomId}</span>
                  </div>
                  <Button size="sm" variant="ghost" onClick={disconnectSync}>Disconnect</Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Room Name" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="bg-background" />
                  <Input type="password" placeholder="Secret Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background" />
                  <Button
                    onClick={() => connectToSync()}
                    disabled={syncStatus === 'connecting' || !roomId || !password}
                    className="shrink-0"
                  >
                    {syncStatus === 'connecting' && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    Connect
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        <CardContent>
          {doses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No doses logged yet</h3>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              {Object.entries(groupDosesByDate(doses)).map(([dateGroup, groupDoses]) => {
                return (
                  <div key={dateGroup} className="mb-6">
                    <h4 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1 z-10 text-center">
                      {dateGroup}
                    </h4>
                    <div className="space-y-3">
                      {groupDoses.map((dose) => {
                        // Find if it's a known substance to link to its page
                        const knownSubstance = substances.find(s => s.id === dose.substanceId || s.name.toLowerCase() === dose.substanceName.toLowerCase())

                        return (
                          <div key={dose.id} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {knownSubstance ? (
                                    <Link href={`/?substance=${knownSubstance.id}`} className="font-medium hover:underline hover:text-primary transition-colors">
                                      {dose.substanceName}
                                    </Link>
                                  ) : (
                                    <span className="font-medium">{dose.substanceName}</span>
                                  )}
                                  {(dose.categories || []).map((cat) => (
                                    <Badge key={cat} variant="outline" className={getCategoryColor(cat)}>{cat}</Badge>
                                  ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Droplets className="h-3 w-3 shrink-0" />
                                    {(() => {
                                      const formatted = formatDoseAmount(dose.amount, dose.unit)
                                      return `${formatted.amount} ${formatted.unit}`
                                    })()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 shrink-0" />{format(new Date(dose.timestamp), 'h:mm a')}
                                  </span>
                                  <span>{dose.route}</span>
                                </div>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingDose(dose)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 touch-manipulation" onClick={() => handleRedose(dose)} disabled={redosing === dose.id}>
                                  {redosing === dose.id ? <Loader2 className="animate-spin h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(dose.id)} disabled={deleting === dose.id}>
                                  {deleting === dose.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Edit modal */}
      {editingDose && (
        <EditDoseModal
          dose={editingDose}
          open={!!editingDose}
          onOpenChange={(open) => !open && setEditingDose(null)}
        />
      )}


      <Dialog open={!!importPreview} onOpenChange={(open) => !open && setImportPreview(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Preview
            </DialogTitle>
            <DialogDescription className="truncate">
              {importPreview?.fileName}
            </DialogDescription>
          </DialogHeader>

          {importPreview && (
            <div className="space-y-4 py-2">
              {/* Summary counts */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <p className="text-2xl font-bold">{importPreview.doses.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
                <div className="rounded-lg border bg-green-500/10 border-green-500/20 p-3">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {importPreview.newCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">New</p>
                </div>
                <div className={`rounded-lg border p-3 ${importPreview.duplicateCount > 0 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-muted/40'}`}>
                  <p className={`text-2xl font-bold ${importPreview.duplicateCount > 0 ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                    {importPreview.duplicateCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Duplicates</p>
                </div>
              </div>


              {importPreview.duplicateCount > 0 && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    {importPreview.duplicateCount} dose{importPreview.duplicateCount > 1 ? 's' : ''} already exist in your history.
                    Choose how to handle them below.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:mr-auto"
              onClick={() => setImportPreview(null)}
              disabled={isImporting}
            >
              Cancel
            </Button>

            {/* Only show overwrite option when there are actual duplicates */}
            {(importPreview?.duplicateCount ?? 0) > 0 && (
              <Button
                variant="outline"
                onClick={() => confirmImport('overwrite')}
                disabled={isImporting}
                className="border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
              >
                {isImporting
                  ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  : <AlertTriangle className="h-4 w-4 mr-2" />}
                Overwrite duplicates
              </Button>
            )}

            <Button onClick={() => confirmImport('skip')} disabled={isImporting}>
              {isImporting
                ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                : <Upload className="h-4 w-4 mr-2" />}
              {(importPreview?.duplicateCount ?? 0) > 0 ? 'Import & skip duplicates' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={showDeleteAllDialog} onOpenChange={(open) => !open && setShowDeleteAllDialog(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete All Doses
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All {doses.length} dose{doses.length !== 1 ? 's' : ''} will be permanently deleted.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Warning box */}
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
              <div className="flex gap-3">
                <Trash2 className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-destructive">
                    You are about to delete all your dose history
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will permanently remove {doses.length} dose log{doses.length !== 1 ? 's' : ''} from your history.
                    Consider exporting your data first if you want to keep a backup.
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation input */}
            <div className="space-y-2">
              <label htmlFor="delete-confirm" className="text-sm font-medium">
                Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
              </label>
              <Input
                id="delete-confirm"
                placeholder="DELETE"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="font-mono"
                autoComplete="off"
              />
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:mr-auto"
              onClick={() => setShowDeleteAllDialog(false)}
              disabled={isDeletingAll}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={isDeletingAll || deleteConfirmText !== 'DELETE'}
            >
              {isDeletingAll ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete All {doses.length} Doses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
