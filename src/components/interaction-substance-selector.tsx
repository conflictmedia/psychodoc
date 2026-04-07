'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Check, ChevronsUpDown, X, Zap, Search, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { substances, searchSubstancesRanked, getSubstancesByCategory } from '@/lib/substances/index'
import type { Substance, SubstanceCategory } from '@/lib/types'

interface InteractionSubstanceSelectorProps {
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  maxSelections?: number
}

// Popular substances shown when no query is typed
const POPULAR_SUBSTANCES = [
  'mdma', 'lsd', 'cannabis', 'alcohol', 'psilocybin', 'cocaine',
  'ketamine', 'dmt', 'diazepam', 'adderall', 'modafinil', 'nicotine',
]

// Category definitions for filter chips
const CATEGORIES: { id: SubstanceCategory | 'all'; label: string; color: string }[] = [
  { id: 'all', label: 'All', color: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/30' },
  { id: 'stimulants', label: 'Stimulants', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  { id: 'depressants', label: 'Depressants', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' },
  { id: 'hallucinogens', label: 'Psychedelics', color: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
  { id: 'dissociatives', label: 'Dissociatives', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30' },
  { id: 'empathogens', label: 'Empathogens', color: 'bg-pink-500/10 text-pink-500 border-pink-500/30' },
  { id: 'cannabinoids', label: 'Cannabis', color: 'bg-green-500/10 text-green-500 border-green-500/30' },
  { id: 'opioids', label: 'Opioids', color: 'bg-red-500/10 text-red-500 border-red-500/30' },
  { id: 'nootropics', label: 'Nootropics', color: 'bg-teal-500/10 text-teal-500 border-teal-500/30' },
  { id: 'other', label: 'Other', color: 'bg-slate-500/10 text-slate-500 border-slate-500/30' },
]

// Category dot colors
const CATEGORY_DOTS: Record<string, string> = {
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

export function InteractionSubstanceSelector({
  selectedIds,
  onSelectionChange,
  maxSelections = 6,
}: InteractionSubstanceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map())

  const selectedSubstances = useMemo(() => {
    return selectedIds
      .map((id) => substances.find((s) => s.id === id))
      .filter(Boolean) as Substance[]
  }, [selectedIds])

  // Ranked search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    return searchSubstancesRanked(query, {
      categoryFilter,
      limit: 40,
    }).filter((r) => !selectedIds.includes(r.substance.id))
  }, [query, selectedIds, categoryFilter])

  // Popular substances when no query (excluding already selected)
  const popularResults = useMemo(() => {
    if (query.trim()) return []
    const filtered = POPULAR_SUBSTANCES
      .filter((id) => !selectedIds.includes(id))
      .map((id) => substances.find((s) => s.id === id))
      .filter(Boolean) as Substance[]
    // If category filter is active, filter popular too
    if (categoryFilter) {
      return filtered.filter((s) => s.categories?.includes(categoryFilter as SubstanceCategory))
    }
    return filtered
  }, [query, selectedIds, categoryFilter])

  // Combined display results
  const displayResults = useMemo(() => {
    if (query.trim()) return searchResults
    return popularResults.map((s) => ({ substance: s, score: 0, matchField: 'name' }))
  }, [searchResults, popularResults, query])

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1)
  }, [displayResults.length])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0) {
      const el = itemRefs.current.get(activeIndex)
      if (el) {
        el.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [activeIndex])

  const handleSelect = useCallback(
    (id: string) => {
      if (selectedIds.length >= maxSelections) return
      onSelectionChange([...selectedIds, id])
      setQuery('')
      setActiveIndex(-1)
      // Keep dropdown open for quick multi-select
      inputRef.current?.focus()
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

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault()
          setOpen(true)
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) =>
            prev < displayResults.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : displayResults.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          const idx = activeIndex >= 0 ? activeIndex : 0
          if (idx < displayResults.length) {
            handleSelect(displayResults[idx].substance.id)
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          setQuery('')
          setActiveIndex(-1)
          break
        case 'Tab':
          // Close dropdown on Tab
          setOpen(false)
          break
      }
    },
    [open, displayResults, activeIndex, handleSelect]
  )

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

  const totalFiltered = categoryFilter
    ? getSubstancesByCategory(categoryFilter).filter(
        (s) => !selectedIds.includes(s.id)
      ).length
    : substances.filter((s) => !selectedIds.includes(s.id)).length

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
          aria-haspopup="listbox"
          className={cn(
            'w-full justify-between font-normal',
            selectedIds.length >= maxSelections && 'opacity-50 cursor-not-allowed'
          )}
          onClick={() => {
            if (selectedIds.length < maxSelections) {
              setOpen(!open)
              if (!open) {
                setTimeout(() => inputRef.current?.focus(), 0)
              }
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
              className="absolute z-50 top-full mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-lg max-h-[380px] overflow-hidden"
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type to search substances..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground pl-8 pr-3 py-1.5"
                    autoFocus
                  />
                </div>
              </div>

              {/* Category filter chips */}
              <div className="px-2 py-1.5 border-b bg-muted/30 flex gap-1 overflow-x-auto scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setCategoryFilter((prev) => (prev === cat.id ? null : cat.id === 'all' ? null : cat.id))
                    }
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors border',
                      categoryFilter === cat.id || (!categoryFilter && cat.id === 'all')
                        ? cat.id === 'all'
                          ? 'bg-primary/20 text-primary border-primary/40'
                          : cat.color
                        : 'bg-transparent text-muted-foreground border-transparent hover:border-border'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Results */}
              <div
                className="overflow-y-auto max-h-[240px] p-1"
                role="listbox"
              >
                {!query.trim() && popularResults.length > 0 && (
                  <div className="px-2 py-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Popular
                  </div>
                )}

                {displayResults.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-muted-foreground text-sm mb-1">No substances found</div>
                    <div className="text-muted-foreground/60 text-xs">
                      Try a different search term or category
                    </div>
                  </div>
                ) : (
                  displayResults.map((result, idx) => {
                    const sub = result.substance
                    const isActive = idx === activeIndex
                    const matchedName = result.matchField !== 'class' && result.matchField !== 'category' && result.matchField !== 'description' ? result.matchField : sub.name

                    return (
                      <button
                        key={sub.id}
                        ref={(el) => {
                          if (el) itemRefs.current.set(idx, el)
                        }}
                        onClick={() => handleSelect(sub.id)}
                        role="option"
                        aria-selected={isActive}
                        className={cn(
                          'flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm transition-colors text-left',
                          isActive
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-accent/50'
                        )}
                      >
                        {/* Category dot */}
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full shrink-0',
                            CATEGORY_DOTS[sub.categories[0]] || 'bg-zinc-500'
                          )}
                        />

                        {/* Name with highlight */}
                        <span className="truncate flex-1">
                          {query.trim() && result.matchField === 'name' ? (
                            <HighlightedText text={sub.name} query={query} />
                          ) : (
                            sub.name
                          )}
                        </span>

                        {/* Matched alias badge */}
                        {query.trim() &&
                          result.matchField !== 'name' &&
                          result.matchField !== 'class' &&
                          result.matchField !== 'category' &&
                          result.matchField !== 'description' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground truncate max-w-[90px]">
                              {result.matchField}
                            </span>
                          )}

                        {/* Category pill */}
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-border text-muted-foreground whitespace-nowrap hidden sm:inline-block">
                          {sub.categories[0]}
                        </span>
                      </button>
                    )
                  })
                )}

                {/* Result count */}
                {displayResults.length > 0 && (
                  <div className="px-2 py-1.5 text-[10px] text-muted-foreground border-t mt-1">
                    {query.trim()
                      ? `${displayResults.length} result${displayResults.length !== 1 ? 's' : ''} found`
                      : `${totalFiltered} substances available`}
                    {!query.trim() && (
                      <span className="flex items-center gap-0.5 ml-1">
                        <Keyboard className="h-2.5 w-2.5" />
                        Type to search
                      </span>
                    )}
                  </div>
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

// ─── HIGHLIGHT MATCHED TEXT ──────────────────────────────────────────────────

function HighlightedText({ text, query }: { text: string; query: string }) {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  const index = lowerText.indexOf(lowerQuery)

  if (index === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, index)}
      <span className="font-semibold text-primary">{text.slice(index, index + lowerQuery.length)}</span>
      {text.slice(index + lowerQuery.length)}
    </>
  )
}
