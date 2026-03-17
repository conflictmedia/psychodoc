'use client'

import { useState, useMemo } from 'react'
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
  Plus
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { DoseLoggerModal } from '@/components/dose-logger-modal'
import { DoseHistory } from '@/components/dose-history'
import { DoseStats } from '@/components/dose-stats'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  substances, 
  categories, 
  type Substance, 
  type SubstanceCategory 
} from '@/lib/substances-data'

const categoryIcons: Record<SubstanceCategory, React.ElementType> = {
  stimulants: Zap,
  depressants: MoonIcon,
  hallucinogens: Sparkles,
  dissociatives: Split,
  empathogens: Heart,
  cannabinoids: Leaf,
  opioids: Pill,
  deliriants: Ghost,
  nootropics: Brain
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
  nootropics: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
}

const riskLevelColors = {
  'low': 'bg-green-500/20 text-green-400 border-green-500/30',
  'moderate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'very-high': 'bg-red-500/20 text-red-400 border-red-500/30'
}

type ViewType = 'substances' | 'dose-log'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<SubstanceCategory | 'all'>('all')
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('substances')
  const [doseRefreshTrigger, setDoseRefreshTrigger] = useState(0)

  const filteredSubstances = useMemo(() => {
    let result = substances
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory)
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

  if (selectedSubstance) {
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
            <div className="ml-auto flex items-center gap-2">
              <DoseLoggerModal 
                preselectedSubstanceId={selectedSubstance.id}
                preselectedSubstanceName={selectedSubstance.name}
                preselectedCategory={selectedSubstance.category}
                onLogCreated={handleDoseLogged}
                trigger={
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Log Dose
                  </Button>
                }
              />
              <Badge variant="outline" className={categoryColors[selectedSubstance.category]}>
                {categories.find(c => c.id === selectedSubstance.category)?.name}
              </Badge>
              <Badge variant="outline" className={riskLevelColors[selectedSubstance.riskLevel]}>
                {selectedSubstance.riskLevel.replace('-', ' ')} risk
              </Badge>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container py-6 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${categoryColors[selectedSubstance.category]}`}>
                      {(() => {
                        const Icon = categoryIcons[selectedSubstance.category]
                        return <Icon className="h-6 w-6" />
                      })()}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedSubstance.name}</CardTitle>
                      <CardDescription>
                        {selectedSubstance.commonNames.join(' • ')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedSubstance.description}
                  </p>
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

              {/* Dosage & Duration */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Droplets className="h-5 w-5" />
                      Dosage Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedSubstance.dosage).map(([level, amount]) => (
                        <div key={level} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="capitalize text-muted-foreground">{level}</span>
                          <Badge variant="secondary">{amount}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5" />
                      Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedSubstance.duration).map(([phase, time]) => (
                        <div key={phase} className="flex justify-between items-center py-2 border-b last:border-0">
                          <span className="capitalize text-muted-foreground">{phase}</span>
                          <Badge variant="secondary">{time}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                  <div className="flex items-center gap-3">
                    <FlaskConical className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{selectedSubstance.class}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Route className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Routes</p>
                      <p className="font-medium">{selectedSubstance.routes.join(', ')}</p>
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r bg-muted/30 overflow-hidden shrink-0`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                <FlaskConical className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">PsychoDoc</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Psychoactive Substances Documentation</p>
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
                const count = substances.filter(s => s.category === category.id).length
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
        <main className="flex-1 p-4 lg:p-6">
          {currentView === 'dose-log' ? (
            /* Dose Log View */
            <div className="space-y-6">
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
                  const Icon = categoryIcons[substance.category]
                  return (
                    <Card 
                      key={substance.id} 
                      className="cursor-pointer hover:border-primary/50 transition-colors group"
                      onClick={() => setSelectedSubstance(substance)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${categoryColors[substance.category]}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                {substance.name}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {substance.class}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {substance.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
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
                          <Badge variant="outline" className={riskLevelColors[substance.riskLevel]}>
                            {substance.riskLevel.replace('-', ' ')}
                          </Badge>
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
