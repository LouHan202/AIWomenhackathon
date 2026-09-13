import { Sparkle } from '@phosphor-icons/react'
import { useApp } from '../lib/state'
import { MACHINE_CATALOG } from '../lib/machines'
import { estimateOilCostOverDuration } from '../lib/costs'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Tag } from '../components/ui/Tag'

export function SuggestionScreen() {
  const { state, dispatch } = useApp()
  const project = state.project!
  const machine = MACHINE_CATALOG.find((m) => m.id === project.selectedMachineId)!
  const zoneCount = project.brief.deploymentScope.value === 'Multi-site' ? 3 : project.brief.deploymentScope.value === 'Multi-room' ? 2 : 1
  const oilCost = estimateOilCostOverDuration(zoneCount, project.brief.durationDays)

  const isComplex = project.brief.classification === 'complex'
  const selected = project.directions.find((d) => d.id === project.selectedDirectionId)
  const isConfirmed = selected?.status === 'confirmed'
  const awaitingExpert = isComplex && !isConfirmed

  return (
    <main className="mx-auto max-w-4xl px-6 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Step 3 of 5</p>
      <h1 className="mt-3 text-[clamp(1.75rem,3vw+1rem,2.5rem)]">Your recommended setup</h1>

      {awaitingExpert && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-signal-amber/40 bg-signal-amber/10 px-5 py-4 text-sm text-signal-amber">
          <Sparkle className="h-5 w-5 shrink-0" />
          <span>
            This brief needs a fragrance consultant and technical consultant to sign off before anything is
            final. You'll see this update the moment they confirm.
          </span>
        </div>
      )}
      {!isComplex && state.customerRequestedExpertReview && !isConfirmed && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-signal-amber/40 bg-signal-amber/10 px-5 py-4 text-sm text-signal-amber">
          <Sparkle className="h-5 w-5 shrink-0" />
          <span>Expert review requested. A fragrance consultant will confirm this setup shortly.</span>
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-[0.1em] text-ink-muted">Machine</h2>
        <Card className="mt-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg">{machine.model}</h3>
                <Tag kind="ai">Recommended</Tag>
              </div>
              <p className="mt-2 max-w-lg text-sm text-ink-muted">{machine.reasoning}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">{machine.priceTierLabel}</p>
              <p className="tabular text-xl">€{machine.priceEur.toLocaleString()}</p>
              <p className="text-xs text-ink-muted">or €{machine.rentalPerWeekEur}/week</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-[0.1em] text-ink-muted">Fragrance direction: pick one to explore</h2>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {project.directions.map((d) => {
            const isSelected = d.id === project.selectedDirectionId
            return (
              <Card
                key={d.id}
                className={`flex flex-col justify-between transition-colors duration-150 ${isSelected ? 'border-ink' : ''}`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base">{d.label}</h3>
                    {d.isAiTopPick && <Tag kind="ai">AI top pick</Tag>}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d.familyDescription}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Tag kind={d.status === 'confirmed' ? 'green' : 'amber'}>
                    {d.status === 'confirmed' ? 'Confirmed' : 'Draft, pending expert'}
                  </Tag>
                  <Button
                    variant={isSelected ? 'secondary' : 'ghost'}
                    className="px-3 py-1.5 text-xs"
                    onClick={() => dispatch({ type: 'SELECT_DIRECTION', directionId: d.id })}
                  >
                    {isSelected ? 'Selected' : 'Approve'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
        {!isComplex && !state.customerRequestedExpertReview && (
          <button
            className="mt-3 text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
            onClick={() => dispatch({ type: 'REQUEST_EXPERT_REVIEW' })}
          >
            Request expert review anyway
          </button>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-sm uppercase tracking-[0.1em] text-ink-muted">Estimated cost</h2>
        <Card className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">Fragrance oil over {project.brief.durationLabel.toLowerCase()}</p>
            <p className="tabular text-2xl">€{oilCost.toLocaleString()}</p>
          </div>
          <p className="text-xs text-ink-muted">estimated, not a final quote</p>
        </Card>
      </section>

      <div className="mt-10 flex justify-end">
        <Button
          variant="primary"
          disabled={!selected || (isComplex && !isConfirmed)}
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'commercial-summary' })}
        >
          Continue to commercial summary
        </Button>
      </div>
    </main>
  )
}
