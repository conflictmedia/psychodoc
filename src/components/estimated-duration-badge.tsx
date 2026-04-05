'use client'


import { FlaskConical } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface EstimatedDurationBadgeProps {
  sourceRoute?: string
  className?: string
}

export function EstimatedDurationBadge({ sourceRoute, className = '' }: EstimatedDurationBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full cursor-help
            bg-amber-500/15 text-amber-400 border border-amber-500/30
            hover:bg-amber-500/25 transition-colors
            ${className}`}
        >
          <FlaskConical className="h-2.5 w-2.5" />
          Est. timeline
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs">
        <p className="font-semibold mb-1">Duration is estimated</p>
        <p className="text-muted-foreground leading-relaxed">
          No verified duration data exists for this route.
          {sourceRoute && (
            <> Timeline was interpolated from <span className="font-medium text-foreground">{sourceRoute}</span> route data using pharmacokinetic multipliers.</>
          )}
        </p>
        <p className="text-amber-400/80 mt-1">
          Actual timing may differ. Do not rely solely on this estimate.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
