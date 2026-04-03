'use client'

import { useState } from 'react'
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Trash2, Calendar, Clock, Droplets, MapPin, Smile, Activity, Loader2, Timer, Download, Cloud, CloudOff, Lock, CheckCircle2, RotateCcw, Pencil } from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { useToast } from '@/hooks/use-toast'
import { EditDoseModal } from './edit-dose-modal'
import { useDoseStore } from '@/store/dose-store'
import { useSync } from '@/contexts/sync-context'
import { DoseLog } from '@/types'

export function DoseHistory() {
  const { doses, isLoaded, deleteDose, addDose } = useDoseStore()
  const { syncStatus, roomId, password, setRoomId, setPassword, connectToSync, disconnectSync } = useSync()
  const { toast } = useToast()

  const [deleting, setDeleting] = useState<string | null>(null)
  const [redosing, setRedosing] = useState<string | null>(null)
  const [editingDose, setEditingDose] = useState<DoseLog | null>(null)
  const [showSyncPanel, setShowSyncPanel] = useState(false)

  if (!isLoaded) {
    return (
      <Card><CardContent className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></CardContent></Card>
    )
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    deleteDose(id)
    setDeleting(null)
    toast({ title: 'Dose deleted', description: 'The dose log has been removed.' })
  }

  const handleRedose = async (dose: DoseLog) => {
    setRedosing(dose.id)
    const now = new Date().toISOString()
    addDose({
      ...dose,
      id: crypto.randomUUID(),
      timestamp: now,
      createdAt: now,
      updatedAt: now,
      notes: dose.notes ? `Redose — ${dose.notes}` : 'Redose',
    })
    setRedosing(null)
    toast({ title: 'Redose logged', description: `${dose.substanceName} logged again.` })
  }

  const exportToCSV = () => {
    if (doses.length === 0) return toast({ title: 'Nothing to export', variant: 'destructive' })
    const headers = ['Date', 'Time', 'Substance', 'Category', 'Amount', 'Unit', 'Route', 'Total Duration', 'Mood', 'Setting', 'Notes']
    const escapeCSV = (value: any) => value == null ? '""' : `"${String(value).replace(/"/g, '""')}"`
    const rows = doses.map((d) => {
      const dateObj = new Date(d.timestamp)
      return [
        format(dateObj, 'yyyy-MM-dd'), format(dateObj, 'HH:mm:ss'),
        d.substanceName, (d.categories || []).join('; '),
        d.amount, d.unit, d.route, d.duration?.total || '',
        d.mood || '', d.setting || '', d.notes || ''
      ].map(escapeCSV).join(',')
    })
    const csvContent = [headers.map(escapeCSV).join(','), ...rows].join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }))
    link.download = `dose-history-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const groupDosesByDate = (doses: DoseLog[]) => {
    const groups: { [key: string]: DoseLog[] } = {}
    doses.forEach(dose => {
      const date = new Date(dose.timestamp)
      const key = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : isThisWeek(date) ? 'This Week' : isThisMonth(date) ? 'This Month' : format(date, 'MMMM yyyy')
      if (!groups[key]) groups[key] = []
      groups[key].push(dose)
    })
    return groups
  }

  const getCategoryColor = (category: string) => categoryColors[category as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between pb-4 flex-wrap gap-4">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" />Dose History</CardTitle>
            <CardDescription>Your logged substance doses</CardDescription>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant={syncStatus === 'synced' ? 'default' : 'outline'} size="sm" onClick={() => setShowSyncPanel(!showSyncPanel)} className={syncStatus === 'synced' ? 'bg-green-600 hover:bg-green-700' : ''}>
              {syncStatus === 'synced' ? <Cloud className="mr-2 h-4 w-4" /> : <CloudOff className="mr-2 h-4 w-4" />}
              {syncStatus === 'synced' ? 'Synced' : 'Sync'}
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}><Download className="mr-2 h-4 w-4" />Export</Button>
          </div>
        </CardHeader>

        {showSyncPanel && (
          <div className="px-6 pb-4">
            <div className="bg-muted p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3"><Lock className="h-4 w-4 text-muted-foreground" /><h4 className="text-sm font-semibold">End-to-End Encrypted Sync</h4></div>
              {syncStatus === 'synced' ? (
                <div className="flex items-center justify-between bg-green-500/10 text-green-700 dark:text-green-400 p-3 rounded-md border border-green-500/20">
                  <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /><span className="text-sm font-medium">Connected to Room: {roomId}</span></div>
                  <Button size="sm" variant="ghost" onClick={disconnectSync}>Disconnect</Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input placeholder="Room Name" value={roomId} onChange={(e) => setRoomId(e.target.value)} className="bg-background" />
                  <Input type="password" placeholder="Secret Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background" />
                  <Button onClick={() => connectToSync()} disabled={syncStatus === 'connecting' || !roomId || !password} className="shrink-0">
                    {syncStatus === 'connecting' && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Connect
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
              {Object.entries(groupDosesByDate(doses)).map(([dateGroup, groupDoses]) => (
                <div key={dateGroup} className="mb-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1 z-10 text-center">{dateGroup}</h4>
                  <div className="space-y-3">
                    {groupDoses.map((dose) => (
                      <div key={dose.id} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{dose.substanceName}</span>
                              {(dose.categories || []).map((cat) => (
                                <Badge key={cat} variant="outline" className={getCategoryColor(cat)}>{cat}</Badge>
                              ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Droplets className="h-3 w-3 shrink-0" />{dose.amount} {dose.unit}</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3 shrink-0" />{format(new Date(dose.timestamp), 'h:mm a')}</span>
                              <span>{dose.route}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingDose(dose)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRedose(dose)} disabled={redosing === dose.id}>{redosing === dose.id ? <Loader2 className="animate-spin h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}</Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(dose.id)} disabled={deleting === dose.id}>{deleting === dose.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4" />}</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {editingDose && (
        <EditDoseModal dose={editingDose} open={!!editingDose} onOpenChange={(open) => !open && setEditingDose(null)} />
      )}
    </>
  )
}
