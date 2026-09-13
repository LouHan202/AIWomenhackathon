import { MockDictation } from '../components/MockDictation'
import { FixedFooter } from '../components/ui/FixedFooter'
import { Modal } from '../components/ui/Modal'
import { useEffect, useRef, useState } from 'react'
import { ScentWave } from '../components/ScentWave'
import { FileUp, Map, Image, Landmark, Stethoscope, Leaf, PartyPopper, ShoppingBag, Shapes, Zap, CalendarDays, Infinity as InfinityIcon, NotebookPen, Wand2, UserCheck } from 'lucide-react'
import { Slider } from '../components/ui/Slider'
import { useApp } from '../lib/state'
import { parseBrief } from '../lib/brief-parser'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { TextArea, TextInput } from '../components/ui/Inputs'
import type { InstallType, VenueType } from '../lib/types'

const SAMPLE_BRIEF =
  'We want a signature scent for our museum lobby that references the copper and stone of the building facade. It should feel calm and welcoming, not clinical. The lobby is about 90m2 with high footfall, roughly 800 visitors per day. There is central HVAC. Please avoid anything sweet or gourmand.'

const HOW_IT_WORKS_STEPS = [
  { title: 'Share your vision', description: 'The mood, the materials, and the people who use your space.', Icon: NotebookPen },
  { title: 'Explore a direction', description: 'Review a scent concept and a recommended machine setup.', Icon: Wand2 },
  { title: 'Refine with an expert', description: 'Check the details together before confirming your installation.', Icon: UserCheck },
] as const

