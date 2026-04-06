'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  AlertTriangle,
  Phone,
  Heart,
  Brain,
  Droplets,
  ArrowLeft,
  Syringe,
  GlassWater,
  AlertOctagon,
  Trees,
  TestTubes,
  Timer,
  ExternalLink,
  BookOpen,
  type LucideIcon,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  generalGuides,
  emergencyResources,
  dangerousInteractions,
  externalResources,
  quickPrinciples,
  type GuideSeverity,
  type DangerousInteraction,
} from '@/lib/harm-reduction-data'

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
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

const severityColors: Record<GuideSeverity, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  important: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  recommended: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const severityLabels: Record<GuideSeverity, string> = {
  critical: 'CRITICAL',
  important: 'IMPORTANT',
  recommended: 'RECOMMENDED',
}

const riskColors: Record<string, string> = {
  fatal: 'bg-red-600 text-white border-red-600',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
}

const riskLabels: Record<string, string> = {
  fatal: 'FATAL',
  high: 'HIGH RISK',
  moderate: 'MODERATE',
}

const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Trees,
  TestTubes,
  AlertOctagon,
  Syringe,
  GlassWater,
  Phone,
  Heart,
  Timer,
  Brain,
  BookOpen,
  Shield,
}

function getGuideIcon(name: string): LucideIcon {
  return iconMap[name] || Shield
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function EmergencyCard({ resource }: { resource: typeof emergencyResources[0] }) {
  return (
    <Card className="border-red-500/20 bg-red-500/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/10 shrink-0">
            <Phone className="h-4 w-4 text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm">{resource.name}</p>
            <p className="text-lg font-mono font-bold text-red-400 mt-1">{resource.number}</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{resource.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PrincipleChip({ principle }: { principle: typeof quickPrinciples[0] }) {
  const Icon = getGuideIcon(principle.icon) || Shield
  return (
    <Card className="flex items-start gap-3 p-4">
      <div className="p-2 rounded-lg bg-primary/10 shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm">{principle.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{principle.description}</p>
      </div>
    </Card>
  )
}

function InteractionRow({ interaction }: { interaction: DangerousInteraction }) {
  const riskColor = riskColors[interaction.risk] || riskColors.moderate
  const riskLabel = riskLabels[interaction.risk] || interaction.risk.toUpperCase()

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        <AlertTriangle className="h-4 w-4 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5 mb-1">
          {interaction.substances.map((sub, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <span className="text-muted-foreground text-xs font-bold">+</span>
              )}
              <Badge variant="outline" className="text-xs font-medium">
                {sub}
              </Badge>
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{interaction.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {interaction.category.map((cat) => (
            <Badge key={cat} variant="outline" className={`text-[10px] ${categoryColors[cat] || ''}`}>
              {cat}
            </Badge>
          ))}
        </div>
      </div>
      <Badge variant="outline" className={`shrink-0 text-[10px] font-bold ${riskColor}`}>
        {riskLabel}
      </Badge>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function HarmReductionPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Desktop Header ── */}
      <header className="hidden md:flex sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-14 items-center gap-4 px-4 lg:px-6">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Harm Reduction Resources</h1>
        </div>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header className="md:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 h-13 px-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Shield className="h-4 w-4 text-primary shrink-0" />
            <h1 className="text-base font-semibold truncate">Harm Reduction Resources</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Desktop Content ── */}
      <main className="hidden md:block container mx-auto py-6 lg:py-10 max-w-5xl">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Harm Reduction Resources</h2>
              <p className="text-muted-foreground mt-1">
                Comprehensive harm reduction information to help you stay safe.
                Evidence-based, non-judgmental, and focused on reducing harm.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-xl font-semibold">Emergency Contacts</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyResources.map((resource, i) => (
              <EmergencyCard key={i} resource={resource} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Quick Principles */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Quick Reference Principles</h3>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickPrinciples.map((principle) => (
              <PrincipleChip key={principle.id} principle={principle} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Harm Reduction Guides */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Harm Reduction Guides</h3>
          </div>
          <Card>
            <Accordion type="multiple" className="w-full">
              {generalGuides.map((guide) => {
                const GuideIcon = getGuideIcon(guide.icon)
                return (
                  <AccordionItem key={guide.id} value={guide.id}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-md bg-muted shrink-0">
                          <GuideIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{guide.title}</span>
                        <Badge
                          variant="outline"
                          className={`ml-2 text-[10px] font-bold shrink-0 ${severityColors[guide.severity]}`}
                        >
                          {severityLabels[guide.severity]}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {guide.content.split('\n\n').map((paragraph, i) => {
                          // Handle bold text
                          const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
                          return (
                            <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0">
                              {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={j} className="text-foreground font-semibold">
                                      {part.slice(2, -2)}
                                    </strong>
                                  )
                                }
                                return part
                              })}
                            </p>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Dangerous Interactions */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="text-xl font-semibold">Dangerous Interactions</h3>
            <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-400 text-xs">
              {dangerousInteractions.length} known dangerous combos
            </Badge>
          </div>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {dangerousInteractions.map((interaction, i) => (
              <InteractionRow key={i} interaction={interaction} />
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* External Resources */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">External Resources</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {externalResources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm flex items-center gap-1.5">
                          {resource.name}
                          <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <Separator className="my-8" />

        {/* Disclaimer */}
        <section className="mb-8">
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Disclaimer</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This information is provided for educational and harm reduction purposes only. 
                    It is not medical advice, and should not replace professional medical guidance. 
                    Drugucopia does not encourage or condone the use of illegal substances. 
                    The information presented here is compiled from publicly available harm reduction 
                    resources and scientific literature, and while we strive for accuracy, we cannot 
                    guarantee its completeness or correctness. Always consult qualified healthcare 
                    professionals for medical advice, and always prioritize your health and safety.
                    If you or someone you know is experiencing a medical emergency, call your local 
                    emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ── Mobile Content ── */}
      <div className="md:hidden flex-1 overflow-y-auto pb-8">
        {/* Hero */}
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Harm Reduction Resources</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comprehensive harm reduction info to keep you safe.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Resources */}
        <section className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold">Emergency Contacts</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {emergencyResources.slice(0, 4).map((resource, i) => (
              <EmergencyCard key={i} resource={resource} />
            ))}
          </div>
        </section>

        {/* Quick Principles */}
        <section className="py-4 border-b border-border">
          <div className="flex items-center gap-2 px-4 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Quick Principles</h3>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
            {quickPrinciples.map((principle) => {
              const Icon = getGuideIcon(principle.icon) || Shield
              return (
                <div
                  key={principle.id}
                  className="flex-shrink-0 w-40 p-3 rounded-xl border border-border bg-card"
                >
                  <div className="p-1.5 rounded-md bg-primary/10 w-fit mb-2">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-xs font-semibold mb-0.5">{principle.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{principle.description}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Harm Reduction Guides */}
        <section className="py-4 border-b border-border">
          <div className="flex items-center gap-2 px-4 mb-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Guides</h3>
          </div>
          <Card className="mx-4">
            <Accordion type="multiple" className="w-full">
              {generalGuides.map((guide) => {
                const GuideIcon = getGuideIcon(guide.icon)
                return (
                  <AccordionItem key={guide.id} value={guide.id}>
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1 rounded-md bg-muted shrink-0">
                          <GuideIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium truncate">{guide.title}</span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] font-bold shrink-0 ${severityColors[guide.severity]}`}
                        >
                          {severityLabels[guide.severity]}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div>
                        {guide.content.split('\n\n').map((paragraph, i) => {
                          const parts = paragraph.split(/(\*\*[^*]+\*\*)/g)
                          return (
                            <p key={i} className="text-xs text-muted-foreground leading-relaxed mb-2 last:mb-0">
                              {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={j} className="text-foreground font-semibold text-xs">
                                      {part.slice(2, -2)}
                                    </strong>
                                  )
                                }
                                return part
                              })}
                            </p>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </Card>
        </section>

        {/* Dangerous Interactions */}
        <section className="py-4 border-b border-border">
          <div className="flex items-center gap-2 px-4 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold">Dangerous Interactions</h3>
          </div>
          <div className="px-4 space-y-2">
            {dangerousInteractions.map((interaction, i) => (
              <InteractionRow key={i} interaction={interaction} />
            ))}
          </div>
        </section>

        {/* External Resources */}
        <section className="py-4 border-b border-border">
          <div className="flex items-center gap-2 px-4 mb-3">
            <ExternalLink className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Resources</h3>
          </div>
          <div className="px-4 space-y-2">
            {externalResources.map((resource, i) => (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-3">
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      {resource.name}
                      <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                      {resource.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="px-4 py-4">
          <Card className="border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold mb-1">Disclaimer</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    This information is for educational and harm reduction purposes only. 
                    Not medical advice. Drugucopia does not encourage illegal substance use. 
                    Always consult healthcare professionals for medical guidance. If you or 
                    someone you know is experiencing a medical emergency, call emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
