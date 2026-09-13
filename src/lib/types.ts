// Prototype-level data model — mirrors PRD §9. Mock data throughout; no persistence beyond the session.

export type Classification = 'simple' | 'complex'
export type ClassificationSource = 'ai' | 'expert'

export type VenueType = 'Museum' | 'Clinic' | 'Wellness center' | 'Event space' | 'Shopping center' | 'Other'
export type InstallType = 'One-off event' | 'Multi-day' | 'Permanent install'
export type BudgetTier = 'Essential' | 'Signature' | 'Bespoke'
export type DeploymentScope = 'Single room' | 'Multi-room' | 'Multi-site'
export type Visibility = 'Visible / on display' | 'Hidden / concealed'

export interface ExtractedField<T> {
  value: T
  authoredBy: ClassificationSource
  /** true when the AI could not find this in the brief and the customer/expert had to fill it in */
  wasGapFilled: boolean
}

export type ComplianceStandard = 'IFRA compliant' | 'Cruelty-free' | 'Vegan' | 'Clean beauty'

export interface Brief {
  rawText: string
  fileName: string | null
  floorPlanFileName: string | null
  /** Mood board / material / brand photos — informs the fragrance consultant, not the space calculation. */
  referenceImageFileNames: string[]
  venueType: VenueType
  installType: InstallType
  durationLabel: string
  durationDays: number

  concept: ExtractedField<string>
  emotionalIntent: ExtractedField<string>
  /** Plain-language physical feel, e.g. "light and airy" vs. "rich and heavy" — never perfumery jargon. */
  textureIntent: ExtractedField<string>
  spaceSizeSqm: ExtractedField<number | null>
  audienceVolume: ExtractedField<string>
  constraints: ExtractedField<string>
  exclusions: ExtractedField<string>
  brandCues: ExtractedField<string>
  /** Non-binding scent-note hints, same treatment as a free-text fragrance guess — never a formulation instruction. */
  scentsOfInterest: ExtractedField<string[]>
  scentsToAvoid: ExtractedField<string[]>

  visibility: ExtractedField<Visibility | null>
  budgetTier: ExtractedField<BudgetTier | null>
  deploymentScope: ExtractedField<DeploymentScope | null>

  /** Production & compliance — optional, feeds the cost/dosage estimate. */
  maxBudgetPerKg: ExtractedField<number | null>
  expectedVolumeKg: ExtractedField<number | null>
  dosagePercent: ExtractedField<number | null>
  complianceStandards: ComplianceStandard[]

  classification: Classification
  classificationSource: ClassificationSource
}

export interface Machine {
  id: string
  model: string
  priceTierLabel: string
  priceEur: number
  rentalPerWeekEur: number
  visibility: Visibility
  capacityRangeSqm: [number, number]
  reasoning: string
}

export type DirectionStatus = 'draft' | 'pending' | 'confirmed'

export type MediaProvider = 'nano-banana' | 'heygen'
export type VisualMediaKind = 'image' | 'video'
export type VisualGenerationStatus = 'idle' | 'queued' | 'generating' | 'completed' | 'failed'

export interface VisualDirectionMedia {
  provider: MediaProvider
  status: VisualGenerationStatus
  kind: VisualMediaKind
  prompt: string | null
  assetUrl: string | null
  jobId: string | null
  error: string | null
}

export interface FragranceDirection {
  id: string
  label: string
  familyDescription: string
  moodTags: string[]
  status: DirectionStatus
  authoredBy: ClassificationSource
  isAiTopPick: boolean
}

export type CommercialTerm = 'rental' | 'purchase'

export interface ControlZone {
  id: string
  name: string
  intensity: number // 0-100
  on: boolean
  intervalMinutes: number
}

export interface ExpertSignoff {
  technicalConsultantReviewed: boolean
  fragranceConsultantReviewed: boolean
}

export interface Project {
  brief: Brief
  selectedMachineId: string | null
  machineAuthoredBy: ClassificationSource
  directions: FragranceDirection[]
  selectedDirectionId: string | null
  visualDirectionMedia: VisualDirectionMedia
  commercialTerm: CommercialTerm
  signoff: ExpertSignoff
  zones: ControlZone[]
  installedAtDay: number | null
}

export type ScreenId =
  | 'brief-upload'
  | 'ai-analysis'
  | 'suggestion'
  | 'machine'
  | 'expert-review'
  | 'commercial-summary'
  | 'control-dashboard'

export type RoleView = 'customer' | 'expert'
