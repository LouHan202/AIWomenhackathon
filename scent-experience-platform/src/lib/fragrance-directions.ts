import type { ClassificationSource, FragranceDirection } from './types'
import { truncateWords } from './text'

// Mood families the mock Olfactory heuristic can reach for. Never a specific SKU/note claim —
// per PRD §7.3 the customer card stays at mood/family description, never a final formula.
// Templates avoid grammatically embedding the raw brief sentence — free text doesn't compose
// safely mid-sentence (capitalization, articles), so it's quoted as a trailing reference instead.
const FAMILIES: { tag: string; describe: (emotion: string) => string }[] = [
  {
    tag: 'Green & mineral',
    describe: (e) => `A cool, mineral-green opening that stays out of the way rather than announcing itself. Reads ${e || 'calm'}.`,
  },
  {
    tag: 'Warm woody-amber',
    describe: (e) => `A low, warm woody-amber base built for longer visits, grounding rather than sharp. Reads ${e || 'settled'}.`,
  },
  {
    tag: 'Bright citrus-floral',
    describe: (e) => `Bright citrus lifted by a soft floral heart, an energetic first impression. Reads ${e || 'uplifting'}.`,
  },
  {
    tag: 'Soft musk & linen',
    describe: (e) => `A quiet, skin-close musk-and-linen accord, near-neutral rather than decorative. Reads ${e || 'reassuring'}.`,
  },
  {
    tag: 'Smoked resin & spice',
    describe: (e) => `Smoked resin with a thread of dry spice, heavier and more theatrical. Reads ${e || 'bold'}, wants to be noticed.`,
  },
]

let directionCounter = 0

export function generateDirectionCandidates(
  concept: string,
  emotionalIntent: string,
  count: 1 | 3,
  authoredBy: ClassificationSource = 'ai',
): FragranceDirection[] {
  const conceptClip = truncateWords(concept, 8)
  const picks = FAMILIES.slice(0, count)
  return picks.map((family, i) => {
    directionCounter += 1
    const base = family.describe(emotionalIntent)
    return {
      id: `dir-${directionCounter}`,
      label: family.tag,
      familyDescription: conceptClip ? `${base} Keyed to your brief: "${conceptClip}"` : base,
      moodTags: [emotionalIntent || 'directional', family.tag],
      status: 'pending',
      authoredBy,
      isAiTopPick: i === 0,
    }
  })
}
