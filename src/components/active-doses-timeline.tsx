'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { format, addMinutes, addHours } from 'date-fns'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { categoryColors } from '@/lib/substance-index'

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
  not_started: { bg: 'bg-slate-500', text: 'text-slate-400', fill: 'bg-slate-500/20', border: 'border-slate-500/30', gradient: 'from-slate-500/30 to-slate-500/10' },
  onset: { bg: 'bg-blue-500', text: 'text-blue-400', fill: 'bg-blue-500/20', border: 'border-blue-500/30', gradient: 'from-blue-500/30 to-blue-500/5' },
  comeup: { bg: 'bg-amber-500', text: 'text-amber-400', fill: 'bg-amber-500/20', border: 'border-amber-500/30', gradient: 'from-amber-500/30 to-amber-500/5' },
  peak: { bg: 'bg-purple-500', text: 'text-purple-400', fill: 'bg-purple-500/20', border: 'border-purple-500/30', gradient: 'from-purple-500/30 to-purple-500/5' },
  offset: { bg: 'bg-cyan-500', text: 'text-cyan-400', fill: 'bg-cyan-500/20', border: 'border-cyan-500/30', gradient: 'from-cyan-500/30 to-cyan-500/5' },
  ended: { bg: 'bg-gray-500', text: 'text-gray-400', fill: 'bg-gray-500/20', border: 'border-gray-500/30', gradient: 'from-gray-500/30 to-gray-500/5' }
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
  progress: number
}

