import { useLayoutEffect } from 'react'
import { Wallet } from 'lucide-react'
import { commercialTotal } from '../lib/costs'
import { FixedFooter } from '../components/ui/FixedFooter'
import { useApp } from '../lib/state'
import { MACHINE_CATALOG } from '../lib/machines'
import { Button } from '../components/ui/Button'

export function MachineRecommendationScreen() {
  const { state, dispatch } = useApp()
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  const project = state.project!
  const machine = MACHINE_CATALOG.find((m) => m.id === project.selectedMachineId) ?? MACHINE_CATALOG[0]

  const zoneCount = project.brief.deploymentScope.value === 'Multi-site' ? 3 : project.brief.deploymentScope.value === 'Multi-room' ? 2 : 1
  const estimatedCost = commercialTotal(machine, project.commercialTerm, project.brief.durationDays, zoneCount)

  return (
    <main className="mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8">
      <h1 className="text-[clamp(1.75rem,3vw+1rem,2.5rem)]">Your scent diffuser</h1>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm leading-6 text-ink-muted">A scent diffuser selected for your space. Your consultant will confirm coverage, placement and installation.</p>
        </div>

        <div className="mt-8">
          <aside className="grid items-start gap-6 rounded-2xl border border-line p-5 sm:grid-cols-[200px_minmax(0,1fr)]">
            <div>
              <div className="flex h-48 items-center justify-center">
                <img src="/dffusor-2.jpeg" alt={machine.model} className="h-44 w-full object-contain" />
              </div>
              <p className="mt-5 text-[10px] uppercase tracking-[0.12em] text-ink-muted">Illustrative device view</p>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold">SILLAGE Scent Diffuser</h2>
                <Button
                  variant="secondary"
                  style={{ padding: '6px 10px', fontSize: '12px', lineHeight: '18px' }}
                >
                  Review your setup
                </Button>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink-muted">{machine.reasoning}</p>

              <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">Coverage</dt>
                  <dd>{machine.capacityRangeSqm[0]}–{machine.capacityRangeSqm[1]} m²</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">Installation</dt>
                  <dd>{machine.visibility}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-ink-muted">Maintenance</dt>
                  <dd>Cartridge service</dd>
                </div>
              </dl>


            </div>
          </aside>

        </div>
      </section>

      <FixedFooter>
        <Button variant="secondary" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'suggestion' })}>Back</Button>
        <div className="cost-footer-actions ml-auto flex items-stretch gap-3">
          <div className="cost-footer-badge flex items-center gap-3 rounded-lg border border-signal-green/30 bg-emerald-50 px-4">
            <Wallet size={22} className="shrink-0 text-signal-green" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <p className="text-xs text-ink-muted"><span className="sm:hidden">Est. cost</span><span className="hidden sm:inline">Estimated cost</span></p>
              <p className="tabular text-lg font-semibold">€{estimatedCost.toLocaleString()}</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'commercial-summary' })}><span className="sm:hidden">Continue</span><span className="hidden sm:inline">Continue to offer summary</span></Button>
        </div>
      </FixedFooter>
    </main>
  )
}
