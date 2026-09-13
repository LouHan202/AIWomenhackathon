import { FixedFooter } from '../components/ui/FixedFooter'
import { useState } from 'react'
import { Building2, Circle, Layers, Crown, Eye, EyeOff, Flower2, House, Sparkles, X, CircleX, Palette, Lightbulb, CheckCircle2, Shield } from 'lucide-react'
import type { LucideIcon as Icon } from 'lucide-react'
import { EditableDetail } from '../components/ui/EditableDetail'
import { useApp } from '../lib/state'
import { Button } from '../components/ui/Button'
import { TextInput } from '../components/ui/Inputs'
import { MAX_SCENT_HINTS, NOTE_FAMILIES } from '../lib/notes'
import type { Brief, BudgetTier, DeploymentScope, ExtractedField, Visibility } from '../lib/types'

function patchField<T>(field: ExtractedField<T>, value: T): ExtractedField<T> {
  return { ...field, value, wasGapFilled: false }
}

const ALL_NOTES = NOTE_FAMILIES.flatMap((f) => f.notes)

const VISIBILITY_OPTIONS: { value: Visibility; label: string; Icon: Icon }[] = [
  { value: 'Visible / on display', label: 'Visible / on display', Icon: Eye },
  { value: 'Hidden / concealed', label: 'Hidden / concealed', Icon: EyeOff },
]

const BUDGET_OPTIONS: { value: BudgetTier; label: string; Icon: Icon }[] = [
  { value: 'Essential', label: 'Essential', Icon: Circle },
  { value: 'Signature', label: 'Signature', Icon: Sparkles },
  { value: 'Bespoke', label: 'Bespoke', Icon: Crown },
]

const DEPLOYMENT_OPTIONS: { value: DeploymentScope; label: string; Icon: Icon }[] = [
  { value: 'Single room', label: 'Single room', Icon: House },
  { value: 'Multi-room', label: 'Multi-room', Icon: Building2 },
  { value: 'Multi-site', label: 'Multi-site', Icon: Layers },
]

