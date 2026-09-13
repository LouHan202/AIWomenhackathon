import { useState } from 'react'
import { Plus, X } from '@phosphor-icons/react'
import { useApp } from '../lib/state'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { Select, TextArea, TextInput } from '../components/ui/Inputs'
import { Tag } from '../components/ui/Tag'
import { MAX_SCENT_HINTS, NOTE_FAMILIES } from '../lib/notes'
import type { Brief, BudgetTier, ComplianceStandard, DeploymentScope, ExtractedField, Visibility } from '../lib/types'

function patchField<T>(field: ExtractedField<T>, value: T): ExtractedField<T> {
  return { ...field, value, wasGapFilled: false }
}

const DOSAGE_OPTIONS = [5, 10, 15, 20, 25]
const COMPLIANCE_OPTIONS: ComplianceStandard[] = ['IFRA compliant', 'Cruelty-free', 'Vegan', 'Clean beauty']
const ALL_NOTES = NOTE_FAMILIES.flatMap((f) => f.notes)

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
  const chipTone = variant === 'interest' ? 'border-ink/30 bg-ink/5 text-ink' : 'border-signal-red/50 bg-signal-red/10 text-signal-red'

  return (
    <div>
      <p className="tabular text-xs uppercase tracking-[0.08em] text-ink-muted">
        {label} ({values.length}/{MAX_SCENT_HINTS})
      </p>

      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map((note) => (
            <span key={note} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${chipTone}`}>
              {note}
              <button
                type="button"
                aria-label={`Remove ${note}`}
                onClick={() => onRemove(note)}
                className="rounded-full transition-opacity duration-150 hover:opacity-70"
              >
                <X className="h-3 w-3" weight="bold" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-2 flex gap-2">
        <TextInput
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
        <Button variant="secondary" className="rounded-full px-3 py-2" disabled={atCap || !draft.trim()} onClick={submitDraft}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {suggestions.map((note) => (
            <button
              key={note}
              type="button"
              disabled={atCap}
              onClick={() => onAdd(note)}
              className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-muted transition-colors duration-150 hover:border-ink/40 hover:text-ink disabled:opacity-40"
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
    <Card>
      <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Scent hints (optional)</p>
      <p className="mt-1 text-xs text-ink-muted">
        Pick from the suggestions or type your own. These are hints for the fragrance consultant, never a
        final ingredient list.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <HintList
          label="Drawn to"
          values={interest}
          otherListValues={avoid}
          variant="interest"
          onAdd={(note) => onChange({ scentsOfInterest: patchField(brief.scentsOfInterest, [...interest, note]) })}
          onRemove={(note) =>
            onChange({ scentsOfInterest: patchField(brief.scentsOfInterest, interest.filter((n) => n !== note)) })
          }
        />
        <HintList
          label="To avoid"
          values={avoid}
          otherListValues={interest}
          variant="avoid"
          onAdd={(note) => onChange({ scentsToAvoid: patchField(brief.scentsToAvoid, [...avoid, note]) })}
          onRemove={(note) => onChange({ scentsToAvoid: patchField(brief.scentsToAvoid, avoid.filter((n) => n !== note)) })}
        />
      </div>
    </Card>
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

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Step 2 of 5</p>
          <h1 className="mt-3 text-[clamp(1.75rem,3vw+1rem,2.5rem)]">What we read from your brief</h1>
        </div>
        <Tag kind={brief.classification === 'complex' ? 'amber' : 'green'}>
          {brief.classification === 'complex' ? 'Needs expert review' : 'Straightforward request'}
        </Tag>
      </div>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        Everything below is editable. Anything we couldn't find in your brief is flagged so you can fill it
        in rather than have us guess.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card>
          <Field label="Concept / theme" gapFilled={brief.concept.wasGapFilled}>
            <TextArea
              rows={2}
              value={brief.concept.value}
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'concept', value: patchField(brief.concept, e.target.value) })}
            />
          </Field>
        </Card>
        <Card>
          <Field label="Emotional intent" gapFilled={brief.emotionalIntent.wasGapFilled}>
            <TextInput
              value={brief.emotionalIntent.value}
              placeholder="e.g. calm, welcoming"
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'emotionalIntent', value: patchField(brief.emotionalIntent, e.target.value) })}
            />
          </Field>
        </Card>
        <Card>
          <Field label="Space size (m²)" gapFilled={brief.spaceSizeSqm.wasGapFilled}>
            <TextInput
              type="number"
              value={brief.spaceSizeSqm.value ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'spaceSizeSqm',
                  value: patchField(brief.spaceSizeSqm, e.target.value ? Number(e.target.value) : null),
                })
              }
            />
          </Field>
        </Card>
        <Card>
          <Field label="Audience volume / flow" gapFilled={brief.audienceVolume.wasGapFilled}>
            <TextInput
              value={brief.audienceVolume.value}
              placeholder="e.g. 800 per day"
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'audienceVolume', value: patchField(brief.audienceVolume, e.target.value) })}
            />
          </Field>
        </Card>
        <Card>
          <Field label="Physical texture / feel">
            <TextInput
              value={brief.textureIntent.value}
              placeholder="e.g. light and airy, rich and heavy"
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'textureIntent', value: patchField(brief.textureIntent, e.target.value) })}
            />
          </Field>
        </Card>
        <Card>
          <Field label="Existing constraints" gapFilled={brief.constraints.wasGapFilled}>
            <TextInput
              value={brief.constraints.value}
              placeholder="HVAC, cooling, airflow"
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'constraints', value: patchField(brief.constraints, e.target.value) })}
            />
          </Field>
        </Card>
        <Card>
          <Field label="Exclusions: what to avoid" gapFilled={brief.exclusions.wasGapFilled}>
            <TextInput
              value={brief.exclusions.value}
              placeholder="e.g. nothing sweet or gourmand"
              onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'exclusions', value: patchField(brief.exclusions, e.target.value) })}
            />
          </Field>
        </Card>
      </div>

      <div className="mt-5">
        <ScentHintPicker brief={brief} onChange={updateFields} />
      </div>

      <h2 className="mt-12 text-sm uppercase tracking-[0.1em] text-ink-muted">We need a few more details</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card className="border-ink/20">
          <Field label="Machine placement" gapFilled={brief.visibility.wasGapFilled}>
            <Select
              value={brief.visibility.value ?? ''}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'visibility', value: patchField(brief.visibility, e.target.value as Visibility) })
              }
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="Visible / on display">Visible / on display</option>
              <option value="Hidden / concealed">Hidden / concealed</option>
            </Select>
          </Field>
        </Card>
        <Card className="border-ink/20">
          <Field label="Budget tier" gapFilled={brief.budgetTier.wasGapFilled}>
            <Select
              value={brief.budgetTier.value ?? ''}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_FIELD', field: 'budgetTier', value: patchField(brief.budgetTier, e.target.value as BudgetTier) })
              }
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="Essential">Essential</option>
              <option value="Signature">Signature</option>
              <option value="Bespoke">Bespoke</option>
            </Select>
          </Field>
        </Card>
        <Card className="border-ink/20">
          <Field label="Deployment scope" gapFilled={brief.deploymentScope.wasGapFilled}>
            <Select
              value={brief.deploymentScope.value ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'deploymentScope',
                  value: patchField(brief.deploymentScope, e.target.value as DeploymentScope),
                })
              }
            >
              <option value="" disabled>
                Choose one
              </option>
              <option value="Single room">Single room</option>
              <option value="Multi-room">Multi-room</option>
              <option value="Multi-site">Multi-site</option>
            </Select>
          </Field>
        </Card>
      </div>

      <h2 className="mt-12 text-sm uppercase tracking-[0.1em] text-ink-muted">Production &amp; compliance (optional)</h2>
      <Card className="mt-4">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Max budget per kg (€)" hint="Shapes the fragrance consultant's cost ceiling">
            <TextInput
              type="number"
              min={0}
              value={brief.maxBudgetPerKg.value ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'maxBudgetPerKg',
                  value: patchField(brief.maxBudgetPerKg, e.target.value ? Number(e.target.value) : null),
                })
              }
            />
          </Field>
          <Field label="Expected oil volume (kg)">
            <TextInput
              type="number"
              min={0}
              value={brief.expectedVolumeKg.value ?? ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'expectedVolumeKg',
                  value: patchField(brief.expectedVolumeKg, e.target.value ? Number(e.target.value) : null),
                })
              }
            />
          </Field>
        </div>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Preferred dosage</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {DOSAGE_OPTIONS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'dosagePercent',
                    value: patchField(brief.dosagePercent, brief.dosagePercent.value === pct ? null : pct),
                  })
                }
                className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors duration-150 ${
                  brief.dosagePercent.value === pct
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line text-ink-muted hover:border-ink/40 hover:text-ink'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Compliance standards</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {COMPLIANCE_OPTIONS.map((standard) => (
              <label key={standard} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={brief.complianceStandards.includes(standard)}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_FIELD',
                      field: 'complianceStandards',
                      value: e.target.checked
                        ? [...brief.complianceStandards, standard]
                        : brief.complianceStandards.filter((s) => s !== standard),
                    })
                  }
                  className="h-4 w-4 rounded border-line accent-ink"
                />
                {standard}
              </label>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-10 flex justify-end">
        <Button
          variant="primary"
          disabled={!requiredGapsFilled}
          onClick={() => dispatch({ type: 'GENERATE_SUGGESTIONS' })}
        >
          Continue to suggestions
        </Button>
      </div>
    </main>
  )
}
