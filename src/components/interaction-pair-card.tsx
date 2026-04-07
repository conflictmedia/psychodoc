'use client'

import { AlertTriangle, HelpCircle, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { InteractionResult } from '@/lib/interaction-checker'

interface InteractionPairCardProps {
  result: InteractionResult
}

const severityConfig = {
  dangerous: {
    icon: ShieldAlert,
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/5',
    badgeColor: 'bg-red-500/15 text-red-400 border-red-500/30',
    badgeLabel: 'DANGEROUS',
    iconColor: 'text-red-400',
  },
  unsafe: {
    icon: AlertTriangle,
    borderColor: 'border-orange-500/30',
    bgColor: 'bg-orange-500/5',
    badgeColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    badgeLabel: 'UNSAFE',
    iconColor: 'text-orange-400',
  },
  uncertain: {
    icon: HelpCircle,
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/5',
    badgeColor: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    badgeLabel: 'UNCERTAIN',
    iconColor: 'text-yellow-400',
  },
}

export function InteractionPairCard({ result }: InteractionPairCardProps) {
  const config = severityConfig[result.severity]
  const Icon = config.icon
  const isCurated = result.sources.includes('curated')

  return (
    <Card
      className={cn(
        'border transition-all hover:shadow-md',
        config.borderColor,
        config.bgColor
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn('p-1.5 rounded-lg shrink-0', config.bgColor)}>
            <Icon className={cn('h-4 w-4', config.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Substance pair */}
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              <Badge variant="outline" className="font-medium text-sm">
                {result.substanceA}
              </Badge>
              <span className="text-muted-foreground font-bold text-xs">&times;</span>
              <Badge variant="outline" className="font-medium text-sm">
                {result.substanceB}
              </Badge>
            </div>

            {/* Description (from curated data) */}
            {result.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {result.description}
              </p>
            )}

            {/* Matched interaction terms */}
            {result.matchedTerms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="text-xs text-muted-foreground">Matched:</span>
                {result.matchedTerms.map((term, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {term}
                  </Badge>
                ))}
              </div>
            )}

            {/* Metadata row */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn('text-[10px] font-bold', config.badgeColor)}
              >
                {config.badgeLabel}
              </Badge>
              {isCurated && (
                <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/30 bg-blue-500/10">
                  CURATED
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
