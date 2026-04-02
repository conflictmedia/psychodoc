'use client'

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Search,
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
  PenLine,
  CalendarDays,
  Timer,
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
  type RouteDosageDuration,
} from '@/lib/substances/index'
import { categories } from '@/lib/categories'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

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
  other: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
}

const categoryDotColors: Record<SubstanceCategory, string> = {
  stimulants: 'bg-amber-500',
  depressants: 'bg-indigo-500',
  hallucinogens: 'bg-purple-500',
  dissociatives: 'bg-cyan-500',
  empathogens: 'bg-pink-500',
  cannabinoids: 'bg-green-500',
  opioids: 'bg-red-500',
  deliriants: 'bg-slate-500',
  nootropics: 'bg-teal-500',
  other: 'bg-zinc-500',
}

const riskLevelColors = {
  'low': 'bg-green-500/20 text-green-400 border-green-500/30',
  'moderate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'very-high': 'bg-red-500/20 text-red-400 border-red-500/30',
}

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

function getRouteIcon(route: string) {
  return routeIconMap[route] || '•'
}

const routeDangerColors: Record<string, string> = {
  'Intravenous': 'border-red-500/40 bg-red-500/5',
  'Intramuscular': 'border-orange-500/40 bg-orange-500/5',
  'Smoking': 'border-orange-500/30 bg-orange-500/5',
}

const GITHUB_NEW_SUBSTANCE_URL =
  'https://github.com/conflictmedia/drugucopia/issues/new?template=new-substance-request.md'
const GITHUB_INFO_CHANGE_URL =
  'https://github.com/conflictmedia/drugucopia/issues/new?template=change-substance-info.md'
const GITHUB_FEEDBACK_URL = 'https://github.com/conflictmedia/drugucopia/issues/new'

type MobileTab = 'substances' | 'timeline' | 'log' | 'history'

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getSubstanceCategories(substance: Substance): SubstanceCategory[] {
  return substance.categories ?? []
}

function getPrimaryCategory(substance: Substance): SubstanceCategory | null {
  return getSubstanceCategories(substance)[0] ?? null
}

function substanceBelongsToCategory(
  substance: Substance,
  filter: SubstanceCategory | 'all'
): boolean {
  if (filter === 'all') return true
  return getSubstanceCategories(substance).includes(filter)
}

// ─── SMALL SHARED COMPONENTS ─────────────────────────────────────────────────

function CategoryBadges({ substance, className = '' }: { substance: Substance; className?: string }) {
  const cats = getSubstanceCategories(substance)
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {cats.map((cat) => {
        const info = categories.find((c) => c.id === cat)
        return (
          <Badge key={cat} variant="outline" className={categoryColors[cat] ?? ''}>
            {info?.name ?? cat}
          </Badge>
        )
      })}
    </div>
  )
}

function CategoryIcon({ substance, className = '' }: { substance: Substance; className?: string }) {
  const primary = getPrimaryCategory(substance)
  if (!primary) return null
  const Icon = categoryIcons[primary]
  return <Icon className={className} />
}

// ─── DOSAGE + DURATION PANEL ─────────────────────────────────────────────────

