'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
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
  Info
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
  progress: number // 0-100 within current phase
  overallProgress: number // 0-100 overall
  timeInPhase: number // minutes in current phase
  timeRemaining: number // minutes remaining in current phase
  totalRemaining: number // minutes remaining overall
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
  not_started: { bg: 'bg-slate-500', text: 'text-slate-400', fill: 'bg-slate-500/30', gradient: '#64748b' },
  onset: { bg: 'bg-blue-500', text: 'text-blue-400', fill: 'bg-blue-500/30', gradient: '#3b82f6' },
  comeup: { bg: 'bg-amber-500', text: 'text-amber-400', fill: 'bg-amber-500/30', gradient: '#f59e0b' },
  peak: { bg: 'bg-purple-500', text: 'text-purple-400', fill: 'bg-purple-500/30', gradient: '#a855f7' },
  offset: { bg: 'bg-cyan-500', text: 'text-cyan-400', fill: 'bg-cyan-500/30', gradient: '#06b6d4' },
  ended: { bg: 'bg-gray-500', text: 'text-gray-400', fill: 'bg-gray-500/30', gradient: '#6b7280' }
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
  x: number
  y: number
  minutesFromDose: number
  phase: string
  phaseTime: string
  absoluteTime: Date
  intensity: number
}

export function ActiveDosesTimeline({ refreshTrigger }: ActiveDosesTimelineProps) {
  const [doses, setDoses] = useState<DoseLog[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTick] = useState(0)
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [expandedDose, setExpandedDose] = useState<string | null>(null)
  const graphRef = useRef<HTMLDivElement>(null)

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
        // Show doses that are not ended or ended within last 30 minutes
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
      return 5 // Minimal during onset
    } else if (minutes <= timings.comeupEnd) {
      const comeupProgress = (minutes - timings.onsetEnd) / (timings.comeupEnd - timings.onsetEnd)
      return 5 + comeupProgress * 75 // Rise from 5% to 80%
    } else if (minutes <= timings.peakEnd) {
      return 80 + Math.sin((minutes - timings.comeupEnd) / (timings.peakEnd - timings.comeupEnd) * Math.PI) * 20 // Peak at 80-100%
    } else {
      const offsetProgress = (minutes - timings.peakEnd) / (timings.offsetEnd - timings.peakEnd)
      return 80 * (1 - offsetProgress) // Decline from 80% to 0%
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
  const handleGraphMouseMove = (e: React.MouseEvent<HTMLDivElement>, dose: typeof activeDoses[0]) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const progress = (x / rect.width) * 100
    
    if (progress >= 0 && progress <= 100) {
      const minutesFromDose = (progress / 100) * dose.timings.totalDuration
      const phase = getPhaseAtProgress(progress, dose.timings)
      const intensity = getIntensityAtProgress(progress, dose.timings)
      const absoluteTime = addMinutes(dose.doseTime, minutesFromDose)
      
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        minutesFromDose,
        phase,
        phaseTime: formatMinutes(minutesFromDose),
        absoluteTime,
        intensity
      })
    }
  }

  const handleGraphMouseLeave = () => {
    setTooltip(null)
  }

  // Generate time markers for the graph
  const generateTimeMarkers = (timings: PhaseTimings, doseTime: Date) => {
    const markers = []
    const totalHours = timings.totalDuration / 60
    const interval = totalHours > 12 ? 2 : 1 // Every 2 hours if long, every 1 hour if short
    
    for (let h = 0; h <= totalHours; h += interval) {
      const progress = (h * 60 / timings.totalDuration) * 100
      if (progress <= 100) {
        markers.push({
          progress,
          time: addHours(doseTime, h),
          label: format(addHours(doseTime, h), 'h:mm a')
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
        <ScrollArea className="max-h-[600px] pr-4">
          <div className="space-y-4">
            {activeDoses.map((dose) => {
              const colors = phaseColors[dose.status.phase]
              const PhaseIcon = phaseIcons[dose.status.phase]
              const timeMarkers = generateTimeMarkers(dose.timings, dose.doseTime)
              const isExpanded = expandedDose === dose.id
              
              return (
                <div 
                  key={dose.id} 
                  className="rounded-lg border p-4 space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between cursor-pointer"
                       onClick={() => setExpandedDose(isExpanded ? null : dose.id)}>
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

                  {/* Interactive Graph */}
                  <div 
                    ref={graphRef}
                    className="relative cursor-crosshair"
                    onMouseMove={(e) => handleGraphMouseMove(e, dose)}
                    onMouseLeave={handleGraphMouseLeave}
                  >
                    {/* Phase sections with hover effects */}
                    <div className="h-10 rounded-lg bg-muted/50 overflow-hidden relative flex">
                      {/* Onset */}
                      <div 
                        className={`${phaseColors.onset.fill} hover:brightness-125 transition-all duration-150 relative group`}
                        style={{ width: `${(dose.timings.onsetEnd / dose.timings.totalDuration) * 100}%` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-blue-300">Onset</span>
                        </div>
                      </div>
                      
                      {/* Comeup */}
                      <div 
                        className={`${phaseColors.comeup.fill} hover:brightness-125 transition-all duration-150 relative group border-l border-background`}
                        style={{ width: `${((dose.timings.comeupEnd - dose.timings.onsetEnd) / dose.timings.totalDuration) * 100}%` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-amber-300">Comeup</span>
                        </div>
                      </div>
                      
                      {/* Peak */}
                      <div 
                        className={`${phaseColors.peak.fill} hover:brightness-125 transition-all duration-150 relative group border-l border-background`}
                        style={{ width: `${((dose.timings.peakEnd - dose.timings.comeupEnd) / dose.timings.totalDuration) * 100}%` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-purple-300">Peak</span>
                        </div>
                      </div>
                      
                      {/* Offset */}
                      <div 
                        className={`${phaseColors.offset.fill} hover:brightness-125 transition-all duration-150 relative group border-l border-background`}
                        style={{ width: `${((dose.timings.offsetEnd - dose.timings.peakEnd) / dose.timings.totalDuration) * 100}%` }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs font-medium text-cyan-300">Offset</span>
                        </div>
                      </div>

                      {/* Current position line */}
                      {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                        <div 
                          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
                          style={{ left: `${Math.min(99.5, dose.status.overallProgress)}%` }}
                        >
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Time markers */}
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground px-1">
                      {timeMarkers.slice(0, 6).map((marker, i) => (
                        <span key={i} style={{ position: 'absolute', left: `${marker.progress}%`, transform: 'translateX(-50%)' }}>
                          {marker.label}
                        </span>
                      ))}
                    </div>

                    {/* Intensity curve */}
                    <div className="mt-4 relative">
                      <svg viewBox="0 0 200 50" className="w-full h-14" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`gradient-${dose.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={phaseColors.onset.gradient} />
                            <stop offset={`${(dose.timings.onsetEnd / dose.timings.totalDuration) * 100}%`} stopColor={phaseColors.onset.gradient} />
                            <stop offset={`${(dose.timings.comeupEnd / dose.timings.totalDuration) * 100}%`} stopColor={phaseColors.peak.gradient} />
                            <stop offset={`${(dose.timings.peakEnd / dose.timings.totalDuration) * 100}%`} stopColor={phaseColors.peak.gradient} />
                            <stop offset="100%" stopColor={phaseColors.offset.gradient} />
                          </linearGradient>
                          <filter id={`glow-${dose.id}`}>
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                        </defs>
                        
                        {/* Generate smooth curve path */}
                        <path
                          d={(() => {
                            const points = []
                            for (let i = 0; i <= 100; i += 2) {
                              const x = i * 2
                              const intensity = getIntensityAtProgress(i, dose.timings)
                              const y = 45 - (intensity * 0.4)
                              points.push(`${i === 0 ? 'M' : 'L'} ${x},${y}`)
                            }
                            return points.join(' ')
                          })()}
                          fill="none"
                          stroke={`url(#gradient-${dose.id})`}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          filter={`url(#glow-${dose.id})`}
                        />
                        
                        {/* Current position marker on curve */}
                        {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                          <circle
                            cx={Math.min(198, Math.max(2, dose.status.overallProgress * 2))}
                            cy={45 - (getIntensityAtProgress(dose.status.overallProgress, dose.timings) * 0.4)}
                            r="5"
                            fill="white"
                            stroke={`url(#gradient-${dose.id})`}
                            strokeWidth="2"
                            className="drop-shadow-lg"
                          />
                        )}
                      </svg>
                    </div>

                    {/* Tooltip */}
                    {tooltip && (
                      <div 
                        className="absolute pointer-events-none z-20 bg-popover border rounded-lg shadow-lg p-3 text-sm"
                        style={{ 
                          left: `${Math.min(tooltip.x + 10, graphRef.current ? graphRef.current.offsetWidth - 180 : 200)}px`, 
                          top: '-10px',
                          transform: 'translateY(-100%)'
                        }}
                      >
                        <div className="font-medium mb-1">{tooltip.phase}</div>
                        <div className="text-muted-foreground space-y-0.5 text-xs">
                          <div>Time: {tooltip.phaseTime} from dose</div>
                          <div>Clock: {format(tooltip.absoluteTime, 'h:mm a')}</div>
                          <div>Intensity: {Math.round(tooltip.intensity)}%</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { label: 'Onset', time: dose.duration?.onset, color: phaseColors.onset },
                          { label: 'Comeup', time: dose.duration?.comeup, color: phaseColors.comeup },
                          { label: 'Peak', time: dose.duration?.peak, color: phaseColors.peak },
                          { label: 'Offset', time: dose.duration?.offset, color: phaseColors.offset },
                        ].map((phase) => (
                          <div key={phase.label} className="p-2 rounded-lg bg-muted/50">
                            <div className={`text-xs font-medium ${phase.color.text}`}>{phase.label}</div>
                            <div className="text-sm mt-0.5">{phase.time || '—'}</div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {phaseDescriptions[dose.status.phase]}
                      </div>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex items-center justify-between text-sm pt-1 border-t">
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
                    <span className="text-muted-foreground text-xs">
                      Total: {dose.duration?.total}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
