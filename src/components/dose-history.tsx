'use client'

import { useState, useEffect, useRef } from 'react'
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  Trash2, Calendar, Clock, Droplets, MapPin, Smile,
  Activity, Loader2, Timer, Download, Cloud, CloudOff, Lock, CheckCircle2,
  RotateCcw
} from 'lucide-react'
import { categoryColors } from '@/lib/categories'
import { useToast } from '@/hooks/use-toast'
import { notifyDoseChange } from './active-doses-timeline'

const firebaseConfig = {
  apiKey: "AIzaSyApN_Tnp0lphwjpYV3RFuCJD9sJqKhnppA",
  authDomain: "drugucopia.firebaseapp.com",
  projectId: "drugucopia",
  storageBucket: "drugucopia.firebasestorage.app",
  messagingSenderId: "871310168837",
  appId: "1:871310168837:web:e85ca16b280cffd56f9d6c"
};

const hashRoomName = async (roomName: string, password: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(roomName + password + "drugucopia-salt");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- WEB CRYPTO E2EE UTILS ---

const buf2base64 = (buf: ArrayBuffer | Uint8Array): string => {
  const uint8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < uint8.byteLength; i++) {
    binary += String.fromCharCode(uint8[i]);
  }
  return btoa(binary);
};

const base642buf = (b64: string): Uint8Array => {
  const binary = atob(b64);
  const uint8 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8[i] = binary.charCodeAt(i);
  }
  return uint8;
};

const deriveKey = async (password: string, salt: string) => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits", "deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
};

const encryptData = async (dataObj: any, key: CryptoKey) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedText = new TextEncoder().encode(JSON.stringify(dataObj));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encodedText);
  return { iv: buf2base64(iv), ciphertext: buf2base64(ciphertext) };
};

const decryptData = async (encryptedObj: {iv: string, ciphertext: string}, key: CryptoKey) => {
  const iv = base642buf(encryptedObj.iv);
  const ciphertext = base642buf(encryptedObj.ciphertext);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(decrypted));
};

// --- INTERFACES ---
interface DoseLog {
  id: string
  substanceId: string
  substanceName: string
  categories: string[]
  amount: number
  unit: string
  route: string
  timestamp: string
  duration: { onset: string; comeup: string; peak: string; offset: string; total: string } | null
  notes: string | null
  mood: string | null
  setting: string | null
  intensity: number | null
  createdAt: string
}

interface DoseHistoryProps {
  refreshTrigger?: number
}

const STORAGE_KEY = 'drugucopia-dose-logs'
const SYNC_AUTH_KEY = 'drugucopia-sync-auth'

