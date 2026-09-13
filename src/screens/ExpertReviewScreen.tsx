import { useState } from 'react'
import { useApp } from '../lib/state'
import { MACHINE_CATALOG } from '../lib/machines'
import { generateDirectionCandidates } from '../lib/fragrance-directions'
import { truncateWords } from '../lib/text'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Field } from '../components/ui/Field'
import { Select, TextArea, TextInput } from '../components/ui/Inputs'
import { Switch } from '../components/ui/Switch'
import { Tag } from '../components/ui/Tag'

export function ExpertReviewScreen() {
  const { state, dispatch } = useApp()
  const project = state.project!
  const [draftLabel, setDraftLabel] = useState('')
  const [draftText, setDraftText] = useState('')

  if (project.directions.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="text-sm text-ink-muted">
          This project hasn't reached the analysis step yet. There's nothing to review until the client's
          brief has been processed.
        </p>
      </main>
    )
  }

  const machine = MACHINE_CATALOG.find((m) => m.id === project.selectedMachineId)!
  const bothSignedOff = project.signoff.technicalConsultantReviewed && project.signoff.fragranceConsultantReviewed
  const canConfirm = bothSignedOff && Boolean(project.selectedDirectionId)

  function addExpertDraft() {
    if (!draftLabel.trim() || !draftText.trim()) return
    const [fresh] = generateDirectionCandidates(draftLabel, draftText, 1, 'expert')
    dispatch({
      type: 'ADD_DIRECTION',
      direction: { ...fresh, label: draftLabel, familyDescription: draftText, isAiTopPick: false },
    })
    setDraftLabel('')
    setDraftText('')
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-ink-muted">Internal review</p>
          <h1 className="mt-1 text-2xl">{truncateWords(project.brief.concept.value, 9) || 'Untitled brief'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Tag kind={project.brief.classification === 'complex' ? 'amber' : 'green'}>
            {project.brief.classification === 'complex' ? 'Needs expert review' : 'Straightforward request'}
          </Tag>
          <Select
            className="w-auto py-1.5 text-xs"
            value={project.brief.classification}
            onChange={(e) => dispatch({ type: 'OVERRIDE_CLASSIFICATION', classification: e.target.value as 'simple' | 'complex' })}
          >
            <option value="simple">Mark straightforward</option>
            <option value="complex">Escalate to expert review</option>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Machine (Technical Consultant)</h2>
              <Tag kind={project.machineAuthoredBy === 'expert' ? 'expert' : 'ai'}>
                {project.machineAuthoredBy === 'expert' ? 'Expert' : 'AI'} suggested
              </Tag>
            </div>
            <Card className="mt-3">
              <Field label="Selected model">
                <Select
                  value={project.selectedMachineId ?? ''}
                  onChange={(e) => dispatch({ type: 'SELECT_MACHINE', machineId: e.target.value })}
                >
                  {MACHINE_CATALOG.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.model}, {m.priceTierLabel} tier, fits {m.capacityRangeSqm[0]} to {m.capacityRangeSqm[1]}m²
                    </option>
                  ))}
                </Select>
              </Field>
              <p className="mt-3 text-xs text-ink-muted">{machine.reasoning}</p>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Fragrance direction (Fragrance Consultant)</h2>
            <div className="mt-3 space-y-3">
              {project.directions.map((d) => (
                <Card key={d.id} className={d.id === project.selectedDirectionId ? 'border-ink' : ''}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          className="w-full rounded border-none bg-transparent p-0 text-sm font-medium text-ink focus-visible:outline-none"
                          value={d.label}
                          onChange={(e) =>
                            dispatch({ type: 'EDIT_DIRECTION', directionId: d.id, patch: { label: e.target.value }, authoredBy: 'expert' })
                          }
                        />
                        <Tag kind={d.authoredBy === 'expert' ? 'expert' : 'ai'}>
                          {d.authoredBy === 'expert' ? 'Expert edit' : 'AI'}
                        </Tag>
                        {d.status === 'confirmed' && <Tag kind="green">Confirmed</Tag>}
                      </div>
                      <TextArea
                        rows={2}
                        value={d.familyDescription}
                        onChange={(e) =>
                          dispatch({
                            type: 'EDIT_DIRECTION',
                            directionId: d.id,
                            patch: { familyDescription: e.target.value },
                            authoredBy: 'expert',
                          })
                        }
                      />
                    </div>
                    <Button
                      variant={d.id === project.selectedDirectionId ? 'secondary' : 'ghost'}
                      className="shrink-0 px-3 py-1.5 text-xs"
                      onClick={() => dispatch({ type: 'SELECT_DIRECTION', directionId: d.id })}
                    >
                      {d.id === project.selectedDirectionId ? 'Carrying forward' : 'Select'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-3 border-dashed">
              <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Draft a new direction</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[160px_1fr_auto]">
                <TextInput placeholder="Label" value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} />
                <TextInput
                  placeholder="Mood / family description"
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                />
                <Button variant="secondary" onClick={addExpertDraft}>
                  Add
                </Button>
              </div>
            </Card>
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Sign-off</h2>
            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Technical Consultant reviewed</span>
                <Switch
                  checked={project.signoff.technicalConsultantReviewed}
                  onChange={() => dispatch({ type: 'TOGGLE_SIGNOFF', key: 'technicalConsultantReviewed' })}
                  label="Technical Consultant reviewed"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">Fragrance Consultant reviewed</span>
                <Switch
                  checked={project.signoff.fragranceConsultantReviewed}
                  onChange={() => dispatch({ type: 'TOGGLE_SIGNOFF', key: 'fragranceConsultantReviewed' })}
                  label="Fragrance Consultant reviewed"
                />
              </div>
            </div>
            <Button variant="primary" className="mt-5 w-full" disabled={!canConfirm} onClick={() => dispatch({ type: 'CONFIRM_SETUP' })}>
              Confirm setup
            </Button>
            {!project.selectedDirectionId && (
              <p className="mt-2 text-xs text-ink-muted">Select a direction to carry forward first.</p>
            )}
          </Card>

          <Card>
            <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Brief recap</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="text-xs text-ink-muted">Reference images</dt>
                <dd>{project.brief.referenceImageFileNames.length > 0 ? project.brief.referenceImageFileNames.join(', ') : 'None uploaded'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Exclusions</dt>
                <dd>{project.brief.exclusions.value || 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Constraints</dt>
                <dd>{project.brief.constraints.value || 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Deployment scope</dt>
                <dd>{project.brief.deploymentScope.value || 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Physical texture</dt>
                <dd>{project.brief.textureIntent.value || 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Drawn to (hint)</dt>
                <dd>{project.brief.scentsOfInterest.value.join(', ') || 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">To avoid (hint)</dt>
                <dd>{project.brief.scentsToAvoid.value.join(', ') || 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Max budget per kg</dt>
                <dd>{project.brief.maxBudgetPerKg.value ? `€${project.brief.maxBudgetPerKg.value}/kg` : 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Expected oil volume</dt>
                <dd>{project.brief.expectedVolumeKg.value ? `${project.brief.expectedVolumeKg.value}kg` : 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Preferred dosage</dt>
                <dd>{project.brief.dosagePercent.value ? `${project.brief.dosagePercent.value}%` : 'None stated'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">Compliance standards</dt>
                <dd>{project.brief.complianceStandards.join(', ') || 'None stated'}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>
    </main>
  )
}
