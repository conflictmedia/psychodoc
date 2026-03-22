'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { 
  Search, 
  Menu, 
  X, 
  Zap, 
  Moon as MoonIcon, 
  Sparkles, 
  Split, 
  Heart, 
  Leaf, 
  Pill, 
  Ghost,
  Brain,
  ChevronRight,
  AlertTriangle,
  Clock,
  Droplets,
  FlaskConical,
  History,
  Shield,
  Scale,
  Route,
  ArrowLeft,
  Info,
  CheckCircle,
  MinusCircle,
  XCircle,
  Activity,
  Plus,
  Syringe,
  Github,
  Send,
  PenLine
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { DoseLoggerModal } from '@/components/dose-logger-modal'
import { DoseHistory } from '@/components/dose-history'
import { DoseStats } from '@/components/dose-stats'
import { ActiveDosesTimeline } from '@/components/active-doses-timeline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  substances,
  type Substance, 
  type SubstanceCategory,
  type RouteDosageDuration
} from '@/lib/substances/index'
import { categories } from '@/lib/categories'

const categoryIcons: Record<SubstanceCategory, React.ElementType> = {
  stimulants: Zap,
  depressants: MoonIcon,
  hallucinogens: Sparkles,
  dissociatives: Split,
  empathogens: Heart,
  cannabinoids: Leaf,
  opioids: Pill,
  deliriants: Ghost,
  nootropics: Brain,
  other: FlaskConical,
}

const categoryColors: Record<SubstanceCategory, string> = {
  stimulants: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  depressants: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  hallucinogens: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  dissociatives: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
  empathogens: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
  cannabinoids: 'text-green-500 bg-green-500/10 border-green-500/20',
  opioids: 'text-red-500 bg-red-500/10 border-red-500/20',
  deliriants: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
  nootropics: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  other: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
}

const riskLevelColors = {
  'low': 'bg-green-500/20 text-green-400 border-green-500/30',
  'moderate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'very-high': 'bg-red-500/20 text-red-400 border-red-500/30'
}

// Route icons mapping
const routeIconMap: Record<string, string> = {
  'Oral': '💊',
  'Sublingual': '👅',
  'Inhalation': '💨',
  'Insufflation': '👃',
  'Intravenous': '💉',
  'Intramuscular': '💉',
  'Transdermal': '🩹',
  'Rectal': '⬇️',
  'Nasal': '👃',
  'Smoking': '🔥',
  'Lemon Tek': '🍋',
  'Tea': '🍵',
  'Topical': '🤲',
}

function getRouteIcon(route: string): string {
  return routeIconMap[route] || '•'
}

// Route danger level colors for certain routes
const routeDangerColors: Record<string, string> = {
  'Intravenous': 'border-red-500/40 bg-red-500/5',
  'Intramuscular': 'border-orange-500/40 bg-orange-500/5',
  'Smoking': 'border-orange-500/30 bg-orange-500/5',
}

type ViewType = 'substances' | 'dose-log'

// GitHub issue URLs
const GITHUB_NEW_SUBSTANCE_URL = 'https://github.com/conflictmedia/drugucopia/issues/new?template=new-substance-request.md'
const GITHUB_INFO_CHANGE_URL = 'https://github.com/conflictmedia/drugucopia/issues/new?template=change-substance-info.md'
const GITHUB_FEEDBACK_URL = 'https://github.com/conflictmedia/drugucopia/issues/new'

// ---------------------------------------------------------------------------
// Multi-category helpers
// ---------------------------------------------------------------------------


/**
 * Return all categories for a substance.
 * Substance.categories is SubstanceCategory[] in the new index.
 */
function getSubstanceCategories(substance: Substance): SubstanceCategory[] {
  return substance.categories ?? []
}

/**
 * Return the "primary" category – the first one – for icons, colours, etc.
 */
function getPrimaryCategory(substance: Substance): SubstanceCategory | null {
  const cats = getSubstanceCategories(substance)
  return cats[0] ?? null
}

/**
 * Returns true when a substance belongs to the given category filter.
 */
function substanceBelongsToCategory(
  substance: Substance,
  filter: SubstanceCategory | 'all'
): boolean {
  if (filter === 'all') return true
  return getSubstanceCategories(substance).includes(filter)
}