function DosageDurationPanel({
  substance,
  onRouteChange,
}: {
  substance: Substance
  onRouteChange?: (route: string | null) => void
}) {
  const hasRouteData = substance.routeData && Object.keys(substance.routeData).length > 0
  const initialRoute = hasRouteData ? Object.keys(substance.routeData!)[0] : null
  const [selectedRoute, setSelectedRoute] = useState<string | null>(initialRoute)
  const prevIdRef = useRef(substance.id)

  useEffect(() => {
    onRouteChange?.(selectedRoute)
  }, [selectedRoute])

  useEffect(() => {
    if (prevIdRef.current !== substance.id) {
      prevIdRef.current = substance.id
      setSelectedRoute(hasRouteData ? Object.keys(substance.routeData!)[0] : null)
    }
  }, [substance.id, hasRouteData, substance.routeData])

  const currentDosage = useMemo(() => {
    if (selectedRoute && substance.routeData?.[selectedRoute]) {
      return substance.routeData[selectedRoute].dosage ?? {}
    }
    return {}
  }, [selectedRoute, substance])

  const currentDuration = useMemo(() => {
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
      {/* Route selector */}
      {hasRouteData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Syringe className="h-4 w-4" />
              Route of Administration
            </CardTitle>
            <CardDescription className="text-xs">
              Dosage and duration vary significantly by route.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Scrollable route chips on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
              {Object.keys(substance.routeData!).map((route) => {
                const isSelected = selectedRoute === route
                const dangerClass = routeDangerColors[route] || ''
                return (
                  <button
                    key={route}
                    onClick={() => setSelectedRoute(route)}
                    className={`
                      flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all min-h-[40px]
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
            {currentNotes && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">{currentNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dosage + Duration side by side on tablet+, stacked on mobile */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Droplets className="h-4 w-4" />
              Dosage
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
                    <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${levelColors[level] || ''}`}>
                      {level}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">{amount}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4" />
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
                    <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${phaseColors[phase] || ''}`}>
                      {phase}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs text-right max-w-[160px] whitespace-normal">
                      {time}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasRouteData && (
        <p className="text-xs text-muted-foreground text-center py-2 opacity-70">
          Route-specific data not available for this substance
        </p>
      )}

      {/* Routes comparison table — hidden on xs, shown md+ */}
      {hasRouteData && Object.keys(substance.routeData!).length > 1 && (
        <Card className="hidden sm:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Route className="h-4 w-4" />
              Routes comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Route</th>
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Common dose</th>
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Onset</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Total</th>
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

// ─── MOBILE BOTTOM NAV ───────────────────────────────────────────────────────

function MobileBottomNav({
  active,
  onChange,
  renderLogTrigger,
}: {
  active: MobileTab
  onChange: (tab: MobileTab) => void
  renderLogTrigger: (trigger: React.ReactNode) => React.ReactNode
}) {
  const items: { id: MobileTab; label: string; icon: React.ElementType }[] = [
    { id: 'substances', label: 'Substances', icon: FlaskConical },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'log', label: 'Log', icon: Plus },
    { id: 'history', label: 'History', icon: CalendarDays },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur border-t border-border safe-area-pb">
      <div className="flex">
        {items.map(({ id, label, icon: Icon }) => {
          const isLog = id === 'log'
          const isActive = active === id

          if (isLog) {
            const btn = (
              <button
                key={id}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
              >
                <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </button>
            )
            return <React.Fragment key={id}>{renderLogTrigger(btn)}</React.Fragment>
          }

          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            >
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-accent' : ''
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
              </span>
              <span className={`text-[10px] ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

// ─── CATEGORY CHIP ROW (mobile horizontal scroll) ───────────────────────────

function CategoryChipRow({
  selected,
  onChange,
}: {
  selected: SubstanceCategory | 'all'
  onChange: (cat: SubstanceCategory | 'all') => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-none -mx-0 md:hidden">
      <button
        onClick={() => onChange('all')}
        className={`flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
          selected === 'all'
            ? 'bg-foreground text-background border-foreground'
            : 'bg-muted text-muted-foreground border-border'
        }`}
      >
        All
      </button>
      {categories.map((cat) => {
        const isActive = selected === cat.id
        const dotColor = categoryDotColors[cat.id]
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-medium border transition-colors ${
              isActive
                ? 'bg-foreground text-background border-foreground'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}

// ─── SUBSTANCE DETAIL VIEW ───────────────────────────────────────────────────

function SubstanceDetail({
  substance,
  onBack,
  onDoseLogged,
}: {
  substance: Substance
  onBack: () => void
  onDoseLogged: () => void
}) {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const primary = getPrimaryCategory(substance)
  const cats = getSubstanceCategories(substance)

  const handleRouteChange = useCallback((r: string | null) => setSelectedRoute(r), [])

  // Quick stats from first available route
  const firstRoute = substance.routeData ? Object.keys(substance.routeData)[0] : null
  const quickDuration = firstRoute ? substance.routeData![firstRoute]?.duration : null
  const quickDosage = firstRoute ? substance.routeData![firstRoute]?.dosage : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop header (hidden on mobile) */}
      <header className="hidden md:flex sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 items-center gap-4 px-4 lg:px-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">{substance.name}</h1>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <DoseLoggerModal
            preselectedSubstanceId={substance.id}
            preselectedSubstanceName={substance.name}
            preselectedCategory={getSubstanceCategories(substance)}
            preselectedRoute={selectedRoute || undefined}
            onLogCreated={onDoseLogged}
            trigger={
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Log Dose
              </Button>
            }
          />
          <CategoryBadges substance={substance} />
          <Badge variant="outline" className={riskLevelColors[substance.riskLevel]}>
            {substance.riskLevel.replace('-', ' ')} risk
          </Badge>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile header */}
      <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 h-13 px-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold flex-1 truncate">{substance.name}</h1>
          <DoseLoggerModal
            preselectedSubstanceId={substance.id}
            preselectedSubstanceName={substance.name}
            preselectedCategory={getSubstanceCategories(substance)}
            preselectedRoute={selectedRoute || undefined}
            onLogCreated={onDoseLogged}
            trigger={
              <button className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                <Plus className="h-4 w-4" />
                Log
              </button>
            }
          />
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile: hero + quick stats + tabbed content */}
      <div className="md:hidden flex-1 overflow-y-auto pb-24">
        {/* Hero */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-start gap-3 mb-3">
            {primary && (
              <div className={`p-3 rounded-xl shrink-0 ${categoryColors[primary]}`}>
                <CategoryIcon substance={substance} className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{substance.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{substance.class}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {cats.map((cat) => {
                  const info = categories.find((c) => c.id === cat)
                  return (
                    <Badge key={cat} variant="outline" className={`text-xs ${categoryColors[cat]}`}>
                      {info?.name ?? cat}
                    </Badge>
                  )
                })}
                <Badge variant="outline" className={`text-xs ${riskLevelColors[substance.riskLevel]}`}>
                  {substance.riskLevel.replace('-', ' ')} risk
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{substance.description}</p>
        </div>

        {/* Quick stat chips */}
        {quickDuration && (
          <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none border-b border-border">
            {quickDuration.onset && (
              <div className="flex-shrink-0 flex flex-col items-center bg-muted rounded-xl px-4 py-2 min-w-[80px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Onset</span>
                <span className="text-sm font-medium mt-0.5">{quickDuration.onset}</span>
              </div>
            )}
            {quickDuration.peak && (
              <div className="flex-shrink-0 flex flex-col items-center bg-muted rounded-xl px-4 py-2 min-w-[80px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Peak</span>
                <span className="text-sm font-medium mt-0.5">{quickDuration.peak}</span>
              </div>
            )}
            {quickDuration.total && (
              <div className="flex-shrink-0 flex flex-col items-center bg-muted rounded-xl px-4 py-2 min-w-[80px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</span>
                <span className="text-sm font-medium mt-0.5">{quickDuration.total}</span>
              </div>
            )}
            {quickDosage?.common && (
              <div className="flex-shrink-0 flex flex-col items-center bg-muted rounded-xl px-4 py-2 min-w-[80px]">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Common</span>
                <span className="text-sm font-medium mt-0.5 font-mono">{quickDosage.common}</span>
              </div>
            )}
            <div className="flex-shrink-0 flex flex-col items-center bg-muted rounded-xl px-4 py-2 min-w-[80px]">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Routes</span>
              <span className="text-sm font-medium mt-0.5">
                {substance.routeData ? Object.keys(substance.routeData).length : '—'}
              </span>
            </div>
          </div>
        )}

        {/* Tabbed content */}
        <Tabs defaultValue="effects" className="w-full">
          <div className="sticky top-[52px] z-30 bg-background border-b border-border">
            <TabsList className="w-full h-auto p-0 bg-transparent rounded-none flex overflow-x-auto scrollbar-none justify-start gap-0">
              {['effects', 'dosage', 'harm', 'info', 'interactions'].map((tab) => {
                const labels: Record<string, string> = {
                  effects: 'Effects',
                  dosage: 'Dosage',
                  harm: 'Harm reduction',
                  info: 'Info',
                  interactions: 'Interactions',
                }
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex-shrink-0 rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 h-11 text-sm font-medium text-muted-foreground data-[state=active]:text-foreground"
                  >
                    {labels[tab]}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>

          <TabsContent value="effects" className="mt-0 px-4 py-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-green-500 uppercase tracking-wide mb-2">Positive</p>
              <ul className="space-y-2">
                {substance.effects.positive.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-yellow-500 uppercase tracking-wide mb-2">Neutral</p>
              <ul className="space-y-2">
                {substance.effects.neutral.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <MinusCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-red-500 uppercase tracking-wide mb-2">Negative</p>
              <ul className="space-y-2">
                {substance.effects.negative.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-sm">{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="dosage" className="mt-0 px-4 py-4">
            <DosageDurationPanel substance={substance} onRouteChange={handleRouteChange} />
          </TabsContent>

          <TabsContent value="harm" className="mt-0 px-4 py-4">
            <ul className="space-y-3">
              {substance.harmReduction.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  <span className="text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="info" className="mt-0 px-4 py-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{substance.history}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Scale className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-muted-foreground">Legality: </span>
                    <span>{substance.legality}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FlaskConical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <span className="text-muted-foreground">Formula: </span>
                    <span className="font-mono">{substance.chemistry.formula}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Contribute button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Github className="h-4 w-4" />
                  Contribute on GitHub
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => window.open(GITHUB_INFO_CHANGE_URL, '_blank')}>
                  <PenLine className="mr-2 h-4 w-4" />Submit info change
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(GITHUB_NEW_SUBSTANCE_URL, '_blank')}>
                  <Send className="mr-2 h-4 w-4" />Submit new substance
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open(GITHUB_FEEDBACK_URL, '_blank')}>
                  <AlertTriangle className="mr-2 h-4 w-4" />Report issue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsContent>

          <TabsContent value="interactions" className="mt-0 px-4 py-4">
            <p className="text-xs text-muted-foreground mb-3">
              Substances with known dangerous interactions:
            </p>
            <div className="flex flex-wrap gap-2">
              {substance.interactions.map((interaction, i) => (
                <Badge key={i} variant="outline" className="border-red-500/30 text-red-400">
                  {interaction}
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop layout — original 3-column */}
      <main className="hidden md:block container mx-auto py-6 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {primary && (
                    <div className={`p-2 rounded-lg ${categoryColors[primary]}`}>
                      <CategoryIcon substance={substance} className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-2xl">{substance.name}</CardTitle>
                    <CardDescription>{substance.commonNames.join(' • ')}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{substance.description}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="w-full sm:w-auto">
                      <Github className="mr-2 h-4 w-4" />
                      Contribute on GitHub
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => window.open(GITHUB_INFO_CHANGE_URL, '_blank')}>
                      <PenLine className="mr-2 h-4 w-4" />Submit info change
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(GITHUB_NEW_SUBSTANCE_URL, '_blank')}>
                      <Send className="mr-2 h-4 w-4" />Submit new substance
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.open(GITHUB_FEEDBACK_URL, '_blank')}>
                      <AlertTriangle className="mr-2 h-4 w-4" />Report issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />Effects
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
                      {substance.effects.positive.map((e, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /><span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="neutral" className="mt-4">
                    <ul className="space-y-2">
                      {substance.effects.neutral.map((e, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <MinusCircle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" /><span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="negative" className="mt-4">
                    <ul className="space-y-2">
                      {substance.effects.negative.map((e, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" /><span>{e}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <DosageDurationPanel substance={substance} onRouteChange={handleRouteChange} />

            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-orange-500">
                  <Shield className="h-5 w-5" />Harm Reduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {substance.harmReduction.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Quick Info</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  {primary && <CategoryIcon substance={substance} className="h-4 w-4 text-muted-foreground mt-0.5" />}
                  <div>
                    <p className="text-sm text-muted-foreground">{cats.length > 1 ? 'Categories' : 'Category'}</p>
                    <CategoryBadges substance={substance} className="mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-medium">{substance.class}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Route className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Routes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {substance.routeData && Object.keys(substance.routeData).map((route) => (
                        <span key={route} className="text-xs bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                          <span>{getRouteIcon(route)}</span><span>{route}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Legality</p>
                    <p className="font-medium text-sm">{substance.legality}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Interactions</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {substance.interactions.map((interaction, i) => (
                    <Badge key={i} variant="outline" className="border-red-500/30 text-red-400">
                      {interaction}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <History className="h-5 w-5" />History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{substance.history}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="hidden">
          <DoseHistory />
        </div>
      </main>
    </div>
  )
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'all'>('all')
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // Desktop view toggle
  const [desktopView, setDesktopView] = useState<'substances' | 'dose-log'>('substances')
  // Mobile bottom nav
  const [mobileTab, setMobileTab] = useState<MobileTab>('substances')
  const [doseRefreshTrigger, setDoseRefreshTrigger] = useState(0)

  const filteredSubstances = useMemo(() => {
    let result = substances
    if (selectedCategory !== 'all') {
      result = result.filter((s) => substanceBelongsToCategory(s, selectedCategory))
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.commonNames.some((n) => n.toLowerCase().includes(q))
          //s.aliases.some((a) => a.toLowerCase().includes(q))
      )
    }
    return result
  }, [selectedCategory, searchQuery])

  const handleDoseLogged = () => {
    setDoseRefreshTrigger((p) => p + 1)
    window.dispatchEvent(new CustomEvent('dose-logs-updated'))
  }

  const handleRouteChange = useCallback((route: string | null) => setSelectedRoute(route), [])

  useEffect(() => {
    if (selectedSubstance) window.scrollTo(0, 0)
  }, [selectedSubstance])

  useEffect(() => {
    if (!selectedSubstance) setSelectedRoute(null)
  }, [selectedSubstance])

  // ── Substance detail ────────────────────────────────────────────────────────
  if (selectedSubstance) {
    return (
      <>
        <SubstanceDetail
          substance={selectedSubstance}
          onBack={() => setSelectedSubstance(null)}
          onDoseLogged={handleDoseLogged}
        />
        {/* Mobile bottom nav stays visible on detail */}
        <MobileBottomNav
          active={mobileTab}
          onChange={(tab) => {
            setSelectedSubstance(null)
            setMobileTab(tab)
          }}
          renderLogTrigger={(btn) => (
            <DoseLoggerModal
              onLogCreated={handleDoseLogged}
              trigger={btn}
            />
          )}
        />
      </>
    )
  }

  // ── List / dose-log view ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Desktop sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } hidden md:flex transition-all duration-300 border-r bg-muted/30 overflow-hidden shrink-0 flex-col`}
      >
        <div className="h-full flex flex-col">
            <div className="p-4 border-b space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Image src="/logo.png" alt="Drugucopia Logo" width={36} height={36} className="rounded-lg" />
                  <span className="font-bold text-lg flex-1">Drugucopia</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Psychoactive Substances Documentation</p>
              </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs bg-background">
                  <Github className="mr-2 h-3 w-3" />
                  Contribute / Feedback
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuItem onClick={() => window.open(GITHUB_NEW_SUBSTANCE_URL, '_blank')}>
                  <Send className="mr-2 h-4 w-4" />Submit a New Substance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(GITHUB_INFO_CHANGE_URL, '_blank')}>
                  <PenLine className="mr-2 h-4 w-4" />Submit Info Change
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.open(GITHUB_FEEDBACK_URL, '_blank')}>
                  <AlertTriangle className="mr-2 h-4 w-4" />Feedback / Report Issue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant={desktopView === 'substances' && selectedCategory === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => { setDesktopView('substances'); setSelectedCategory('all') }}
              >
                <Info className="h-4 w-4" />
                All Substances
                <Badge variant="outline" className="ml-auto">{substances.length}</Badge>
              </Button>
              <Button
                variant={desktopView === 'dose-log' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => setDesktopView('dose-log')}
              >
                <Activity className="h-4 w-4" />
                Dose Log
              </Button>
              <Separator className="my-3" />
              {categories.map((category) => {
                const Icon = categoryIcons[category.id]
                const count = substances.filter((s) => substanceBelongsToCategory(s, category.id)).length
                return (
                  <Button
                    key={category.id}
                    variant={desktopView === 'substances' && selectedCategory === category.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2"
                    onClick={() => { setDesktopView('substances'); setSelectedCategory(category.id) }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{category.name}</span>
                    <Badge variant="outline" className="ml-auto">{count}</Badge>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Educational and harm reduction purposes only. Always consult medical professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop header */}
        <header className="hidden md:flex sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 items-center px-4 lg:px-6 gap-4">
          {!sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="-ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          )}

          {desktopView === 'substances' && (
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search substances..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {desktopView === 'dose-log' && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold">Dose Log</h2>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {desktopView === 'dose-log' && <DoseLoggerModal onLogCreated={handleDoseLogged} />}
            <ThemeToggle />
          </div>
        </header>
        {/* ── Mobile header ─────────────────────────────────────────────────── */}
        <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
          {/* Logo row */}
          <div className="flex items-center gap-3 px-4 h-12">
            <Image src="logo.png" alt="Drugucopia" width={28} height={28} className="rounded-lg" />
            <span className="font-bold text-base flex-1">Drugucopia</span>
            <ThemeToggle />
          </div>

          {/* Search — only on substances tab */}
          {mobileTab === 'substances' && (
            <div className="px-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search substances…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 h-9"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {mobileTab === 'timeline' && (
            <div className="px-4 pb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Active timeline</span>
              <DoseLoggerModal onLogCreated={handleDoseLogged} trigger={
                <button className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  <Plus className="h-3.5 w-3.5" />Log
                </button>
              } />
            </div>
          )}

          {mobileTab === 'history' && (
            <div className="px-4 pb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Dose history</span>
              <DoseLoggerModal onLogCreated={handleDoseLogged} trigger={
                <button className="flex items-center gap-1.5 h-8 px-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  <Plus className="h-3.5 w-3.5" />Log
                </button>
              } />
            </div>
          )}
        </header>

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <main className="flex-1">
          {/* ─ Desktop dose-log ─ */}
          <div className={`container mx-auto py-6 lg:py-10 px-4 lg:px-6 ${desktopView === 'dose-log' ? 'hidden md:block' : 'hidden'}`}>
            <div className="space-y-6">
              <ActiveDosesTimeline refreshTrigger={doseRefreshTrigger} />
              <DoseStats refreshTrigger={doseRefreshTrigger} />
              <DoseHistory refreshTrigger={doseRefreshTrigger} />
            </div>
          </div>

          {/* ─ Desktop substances ─ */}
          <div className={`container mx-auto py-6 lg:py-10 px-4 lg:px-6 ${desktopView === 'substances' ? 'hidden md:block' : 'hidden'}`}>
            {selectedCategory !== 'all' && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${categoryColors[selectedCategory]}`}>
                    {(() => { const Icon = categoryIcons[selectedCategory]; return <Icon className="h-5 w-5" /> })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{categories.find((c) => c.id === selectedCategory)?.name}</h2>
                    <p className="text-muted-foreground text-sm">{categories.find((c) => c.id === selectedCategory)?.description}</p>
                  </div>
                </div>
              </div>
            )}
            {selectedCategory === 'all' && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">All Substances</h2>
                <p className="text-muted-foreground">Browse the complete documentation of psychoactive substances</p>
              </div>
            )}

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
                          {primary && (
                            <div className={`p-2 rounded-lg shrink-0 ${categoryColors[primary]}`}>
                              <CategoryIcon substance={substance} className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {substance.name}
                            </CardTitle>
                            <CardDescription className="text-xs">{substance.class}</CardDescription>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{substance.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {substance.commonNames.slice(0, 2).map((name, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{name}</Badge>
                        ))}
                        {substance.commonNames.length > 2 && (
                          <Badge variant="secondary" className="text-xs">+{substance.commonNames.length - 2}</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex flex-wrap gap-1">
                          {cats.slice(0, 2).map((cat) => {
                            const info = categories.find((c) => c.id === cat)
                            return (
                              <Badge key={cat} variant="outline" className={`text-xs ${categoryColors[cat] ?? ''}`}>
                                {info?.name ?? cat}
                              </Badge>
                            )
                          })}
                          {cats.length > 2 && (
                            <Badge variant="outline" className="text-xs text-muted-foreground">+{cats.length - 2}</Badge>
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

            {filteredSubstances.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No substances found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* ─ Mobile: Substances tab ─ */}
          <div className={`${mobileTab === 'substances' ? 'block md:hidden' : 'hidden'} pb-24`}>
            <div className="px-4 pt-3 pb-1">
              <CategoryChipRow selected={selectedCategory} onChange={setSelectedCategory} />
            </div>

            {selectedCategory !== 'all' && (
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground">
                  {categories.find((c) => c.id === selectedCategory)?.description}
                </p>
              </div>
            )}

            <div className="px-4 space-y-3">
              {filteredSubstances.map((substance) => {
                const primary = getPrimaryCategory(substance)
                const cats = getSubstanceCategories(substance)
                return (
                  <button
                    key={substance.id}
                    onClick={() => setSelectedSubstance(substance)}
                    className="w-full text-left flex items-start gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 active:scale-[0.99] transition-all"
                  >
                    {primary && (
                      <div className={`p-2.5 rounded-xl shrink-0 ${categoryColors[primary]}`}>
                        <CategoryIcon substance={substance} className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold text-base leading-tight">{substance.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{substance.class}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                        {substance.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {cats.slice(0, 2).map((cat) => {
                          const info = categories.find((c) => c.id === cat)
                          return (
                            <Badge key={cat} variant="outline" className={`text-xs ${categoryColors[cat]}`}>
                              {info?.name ?? cat}
                            </Badge>
                          )
                        })}
                        {cats.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{cats.length - 2}</Badge>
                        )}
                        <Badge variant="outline" className={`text-xs ${riskLevelColors[substance.riskLevel]}`}>
                          {substance.riskLevel.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </button>
                )
              })}

              {filteredSubstances.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground text-sm">No substances found</p>
                </div>
              )}
            </div>
          </div>

          {/* ─ Mobile: Timeline tab ─ */}
          <div className={`${mobileTab === 'timeline' ? 'block md:hidden' : 'hidden'} pb-24 px-4 pt-3 space-y-4`}>
            <ActiveDosesTimeline refreshTrigger={doseRefreshTrigger} />
            <DoseStats refreshTrigger={doseRefreshTrigger} />
          </div>

          {/* ─ Mobile: History tab ─ */}
          <div className={`${mobileTab === 'history' ? 'block md:hidden' : 'hidden'} pb-24 px-4 pt-3`}>
            <DoseHistory refreshTrigger={doseRefreshTrigger} />
          </div>
        </main>
      </div>

      {/* ── Mobile bottom nav ──────────────────────────────────────────────── */}
      <MobileBottomNav
        active={mobileTab}
        onChange={setMobileTab}
        renderLogTrigger={(btn) => (
          <DoseLoggerModal
            onLogCreated={() => {
              handleDoseLogged()
              setMobileTab('timeline')
            }}
            trigger={btn}
          />
        )}
      />
    </div>
  )
}
