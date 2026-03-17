'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, addMinutes, addHours } from 'date-fns'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Activity, 
  Timer, 
  Clock, 
  Loader2,
  Zap,
  TrendingUp,
  Mountain,
  TrendingDown,
  Sunrise,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { categoryColors } from '@/lib/substances-data'

interface Duration {
  onset: string
  comeup: string
  peak: string
  offset: string
  total: string
}

interface DoseLog {
  id: string
  substanceId: string
  substanceName: string
  category: string
  amount: number
  unit: string
  route: string
  timestamp: string
  duration: Duration | null
  notes: string | null
  mood: string | null
  setting: string | null
  intensity: number | null
  createdAt: string
}

interface ActiveDosesTimelineProps {
  refreshTrigger?: number
}

const STORAGE_KEY = 'drugucopia-dose-logs'

// Parse duration string like "30-60 minutes" or "2-4 hours" to minutes
function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 0
  
  const lower = durationStr.toLowerCase()
  
  // Handle ranges like "30-60 minutes" - take the average
  const rangeMatch = lower.match(/(\d+)-(\d+)\s*(minutes?|hours?|min|h)/)
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1])
    const max = parseInt(rangeMatch[2])
    const avg = (min + max) / 2
    const unit = rangeMatch[3]
    
    if (unit.startsWith('h')) {
      return avg * 60
    }
    return avg
  }
  
  // Handle single values like "30 minutes" or "1 hour"
  const singleMatch = lower.match(/(\d+)\s*(minutes?|hours?|min|h)/)
  if (singleMatch) {
    const value = parseInt(singleMatch[1])
    const unit = singleMatch[2]
    
    if (unit.startsWith('h')) {
      return value * 60
    }
    return value
  }
  
  return 0
}

// Calculate phase timings in minutes from dose time
interface PhaseTimings {
  onsetStart: number
  onsetEnd: number
  comeupEnd: number
  peakEnd: number
  offsetEnd: number
  totalDuration: number
}

function calculatePhaseTimings(duration: Duration): PhaseTimings {
  const onsetMins = parseDurationToMinutes(duration.onset)
  const comeupMins = parseDurationToMinutes(duration.comeup)
  const peakMins = parseDurationToMinutes(duration.peak)
  const offsetMins = parseDurationToMinutes(duration.offset)
  
  const onsetStart = 0
  const onsetEnd = onsetMins
  const comeupEnd = onsetEnd + comeupMins
  const peakEnd = comeupEnd + peakMins
  const offsetEnd = peakEnd + offsetMins
  
  return {
    onsetStart,
    onsetEnd,
    comeupEnd,
    peakEnd,
    offsetEnd,
    totalDuration: offsetEnd
  }
}

// Determine current phase and progress
interface PhaseStatus {
  phase: 'not_started' | 'onset' | 'comeup' | 'peak' | 'offset' | 'ended'
  progress: number
  overallProgress: number
  timeInPhase: number
  timeRemaining: number
  totalRemaining: number
}

function getPhaseStatus(doseTime: Date, timings: PhaseTimings): PhaseStatus {
  const now = new Date()
  const elapsedMinutes = (now.getTime() - doseTime.getTime()) / (1000 * 60)
  
  if (elapsedMinutes < 0) {
    return {
      phase: 'not_started',
      progress: 0,
      overallProgress: 0,
      timeInPhase: 0,
      timeRemaining: Math.abs(elapsedMinutes),
      totalRemaining: timings.totalDuration
    }
  }
  
  if (elapsedMinutes >= timings.offsetEnd) {
    return {
      phase: 'ended',
      progress: 100,
      overallProgress: 100,
      timeInPhase: 0,
      timeRemaining: 0,
      totalRemaining: 0
    }
  }
  
  if (elapsedMinutes >= timings.peakEnd) {
    const phaseElapsed = elapsedMinutes - timings.peakEnd
    const phaseDuration = timings.offsetEnd - timings.peakEnd
    return {
      phase: 'offset',
      progress: Math.min(100, (phaseElapsed / phaseDuration) * 100),
      overallProgress: (elapsedMinutes / timings.totalDuration) * 100,
      timeInPhase: phaseElapsed,
      timeRemaining: phaseDuration - phaseElapsed,
      totalRemaining: timings.offsetEnd - elapsedMinutes
    }
  }
  
  if (elapsedMinutes >= timings.comeupEnd) {
    const phaseElapsed = elapsedMinutes - timings.comeupEnd
    const phaseDuration = timings.peakEnd - timings.comeupEnd
    return {
      phase: 'peak',
      progress: Math.min(100, (phaseElapsed / phaseDuration) * 100),
      overallProgress: (elapsedMinutes / timings.totalDuration) * 100,
      timeInPhase: phaseElapsed,
      timeRemaining: phaseDuration - phaseElapsed,
      totalRemaining: timings.offsetEnd - elapsedMinutes
    }
  }
  
  if (elapsedMinutes >= timings.onsetEnd) {
    const phaseElapsed = elapsedMinutes - timings.onsetEnd
    const phaseDuration = timings.comeupEnd - timings.onsetEnd
    return {
      phase: 'comeup',
      progress: Math.min(100, (phaseElapsed / phaseDuration) * 100),
      overallProgress: (elapsedMinutes / timings.totalDuration) * 100,
      timeInPhase: phaseElapsed,
      timeRemaining: phaseDuration - phaseElapsed,
      totalRemaining: timings.offsetEnd - elapsedMinutes
    }
  }
  
  const phaseElapsed = elapsedMinutes
  const phaseDuration = timings.onsetEnd > 0 ? timings.onsetEnd : 1
  return {
    phase: 'onset',
    progress: Math.min(100, (phaseElapsed / phaseDuration) * 100),
    overallProgress: (elapsedMinutes / timings.totalDuration) * 100,
    timeInPhase: phaseElapsed,
    timeRemaining: phaseDuration - phaseElapsed,
    totalRemaining: timings.offsetEnd - elapsedMinutes
  }
}