// ---------------------------------------------------------------------------
// Category badge – renders one or more coloured chips
// ---------------------------------------------------------------------------
function CategoryBadges({
  substance,
  className = '',
}: {
  substance: Substance
  className?: string
}) {
  const cats = getSubstanceCategories(substance)
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {cats.map((cat) => {
        const info = categories.find((c) => c.id === cat)
        return (
          <Badge
            key={cat}
            variant="outline"
            className={categoryColors[cat] ?? ''}
          >
            {info?.name ?? cat}
          </Badge>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Category icon component – uses the primary category
// ---------------------------------------------------------------------------
function CategoryIcon({
  substance,
  className = '',
}: {
  substance: Substance
  className?: string
}) {
  const primary = getPrimaryCategory(substance)
  if (!primary) return null
  const Icon = categoryIcons[primary]
  return <Icon className={className} />
}

// ---------------------------------------------------------------------------
// Dosage & Duration display component with route selector
// ---------------------------------------------------------------------------
function DosageDurationPanel({ 
  substance, 
  onRouteChange 
}: { 
  substance: Substance,
  onRouteChange?: (route: string | null) => void
}) {
  const hasRouteData = substance.routeData && Object.keys(substance.routeData).length > 0
  const initialRoute = hasRouteData ? Object.keys(substance.routeData!)[0] : null
  
  const [selectedRoute, setSelectedRoute] = useState<string | null>(initialRoute)
  const prevSubstanceIdRef = useRef(substance.id)

  // Notify parent of route changes (including initial)
  useEffect(() => {
    onRouteChange?.(selectedRoute)
  }, [selectedRoute])

  // Reset to first route when substance changes
  useEffect(() => {
    if (prevSubstanceIdRef.current !== substance.id) {
      prevSubstanceIdRef.current = substance.id
      const newRoute = hasRouteData ? Object.keys(substance.routeData!)[0] : null
      setSelectedRoute(newRoute)
    }
  }, [substance.id, hasRouteData, substance.routeData])

  const currentDosage = useMemo<Record<string, string>>(() => {
    if (selectedRoute && substance.routeData?.[selectedRoute]) {
      return substance.routeData[selectedRoute].dosage ?? {}
    }
    return {}
  }, [selectedRoute, substance])

  const currentDuration = useMemo<Record<string, string>>(() => {
    if (selectedRoute && substance.routeData?.[selectedRoute]) {
      return substance.routeData[selectedRoute].duration ?? {}
    }
    return {}
  }, [selectedRoute, substance])

  const currentNotes = useMemo(() => {
    if (selectedRoute && substance.routeData?.[selectedRoute]) {
      return substance.routeData[selectedRoute].notes
    }
    return null
  }, [selectedRoute, substance])

  return (
    <div className="space-y-4">
      {/* Route Selector */}
      {hasRouteData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Syringe className="h-4 w-4" />
              Route of Administration
            </CardTitle>
            <CardDescription className="text-xs">
              Dosage and duration vary significantly by route. Select to see specific data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.keys(substance.routeData!).map((route) => {
                const isSelected = selectedRoute === route
                const dangerClass = routeDangerColors[route] || ''
                return (
                  <button
                    key={route}
                    onClick={() => setSelectedRoute(route)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                        : `bg-background hover:bg-muted border-border ${dangerClass}`
                      }
                    `}
                  >
                    <span>{getRouteIcon(route)}</span>
                    <span>{route}</span>
                    {(route === 'Intravenous' || route === 'Smoking') && !isSelected && (
                      <span className="text-orange-400 text-xs">⚠</span>
                    )}
                  </button>
                )
              })}
            </div>
            {/* Route note */}
            {currentNotes && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{currentNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dosage & Duration Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="h-5 w-5" />
              Dosage Guide
              {selectedRoute && hasRouteData && (
                <Badge variant="outline" className="ml-auto text-xs font-normal">
                  {getRouteIcon(selectedRoute)} {selectedRoute}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(currentDosage).map(([level, amount]) => {
                const levelColors: Record<string, string> = {
                  threshold: 'text-blue-400 bg-blue-500/10',
                  light: 'text-green-400 bg-green-500/10',
                  common: 'text-yellow-400 bg-yellow-500/10',
                  strong: 'text-orange-400 bg-orange-500/10',
                  heavy: 'text-red-400 bg-red-500/10',
                }
                return (
                  <div key={level} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${levelColors[level] || ''}`}>
                        {level}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">{amount}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Duration
              {selectedRoute && hasRouteData && (
                <Badge variant="outline" className="ml-auto text-xs font-normal">
                  {getRouteIcon(selectedRoute)} {selectedRoute}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(currentDuration).map(([phase, time]) => {
                const phaseColors: Record<string, string> = {
                  onset: 'text-blue-400 bg-blue-500/10',
                  comeup: 'text-amber-400 bg-amber-500/10',
                  peak: 'text-purple-400 bg-purple-500/10',
                  offset: 'text-cyan-400 bg-cyan-500/10',
                  total: 'text-green-400 bg-green-500/10',
                }
                return (
                  <div key={phase} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${phaseColors[phase] || ''}`}>
                        {phase}
                      </span>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs text-right max-w-[180px] whitespace-normal text-right">
                      {time}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route comparison note if no route selected */}
      {!hasRouteData && (
        <p className="text-xs text-muted-foreground text-center py-2 opacity-70">
          Route-specific data not available for this substance
        </p>
      )}

      {/* All Routes Comparison Table (if route data exists) */}
      {hasRouteData && Object.keys(substance.routeData!).length > 1 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Route className="h-4 w-4" />
              Routes Comparison
            </CardTitle>
            <CardDescription className="text-xs">Common dose and onset by route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Route</th>
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Common Dose</th>
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Onset</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Total Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(substance.routeData!) as [string, RouteDosageDuration][]).map(([route, data]) => (
                    <tr 
                      key={route} 
                      className={`border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${selectedRoute === route ? 'bg-primary/5' : ''}`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <td className="py-2 pr-3 font-medium">
                        <span className="flex items-center gap-1">
                          <span>{getRouteIcon(route)}</span>
                          <span>{route}</span>
                          {selectedRoute === route && <span className="text-primary text-xs">●</span>}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-muted-foreground font-mono">{data.dosage.common}</td>
                      <td className="py-2 pr-3 text-muted-foreground font-mono">{data.duration.onset}</td>
                      <td className="py-2 text-muted-foreground font-mono">{data.duration.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'all'>('all')
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('substances')
  const [doseRefreshTrigger, setDoseRefreshTrigger] = useState(0)

  const filteredSubstances = useMemo(() => {
    let result = substances
    // Multi-category aware filter
    if (selectedCategory !== 'all') {
      result = result.filter(s => substanceBelongsToCategory(s, selectedCategory))
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.commonNames.some(n => n.toLowerCase().includes(query)) ||
        s.aliases.some(a => a.toLowerCase().includes(query))
      )
    }
    return result
  }, [selectedCategory, searchQuery])

  const handleDoseLogged = () => {
    setDoseRefreshTrigger(prev => prev + 1)
  }

  const handleRouteChange = useCallback((route: string | null) => {
    setSelectedRoute(route)
  }, [])

  // Scroll to top when a substance is selected
  useEffect(() => {
    if (selectedSubstance) {
      window.scrollTo(0, 0)
    }
  }, [selectedSubstance])

  // Reset selected route when substance changes
  useEffect(() => {
    if (!selectedSubstance) {
      setSelectedRoute(null)
    }
  }, [selectedSubstance])

  // ---------------------------------------------------------------------------
  // Substance detail view
  // ---------------------------------------------------------------------------
  if (selectedSubstance) {
    const primary = getPrimaryCategory(selectedSubstance)
    const cats = getSubstanceCategories(selectedSubstance)

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedSubstance(null)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-lg font-semibold">{selectedSubstance.name}</h1>
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <DoseLoggerModal 
                preselectedSubstanceId={selectedSubstance.id}
                preselectedSubstanceName={selectedSubstance.name}
                preselectedCategory={getSubstanceCategories(selectedSubstance)}
                preselectedRoute={selectedRoute || undefined}
                onLogCreated={handleDoseLogged}
                trigger={
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Log Dose
                  </Button>
                }
              />
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2"
                onClick={() => window.open(GITHUB_NEW_SUBSTANCE_URL, '_blank')}
              >
                <Send className="h-4 w-4" />
                Submit a Substance
              </Button>
              {/* All category badges in the header */}
              <CategoryBadges substance={selectedSubstance} />
              <Badge variant="outline" className={riskLevelColors[selectedSubstance.riskLevel]}>
                {selectedSubstance.riskLevel.replace('-', ' ')} risk
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto py-6 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {/* Icon uses primary (first) category */}
                    {primary && (
                      <div className={`p-2 rounded-lg ${categoryColors[primary]}`}>
                        <CategoryIcon substance={selectedSubstance} className="h-6 w-6" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-2xl">{selectedSubstance.name}</CardTitle>
                      <CardDescription>
                        {selectedSubstance.commonNames.join(' • ')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedSubstance.description}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full sm:w-auto"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Contribute on GitHub
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => window.open(GITHUB_INFO_CHANGE_URL, '_blank')}>
                        <PenLine className="mr-2 h-4 w-4" />
                        Submit Info Change
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(GITHUB_NEW_SUBSTANCE_URL, '_blank')}>
                        <Send className="mr-2 h-4 w-4" />
                        Submit a New Substance
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.open(GITHUB_FEEDBACK_URL, '_blank')}>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Report an Issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Effects Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Effects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="positive" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="positive" className="text-green-500 data-[state=active]:bg-green-500/20">Positive</TabsTrigger>
                      <TabsTrigger value="neutral" className="text-yellow-500 data-[state=active]:bg-yellow-500/20">Neutral</TabsTrigger>
                      <TabsTrigger value="negative" className="text-red-500 data-[state=active]:bg-red-500/20">Negative</TabsTrigger>
                    </TabsList>
                    <TabsContent value="positive" className="mt-4">
                      <ul className="space-y-2">
                        {selectedSubstance.effects.positive.map((effect, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="neutral" className="mt-4">
                      <ul className="space-y-2">
                        {selectedSubstance.effects.neutral.map((effect, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <MinusCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="negative" className="mt-4">
                      <ul className="space-y-2">
                        {selectedSubstance.effects.negative.map((effect, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                            <span>{effect}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Dosage & Duration with Route Selector */}
              <DosageDurationPanel 
                substance={selectedSubstance} 
                onRouteChange={handleRouteChange}
              />

              {/* Harm Reduction */}
              <Card className="border-orange-500/30 bg-orange-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-orange-500">
                    <Shield className="h-5 w-5" />
                    Harm Reduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {selectedSubstance.harmReduction.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Show all categories */}
                  <div className="flex items-start gap-3">
                    {primary && <CategoryIcon substance={selectedSubstance} className="h-4 w-4 text-muted-foreground mt-0.5" />}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {cats.length > 1 ? 'Categories' : 'Category'}
                      </p>
                      <CategoryBadges substance={selectedSubstance} className="mt-1" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{selectedSubstance.class}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Route className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Routes</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSubstance.routeData && Object.keys(selectedSubstance.routeData).map((route) => (
                          <span key={route} className="text-xs bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                            <span>{getRouteIcon(route)}</span>
                            <span>{route}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Legality</p>
                      <p className="font-medium text-sm">{selectedSubstance.legality}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chemistry */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FlaskConical className="h-5 w-5" />
                    Chemistry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Formula</span>
                    <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                      {selectedSubstance.chemistry.formula}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mol. Weight</span>
                    <span className="font-mono text-sm">{selectedSubstance.chemistry.molecularWeight}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Interactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubstance.interactions.map((interaction, i) => (
                      <Badge key={i} variant="outline" className="border-red-500/30 text-red-400">
                        {interaction}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <History className="h-5 w-5" />
                    History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedSubstance.history}
                  </p>
                </CardContent>
              </Card>

              {/* After Effects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">After Effects</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubstance.afterEffects}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // List / main view
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r bg-muted/30 overflow-hidden shrink-0`}>
        <div className="h-full flex flex-col">
          {/* Logo & Top Actions */}
          <div className="p-4 border-b space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Image 
                  src="logo.png" 
                  alt="Drugucopia Logo" 
                  width={36} 
                  height={36}
                  className="rounded-lg"
                />
                <span className="font-bold text-lg">Drugucopia</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Psychoactive Substances Documentation</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs bg-background"
                >
                  <Github className="mr-2 h-3 w-3" />
                  Contribute / Feedback
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem onClick={() => window.open(GITHUB_NEW_SUBSTANCE_URL, '_blank')}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit a New Substance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(GITHUB_INFO_CHANGE_URL, '_blank')}>
                  <PenLine className="mr-2 h-4 w-4" />
                  Submit Info Change
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open(GITHUB_FEEDBACK_URL, '_blank')}>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Feedback / Report Issue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant={currentView === 'substances' && selectedCategory === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => { setCurrentView('substances'); setSelectedCategory('all') }}
              >
                <Info className="h-4 w-4" />
                All Substances
                <Badge variant="outline" className="ml-auto">{substances.length}</Badge>
              </Button>

              <Button
                variant={currentView === 'dose-log' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => setCurrentView('dose-log')}
              >
                <Activity className="h-4 w-4" />
                Dose Log
              </Button>
              
              <Separator className="my-3" />
              
              {categories.map((category) => {
                const Icon = categoryIcons[category.id]
                // Count uses multi-category-aware filter
                const count = substances.filter(s => substanceBelongsToCategory(s, category.id)).length
                return (
                  <Button
                    key={category.id}
                    variant={currentView === 'substances' && selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                    onClick={() => { setCurrentView('substances'); setSelectedCategory(category.id) }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{category.name}</span>
                    <Badge variant="outline" className="ml-auto">{count}</Badge>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  This documentation is for educational and harm reduction purposes only. 
                  Always consult medical professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center gap-4 px-4 lg:px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {currentView === 'substances' && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search substances..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}

            {currentView === 'dose-log' && (
              <div className="flex-1">
                <h2 className="text-lg font-semibold">Dose Log</h2>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {currentView === 'dose-log' && (
                <DoseLoggerModal onLogCreated={handleDoseLogged} />
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto py-6 pg:py-10 px-4 lg:px-6">
          {currentView === 'dose-log' ? (
            /* Dose Log View */
            <div className="space-y-6">
              <ActiveDosesTimeline refreshTrigger={doseRefreshTrigger} />
              <DoseStats refreshTrigger={doseRefreshTrigger} />
              <DoseHistory refreshTrigger={doseRefreshTrigger} />
            </div>
          ) : (
            /* Substances View */
            <>
              {/* Category Header */}
              {selectedCategory !== 'all' && (
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${categoryColors[selectedCategory]}`}>
                      {(() => {
                        const Icon = categoryIcons[selectedCategory]
                        return <Icon className="h-5 w-5" />
                      })()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {categories.find(c => c.id === selectedCategory)?.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* All Substances Header */}
              {selectedCategory === 'all' && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">All Substances</h2>
                  <p className="text-muted-foreground">
                    Browse the complete documentation of psychoactive substances
                  </p>
                </div>
              )}

              {/* Substances Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSubstances.map((substance) => {
                  const primary = getPrimaryCategory(substance)
                  const cats = getSubstanceCategories(substance)
                  const hasRouteData = substance.routeData && Object.keys(substance.routeData).length > 1
                  return (
                    <Card 
                      key={substance.id} 
                      className="cursor-pointer hover:border-primary/50 transition-colors group"
                      onClick={() => setSelectedSubstance(substance)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {/* Icon from primary category */}
                            {primary && (
                              <div className={`p-2 rounded-lg shrink-0 ${categoryColors[primary]}`}>
                                <CategoryIcon substance={substance} className="h-4 w-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {substance.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {substance.class}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {substance.description}
                        </p>

                        {/* Common names row */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {substance.commonNames.slice(0, 2).map((name, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                          {substance.commonNames.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{substance.commonNames.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Categories row + risk */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          {/* All category chips – capped at 2 to keep cards tidy */}
                          <div className="flex flex-wrap gap-1">
                            {cats.slice(0, 2).map((cat) => {
                              const info = categories.find(c => c.id === cat)
                              return (
                                <Badge
                                  key={cat}
                                  variant="outline"
                                  className={`text-xs ${categoryColors[cat] ?? ''}`}
                                >
                                  {info?.name ?? cat}
                                </Badge>
                              )
                            })}
                            {cats.length > 2 && (
                              <Badge variant="outline" className="text-xs text-muted-foreground">
                                +{cats.length - 2}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {hasRouteData && (
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary/70">
                                {Object.keys(substance.routeData!).length} routes
                              </Badge>
                            )}
                            <Badge variant="outline" className={riskLevelColors[substance.riskLevel]}>
                              {substance.riskLevel.replace('-', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* No Results */}
              {filteredSubstances.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No substances found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