export function DoseHistory({ refreshTrigger }: DoseHistoryProps) {
  const [doses, setDoses] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [redosing, setRedosing] = useState<string | null>(null)
  const { toast } = useToast()

  // Sync States
  const [showSyncPanel, setShowSyncPanel] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'connecting' | 'synced' | 'error'>('idle')
  const [roomId, setRoomId] = useState('')
  const [password, setPassword] = useState('')
  
  // Refs for background syncing
  const cryptoKeyRef = useRef<CryptoKey | null>(null)
  const activeRoomRef = useRef<string | null>(null)
  const hashedRoomRef = useRef<string | null>(null)
  const deviceIdRef = useRef(
    (() => {
      const stored = localStorage.getItem('drugucopia-device-id')
      if (stored) return stored
      const id = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('drugucopia-device-id', id)
      return id
    })()
  )
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const localVersionRef = useRef<number>(0)

  // Load initial local data
  const fetchDoses = () => {
    setLoading(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const logs = stored ? JSON.parse(stored) : []
      const sorted = logs.sort((a: DoseLog, b: DoseLog) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      setDoses(sorted)
      // ← Remove the pushToSync(sorted) call that was here
    } catch (error) {
      console.error('Error loading dose logs:', error)
      setDoses([])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchDoses()
  }, [refreshTrigger])

  // Auto-connect to sync if credentials exist
  useEffect(() => {
    const savedAuth = localStorage.getItem(SYNC_AUTH_KEY)
    if (savedAuth) {
      const { savedRoom, savedPass } = JSON.parse(savedAuth)
      setRoomId(savedRoom)
      setPassword(savedPass)
      connectToSync(savedRoom, savedPass)
    }
    
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current()
    }
  }, [])

  // --- SYNC LOGIC ---

  const connectToSync = async (rId = roomId, pass = password) => {
    if (!rId || !pass) return
    
    if (!window.crypto || !window.crypto.subtle) {
      toast({ title: 'Encryption Blocked', description: 'HTTPS is required for syncing.', variant: 'destructive' })
      return
    }

    setSyncStatus('connecting')
    try {
      cryptoKeyRef.current = await deriveKey(pass, rId)
      activeRoomRef.current = rId

      const hashedRoomId = await hashRoomName(rId, pass)
      hashedRoomRef.current = hashedRoomId

      localStorage.setItem(SYNC_AUTH_KEY, JSON.stringify({ savedRoom: rId, savedPass: pass }))

      const docRef = doc(db, 'secure_rooms', hashedRoomId)
      unsubscribeRef.current = onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data()
          
          // Ignore updates that WE just pushed
          if (remoteData.sourceDevice === deviceIdRef.current) return

          // Only accept remote data if its version is newer than our last push
          const remoteVersion = remoteData.version || 0
          if (remoteVersion <= localVersionRef.current) return

          try {
            const remoteDoses: DoseLog[] = await decryptData(
              remoteData.encrypted,
              cryptoKeyRef.current!
            )

            const sorted = remoteDoses.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            )

            // Last write wins: fully replace local with remote
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
            setDoses(sorted)
            notifyDoseChange()
            
            // Update our version tracker to match what we received
            localVersionRef.current = remoteVersion

            toast({ title: 'Data Synced', description: 'Received updates from another device.' })
          } catch (e) {
            setSyncStatus('error')
            toast({ title: 'Decryption Failed', description: 'Wrong password or corrupt data.', variant: 'destructive' })
          }
        } else {
          // Room is empty — push our local data to initialize it
          const currentLocal = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
          if (currentLocal.length > 0) pushToSync(currentLocal)
        }
      })

      setSyncStatus('synced')
      toast({ title: 'Secure Sync Active', description: 'Your data is now end-to-end encrypted and syncing.' })
      
    } catch (error) {
      setSyncStatus('error')
      toast({ title: 'Connection Error', description: 'Could not connect to sync server.', variant: 'destructive' })
    }
  }

  const disconnectSync = () => {
    if (unsubscribeRef.current) unsubscribeRef.current()
    cryptoKeyRef.current = null
    activeRoomRef.current = null
    hashedRoomRef.current = null
    localVersionRef.current = 0
    localStorage.removeItem(SYNC_AUTH_KEY)
    setSyncStatus('idle')
    setRoomId('')
    setPassword('')
    toast({ title: 'Sync Disconnected', description: 'Data will only save locally.' })
  }

  const pushToSync = async (latestDoses: DoseLog[]) => {
    if (!cryptoKeyRef.current || !hashedRoomRef.current) return

    try {
      const now = Date.now()
      localVersionRef.current = now

      const encrypted = await encryptData(latestDoses, cryptoKeyRef.current)
      await setDoc(doc(db, 'secure_rooms', hashedRoomRef.current), {
        encrypted,
        sourceDevice: deviceIdRef.current,
        version: now,
        timestamp: serverTimestamp()
      })
    } catch (e) {
      console.error("Failed to push sync:", e)
      toast({ title: 'Sync Warning', description: 'Failed to push update to cloud.', variant: 'destructive' })
    }
  }

  // --- STANDARD LOGIC ---

  const deleteDose = async (id: string) => {
    setDeleting(id)
    try {
      const updated = doses.filter(d => d.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setDoses(updated)
      notifyDoseChange()
      
      await pushToSync(updated)

      toast({ title: 'Dose deleted', description: 'The dose log has been removed' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete dose', variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  const redose = async (dose: DoseLog) => {
    setRedosing(dose.id)
    try {
      const now = new Date().toISOString()
      const newDose: DoseLog = {
        ...dose,
        id: crypto.randomUUID(),
        timestamp: now,
        createdAt: now,
        notes: dose.notes ? `Redose — ${dose.notes}` : 'Redose',
      }

      const updated = [newDose, ...doses]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      setDoses(updated)
      notifyDoseChange()

      await pushToSync(updated)

      toast({
        title: 'Redose logged',
        description: `${dose.substanceName} ${dose.amount} ${dose.unit} logged again at ${format(new Date(now), 'h:mm a')}`,
      })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to log redose', variant: 'destructive' })
    } finally {
      setRedosing(null)
    }
  }

  const exportToCSV = () => {
    if (doses.length === 0) {
      toast({ title: 'Nothing to export', description: 'You have no dose logs to export yet.', variant: 'destructive' })
      return
    }
    const headers = ['Date', 'Time', 'Substance', 'Category', 'Amount', 'Unit', 'Route', 'Total Duration', 'Mood', 'Setting', 'Intensity', 'Notes']
    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return '""'
      return `"${String(value).replace(/"/g, '""')}"`
    }
    const rows = doses.map((dose) => {
      const dateObj = new Date(dose.timestamp)
      return [
        format(dateObj, 'yyyy-MM-dd'), format(dateObj, 'HH:mm:ss'), dose.substanceName, getDoseCategories(dose).join('; '),
        dose.amount, dose.unit, dose.route, dose.duration?.total || '', dose.mood || '', dose.setting || '',
        dose.intensity || '', dose.notes || ''
      ].map(escapeCSV).join(',')
    })
    const csvContent = [headers.map(escapeCSV).join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `dose-history-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast({ title: 'Export successful', description: 'Your dose history has been downloaded as a CSV file.' })
  }

  const groupDosesByDate = (doses: DoseLog[]) => {
    const groups: { [key: string]: DoseLog[] } = {}
    doses.forEach(dose => {
      const date = new Date(dose.timestamp)
      let key = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : 
                isThisWeek(date) ? 'This Week' : isThisMonth(date) ? 'This Month' : format(date, 'MMMM yyyy')
      if (!groups[key]) groups[key] = []
      groups[key].push(dose)
    })
    return groups
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'
  }

  // Normalise: old logs stored category as a string scalar, new ones as string[]
  const getDoseCategories = (dose: DoseLog): string[] => {
    if (Array.isArray(dose.categories)) return dose.categories
    const legacy = (dose as any).category as string | undefined
    if (legacy && legacy !== 'unknown') return [legacy]
    return []
  }

  if (loading) {
    return (
      <Card><CardContent className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></CardContent></Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1.5">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dose History
          </CardTitle>
          <CardDescription>Your logged substance doses</CardDescription>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant={syncStatus === 'synced' ? "default" : "outline"}
            size="sm" 
            onClick={() => setShowSyncPanel(!showSyncPanel)}
            className={syncStatus === 'synced' ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {syncStatus === 'synced' ? <Cloud className="mr-2 h-4 w-4" /> : <CloudOff className="mr-2 h-4 w-4" />}
            {syncStatus === 'synced' ? 'Synced' : 'Sync'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>

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
                <Button size="sm" variant="ghost" onClick={disconnectSync} className="hover:bg-green-500/20">Disconnect</Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Input 
                  placeholder="Room Name" 
                  value={roomId} 
                  onChange={(e) => setRoomId(e.target.value)} 
                  className="bg-background"
                />
                <Input 
                  type="password" 
                  placeholder="Secret Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background"
                />
                <Button 
                  onClick={() => connectToSync()} 
                  disabled={syncStatus === 'connecting' || !roomId || !password}
                  className="shrink-0"
                >
                  {syncStatus === 'connecting' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Connect
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Enter the same room name and password on your other devices to sync data privately. Firebase cannot read your data.
            </p>
          </div>
        </div>
      )}

      <CardContent>
        {doses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No doses logged yet</h3>
            <p className="text-sm text-muted-foreground">Start tracking your substance use by logging your first dose</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            {Object.entries(groupDosesByDate(doses)).map(([dateGroup, groupDoses]) => (
              <div key={dateGroup} className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-1 z-10 text-center">
                  {dateGroup}
                </h4>
                <div className="space-y-3">
                  {groupDoses.map((dose) => (
                    <div key={dose.id} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{dose.substanceName}</span>
                            {getDoseCategories(dose).map((cat) => (
                              <Badge key={cat} variant="outline" className={getCategoryColor(cat)}>
                                {cat}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Droplets className="h-3 w-3" />{dose.amount} {dose.unit}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(dose.timestamp), 'MMM d, yyyy')}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(dose.timestamp), 'h:mm a')}</span>
                            <span>{dose.route}</span>
                            {dose.duration?.total && (
                              <span className="flex items-center gap-1"><Timer className="h-3 w-3" />{dose.duration.total}</span>
                            )}
                          </div>

                          {(dose.mood || dose.setting || dose.notes) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {dose.mood && <Badge variant="secondary" className="text-xs"><Smile className="h-3 w-3 mr-1" />{dose.mood}</Badge>}
                              {dose.setting && <Badge variant="secondary" className="text-xs"><MapPin className="h-3 w-3 mr-1" />{dose.setting}</Badge>}
                            </div>
                          )}

                          {dose.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{dose.notes}</p>}
                        </div>
                        
                        <div className="flex gap-1 shrink-0">
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => redose(dose)}
                            disabled={redosing === dose.id}
                            title="Redose"
                          >
                            {redosing === dose.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteDose(dose.id)}
                            disabled={deleting === dose.id}
                          >
                            {deleting === dose.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          </Button>
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
  )
}
