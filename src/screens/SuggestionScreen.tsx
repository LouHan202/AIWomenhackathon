import { FixedFooter } from '../components/ui/FixedFooter'
import { useLayoutEffect, useState } from 'react'
import { Wind, ClipboardCheck, Users, Citrus, Leaf, Droplets, Flower2, Waves, Layers, Trees, Cloud, Sun, Wallet } from 'lucide-react'
import neroliTerraceVisual from '../../img/neroli-terrace-visual.png'
import { useApp } from '../lib/state'
import { estimateOilCostOverDuration } from '../lib/costs'
import { Button } from '../components/ui/Button'

export function SuggestionScreen() {
  const { state, dispatch } = useApp()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])
  const project = state.project!
  const zoneCount = project.brief.deploymentScope.value === 'Multi-site' ? 3 : project.brief.deploymentScope.value === 'Multi-room' ? 2 : 1
  const oilCost = estimateOilCostOverDuration(zoneCount, project.brief.durationDays)

  const isComplex = project.brief.classification === 'complex'
  const selected = project.directions.find((d) => d.id === project.selectedDirectionId)
  const activeDirection = selected ?? project.directions[0]
  const isConfirmed = activeDirection?.status === 'confirmed'
  const [imageLoaded, setImageLoaded] = useState(false)
  const scentLabel = activeDirection?.label ?? 'Direction candidate'
  const scentDescription =
    activeDirection?.familyDescription ??
    'A directional scent concept will appear here after selecting a direction.'
  const scentMoments = [
    {
      phase: 'Top',
      time: '0-30 min',
      title: 'Arrival lift',
      notes: [{ label: 'Citrus peel', Icon: Citrus }, { label: 'Airy green leaf', Icon: Leaf }, { label: 'Watery brightness', Icon: Droplets }],
    },
    {
      phase: 'Heart',
      time: '30-90 min',
      title: 'Atmosphere build',
      notes: [{ label: 'Soft floral trace', Icon: Flower2 }, { label: 'Cool mineral air', Icon: Waves }, { label: 'Textural bridge', Icon: Layers }],
    },
    {
      phase: 'Base',
      time: '90 min+',
      title: 'Lingering residence',
      notes: [{ label: 'Clean woods', Icon: Trees }, { label: 'Musk veil', Icon: Cloud }, { label: 'Warm surface accord', Icon: Sun }],
    },
  ]

  return (
    <main className="mx-auto max-w-4xl px-5 pb-36 pt-10 sm:px-8">
      <h1 className="text-[clamp(1.75rem,3vw+1rem,2.5rem)]">Scent direction</h1>

      <section className="mt-10">
        <div className="overflow-hidden">
          <div className="overflow-hidden rounded-2xl border border-line bg-paper p-5">
            <aside className="pb-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Olfactive direction</p>
              </div>

              <div className="mt-4 grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div className="flex flex-wrap content-start gap-2 sm:flex-col">
                {project.directions.map((d) => {
                  const isSelected = d.id === activeDirection?.id
                  return (
                    <button
                      key={d.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => dispatch({ type: 'SELECT_DIRECTION', directionId: d.id })}
                      className={`min-w-[9.5rem] rounded-xl border px-3 py-2 text-left transition-colors duration-150 ${
                        isSelected
                          ? 'border-ink bg-paper shadow-sm'
                          : 'border-line bg-transparent text-ink-muted hover:border-ink-muted hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{d.label}</span>
                        {d.status === 'confirmed' && <span className="h-2 w-2 rounded-full bg-signal-green" aria-hidden="true" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="min-w-0">
              <h3 className="text-2xl">{scentLabel}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{scentDescription}</p>
              <dl className="mt-6 flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <dt className="flex items-center gap-2 whitespace-nowrap text-ink-muted"><Wind size={16} aria-hidden="true" />Format</dt>
                  <dd>Spatial scent</dd>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <dt className="flex items-center gap-2 whitespace-nowrap text-ink-muted"><ClipboardCheck size={16} aria-hidden="true" />Status</dt>
                  <dd>{isConfirmed ? 'Confirmed' : 'Draft'}</dd>
                </div>
                <div className="flex min-w-0 items-center gap-2">
                  <dt className="flex items-center gap-2 whitespace-nowrap text-ink-muted"><Users size={16} aria-hidden="true" />Owner</dt>
                  <dd>{isComplex ? 'Expert review' : 'AI + expert'}</dd>
                </div>
              </dl>
              </div>
              </div>
            </aside>

            <div className="border-t border-line pt-6">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Olfactory architecture</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-line bg-surface-sunken p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">Intensity path</p>
                <div className="mt-2 rounded-lg border border-line/70 bg-[linear-gradient(180deg,#ffffff_0%,#f4f1e9_100%)] p-2">
                  <svg
                    viewBox="0 0 760 210"
                    role="img"
                    aria-label="Scent evolution trace from top notes to base notes over time"
                    className="h-[210px] w-full"
                  >
                    <text x="8" y="14" className="fill-ink-muted text-[10px] uppercase tracking-[0.12em]">Intensity</text>

                    <line x1="8" y1="176" x2="752" y2="176" stroke="currentColor" className="text-line" />
                    <line x1="255" y1="34" x2="255" y2="176" stroke="currentColor" className="text-line" strokeDasharray="4 6" />
                    <line x1="502" y1="34" x2="502" y2="176" stroke="currentColor" className="text-line" strokeDasharray="4 6" />

                    <path
                      d="M12,152 C90,54 170,30 256,92 C338,148 452,162 752,170"
                      fill="none"
                      stroke="#E99B45"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12,164 C122,160 208,84 300,72 C408,58 506,120 752,164"
                      fill="none"
                      stroke="#8FC0B4"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12,174 C220,174 302,166 388,144 C482,120 582,92 752,86"
                      fill="none"
                      stroke="#9C95C6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    <g>
                      <rect x="48" y="50" width="106" height="28" fill="#fff" opacity="0.95" rx="5" />
                      <text x="61" y="69" className="fill-[#9B562B] text-[11px] uppercase tracking-[0.11em]">Citrus lift</text>
                    </g>
                    <g>
                      <rect x="330" y="70" width="96" height="28" fill="#fff" opacity="0.95" rx="5" />
                      <text x="343" y="89" className="fill-[#39766A] text-[11px] uppercase tracking-[0.11em]">Water air</text>
                    </g>
                    <g>
                      <rect x="668" y="120" width="74" height="28" fill="#fff" opacity="0.95" rx="5" />
                      <text x="681" y="139" className="fill-[#615C8E] text-[11px] uppercase tracking-[0.11em]">Woods</text>
                    </g>

                    <text x="80" y="198" className="fill-ink-muted text-[10px] uppercase tracking-[0.12em]">0-30 min</text>
                    <text x="318" y="198" className="fill-ink-muted text-[10px] uppercase tracking-[0.12em]">30-90 min</text>
                    <text x="560" y="198" className="fill-ink-muted text-[10px] uppercase tracking-[0.12em]">90 min+</text>
                  </svg>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                {scentMoments.map((moment) => (
                  <article key={moment.phase} className="rounded-xl border border-line bg-paper p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">
                      {moment.phase} {moment.time}
                    </p>
                    <h4 className="mt-2 text-lg">{moment.title}</h4>
                    <ul className="mt-2 space-y-1 text-sm text-ink-muted">
                      {moment.notes.map(({ label, Icon }) => (
                        <li key={label} className="flex items-start gap-2"><Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><span>{label}</span></li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              <p className="mt-4 text-xs text-ink-muted">
                Creative direction only. Final formula and installation profile are confirmed in expert review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Image direction</h2>
        <div className="mt-3 overflow-hidden rounded-xl">
          <div className="relative min-h-[280px] bg-surface-sunken" aria-busy={!imageLoaded}>
            {!imageLoaded && (
              <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-ink-muted">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-signal-green motion-safe:animate-pulse" />
                Preparing image direction…
              </div>
            )}
            <img
              src={neroliTerraceVisual}
              alt="Neroli Terrace scent direction mood board"
              onLoad={() => setImageLoaded(true)}
              className={`h-auto w-full motion-safe:transition-opacity motion-safe:duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        </div>
      </section>

      {!isComplex && !state.customerRequestedExpertReview && (
        <div className="mt-8">
          <button
            className="text-xs text-ink-muted underline decoration-line underline-offset-4 hover:text-ink"
            onClick={() => dispatch({ type: 'REQUEST_EXPERT_REVIEW' })}
          >
            Request expert review anyway
          </button>
        </div>
      )}

      <FixedFooter>
            <Button
              variant="secondary"
              onClick={() => dispatch({ type: 'NAVIGATE', screen: 'ai-analysis' })}
            >
              Back
            </Button>
            <div className="ml-auto flex items-stretch gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-signal-green/30 bg-emerald-50 px-4">
              <Wallet size={22} className="shrink-0 text-signal-green" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <p className="text-xs text-ink-muted">Estimated cost</p>
                <p className="tabular text-lg font-semibold">€{oilCost.toLocaleString()}</p>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => dispatch({ type: 'NAVIGATE', screen: 'machine' })}
            >
              Continue to machine recommendation
            </Button>
            </div>
      </FixedFooter>
    </main>
  )
}