// SVG dimensions for the graph
const SVG_WIDTH = 400
const SVG_HEIGHT = 100
const PADDING_LEFT = 38
const PADDING_RIGHT = 10
const PADDING_TOP = 18  // extra top room for phase labels
const PADDING_BOTTOM = 16
const GRAPH_WIDTH = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT
const GRAPH_HEIGHT = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM

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

  // Calculate intensity at a given point using a smooth pharmacokinetic curve
  const getIntensityAtProgress = (progress: number, timings: PhaseTimings): number => {
    const minutes = (progress / 100) * timings.totalDuration
    
    if (minutes <= timings.onsetEnd) {
      if (timings.onsetEnd === 0) return 5
      const t = minutes / timings.onsetEnd
      return 5 + 10 * (1 - Math.cos(t * Math.PI / 2))
    } else if (minutes <= timings.comeupEnd) {
      const comeupDuration = timings.comeupEnd - timings.onsetEnd
      if (comeupDuration === 0) return 50
      const t = (minutes - timings.onsetEnd) / comeupDuration
      return 15 + 77 * (1 - Math.cos(t * Math.PI / 2))
    } else if (minutes <= timings.peakEnd) {
      const peakDuration = timings.peakEnd - timings.comeupEnd
      if (peakDuration === 0) return 95
      const t = (minutes - timings.comeupEnd) / peakDuration
      return 92 + 8 * Math.sin(t * Math.PI) * 0.5 + 4
    } else {
      const offsetDuration = timings.offsetEnd - timings.peakEnd
      if (offsetDuration === 0) return 0
      const t = (minutes - timings.peakEnd) / offsetDuration
      return 92 * Math.pow(1 - t, 1.5)
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

  // Convert progress (0-100) to SVG x coordinate
  const progressToX = (progress: number): number => {
    return PADDING_LEFT + (progress / 100) * GRAPH_WIDTH
  }

  // Convert intensity (0-100) to SVG y coordinate
  const intensityToY = (intensity: number): number => {
    return PADDING_TOP + GRAPH_HEIGHT - (intensity / 100) * GRAPH_HEIGHT
  }

  // Generate smooth SVG path for the intensity curve using bezier curves
  const generateCurvePath = (timings: PhaseTimings): string => {
    const points: { x: number; y: number }[] = []
    const numPoints = 100
    
    for (let i = 0; i <= numPoints; i++) {
      const progress = (i / numPoints) * 100
      const intensity = getIntensityAtProgress(progress, timings)
      points.push({
        x: progressToX(progress),
        y: intensityToY(intensity)
      })
    }
    
    let path = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`
    
    for (let i = 1; i < points.length; i++) {
      const curr = points[i]
      const next = points[i + 1]
      
      if (next) {
        const cpX = curr.x
        const cpY = curr.y
        const endX = (curr.x + next.x) / 2
        const endY = (curr.y + next.y) / 2
        path += ` Q ${cpX.toFixed(2)},${cpY.toFixed(2)} ${endX.toFixed(2)},${endY.toFixed(2)}`
      } else {
        path += ` L ${curr.x.toFixed(2)},${curr.y.toFixed(2)}`
      }
    }
    
    return path
  }

  // Generate filled area path
  const generateAreaPath = (timings: PhaseTimings): string => {
    const curvePath = generateCurvePath(timings)
    const endX = progressToX(100)
    const startX = progressToX(0)
    const bottomY = PADDING_TOP + GRAPH_HEIGHT
    
    return `${curvePath} L ${endX.toFixed(2)},${bottomY.toFixed(2)} L ${startX.toFixed(2)},${bottomY.toFixed(2)} Z`
  }

  // rAF ref to throttle mouse events
  const rafRef = useRef<number | null>(null)

  // Handle graph interaction - throttled via requestAnimationFrame for responsiveness
  const handleGraphMouseMove = useCallback((doseId: string, e: React.MouseEvent<SVGSVGElement>, timings: PhaseTimings, doseTime: Date) => {
    if (rafRef.current !== null) return
    const clientX = e.clientX
    const rect = e.currentTarget.getBoundingClientRect()
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const x = clientX - rect.left
      const svgX = (x / rect.width) * SVG_WIDTH
      const progress = Math.max(0, Math.min(100, ((svgX - PADDING_LEFT) / GRAPH_WIDTH) * 100))
      const minutesFromDose = (progress / 100) * timings.totalDuration
      const phase = getPhaseAtProgress(progress, timings)
      const intensity = getIntensityAtProgress(progress, timings)
      const absoluteTime = addMinutes(doseTime, minutesFromDose)
      setTooltip(prev => ({
        ...prev,
        [doseId]: { phase, phaseTime: formatMinutes(minutesFromDose), absoluteTime, intensity, progress }
      }))
    })
  }, [])

  const handleGraphMouseLeave = useCallback((doseId: string) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setTooltip(prev => {
      const newTooltip = { ...prev }
      delete newTooltip[doseId]
      return newTooltip
    })
  }, [])

  // Generate time markers for the graph
  const generateTimeMarkers = (timings: PhaseTimings, doseTime: Date): { progress: number; time: Date; label: string }[] => {
    const markers: { progress: number; time: Date; label: string }[] = []
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

  // Generate phase boundary lines
  const generatePhaseBoundaries = (timings: PhaseTimings): { x: number; phase: string }[] => {
    const boundaries: { x: number; phase: string }[] = []
    
    if (timings.onsetEnd > 0) {
      boundaries.push({ x: progressToX((timings.onsetEnd / timings.totalDuration) * 100), phase: 'onset' })
    }
    if (timings.comeupEnd > timings.onsetEnd) {
      boundaries.push({ x: progressToX((timings.comeupEnd / timings.totalDuration) * 100), phase: 'comeup' })
    }
    if (timings.peakEnd > timings.comeupEnd) {
      boundaries.push({ x: progressToX((timings.peakEnd / timings.totalDuration) * 100), phase: 'peak' })
    }
    
    return boundaries
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
            const phaseBoundaries = generatePhaseBoundaries(dose.timings)
            const isExpanded = expandedDose === dose.id
            const currentTooltip = tooltip[dose.id]
            const curvePath = generateCurvePath(dose.timings)
            const areaPath = generateAreaPath(dose.timings)
            
            const currentX = progressToX(dose.status.overallProgress)
            const currentIntensity = getIntensityAtProgress(dose.status.overallProgress, dose.timings)
            const currentY = intensityToY(currentIntensity)
            
            return (
              <div 
                key={dose.id} 
                className="rounded-lg border border-border/50 bg-gradient-to-br from-background to-muted/20 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{dose.substanceName}</span>
                    {dose.category && dose.category !== 'unknown' && (
                      <Badge variant="outline" className={getCategoryColor(dose.category)}>
                        {dose.category}
                      </Badge>
                    )}
                    <Badge className={`${colors.bg} text-white text-xs shadow-sm`}>
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

                <div className="relative">
                  <svg 
                    viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                    className="w-full h-auto cursor-crosshair"
                    preserveAspectRatio="xMidYMid meet"
                    onMouseMove={(e) => handleGraphMouseMove(dose.id, e, dose.timings, dose.doseTime)}
                    onMouseLeave={() => handleGraphMouseLeave(dose.id)}
                  >
                    <defs>
                      <linearGradient id={`areaGradient-${dose.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
                      </linearGradient>
                      
                      <linearGradient id={`curveGradient-${dose.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="25%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="75%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      
                      <filter id={`glow-${dose.id}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      
                      <filter id={`dropshadow-${dose.id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#a855f7" floodOpacity="0.5"/>
                      </filter>
                    </defs>
                    
                    <g opacity="0.15">
                      <rect
                        x={PADDING_LEFT}
                        y={PADDING_TOP}
                        width={(dose.timings.onsetEnd / dose.timings.totalDuration) * GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                        fill="#3b82f6"
                      />
                      <rect
                        x={progressToX((dose.timings.onsetEnd / dose.timings.totalDuration) * 100)}
                        y={PADDING_TOP}
                        width={((dose.timings.comeupEnd - dose.timings.onsetEnd) / dose.timings.totalDuration) * GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                        fill="#f59e0b"
                      />
                      <rect
                        x={progressToX((dose.timings.comeupEnd / dose.timings.totalDuration) * 100)}
                        y={PADDING_TOP}
                        width={((dose.timings.peakEnd - dose.timings.comeupEnd) / dose.timings.totalDuration) * GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                        fill="#a855f7"
                      />
                      <rect
                        x={progressToX((dose.timings.peakEnd / dose.timings.totalDuration) * 100)}
                        y={PADDING_TOP}
                        width={((dose.timings.offsetEnd - dose.timings.peakEnd) / dose.timings.totalDuration) * GRAPH_WIDTH}
                        height={GRAPH_HEIGHT}
                        fill="#06b6d4"
                      />
                    </g>
                    
                    <g className="text-muted-foreground/20" stroke="currentColor" strokeWidth="0.5">
                      <line x1={PADDING_LEFT} y1={PADDING_TOP} x2={SVG_WIDTH - PADDING_RIGHT} y2={PADDING_TOP} strokeDasharray="2,2" />
                      <line x1={PADDING_LEFT} y1={PADDING_TOP + GRAPH_HEIGHT * 0.25} x2={SVG_WIDTH - PADDING_RIGHT} y2={PADDING_TOP + GRAPH_HEIGHT * 0.25} strokeDasharray="2,2" />
                      <line x1={PADDING_LEFT} y1={PADDING_TOP + GRAPH_HEIGHT * 0.5} x2={SVG_WIDTH - PADDING_RIGHT} y2={PADDING_TOP + GRAPH_HEIGHT * 0.5} strokeDasharray="2,2" />
                      <line x1={PADDING_LEFT} y1={PADDING_TOP + GRAPH_HEIGHT * 0.75} x2={SVG_WIDTH - PADDING_RIGHT} y2={PADDING_TOP + GRAPH_HEIGHT * 0.75} strokeDasharray="2,2" />
                      <line x1={PADDING_LEFT} y1={PADDING_TOP + GRAPH_HEIGHT} x2={SVG_WIDTH - PADDING_RIGHT} y2={PADDING_TOP + GRAPH_HEIGHT} />
                    </g>
                    
                    {phaseBoundaries.map((boundary, i) => (
                      <line
                        key={i}
                        x1={boundary.x}
                        y1={PADDING_TOP}
                        x2={boundary.x}
                        y2={PADDING_TOP + GRAPH_HEIGHT}
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4,2"
                        className="text-muted-foreground/30"
                      />
                    ))}
                    
                    <path
                      d={areaPath}
                      fill={`url(#areaGradient-${dose.id})`}
                    />
                    
                    <path
                      d={curvePath}
                      fill="none"
                      stroke={`url(#curveGradient-${dose.id})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#glow-${dose.id})`}
                    />
                    
                    <g className="text-[9px] fill-muted-foreground">
                      <text x={PADDING_LEFT - 5} y={PADDING_TOP + 3} textAnchor="end">100</text>
                      <text x={PADDING_LEFT - 5} y={PADDING_TOP + GRAPH_HEIGHT * 0.5 + 3} textAnchor="end">50</text>
                      <text x={PADDING_LEFT - 5} y={PADDING_TOP + GRAPH_HEIGHT + 3} textAnchor="end">0</text>
                    </g>
                    
                    {/* Time markers along the bottom axis */}
                    <g className="text-[9px] fill-muted-foreground">
                      {timeMarkers.map((marker, i) => {
                        const x = progressToX(marker.progress)
                        return (
                          <text 
                            key={i} 
                            x={x} 
                            y={SVG_HEIGHT - 2}
                            textAnchor="middle"
                          >
                            {marker.label}
                          </text>
                        )
                      })}
                    </g>
                    
                    {/* Phase labels - rendered inside the top of each phase band */}
                    {[
                      { name: 'Onset', startProgress: 0, endProgress: (dose.timings.onsetEnd / dose.timings.totalDuration) * 100, color: '#60a5fa' },
                      { name: 'Comeup', startProgress: (dose.timings.onsetEnd / dose.timings.totalDuration) * 100, endProgress: (dose.timings.comeupEnd / dose.timings.totalDuration) * 100, color: '#fbbf24' },
                      { name: 'Peak', startProgress: (dose.timings.comeupEnd / dose.timings.totalDuration) * 100, endProgress: (dose.timings.peakEnd / dose.timings.totalDuration) * 100, color: '#c084fc' },
                      { name: 'Offset', startProgress: (dose.timings.peakEnd / dose.timings.totalDuration) * 100, endProgress: 100, color: '#22d3ee' }
                    ].map((label, i) => {
                      const pixelWidth = ((label.endProgress - label.startProgress) / 100) * GRAPH_WIDTH
                      if (pixelWidth < 20) return null
                      const centerX = progressToX((label.startProgress + label.endProgress) / 2)
                      // Abbreviate if narrow
                      const name = pixelWidth < 38 ? label.name.slice(0, 2) : label.name
                      return (
                        <text
                          key={i}
                          x={centerX}
                          y={PADDING_TOP + 8}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="600"
                          fill={label.color}
                          opacity="0.85"
                        >
                          {name}
                        </text>
                      )
                    })}
                    
                    {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                      <g>
                        <line
                          x1={currentX}
                          y1={PADDING_TOP}
                          x2={currentX}
                          y2={PADDING_TOP + GRAPH_HEIGHT}
                          stroke="#a855f7"
                          strokeWidth="1.5"
                          strokeDasharray="4,2"
                          opacity="0.6"
                        />
                        
                        <circle
                          cx={currentX}
                          cy={currentY}
                          r="5"
                          fill="#a855f7"
                          stroke="#fff"
                          strokeWidth="2"
                          filter={`url(#dropshadow-${dose.id})`}
                          className="animate-pulse"
                        />
                        
                        <circle
                          cx={currentX}
                          cy={currentY}
                          r="3"
                          fill="#fff"
                          opacity="0.8"
                        />
                      </g>
                    )}
                    
                    {currentTooltip && (
                      <line
                        x1={progressToX(currentTooltip.progress)}
                        y1={PADDING_TOP}
                        x2={progressToX(currentTooltip.progress)}
                        y2={PADDING_TOP + GRAPH_HEIGHT}
                        stroke="#fff"
                        strokeWidth="1"
                        strokeDasharray="3,3"
                        opacity="0.5"
                      />
                    )}
                  </svg>
                  
                  {currentTooltip && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-muted/80 to-muted/40 rounded-lg text-sm border border-border/50 backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${
                            currentTooltip.phase === 'Onset' ? 'text-blue-400' :
                            currentTooltip.phase === 'Comeup' ? 'text-amber-400' :
                            currentTooltip.phase === 'Peak' ? 'text-purple-400' : 'text-cyan-400'
                          }`}>
                            {currentTooltip.phase}
                          </span>
                          <span className="text-muted-foreground">
                            {currentTooltip.phaseTime} from dose
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(currentTooltip.absoluteTime, 'h:mm a')}
                          </span>
                          <span className="font-medium text-purple-400">
                            {Math.round(currentTooltip.intensity)}% intensity
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    {dose.status.phase !== 'not_started' && dose.status.phase !== 'ended' && (
                      <>
                        <span className={`${colors.text} font-medium`}>
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
                      className="p-1 hover:bg-muted/50 rounded transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-border/50 space-y-3">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { label: 'Onset', time: dose.duration?.onset, color: phaseColors.onset },
                        { label: 'Comeup', time: dose.duration?.comeup, color: phaseColors.comeup },
                        { label: 'Peak', time: dose.duration?.peak, color: phaseColors.peak },
                        { label: 'Offset', time: dose.duration?.offset, color: phaseColors.offset },
                      ].map((phase) => (
                        <div key={phase.label} className={`p-2.5 rounded-lg ${phase.color.fill} border ${phase.color.border}`}>
                          <div className={`font-semibold ${phase.color.text}`}>{phase.label}</div>
                          <div className="mt-0.5 text-foreground">{phase.time || '—'}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/30 p-2 rounded">
                      <Info className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{phaseDescriptions[dose.status.phase]}</span>
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
