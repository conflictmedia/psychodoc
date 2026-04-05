'use client'


import { useState, useEffect } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp, FlaskConical, Clock, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Duration } from '@/types'
import { EstimatedDuration } from '@/lib/duration-interpolation'

interface DurationOverrideFieldsProps {
  baseDuration: EstimatedDuration | null
  onChange: (duration: Duration | null) => void
  defaultExpanded?: boolean
}

const PHASES: { key: keyof Duration; label: string; color: string; placeholder: string }[] = [
  { key: 'onset',  label: 'Onset',  color: 'text-blue-400',   placeholder: 'e.g. 20-40 minutes' },
  { key: 'comeup', label: 'Come-up',color: 'text-amber-400',  placeholder: 'e.g. 30-60 minutes' },
  { key: 'peak',   label: 'Peak',   color: 'text-purple-400', placeholder: 'e.g. 2-3 hours'     },
  { key: 'offset', label: 'Offset', color: 'text-cyan-400',   placeholder: 'e.g. 1-2 hours'     },
  { key: 'total',  label: 'Total',  color: 'text-green-400',  placeholder: 'e.g. 4-6 hours'     },
]

export function DurationOverrideFields({
  baseDuration,
  onChange,
  defaultExpanded = false,
}: DurationOverrideFieldsProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || !!baseDuration?.isEstimated)

  const [values, setValues] = useState<Duration>({
    onset:  baseDuration?.onset  ?? '',
    comeup: baseDuration?.comeup ?? '',
    peak:   baseDuration?.peak   ?? '',
    offset: baseDuration?.offset ?? '',
    total:  baseDuration?.total  ?? '',
  })

  useEffect(() => {
    setValues({
      onset:  baseDuration?.onset  ?? '',
      comeup: baseDuration?.comeup ?? '',
      peak:   baseDuration?.peak   ?? '',
      offset: baseDuration?.offset ?? '',
      total:  baseDuration?.total  ?? '',
    })
    if (baseDuration?.isEstimated) setExpanded(true)
  }, [baseDuration])

  const handleChange = (key: keyof Duration, val: string) => {
    const next = { ...values, [key]: val }
    setValues(next)
    const hasMinimum = next.onset.trim() !== '' && next.peak.trim() !== ''
    onChange(hasMinimum ? next : null)
  }

  const isEstimated = baseDuration?.isEstimated ?? false
  const hasAnyData  = baseDuration !== null

  if (!hasAnyData && !expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="w-full flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
      >
        <Clock className="h-3.5 w-3.5" />
        <span>Add custom duration (optional)</span>
        <ChevronDown className="h-3 w-3 ml-auto" />
      </button>
    )
  }

  return (
    <div className="space-y-2">
      {/* Section header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 text-sm font-medium"
      >
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span>Duration</span>
        {isEstimated && (
          <span className="ml-1 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <FlaskConical className="h-2.5 w-2.5" />
            Estimated
          </span>
        )}
        {expanded
          ? <ChevronUp   className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
        }
      </button>

      {expanded && (
        <div className="space-y-3 pl-1">
          {/* Estimated disclaimer */}
          {isEstimated && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/8 p-3 space-y-1.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300/90 leading-relaxed font-medium">
                  Duration estimated — not sourced from verified data
                </p>
              </div>
              {baseDuration?.estimationNote && (
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-5">
                  {baseDuration.estimationNote}
                </p>
              )}
              {baseDuration?.sourceRoute && (
                <p className="text-[11px] text-amber-400/60 pl-5">
                  Interpolated from: <span className="font-medium">{baseDuration.sourceRoute}</span> route data
                </p>
              )}
              <p className="text-[11px] text-muted-foreground pl-5 pt-0.5">
                You can override any phase below with your own values.
              </p>
            </div>
          )}

          {/* No data at all disclaimer */}
          {!isEstimated && !baseDuration && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                No duration data available for this substance and route.
                Entering values here will enable the active timeline tracker.
              </p>
            </div>
          )}

          {/* Phase fields */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3">
            {PHASES.map(({ key, label, color, placeholder }) => (
              <div key={key} className="grid gap-1">
                <Label className={`text-xs font-medium ${color}`}>{label}</Label>
                <Input
                  value={values[key] ?? ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="h-8 text-xs font-mono"
                />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Format: <span className="font-mono">30-60 minutes</span> or <span className="font-mono">1-2 hours</span>.
            Onset and Peak are required for the timeline.
          </p>
        </div>
      )}
    </div>
  )
}
