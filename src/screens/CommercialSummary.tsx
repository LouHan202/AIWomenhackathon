import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CheckCircle2, AirVent, Flower2, LoaderCircle, Send, Wallet, Users, Maximize, Building2, CalendarDays } from 'lucide-react'
import { FixedFooter } from '../components/ui/FixedFooter'
import { useApp } from '../lib/state'
import { MACHINE_CATALOG } from '../lib/machines'
import { commercialTotal, estimateOilCostOverDuration } from '../lib/costs'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { TextArea, TextInput } from '../components/ui/Inputs'
import museumImage from '../../img/museum.png'
import floorplanImage from '../../img/floorplan.png'
import neroliTerraceVisual from '../../img/neroli-terrace-visual.png'

export function CommercialSummary() {
  const { state, dispatch } = useApp()
  const project = state.project!
  const machine = MACHINE_CATALOG.find((m) => m.id === project.selectedMachineId) ?? MACHINE_CATALOG[0]
  const scent = project.directions.find((d) => d.id === project.selectedDirectionId) ?? project.directions[0]
  const zoneCount = project.brief.deploymentScope.value === 'Multi-site' ? 3 : project.brief.deploymentScope.value === 'Multi-room' ? 2 : 1
  const oilCost = estimateOilCostOverDuration(zoneCount, project.brief.durationDays)
  const total = commercialTotal(machine, project.commercialTerm, project.brief.durationDays, zoneCount)
  const [modalOpen, setModalOpen] = useState(false)
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  useLayoutEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return (
    <main className="mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8">
      <h1 className="text-[clamp(1.75rem,4vw,2.5rem)]">Your offer summary</h1>
      <p className="mt-3 text-sm leading-6 text-ink-muted">Your scent, system and estimated price at a glance. A SILLAGE consultant will help finalise your personal proposal.</p>

      <section aria-label="Selected offer" className="mt-8 grid gap-5 rounded-2xl border border-line p-5 sm:grid-cols-3 sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-sm text-ink-muted"><Flower2 size={18} aria-hidden="true" />Scent</h2>
          <img src={neroliTerraceVisual} alt="Neroli Terrace scent direction mood board" className="mt-3 h-20 w-28 rounded-lg object-cover" />
          <p className="mt-3 text-lg font-semibold">{scent?.label ?? 'To be confirmed'}</p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{scent?.familyDescription}</p>
        </div>
        <div>
          <h2 className="flex items-center gap-2 text-sm text-ink-muted"><AirVent size={18} aria-hidden="true" />Machine</h2>
          <img src="/dffusor-2.jpeg" alt="SILLAGE Scent Diffuser" className="mt-3 h-20 w-28 object-contain" />
          <p className="mt-3 text-lg font-semibold">SILLAGE Scent Diffuser</p>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{machine.capacityRangeSqm[0]}–{machine.capacityRangeSqm[1]} m² · {machine.visibility}</p>
          <p className="mt-2 text-sm text-ink-muted">{zoneCount} {zoneCount === 1 ? 'zone' : 'zones'} · {project.brief.durationLabel}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4">
          <h2 className="flex items-center gap-2 text-sm text-ink-muted"><Wallet size={18} aria-hidden="true" />Estimated price</h2>
          <p className="mt-2 tabular text-3xl font-semibold">€{total.toLocaleString()}</p>
          <p className="mt-2 text-xs leading-5 text-ink-muted">Machine {project.commercialTerm}: €{(total - oilCost).toLocaleString()}<br />Fragrance oil: €{oilCost.toLocaleString()}</p>
          <p className="mt-2 text-xs text-ink-muted">Final pricing confirmed in your proposal.</p>
        </div>
      <section className="grid gap-5 border-t border-line pt-5 sm:col-span-3 sm:grid-cols-3" aria-labelledby="space-images-title">
        <div className="sm:col-span-2">
        <h2 id="space-images-title" className="text-base font-semibold">Your space</h2>
        <div className="mt-3 grid grid-cols-2 gap-4">
          {[{ src: museumImage, label: 'Museum', fit: 'object-cover' }, { src: floorplanImage, label: 'Floor plan', fit: 'object-contain' }].map(({ src, label, fit }) => (
            <figure key={label} className="min-w-0">
              <img src={src} alt={label === 'Museum' ? 'Museum interior reference' : 'Museum floor plan reference'} className={`h-44 w-full rounded-lg border border-line bg-surface-sunken sm:h-52 ${fit}`} />
              <figcaption className="mt-2 text-xs text-ink-muted">{label}</figcaption>
            </figure>
          ))}
        </div>
        </div>
        <dl className="space-y-4 p-4 text-sm">
          <div>
            <dt className="flex items-center gap-2 text-ink-muted"><Maximize size={16} aria-hidden="true" />Area</dt>
            <dd className="mt-1 font-medium">{project.brief.spaceSizeSqm.value !== null ? `${project.brief.spaceSizeSqm.value.toLocaleString()} m²` : 'To be confirmed'}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-ink-muted"><Users size={16} aria-hidden="true" />People / footfall</dt>
            <dd className="mt-1 font-medium">{project.brief.audienceVolume.value?.trim() || 'To be confirmed'}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-ink-muted"><Building2 size={16} aria-hidden="true" />Space type</dt>
            <dd className="mt-1 font-medium">{project.brief.venueType}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-ink-muted"><CalendarDays size={16} aria-hidden="true" />Duration</dt>
            <dd className="mt-1 font-medium">{project.brief.durationLabel}</dd>
          </div>
        </dl>
      </section>
      </section>

      <FixedFooter>
        <Button variant="secondary" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'machine' })}>Back</Button>
        <Button variant="primary" icon={<Send size={17} aria-hidden="true" />} onClick={() => setModalOpen(true)}>Request your personal proposal</Button>
      </FixedFooter>

      <Modal hideTitle={requestStatus === 'sent'} open={modalOpen} onClose={() => setModalOpen(false)} title={`Personal proposal · ${scent?.label ?? 'Your scent'}`} initialFocusEl={() => nameInputRef.current}>
        <div className="max-h-[65dvh] overflow-y-auto pr-1">
          {requestStatus === 'sent' ? (
            <div role="status" className="py-4 text-center">
              <CheckCircle2 size={44} className="mx-auto text-signal-green" aria-hidden="true" />
              <h2 className="mt-4 text-xl">Request sent</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">Thank you, {name.trim()}. Your scent and machine selections are ready for a personal proposal.</p>
              <Button className="mt-6" onClick={() => window.location.assign('/index.html')}>Done</Button>
            </div>
          ) : (
            <form onSubmit={(event) => {
              event.preventDefault()
              if (requestStatus === 'sending' || !name.trim()) return
              setRequestStatus('sending')
              timer.current = setTimeout(() => setRequestStatus('sent'), 1600)
            }}>
              <p className="mb-5 text-sm leading-6 text-ink-muted">Your selected scent and machine preferences will be prepared for a SILLAGE consultant. We will confirm the final proposal together.</p>
              <fieldset disabled={requestStatus === 'sending'} className="space-y-4">
                <div><label htmlFor="proposal-name" className="mb-2 block text-sm">Name</label><TextInput ref={nameInputRef} id="proposal-name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></div>
                <div><label htmlFor="proposal-email" className="mb-2 block text-sm">Email</label><TextInput id="proposal-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" /></div>
                <div><label htmlFor="proposal-note" className="mb-2 block text-sm">Project note <span className="text-ink-muted">(optional)</span></label><TextArea id="proposal-note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Anything we should know?" /></div>
                <Button type="submit" className="w-full" disabled={requestStatus === 'sending' || !name.trim()} icon={requestStatus === 'sending' ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}>
                  {requestStatus === 'sending' ? 'Sending request…' : 'Send consultation request'}
                </Button>
              </fieldset>
              <span role="status" className="sr-only">{requestStatus === 'sending' ? 'Sending your demo request' : ''}</span>
              <p className="mt-4 text-xs text-ink-muted">Prototype only — this form simulates sending and does not transmit data.</p>
            </form>
          )}
        </div>
      </Modal>
    </main>
  )
}
