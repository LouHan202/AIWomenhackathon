import { useRef, useState } from 'react'
import { FileArrowUp, FloppyDisk, Images } from '@phosphor-icons/react'
import { useApp } from '../lib/state'
import { parseBrief } from '../lib/brief-parser'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/Field'
import { Select, TextArea, TextInput } from '../components/ui/Inputs'
import type { InstallType, VenueType } from '../lib/types'

const SAMPLE_BRIEF =
  'We want a signature scent for our museum lobby that references the copper and stone of the building facade. It should feel calm and welcoming, not clinical. The lobby is about 90m2 with high footfall, roughly 800 visitors per day. There is central HVAC. Please avoid anything sweet or gourmand.'

export function BriefUpload() {
  const { dispatch } = useApp()
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState<string | null>(null)
  const [floorPlanFileName, setFloorPlanFileName] = useState<string | null>(null)
  const [referenceImageFileNames, setReferenceImageFileNames] = useState<string[]>([])
  const [venueType, setVenueType] = useState<VenueType>('Museum')
  const [installType, setInstallType] = useState<InstallType>('Permanent install')
  const [durationDays, setDurationDays] = useState(180)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const floorPlanInputRef = useRef<HTMLInputElement>(null)
  const referenceInputRef = useRef<HTMLInputElement>(null)

  const canSubmit = rawText.trim().length > 12

  function handleSubmit() {
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
    <main className="relative mx-auto flex max-w-3xl flex-col items-center overflow-hidden px-6 py-16 sm:py-24">
      {/* the signature motif — a soft coral glow behind the hero, decorative only */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-160px] h-[640px] w-[640px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--color-coral) 35%, transparent) 0%, color-mix(in oklab, var(--color-coral-soft) 16%, transparent) 45%, transparent 72%)',
        }}
      />

      <p className="relative text-xs uppercase tracking-[0.14em] text-coral">Brief intake</p>
      <h1 className="relative mt-4 max-w-xl text-center text-[clamp(2.25rem,5vw+1rem,3.5rem)] leading-[1.05]">
        Tell us what this space should feel like
      </h1>
      <p className="relative mt-4 max-w-md text-center text-[0.95rem] leading-relaxed text-ink">
        Plain language is fine. Our team turns this into a machine and scent recommendation you can
        review before anything is ordered.
      </p>

      <div className="relative mt-12 w-full space-y-6">
        <Field label="Describe the space and the feeling you're after">
          <TextArea
            rows={6}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={SAMPLE_BRIEF}
          />
        </Field>

        <div className="flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
          />
          <Button variant="secondary" icon={<FileArrowUp className="h-4 w-4" />} onClick={() => fileInputRef.current?.click()}>
            {fileName ?? 'Upload brief document'}
          </Button>
          <input
            ref={floorPlanInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => setFloorPlanFileName(e.target.files?.[0]?.name ?? null)}
          />
          <Button
            variant="secondary"
            icon={<FloppyDisk className="h-4 w-4" />}
            onClick={() => floorPlanInputRef.current?.click()}
          >
            {floorPlanFileName ?? 'Optional: floor plan / photo'}
          </Button>
          <input
            ref={referenceInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => setReferenceImageFileNames(Array.from(e.target.files ?? []).map((f) => f.name))}
          />
          <Button
            variant="secondary"
            icon={<Images className="h-4 w-4" />}
            onClick={() => referenceInputRef.current?.click()}
          >
            {referenceImageFileNames.length > 0
              ? `${referenceImageFileNames.length} reference image${referenceImageFileNames.length > 1 ? 's' : ''}`
              : 'Optional: mood board / references'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Venue type">
            <Select value={venueType} onChange={(e) => setVenueType(e.target.value as VenueType)}>
              <option>Museum</option>
              <option>Clinic</option>
              <option>Wellness center</option>
              <option>Event space</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Install type">
            <Select value={installType} onChange={(e) => setInstallType(e.target.value as InstallType)}>
              <option>One-off event</option>
              <option>Multi-day</option>
              <option>Permanent install</option>
            </Select>
          </Field>
          <Field label="Duration (days)" hint={installType === 'Permanent install' ? 'Not applicable to a permanent install' : undefined}>
            <TextInput
              type="number"
              min={1}
              disabled={installType === 'Permanent install'}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            className="text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
            onClick={() => setRawText(SAMPLE_BRIEF)}
          >
            Use a sample brief
          </button>
          <Button variant="primary" disabled={!canSubmit} onClick={handleSubmit}>
            Analyze brief
          </Button>
        </div>
      </div>
    </main>
  )
}