export function BriefUpload() {
  const { dispatch } = useApp()
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [floorPlanFileName, setFloorPlanFileName] = useState<string | null>(null)
  const [referenceImageFileNames, setReferenceImageFileNames] = useState<string[]>([])
  const [venueType, setVenueType] = useState<VenueType | null>(null)
  const [installType, setInstallType] = useState<InstallType | null>(null)
  const [durationDays, setDurationDays] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const floorPlanInputRef = useRef<HTMLInputElement>(null)
  const referenceInputRef = useRef<HTMLInputElement>(null)

  const briefInputRef = useRef<HTMLTextAreaElement>(null)
  const [dictating, setDictating] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  useEffect(() => { briefInputRef.current?.focus({ preventScroll: true }) }, [])

  const canSubmit = rawText.trim().length > 12 && venueType !== null && installType !== null && !dictating

  function handleSubmit() {
    if (!canSubmit || !venueType || !installType) return
    const brief = parseBrief({
      rawText,
      fileName,
      floorPlanFileName,
      referenceImageFileNames,
      venueType,
      installType,
      durationLabel: installType === 'Permanent install' ? 'Permanent' : `${durationDays} days`,
      durationDays: installType === 'Permanent install' ? 365 : durationDays,
    })
    dispatch({ type: 'SUBMIT_BRIEF', brief })
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pb-36 pt-8 sm:px-8 sm:pt-10">
      <div className="relative isolate mb-7 overflow-hidden py-2 sm:py-4">
        <ScentWave />
        <h1 className="whitespace-nowrap text-[clamp(1.25rem,4.3vw,2.75rem)] leading-tight tracking-[-0.045em]">A feeling starts with a brief.</h1>
      </div>

      <div className="brief-panel mx-auto w-full space-y-7">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-5">
          <h2 className="flex items-center gap-3 text-base"><span className="section-number">01</span> The creative brief</h2>
          <button type="button" className="rounded px-2 py-1 text-xs text-ink-muted underline underline-offset-4 hover:text-ink focus-visible:outline-2" onClick={() => setRawText(SAMPLE_BRIEF)}>Try an example</button>
        </div>
        <Field label="Describe the space and the feeling you're after">
          <div className="relative w-full">
          <TextArea
            ref={briefInputRef}
            className="scent-focus-input pb-16"
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Describe the atmosphere, the people, and what you want them to feel. What should the scent evoke?"
          />
        <MockDictation onRecordingChange={setDictating} onTranscript={(text) => {
          setRawText((current) => current.trim() ? `${current.trimEnd()}\n\n${text}` : text)
          briefInputRef.current?.focus({ preventScroll: true })
        }} />
          </div>
        </Field>

        <section aria-labelledby="supporting-files-heading">
          <h2 id="supporting-files-heading" className="text-lg font-semibold tracking-normal">Add supporting files</h2>
          <p className="mt-1 text-sm text-ink-muted">Optional — this helps us understand the space faster</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
            <input ref={floorPlanInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFloorPlanFileName(e.target.files?.[0]?.name ?? null)} />
            <input ref={referenceInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => setReferenceImageFileNames(Array.from(e.target.files ?? []).map((f) => f.name))} />
            {[
              { title: 'Brief document', detail: fileName, Icon: FileUp, input: fileInputRef },
              { title: 'Floor plan', detail: floorPlanFileName, Icon: Map, input: floorPlanInputRef },
              { title: 'Reference images', detail: referenceImageFileNames.length ? `${referenceImageFileNames.length} image${referenceImageFileNames.length === 1 ? '' : 's'} selected` : null, Icon: Image, input: referenceInputRef },
            ].map(({ title, detail, Icon, input }) => (
              <button key={title} type="button" onClick={() => input.current?.click()} className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-line bg-surface-sunken/30 px-4 py-5 text-sm font-medium transition-colors hover:border-ink hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                <Icon className="h-6 w-6 text-ink-muted" strokeWidth={1.7} aria-hidden="true" />
                <span>{title}</span>
                {detail && <span className="max-w-full break-all text-xs font-normal text-ink-muted" aria-live="polite">{detail}</span>}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-7 border-t border-line pt-7" aria-labelledby="space-heading">
          <h2 id="space-heading" className="text-lg font-semibold tracking-normal">A few details about the space</h2>
          <fieldset>
            <legend className="mb-3 w-full text-sm font-medium">Venue type <span className="float-right font-normal text-ink-muted">Where the scent lives</span></legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {([
                ['Museum', Landmark], ['Clinic', Stethoscope], ['Wellness center', Leaf],
                ['Event space', PartyPopper], ['Shopping center', ShoppingBag], ['Other', Shapes],
              ] as const).map(([title, Icon]) => (
                <label key={title} className="choice-tile">
                  <input type="radio" name="venue-type" value={title} checked={venueType === title} onChange={() => setVenueType(title)} className="peer sr-only" />
                  <span className="choice-content"><span className="choice-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span><span>{title}</span></span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-3 w-full text-sm font-medium">Install type <span className="float-right font-normal text-ink-muted">How long it stays</span></legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {([
                ['One-off event', 'A single day', Zap], ['Multi-day', 'Runs for a while', CalendarDays], ['Permanent install', 'Always on', InfinityIcon],
              ] as const).map(([title, description, Icon]) => (
                <label key={title} className="choice-tile">
                  <input type="radio" name="install-type" value={title} checked={installType === title} onChange={() => { setInstallType(title); if (title === 'One-off event') setDurationDays(1); else if (title === 'Multi-day') setDurationDays((days) => Math.max(2, days)); }} className="peer sr-only" />
                  <span className="choice-content"><span className="choice-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span><span>{title}<span className="mt-0.5 block text-xs font-normal text-ink-muted">{description}</span></span></span>
                </label>
              ))}
            </div>
          </fieldset>
          {installType === 'Multi-day' && (
            <div>
              <div className="mb-3 flex flex-wrap justify-between gap-1 text-sm"><label htmlFor="duration-days" className="font-medium">Duration</label><span className="text-ink-muted">Drag or type the number of days</span></div>
              <div className="flex flex-col gap-5 rounded-2xl border border-line p-5 sm:flex-row sm:items-center">
                <div className="flex shrink-0 items-center gap-3">
                  <TextInput id="duration-days" className="w-20 text-center font-semibold" type="number" min={1} max={90} value={durationDays} onChange={(e) => setDurationDays(Math.min(90, Math.max(1, Number(e.target.value) || 1)))} />
                  <span className="text-sm text-ink-muted">days</span>
                </div>
                <div className="min-w-0 flex-1">
                  <Slider value={durationDays} min={1} max={90} onChange={setDurationDays} ariaLabel="Duration in days" />
                  <div className="mt-1 flex justify-between text-xs text-ink-muted"><span>1 day</span><span>1 month</span><span>90 days</span></div>
                </div>
              </div>
            </div>
          )}
        </section>

      </div>
      <FixedFooter>
        <div className="flex min-w-0 items-center gap-4">
          <button type="button" className="shrink-0 rounded px-1 py-1 text-xs text-ink-muted underline underline-offset-4 hover:text-ink focus-visible:outline-2" onClick={() => setShowHowItWorks(true)}>How it works</button>
          <p className="truncate text-xs text-ink-muted">{!venueType || !installType ? 'Choose a venue and install type to continue.' : dictating ? 'Finish dictation to continue.' : ''}</p>
        </div>
        <Button className="ml-auto" variant="primary" disabled={!canSubmit} onClick={handleSubmit}>Analyze brief</Button>
      </FixedFooter>

      <Modal open={showHowItWorks} onClose={() => setShowHowItWorks(false)} title="How it works">
        <ol className="space-y-6">
          {HOW_IT_WORKS_STEPS.map(({ title, description, Icon }, index) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface-sunken">
                <Icon className="h-6 w-6 text-ink" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div className="pt-1">
                <h2 className="text-sm font-medium tracking-normal">{index + 1}. {title}</h2>
                <p className="mt-1 text-sm leading-6 text-ink-muted">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </Modal>
    </main>
  )
}