// Format minutes to human readable
function formatMinutes(minutes: number): string {
  if (minutes < 0) return '0m'
  if (minutes < 60) {
    return `${Math.round(minutes)}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

const phaseColors = {
  not_started: { bg: 'bg-slate-500', text: 'text-slate-400', fill: 'bg-slate-500/30', border: 'border-slate-500/50' },
  onset: { bg: 'bg-blue-500', text: 'text-blue-400', fill: 'bg-blue-500/30', border: 'border-blue-500/50' },
  comeup: { bg: 'bg-amber-500', text: 'text-amber-400', fill: 'bg-amber-500/30', border: 'border-amber-500/50' },
  peak: { bg: 'bg-purple-500', text: 'text-purple-400', fill: 'bg-purple-500/30', border: 'border-purple-500/50' },
  offset: { bg: 'bg-cyan-500', text: 'text-cyan-400', fill: 'bg-cyan-500/30', border: 'border-cyan-500/50' },
  ended: { bg: 'bg-gray-500', text: 'text-gray-400', fill: 'bg-gray-500/30', border: 'border-gray-500/50' }
}

const phaseIcons = {
  not_started: Sunrise,
  onset: Zap,
  comeup: TrendingUp,
  peak: Mountain,
  offset: TrendingDown,
  ended: Clock
}

const phaseDescriptions = {
  not_started: 'Effects have not yet begun',
  onset: 'Initial effects are beginning to be felt',
  comeup: 'Effects are rapidly increasing in intensity',
  peak: 'Maximum effects are being experienced',
  offset: 'Effects are gradually declining',
  ended: 'The primary experience has ended'
}

interface TooltipData {
  phase: string
  phaseTime: string
  absoluteTime: Date
  intensity: number
}

export function ActiveDosesTimeline({ refreshTrigger }: ActiveDosesTimelineProps) {
  const [doses, setDoses] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTick] = useState(0)
  const [tooltip, setTooltip] = useState<{ [key: string]: TooltipData }>({})
  const [expandedDose, setExpandedDose] = useState<string | null>(null)

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchDoses = () => {
    setLoading(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const logs = stored ? JSON.parse(stored) : []
      setDoses(logs.sort((a: DoseLog, b: DoseLog) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ))
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

  // Filter and process active/upcoming doses
  const activeDoses = useMemo(() => {
    return doses
      .filter(dose => dose.duration)
      .map(dose => {
        const timings = calculatePhaseTimings(dose.duration!)
        const doseTime = new Date(dose.timestamp)
        const status = getPhaseStatus(doseTime, timings)
        
        return {
          ...dose,
          timings,
          status,
          doseTime
        }
      })
      .filter(dose => {
        return dose.status.phase !== 'ended' || dose.status.totalRemaining > -30
      })
  }, [doses])

  const getCategoryColor = (category: string) => {
    return categoryColors[category as keyof typeof categoryColors] || 'text-gray-500 bg-gray-500/10 border-gray-500/20'
  }

  // Calculate intensity at a given point (0-100% of total duration)
  const getIntensityAtProgress = (progress: number, timings: PhaseTimings): number => {
    const minutes = (progress / 100) * timings.totalDuration
    
    if (minutes <= timings.onsetEnd) {
      return 10
    } else if (minutes <= timings.comeupEnd) {
      const comeupProgress = (minutes - timings.onsetEnd) / (timings.comeupEnd - timings.onsetEnd)
      return 10 + comeupProgress * 70
    } else if (minutes <= timings.peakEnd) {
      return 80 + Math.sin((minutes - timings.comeupEnd) / (timings.peakEnd - timings.comeupEnd) * Math.PI) * 15
    } else {
      const offsetProgress = (minutes - timings.peakEnd) / (timings.offsetEnd - timings.peakEnd)
      return 80 * (1 - offsetProgress)
    }
  }

  // Get phase at a given progress
  const getPhaseAtProgress = (progress: number, timings: PhaseTimings): string => {
    const minutes = (progress / 100) * timings.totalDuration
    
    if (minutes <= timings.onsetEnd) return 'Onset'
    if (minutes <= timings.comeupEnd) return 'Comeup'
    if (minutes <= timings.peakEnd) return 'Peak'
    return 'Offset'
  }

  // Handle graph interaction
  const handleGraphMouseMove = (doseId: string, e: React.MouseEvent<HTMLDivElement>, timings: PhaseTimings, doseTime: Date) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const progress = Math.max(0, Math.min(100, (x / rect.width) * 100))
    
    const minutesFromDose = (progress / 100) * timings.totalDuration
    const phase = getPhaseAtProgress(progress, timings)
    const intensity = getIntensityAtProgress(progress, timings)
    const absoluteTime = addMinutes(doseTime, minutesFromDose)
    
    setTooltip(prev => ({
      ...prev,
      [doseId]: {
        phase,
        phaseTime: formatMinutes(minutesFromDose),
        absoluteTime,
        intensity
      }
    }))
  }

  const handleGraphMouseLeave = (doseId: string) => {
    setTooltip(prev => {
      const newTooltip = { ...prev }
      delete newTooltip[doseId]
      return newTooltip
    })
  }

  // Generate time markers for the graph
  const generateTimeMarkers = (timings: PhaseTimings, doseTime: Date) => {
    const markers = []
    const totalHours = timings.totalDuration / 60
    const interval = totalHours > 8 ? 2 : 1
    
    for (let h = 0; h <= totalHours; h += interval) {
      const progress = (h * 60 / timings.totalDuration) * 100
      if (progress <= 100) {
        markers.push({
          progress,
          time: addHours(doseTime, h),
          label: format(addHours(doseTime, h), 'h:mm')
        })
      }
    }
    return markers
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (activeDoses.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-500" />
          Active Timeline
        </CardTitle>
        <CardDescription>
          Real-time view of your active doses. Hover over the graph for details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeDoses.map((dose) => {
            const colors = phaseColors[dose.status.phase]
            const PhaseIcon = phaseIcons[dose.status.phase]
            const timeMarkers = generateTimeMarkers(dose.timings, dose.doseTime)
            const isExpanded = expandedDose === dose.id
            const currentTooltip = tooltip[dose.id]
            
            return (
              <div 
                key={dose.id} 
                className="rounded-lg border p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{dose.substanceName}</span>
                    {dose.category && dose.category !== 'unknown' && (
                      <Badge variant="outline" className={getCategoryColor(dose.category)}>
                        {dose.category}
                      </Badge>
                    )}
                    <Badge className={`${colors.bg} text-white text-xs`}>
                      <PhaseIcon className="h-3 w-3 mr-1" />
                      {dose.status.phase === 'not_started' ? 'Upcoming' : 
                       dose.status.phase.charAt(0).toUpperCase() + dose.status.phase.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {dose.amount}{dose.unit} • {dose.route}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(dose.doseTime, 'h:mm a')}
                    </div>
                  </div>
                </div>

                {/* Interactive Graph Container */}
                <div 
                  className="relative cursor-crosshair bg-muted/30 rounded-lg p-3"
                  onMouseMove={(e) => handleGraphMouseMove(dose.id, e, dose.timings, dose.doseTime)}
                  onMouseLeave={() => handleGraphMouseLeave(dose.id)}
                >
                  {/* Phase sections */}
                  <div className="h-8 rounded overflow-hidden relative flex mb-4">
                    {/* Onset */}
                    <div 
                      className={`${phaseColors.onset.fill} ${phaseColors.onset.border} border-r transition-all duration-150`}
                      style={{ width: `${(dose.timings.onsetEnd / dose.timings.totalDuration) * 100}%` }}
                    />
                    
                    {/* Comeup */}
                    <div 
                      className={`${phaseColors.comeup.fill} ${phaseColors.comeup.border} border-r transition-all duration-150`}
                      style={{ width: `${((dose.timings.comeupEnd - dose.timings.onsetEnd) / dose.timings.totalDuration) * 100}%` }}
                    />
                    
                    {/* Peak */}
                    <div 
                      className={`${phaseColors.peak.fill} ${phaseColors.peak.border} border-r transition-all duration-150`}
                      style={{ width: `${((dose.timings.peakEnd - dose.timings.comeupEnd) / dose.timings.totalDuration) * 100}%` }}
                    />
                    
                    {/* Offset */}
                    <div 
                      className={`${phaseColors.offset.fill} transition-all duration-150`}
                      style={{ width: `${((dose.timings.offsetEnd - dose.timings.peakEnd) / dose.timings.totalDuration) * 100}%` }}
                    />

                    {/* Current position line */}
                    {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                        style={{ left: `${Math.min(99, dose.status.overallProgress)}%` }}
                      />
                    )}
                  </div>

                  {/* Phase labels */}
                  <div className="flex text-xs text-muted-foreground mb-2">
                    <span style={{ width: `${(dose.timings.onsetEnd / dose.timings.totalDuration) * 100}%` }} className="text-center">Onset</span>
                    <span style={{ width: `${((dose.timings.comeupEnd - dose.timings.onsetEnd) / dose.timings.totalDuration) * 100}%` }} className="text-center">Comeup</span>
                    <span style={{ width: `${((dose.timings.peakEnd - dose.timings.comeupEnd) / dose.timings.totalDuration) * 100}%` }} className="text-center">Peak</span>
                    <span style={{ width: `${((dose.timings.offsetEnd - dose.timings.peakEnd) / dose.timings.totalDuration) * 100}%` }} className="text-center">Offset</span>
                  </div>

                  {/* Intensity curve */}
                  <svg viewBox="0 0 100 40" className="w-full h-12 mt-2">
                    {/* Generate smooth curve path */}
                    <path
                      d={(() => {
                        const points: string[] = []
                        for (let i = 0; i <= 50; i++) {
                          const x = i * 2
                          const progress = i * 2
                          const intensity = getIntensityAtProgress(progress, dose.timings)
                          const y = 38 - (intensity * 0.35)
                          points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`)
                        }
                        return points.join(' ')
                      })()}
                      fill="none"
                      stroke="url(#curveGradient)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="30%" stopColor="#f59e0b" />
                        <stop offset="60%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    
                    {/* Current position marker */}
                    {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                      <circle
                        cx={Math.min(98, Math.max(2, dose.status.overallProgress))}
                        cy={38 - (getIntensityAtProgress(dose.status.overallProgress, dose.timings) * 0.35)}
                        r="2"
                        fill="white"
                        stroke="#a855f7"
                        strokeWidth="1"
                      />
                    )}
                  </svg>

                  {/* Time markers */}
                  <div className="relative h-4 mt-1">
                    {timeMarkers.map((marker, i) => (
                      <span 
                        key={i} 
                        className="absolute text-xs text-muted-foreground transform -translate-x-1/2"
                        style={{ left: `${marker.progress}%` }}
                      >
                        {marker.label}
                      </span>
                    ))}
                  </div>

                  {/* Tooltip - positioned inside the graph container */}
                  {currentTooltip && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium">{currentTooltip.phase}</span>
                        <span className="text-muted-foreground">
                          {currentTooltip.phaseTime} from dose
                        </span>
                        <span className="text-muted-foreground">
                          {format(currentTooltip.absoluteTime, 'h:mm a')}
                        </span>
                        <span className="text-purple-400">
                          {Math.round(currentTooltip.intensity)}% intensity
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm pt-2 border-t">
                  <div className="flex items-center gap-4">
                    {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                      <>
                        <span className={`${colors.text}`}>
                          <Timer className="h-3 w-3 inline mr-1" />
                          {formatMinutes(dose.status.totalRemaining)} remaining
                        </span>
                        <span className="text-muted-foreground">
                          Phase: {formatMinutes(dose.status.timeRemaining)} left
                        </span>
                      </>
                    )}
                    {dose.status.phase === 'not_started' && (
                      <span className="text-slate-400">
                        <Sunrise className="h-3 w-3 inline mr-1" />
                        Starts in {formatMinutes(dose.status.timeRemaining)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      Total: {dose.duration?.total}
                    </span>
                    <button 
                      onClick={() => setExpandedDose(isExpanded ? null : dose.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { label: 'Onset', time: dose.duration?.onset, color: phaseColors.onset },
                        { label: 'Comeup', time: dose.duration?.comeup, color: phaseColors.comeup },
                        { label: 'Peak', time: dose.duration?.peak, color: phaseColors.peak },
                        { label: 'Offset', time: dose.duration?.offset, color: phaseColors.offset },
                      ].map((phase) => (
                        <div key={phase.label} className={`p-2 rounded-lg ${phase.color.fill}`}>
                          <div className={`font-medium ${phase.color.text}`}>{phase.label}</div>
                          <div className="mt-0.5">{phase.time || '—'}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {phaseDescriptions[dose.status.phase]}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