function SelectionCards<T extends string>({
  value,
  options,
  onSelect,
  ariaLabel,
}: {
  value: T | null
  options: { value: T; label: string; Icon: Icon }[]
  onSelect: (value: T) => void
  ariaLabel: string
}) {
  return (
    <fieldset data-analysis-gap={value === null || undefined}>
      <legend className="mb-3 flex items-center gap-3 text-base font-medium">{ariaLabel}{value === null && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">not found</span>}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <label key={option.value} className="choice-tile">
            <input className="sr-only" type="radio" name={ariaLabel} checked={value === option.value} onChange={() => onSelect(option.value)} />
            <span className="choice-content"><span className="choice-icon"><option.Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span><span>{option.label}</span></span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/** One removable-chip list (either "drawn to" or "to avoid"), with free-text add and taxonomy suggestions. */
function HintList({
  label,
  values,
  otherListValues,
  variant,
  onAdd,
  onRemove,
}: {
  label: string
  values: string[]
  otherListValues: string[]
  variant: 'interest' | 'avoid'
  onAdd: (note: string) => void
  onRemove: (note: string) => void
}) {
  const [draft, setDraft] = useState('')
  const atCap = values.length >= MAX_SCENT_HINTS

  function submitDraft() {
    const note = draft.trim()
    if (!note || atCap || values.includes(note) || otherListValues.includes(note)) return
    onAdd(note)
    setDraft('')
  }

  const suggestions = ALL_NOTES.filter((n) => !values.includes(n) && !otherListValues.includes(n))

  // "Interest" hints use ink (coral stays CTA-only); "avoid" keeps the semantic red status color.
  const chipTone = variant === 'interest' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-signal-red/50 bg-signal-red/10 text-signal-red'

  return (
    <div>
      <p className="tabular text-right text-xs text-ink-muted">
        {values.length}/{MAX_SCENT_HINTS}
      </p>

      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((note) => (
            <span key={note} className={`group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[14px] ${chipTone}`}>
              {note}
              <button
                type="button"
                aria-label={`Remove ${note}`}
                onClick={() => onRemove(note)}
                className="rounded-full opacity-70 transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex gap-2">
        <TextInput
          aria-label={label}
          value={draft}
          disabled={atCap}
          placeholder={atCap ? `Max ${MAX_SCENT_HINTS} reached` : 'Type a scent and press Enter'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              submitDraft()
            }
          }}
          className="flex-1"
        />

      </div>

      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((note) => (
            <button
              key={note}
              type="button"
              disabled={atCap}
              onClick={() => onAdd(note)}
              className="rounded-full border border-line px-2.5 py-1 text-[14px] text-ink-muted transition-colors duration-150 hover:border-ink/40 hover:text-ink disabled:opacity-40"
            >
              {note}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ScentHintPicker({ brief, onChange }: { brief: Brief; onChange: (patch: Partial<Brief>) => void }) {
  const interest = brief.scentsOfInterest.value
  const avoid = brief.scentsToAvoid.value

  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="text-lg">Scent hints</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Optional — tell us what to lean into and what to avoid.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-signal-green/45 bg-paper p-4">
          <div className="flex items-center gap-2">
            <Flower2 className="h-4 w-4 text-signal-green" />
            <h3 className="text-base font-semibold tracking-normal text-signal-green">Lean into</h3>
          </div>
          
          <div className="mt-3">
            <HintList
              label="Positive cues"
              values={interest}
              otherListValues={avoid}
              variant="interest"
              onAdd={(note) => onChange({ scentsOfInterest: patchField(brief.scentsOfInterest, [...interest, note]) })}
              onRemove={(note) =>
                onChange({ scentsOfInterest: patchField(brief.scentsOfInterest, interest.filter((n) => n !== note)) })
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-signal-red/45 bg-paper p-4">
          <div className="flex items-center gap-2">
            <CircleX className="h-4 w-4 text-signal-red" />
            <h3 className="text-base font-semibold tracking-normal text-signal-red">Avoid</h3>
          </div>
          
          <div className="mt-3">
            <HintList
              label="Avoid cues"
              values={avoid}
              otherListValues={interest}
              variant="avoid"
              onAdd={(note) => onChange({ scentsToAvoid: patchField(brief.scentsToAvoid, [...avoid, note]) })}
              onRemove={(note) => onChange({ scentsToAvoid: patchField(brief.scentsToAvoid, avoid.filter((n) => n !== note)) })}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export function AiAnalysisResults() {
  const { state, dispatch } = useApp()
  const project = state.project!
  const { brief } = project

  function updateFields(patch: Partial<Brief>) {
    for (const key of Object.keys(patch) as (keyof Brief)[]) {
      dispatch({ type: 'UPDATE_FIELD', field: key, value: patch[key] })
    }
  }

  const requiredGapsFilled =
    brief.visibility.value !== null && brief.budgetTier.value !== null && brief.deploymentScope.value !== null

  const groups = [
    { title: 'The concept', Icon: Palette, fields: [
      { key: 'concept', label: 'Concept / theme', placeholder: 'Describe the story behind your space.' },
      { key: 'emotionalIntent', label: 'Emotional intent', placeholder: 'e.g. calm, welcoming' },
      { key: 'textureIntent', label: 'Physical texture / feel', placeholder: 'e.g. light and airy, rich and heavy' },
    ] },
    { title: 'The space', Icon: Building2, fields: [
      { key: 'spaceSizeSqm', label: 'Space size (m²)', placeholder: 'Add the approximate area in square metres.' },
      { key: 'audienceVolume', label: 'Audience volume / flow', placeholder: 'e.g. 800 visitors per day' },
    ] },
    { title: 'Considerations', Icon: Shield, fields: [
      { key: 'constraints', label: 'Existing constraints', placeholder: 'HVAC, cooling, airflow — or enter None.' },
      { key: 'exclusions', label: 'Exclusions: what to avoid', placeholder: 'e.g. nothing sweet or gourmand — or enter None.' },
    ] },
  ] as const
  const isMissing = (key: typeof groups[number]['fields'][number]['key']) => {
    const field = brief[key]
    return field.wasGapFilled || field.value === null || String(field.value).trim() === ''
  }
  const missingCore = groups.reduce((count, group) => count + group.fields.filter(({ key }) => isMissing(key)).length, 0)
  const missingChoices = [brief.visibility, brief.budgetTier, brief.deploymentScope].filter((field) => field.value === null).length
  const missingCount = missingCore + missingChoices
  const found = 10 - missingCount

  return (
    <main className="mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)]">Here's what we understood</h1>
      </div>
      <p className="mt-3 text-base leading-7 text-ink-muted">Everything is editable. We've flagged the gaps so you can fill them in rather than have us guess.</p>
      <div className={`sticky top-0 z-30 mt-8 flex flex-wrap items-center gap-4 rounded-2xl border p-5 ${missingCount === 0 ? 'border-signal-green/45 bg-[color-mix(in_oklab,var(--color-signal-green)_10%,var(--color-paper))]' : 'border-amber-200 bg-amber-50'}`}>
        {missingCount === 0 ? (
          <CheckCircle2 size={25} className="shrink-0 text-signal-green" aria-hidden="true" />
        ) : (
          <Lightbulb size={25} className="shrink-0 text-amber-600" aria-hidden="true" />
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-sm ${missingCount === 0 ? 'text-signal-green' : 'text-amber-900'}`}>
            <strong>{found} of 10 details ready.</strong> {missingCount ? `${missingCount} detail${missingCount === 1 ? '' : 's'} to review.` : 'Your brief is ready to explore.'}
          </p>
          <progress aria-label="Brief details completed" max={10} value={found} className={`mt-3 h-2 w-full ${missingCount === 0 ? 'accent-signal-green' : 'accent-amber-500'}`} />
        </div>
        {missingCount > 0 && <Button variant="secondary" onClick={() => { const gap = document.querySelector('[data-analysis-gap]'); gap?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' }); (gap?.querySelector('button, input') as HTMLElement | null)?.focus({ preventScroll: true }) }}>Fill the gap</Button>}
      </div>
      {groups.map(({ title, Icon, fields }) => (
        <section key={title} className="mt-8">
          <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-wide"><Icon size={23} strokeWidth={1.7} aria-hidden="true" />{title}{fields.some(({ key }) => isMissing(key)) && <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-normal normal-case tracking-normal text-amber-800">{fields.filter(({ key }) => isMissing(key)).length} to add</span>}</h2>
          <div className={`overflow-hidden rounded-2xl border border-line ${title !== 'The concept' ? 'analysis-detail-pair grid sm:grid-cols-2' : 'analysis-concept-grid grid sm:grid-cols-2'}`}>
            {fields.map(({ key, label, placeholder }) => <EditableDetail key={key} label={label} value={String(brief[key].value ?? '')} missing={isMissing(key)} placeholder={placeholder} numeric={key === 'spaceSizeSqm'} onSave={(value) => {
              if (key === 'spaceSizeSqm') updateFields({ spaceSizeSqm: patchField(brief.spaceSizeSqm, Number(value)) })
              else updateFields({ [key]: patchField(brief[key], value) })
            }} />)}
          </div>
        </section>
      ))}
      <ScentHintPicker brief={brief} onChange={updateFields} />
      <section className="mt-9 space-y-6 border-t border-line pt-8">
        <div><h2 className="text-lg">A few more details</h2><p className="mt-1 text-sm text-ink-muted">Pick what fits your space and plans.</p></div>
        <SelectionCards value={brief.visibility.value} options={VISIBILITY_OPTIONS} ariaLabel="Machine placement" onSelect={(value) => updateFields({ visibility: patchField(brief.visibility, value) })} />
        <SelectionCards value={brief.budgetTier.value} options={BUDGET_OPTIONS} ariaLabel="Budget tier" onSelect={(value) => updateFields({ budgetTier: patchField(brief.budgetTier, value) })} />
        <SelectionCards value={brief.deploymentScope.value} options={DEPLOYMENT_OPTIONS} ariaLabel="Deployment scope" onSelect={(value) => updateFields({ deploymentScope: patchField(brief.deploymentScope, value) })} />
      </section>

      <FixedFooter>
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'brief-upload' })}
          >
            Back
          </Button>
          <Button
            variant="primary"
            disabled={!requiredGapsFilled}
            onClick={() => dispatch({ type: 'GENERATE_SUGGESTIONS' })}
          >
            Continue to suggestions
          </Button>
      </FixedFooter>
    </main>
  )
}
