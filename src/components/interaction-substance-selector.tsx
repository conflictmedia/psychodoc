'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import { Check, ChevronsUpDown, X, Plus, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { substances, searchSubstances } from '@/lib/substances/index'
import type { Substance } from '@/lib/types'

interface InteractionSubstanceSelectorProps {
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  maxSelections?: number
}

export function InteractionSubstanceSelector({
  selectedIds,
  onSelectionChange,
  maxSelections = 6,
}: InteractionSubstanceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selectedSubstances = useMemo(() => {
    return selectedIds
      .map((id) => substances.find((s) => s.id === id))
      .filter(Boolean) as Substance[]
  }, [selectedIds])

  const filteredSubstances = useMemo(() => {
    const results = searchSubstances(query)
    // Remove already selected
    return results.filter((s) => !selectedIds.includes(s.id))
  }, [query, selectedIds])

  const handleSelect = useCallback(
    (id: string) => {
      if (selectedIds.length >= maxSelections) return
      onSelectionChange([...selectedIds, id])
      setQuery('')
      setOpen(false)
    },
    [selectedIds, onSelectionChange, maxSelections]
  )

  const handleRemove = useCallback(
    (id: string) => {
      onSelectionChange(selectedIds.filter((sid) => sid !== id))
    },
    [selectedIds, onSelectionChange]
  )

  const handleClearAll = useCallback(() => {
    onSelectionChange([])
  }, [onSelectionChange])

  // Category colors
  const getCategoryColor = (categories: string[]) => {
    const cat = categories?.[0]
    const colorMap: Record<string, string> = {
      stimulants: 'border-amber-500/40 bg-amber-500/10 text-amber-500',
      depressants: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-500',
      hallucinogens: 'border-purple-500/40 bg-purple-500/10 text-purple-500',
      dissociatives: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-500',
      empathogens: 'border-pink-500/40 bg-pink-500/10 text-pink-500',
      cannabinoids: 'border-green-500/40 bg-green-500/10 text-green-500',
      opioids: 'border-red-500/40 bg-red-500/10 text-red-500',
      deliriants: 'border-slate-500/40 bg-slate-500/10 text-slate-500',
      nootropics: 'border-teal-500/40 bg-teal-500/10 text-teal-500',
      other: 'border-zinc-500/40 bg-zinc-500/10 text-zinc-500',
    }
    return colorMap[cat || 'other'] || colorMap.other
  }

  return (
    <div className="space-y-3">
      {/* Selected substances as chips */}
      {selectedSubstances.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSubstances.map((sub) => (
            <Badge
              key={sub.id}
              variant="outline"
              className={cn(
                'gap-1 pr-1 text-sm font-medium py-1 px-2.5 transition-all',
                getCategoryColor(sub.categories)
              )}
            >
              <span className="truncate max-w-[120px]">{sub.name}</span>
              <button
                onClick={() => handleRemove(sub.id)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedIds.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Combobox trigger */}
      <div className="relative">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            selectedIds.length >= maxSelections && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => {
            if (selectedIds.length < maxSelections) {
              setOpen(!open)
            }
          }}
          disabled={selectedIds.length >= maxSelections}
        >
          <span className="text-muted-foreground truncate">
            {selectedIds.length >= maxSelections
              ? `Maximum ${maxSelections} substances reached`
              : selectedIds.length > 0
                ? 'Add another substance...'
                : 'Search for a substance...'}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {/* Dropdown */}
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              ref={listRef}
              className="absolute z-50 top-full mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg max-h-[250px] overflow-hidden"
            >
              {/* Search input */}
              <div className="p-2 border-b">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type to search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground px-1"
                  autoFocus
                />
              </div>

              {/* Results */}
              <div className="overflow-y-auto max-h-[200px] p-1">
                {filteredSubstances.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No substances found.
                  </div>
                ) : (
                  filteredSubstances.slice(0, 30).map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSelect(sub.id)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm hover:bg-accent transition-colors text-left"
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full shrink-0',
                          sub.categories[0] === 'stimulants' && 'bg-amber-500',
                          sub.categories[0] === 'depressants' && 'bg-indigo-500',
                          sub.categories[0] === 'hallucinogens' && 'bg-purple-500',
                          sub.categories[0] === 'dissociatives' && 'bg-cyan-500',
                          sub.categories[0] === 'empathogens' && 'bg-pink-500',
                          sub.categories[0] === 'cannabinoids' && 'bg-green-500',
                          sub.categories[0] === 'opioids' && 'bg-red-500',
                          sub.categories[0] === 'deliriants' && 'bg-slate-500',
                          sub.categories[0] === 'nootropics' && 'bg-teal-500',
                          sub.categories[0] === 'other' && 'bg-zinc-500',
                          !sub.categories[0] && 'bg-zinc-500'
                        )}
                      />
                      <span className="truncate flex-1">{sub.name}</span>
                      {sub.commonNames[0] && (
                        <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {sub.commonNames[0]}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Selection counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {selectedIds.length} of {maxSelections} selected
        </span>
        {selectedIds.length >= 2 && (
          <span className="flex items-center gap-1 text-primary font-medium">
            <Zap className="h-3 w-3" />
            Ready to check
          </span>
        )}
      </div>
    </div>
  )
}
