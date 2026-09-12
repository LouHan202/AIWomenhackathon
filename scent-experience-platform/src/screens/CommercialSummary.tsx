import { useApp } from '../lib/state'
import { MACHINE_CATALOG } from '../lib/machines'
import { commercialTotal, estimateOilCostOverDuration } from '../lib/costs'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Tag } from '../components/ui/Tag'

export function CommercialSummary() {
  const { state, dispatch } = useApp()
  const project = state.project!
  const machine = MACHINE_CATALOG.find((m) => m.id === project.selectedMachineId)!
  const zoneCount = project.brief.deploymentScope.value === 'Multi-site' ? 3 : project.brief.deploymentScope.value === 'Multi-room' ? 2 : 1
  const durationWeeks = Math.ceil(project.brief.durationDays / 7)
  const oilCost = estimateOilCostOverDuration(zoneCount, project.brief.durationDays)
  const total = commercialTotal(machine, project.commercialTerm, project.brief.durationDays, zoneCount)

  return (
    <main className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
      <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Step 4 of 5</p>
      <h1 className="mt-3 text-[clamp(1.75rem,3vw+1rem,2.5rem)]">Commercial summary</h1>

      <div className="mt-8 flex items-center gap-2 rounded-full border border-line p-1 text-sm">
        {(['rental', 'purchase'] as const).map((term) => (
          <button
            key={term}
            onClick={() => dispatch({ type: 'SET_COMMERCIAL_TERM', term })}
            className={`flex-1 rounded-full px-4 py-2 capitalize transition-colors duration-150 ${
              project.commercialTerm === term ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {term}
          </button>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg">{machine.model}</h2>
            <p className="text-sm text-ink-muted">{machine.priceTierLabel} tier</p>
          </div>
          <p className="tabular text-2xl">
            {project.commercialTerm === 'purchase'
              ? `€${machine.priceEur.toLocaleString()}`
              : `€${machine.rentalPerWeekEur}/wk`}
          </p>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Deployment scope</p>
          <p className="mt-2 text-lg">{project.brief.deploymentScope.value}</p>
          <p className="mt-1 text-sm text-ink-muted">
            {zoneCount} {zoneCount === 1 ? 'zone' : 'zones'} · {project.brief.durationLabel}
          </p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Fragrance oil, projected</p>
          <p className="mt-2 tabular text-lg">€{oilCost.toLocaleString()}</p>
          <p className="mt-1 text-sm text-ink-muted">
            over {project.commercialTerm === 'rental' ? `${durationWeeks} weeks` : project.brief.durationLabel.toLowerCase()}, estimated
          </p>
        </Card>
      </div>

      <Card className="mt-4 flex items-center justify-between border-ink/20">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Total estimate</p>
          <p className="tabular mt-1 text-3xl">€{total.toLocaleString()}</p>
        </div>
        <Tag kind="amber">Estimate, not a final invoice</Tag>
      </Card>

      <div className="mt-10 flex justify-end">
        <Button variant="primary" onClick={() => dispatch({ type: 'CONFIRM_INSTALL' })}>
          Confirm &amp; install
        </Button>
      </div>
    </main>
  )
}
