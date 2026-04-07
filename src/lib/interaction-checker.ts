// Interaction Checker Engine
// Checks drug-drug interactions between selected substances using
// per-substance interaction data and curated dangerous interaction pairs.

import { substances, getSubstanceById } from '@/lib/substances/index';
import { dangerousInteractions } from '@/lib/harm-reduction-data';
import type { Substance } from '@/lib/types';

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type InteractionSeverity = 'dangerous' | 'unsafe' | 'uncertain';

export interface InteractionResult {
  substanceA: string;       // Substance name A
  substanceB: string;       // Substance name B
  severity: InteractionSeverity;
  matchedTerms: string[];   // All interaction strings that matched
  sources: string[];        // Where matches came from
  description?: string;     // Enriched description from curated data
}

export interface CrossToleranceResult {
  tolerance: string;        // e.g., "serotonergic"
  substances: string[];     // Substance names that share this tolerance
}

export interface InteractionCheckResult {
  pairs: InteractionResult[];
  crossTolerances: CrossToleranceResult[];
  summary: {
    dangerous: number;
    unsafe: number;
    uncertain: number;
    total: number;
  };
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

/** Escape special regex characters */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build searchable keywords from a substance for fuzzy matching */
function getSubstanceKeywords(sub: Substance): string[] {
  return [
    sub.name,
    sub.class,
    ...(sub.categories || []),
    ...(sub.commonNames || []),
    ...(sub.aliases || []),
  ]
    .filter(Boolean)
    .map((s: string) => s.toLowerCase())
    .filter((s: string) => s !== 'other' && s.length > 1);
}

/** Check if any interaction string from a list matches against any keyword */
function matchInteractionList(
  interactionList: string[],
  keywords: string[]
): string | null {
  for (const interactionStr of interactionList) {
    const interactionLower = interactionStr.toLowerCase();
    for (const keyword of keywords) {
      try {
        // Use word boundary matching for multi-char keywords to avoid
        // false positives like "meth" matching inside "tramadol"
        if (keyword.length > 2) {
          const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i');
          if (regex.test(interactionLower)) {
            return interactionStr;
          }
        } else {
          // Short keywords use simple includes (acceptable for short strings)
          if (interactionLower.includes(keyword)) {
            return interactionStr;
          }
        }
      } catch {
        // Regex construction failed — skip this keyword rather than
        // falling back to loose substring matching
      }
    }
  }
  return null;
}

/** Check if two substance keywords overlap in any meaningful way */
function keywordsOverlap(kwA: string[], kwB: string[]): string | null {
  for (const a of kwA) {
    for (const b of kwB) {
      if (a === b && a.length > 2) return a;
      // Check if one is a significant substring of the other
      if (a.length > 4 && b.includes(a)) return a;
      if (b.length > 4 && a.includes(b)) return b;
    }
  }
  return null;
}

/** Consolidate interaction pairs — merge same pair+severity into one result */
function consolidatePairs(pairs: InteractionResult[]): InteractionResult[] {
  const map = new Map<string, InteractionResult>();
  for (const pair of pairs) {
    // Normalize key so A+B and B+A are the same
    const names = [pair.substanceA, pair.substanceB].sort();
    const key = `${names[0]}|${names[1]}|${pair.severity}`;
    const existing = map.get(key);
    if (existing) {
      // Merge matched terms and sources, deduplicating
      for (const term of pair.matchedTerms) {
        if (!existing.matchedTerms.includes(term)) existing.matchedTerms.push(term);
      }
      for (const src of pair.sources) {
        if (!existing.sources.includes(src)) existing.sources.push(src);
      }
      // Prefer curated description
      if (pair.description && !existing.description) existing.description = pair.description;
    } else {
      map.set(key, { ...pair });
    }
  }
  return Array.from(map.values());
}

/** Get a substance by ID or name fallback */
function resolveSubstance(id: string): Substance | undefined {
  return getSubstanceById(id) ?? substances.find(
    (s) => s.name.toLowerCase() === id.toLowerCase()
  );
}

// ─── CURATED PAIR MATCHING ──────────────────────────────────────────────────

/** Check curated dangerous interaction pairs against selected substances */
function checkCuratedPairs(
  selectedSubs: Substance[]
): InteractionResult[] {
  const results: InteractionResult[] = [];

  if (selectedSubs.length < 2) return results;

  // Build a pool of all keywords from all selected substances
  const allKeywordsBySub = selectedSubs.map((sub) => ({
    sub,
    keywords: getSubstanceKeywords(sub),
  }));

  for (const curated of dangerousInteractions) {
    // Check if at least 2 selected substances match this curated pair
    const matchedSubs: Substance[] = [];

    for (const { sub, keywords } of allKeywordsBySub) {
      // Check if any curated substance string matches this substance's keywords
      for (const curatedSub of curated.substances) {
        const curatedLower = curatedLower_normalized(curatedSub);
        const matches = keywords.some(
          (kw) =>
            kw === curatedLower ||
            kw.includes(curatedLower) ||
            curatedLower.includes(kw)
        );
        if (matches && !matchedSubs.includes(sub)) {
          matchedSubs.push(sub);
          break;
        }
      }
    }

    // Need at least 2 matched substances for this curated interaction to apply
    if (matchedSubs.length >= 2) {
      // Map curated risk to severity
      let severity: InteractionSeverity;
      if (curated.risk === 'fatal') severity = 'dangerous';
      else if (curated.risk === 'high') severity = 'unsafe';
      else severity = 'uncertain';

      // Generate pair combinations
      for (let i = 0; i < matchedSubs.length; i++) {
        for (let j = i + 1; j < matchedSubs.length; j++) {
          results.push({
            substanceA: matchedSubs[i].name,
            substanceB: matchedSubs[j].name,
            severity,
            matchedTerms: [curated.substances.join(' + ')],
            sources: ['curated'],
            description: curated.description,
          });
        }
      }
    }
  }

  return results;
}

/** Normalize a curated substance string for matching */
function curatedLower_normalized(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// ─── MAIN CHECK FUNCTION ───────────────────────────────────────────────────

/**
 * Check interactions between a list of substance IDs.
 * Returns all interaction pairs, cross-tolerances, and a summary.
 */
export function checkInteractions(substanceIds: string[]): InteractionCheckResult {
  const pairs: InteractionResult[] = [];
  const crossToleranceMap = new Map<string, string[]>();

  // Resolve substances
  const resolvedSubs = substanceIds
    .map((id) => resolveSubstance(id))
    .filter(Boolean) as Substance[];

  if (resolvedSubs.length < 2) {
    return { pairs: [], crossTolerances: [], summary: { dangerous: 0, unsafe: 0, uncertain: 0, total: 0 } };
  }

  // ── 1. Pairwise substance interaction checking ──
  for (let i = 0; i < resolvedSubs.length; i++) {
    for (let j = i + 1; j < resolvedSubs.length; j++) {
      const subA = resolvedSubs[i];
      const subB = resolvedSubs[j];
      const kwA = getSubstanceKeywords(subA);
      const kwB = getSubstanceKeywords(subB);

      // Check A's interactions against B's keywords (forward)
      const severityOrder: InteractionSeverity[] = ['dangerous', 'unsafe', 'uncertain'];

      for (const severity of severityOrder) {
        const interactionList = subA.interactions[severity] || [];
        const match = matchInteractionList(interactionList, kwB);
        if (match) {
          pairs.push({
            substanceA: subA.name,
            substanceB: subB.name,
            severity,
            matchedTerms: [match],
            sources: ['substance-a'],
          });
        }
      }

      // Check B's interactions against A's keywords (reverse)
      for (const severity of severityOrder) {
        const interactionList = subB.interactions[severity] || [];
        const match = matchInteractionList(interactionList, kwA);
        if (match) {
          pairs.push({
            substanceA: subA.name,
            substanceB: subB.name,
            severity,
            matchedTerms: [match],
            sources: ['substance-b'],
          });
        }
      }
    }
  }

  // ── 2. Curated dangerous interaction pairs ──
  const curatedResults = checkCuratedPairs(resolvedSubs);
  pairs.push(...curatedResults);

  // ── 3. Cross-tolerance analysis ──
  for (const sub of resolvedSubs) {
    for (const tolerance of sub.interactions.crossTolerances || []) {
      const tolLower = tolerance.toLowerCase();
      if (!crossToleranceMap.has(tolLower)) {
        crossToleranceMap.set(tolLower, []);
      }
      const list = crossToleranceMap.get(tolLower)!;
      if (!list.includes(sub.name)) {
        list.push(sub.name);
      }
    }
  }

  // Only include cross-tolerances shared by 2+ substances
  const crossTolerances: CrossToleranceResult[] = [];
  for (const [tolerance, subs] of crossToleranceMap) {
    if (subs.length >= 2) {
      crossTolerances.push({ tolerance, substances: subs });
    }
  }

  // ── 4. Consolidate and sort ──
  const consolidatedPairs = consolidatePairs(pairs);

  // Sort: dangerous first, then unsafe, then uncertain
  const severityOrder: Record<InteractionSeverity, number> = {
    dangerous: 0,
    unsafe: 1,
    uncertain: 2,
  };
  consolidatedPairs.sort((a, b) => {
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    // Within same severity, prefer curated results (they have descriptions)
    if (a.sources.includes('curated') && !b.sources.includes('curated')) return -1;
    if (!a.sources.includes('curated') && b.sources.includes('curated')) return 1;
    return a.substanceA.localeCompare(b.substanceA);
  });

  // ── 5. Summary ──
  const summary = {
    dangerous: consolidatedPairs.filter((p) => p.severity === 'dangerous').length,
    unsafe: consolidatedPairs.filter((p) => p.severity === 'unsafe').length,
    uncertain: consolidatedPairs.filter((p) => p.severity === 'uncertain').length,
    total: consolidatedPairs.length,
  };

  return {
    pairs: consolidatedPairs,
    crossTolerances: crossTolerances.sort((a, b) => a.tolerance.localeCompare(b.tolerance)),
    summary,
  };
}

/**
 * Quick check: get all interactions for a single substance
 * (useful for the substance detail view).
 */
export function getSubstanceInteractions(
  substanceId: string
): { dangerous: string[]; unsafe: string[]; uncertain: string[]; crossTolerances: string[] } {
  const sub = resolveSubstance(substanceId);
  if (!sub) return { dangerous: [], unsafe: [], uncertain: [], crossTolerances: [] };
  return {
    dangerous: sub.interactions.dangerous || [],
    unsafe: sub.interactions.unsafe || [],
    uncertain: sub.interactions.uncertain || [],
    crossTolerances: sub.interactions.crossTolerances || [],
  };
}
