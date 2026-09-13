import type { Brief, Classification, InstallType, VenueType } from './types'

// Mock AI extraction — deliberately simple keyword/regex heuristics standing in for a real
// perceptual model. PRD §5/§8: never silently assume, always flag what's missing.

const EMOTION_WORDS = [
  'calm', 'calming', 'energetic', 'energising', 'energizing', 'luxurious', 'playful',
  'clinical', 'fresh', 'cozy', 'cosy', 'mysterious', 'welcoming', 'clean', 'soothing',
  'nostalgic', 'uplifting', 'focused', 'reassuring',
]

// Plain-language physical texture/feel — never perfumery jargon in the customer-facing label.
const TEXTURE_PHRASES = [
  'light and airy', 'rich and heavy', 'soft and powdery', 'clean and crisp', 'warm and enveloping',
  'airy', 'heavy', 'powdery', 'crisp', 'enveloping',
]

const COMPLEX_SIGNALS = [
  'artwork', 'sculpture', 'exhibit', 'exhibition', 'installation', 'architecture',
  'brand identity', 'brand world', 'campaign', 'corporate identity',
]

const CONSTRAINT_WORDS = ['hvac', 'airflow', 'ventilation', 'air handling', 'cooling', 'ac unit', 'air conditioning']

function findFirstMatch(text: string, words: string[]): string | null {
  const lower = text.toLowerCase()
  const hit = words.find((w) => lower.includes(w))
  return hit ?? null
}

function extractSpaceSize(text: string): number | null {
  const match = text.match(/(\d{2,4})\s?(?:m2|m²|sq\.?\s?m|square met(?:er|re)s?)/i)
  return match ? Number(match[1]) : null
}

function extractAudience(text: string): string | null {
  const match = text.match(/(\d[\d,]{1,6})\s*(?:visitors|guests|attendees|people)(?:\s*(?:per|\/)\s*(day|week|month))?/i)
  if (!match) return null
  return match[2] ? `${match[1]} ${match[2] === 'day' ? 'per day' : match[2] === 'week' ? 'per week' : 'per month'}` : `${match[1]} total`
}

// Prefer explicit "avoid/without" phrasing over a bare "not X" — the latter false-positives on
// ordinary negation elsewhere in the sentence (e.g. "calming, not clinical" describing a feeling,
// not a boundary), so it's tried last.
function extractExclusions(text: string): string | null {
  const patterns = [/avoid(?:ing)?\s+([a-z][a-z\s-]{2,60})/i, /without\s+([a-z][a-z\s-]{2,60})/i, /\bno\s+([a-z][a-z\s-]{2,60})/i]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[0].trim().replace(/\s+/g, ' ')
  }
  return null
}

function extractConcept(text: string): string {
  const firstSentence = text.split(/[.!\n]/)[0]?.trim()
  return firstSentence && firstSentence.length > 4 ? firstSentence : text.trim().slice(0, 80)
}

export interface BriefFormInput {
  rawText: string
  fileName: string | null
  floorPlanFileName: string | null
  referenceImageFileNames: string[]
  venueType: VenueType
  installType: InstallType
  durationLabel: string
  durationDays: number
}

export function parseBrief(input: BriefFormInput): Brief {
  const { rawText } = input
  const emotion = findFirstMatch(rawText, EMOTION_WORDS)
  const texture = findFirstMatch(rawText, TEXTURE_PHRASES)
  const constraint = findFirstMatch(rawText, CONSTRAINT_WORDS)
  const exclusion = extractExclusions(rawText)
  const spaceSize = extractSpaceSize(rawText)
  const audience = extractAudience(rawText)

  const hasComplexSignal = COMPLEX_SIGNALS.some((w) => rawText.toLowerCase().includes(w))
  const classification: Classification =
    hasComplexSignal || Boolean(input.floorPlanFileName) ? 'complex' : 'simple'

  return {
    rawText,
    fileName: input.fileName,
    floorPlanFileName: input.floorPlanFileName,
    referenceImageFileNames: input.referenceImageFileNames,
    venueType: input.venueType,
    installType: input.installType,
    durationLabel: input.durationLabel,
    durationDays: input.durationDays,

    concept: { value: extractConcept(rawText), authoredBy: 'ai', wasGapFilled: false },
    emotionalIntent: { value: emotion ?? '', authoredBy: 'ai', wasGapFilled: emotion === null },
    textureIntent: { value: texture ?? '', authoredBy: 'ai', wasGapFilled: false },
    spaceSizeSqm: { value: spaceSize, authoredBy: 'ai', wasGapFilled: spaceSize === null },
    audienceVolume: { value: audience ?? '', authoredBy: 'ai', wasGapFilled: audience === null },
    constraints: { value: constraint ?? '', authoredBy: 'ai', wasGapFilled: constraint === null },
    exclusions: { value: exclusion ?? '', authoredBy: 'ai', wasGapFilled: exclusion === null },
    brandCues: { value: hasComplexSignal ? 'Referenced in brief' : '', authoredBy: 'ai', wasGapFilled: false },
    scentsOfInterest: { value: [], authoredBy: 'ai', wasGapFilled: false },
    scentsToAvoid: { value: [], authoredBy: 'ai', wasGapFilled: false },

    visibility: { value: null, authoredBy: 'ai', wasGapFilled: true },
    budgetTier: { value: null, authoredBy: 'ai', wasGapFilled: true },
    deploymentScope: { value: null, authoredBy: 'ai', wasGapFilled: true },

    maxBudgetPerKg: { value: null, authoredBy: 'ai', wasGapFilled: false },
    expectedVolumeKg: { value: null, authoredBy: 'ai', wasGapFilled: false },
    dosagePercent: { value: null, authoredBy: 'ai', wasGapFilled: false },
    complianceStandards: [],

    classification,
    classificationSource: 'ai',
  }
}
