import { FixedFooter } from '../components/ui/FixedFooter'
import { useEffect } from 'react'
import { Sparkle } from '@phosphor-icons/react'
import { useApp } from '../lib/state'
import { MACHINE_CATALOG } from '../lib/machines'
import { estimateOilCostOverDuration } from '../lib/costs'
import { buildVisualDirectionPrompt, generateVisualDirectionMedia } from '../lib/visual-direction'
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
  const visual = project.visualDirectionMedia
  const scentLabel = selected?.label ?? project.directions[0]?.label ?? 'Direction candidate'
  const scentDescription =
    selected?.familyDescription ??
    project.directions[0]?.familyDescription ??
    'A directional scent concept will appear here after selecting a direction.'
  const scentMoments = [
    {
      phase: 'Top',
      time: '0-30 min',
      title: 'Arrival lift',
      notes: ['Citrus peel', 'Airy green leaf', 'Watery brightness'],
    },
    {
      phase: 'Heart',
      time: '30-90 min',
      title: 'Atmosphere build',
      notes: ['Soft floral trace', 'Cool mineral air', 'Textural bridge'],
    },
    {
      phase: 'Base',
      time: '90 min+',
      title: 'Lingering residence',
      notes: ['Clean woods', 'Musk veil', 'Warm surface accord'],
    },
  ]

  useEffect(() => {
    if (visual.status !== 'queued') return
    const direction = selected ?? project.directions[0]
    if (!direction) {
      dispatch({ type: 'FAIL_VISUAL_DIRECTION_GENERATION', error: 'No direction selected for visual generation.' })
      return
    }

    const prompt = buildVisualDirectionPrompt(project.brief, direction)
    dispatch({ type: 'START_VISUAL_DIRECTION_GENERATION', prompt, kind: 'image' })

    let cancelled = false
    ;(async () => {
      try {
        const result = await generateVisualDirectionMedia(visual.provider, prompt, direction.label)
        if (cancelled) return
        dispatch({ type: 'SET_VISUAL_DIRECTION_JOB', jobId: result.jobId })
        dispatch({ type: 'COMPLETE_VISUAL_DIRECTION_GENERATION', assetUrl: result.assetUrl, kind: result.kind })
      } catch (error) {
        if (cancelled) return
        dispatch({
          type: 'FAIL_VISUAL_DIRECTION_GENERATION',
          error: error instanceof Error ? error.message : 'Generation failed',
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [dispatch, project, selected, visual.provider, visual.status])

  return (
    <main className="mx-auto max-w-5xl px-6 pb-36 pt-12 sm:pt-16">
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
        <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Machine</h2>
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
        <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Fragrance direction: pick one to explore</h2>
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
        <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Scent direction</h2>
        <Card className="mt-3 overflow-hidden">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-2xl border border-line bg-surface-sunken p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Olfactive direction</p>
              <h3 className="mt-3 text-2xl">{scentLabel}</h3>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{scentDescription}</p>
              <dl className="mt-6 grid gap-2 text-sm">
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <dt className="text-ink-muted">Format</dt>
                  <dd>Spatial scent</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <dt className="text-ink-muted">Status</dt>
                  <dd>{isConfirmed ? 'Confirmed' : 'Draft'}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2">
                  <dt className="text-ink-muted">Owner</dt>
                  <dd>{isComplex ? 'Expert review' : 'AI + expert'}</dd>
                </div>
              </dl>
            </aside>

            <div className="rounded-2xl border border-line bg-paper p-5">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Olfactory architecture</p>
                  <h3 className="mt-2 text-2xl">{scentLabel}</h3>
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Space trail 0-4 hours</p>
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
                      {moment.notes.map((note) => (
                        <li key={note}>{note}</li>
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
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Image direction</h2>
        <Card className="mt-3 overflow-hidden p-0">
          {visual.status === 'generating' || visual.status === 'queued' ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 bg-surface-sunken px-6 py-12 text-center">
              <p className="text-xs uppercase tracking-[0.12em] text-ink-muted">Generating image direction</p>
              <h3 className="text-3xl">Rendering {scentLabel}</h3>
              <p className="max-w-md text-sm text-ink-muted">
                Building the scene from your approved direction. Provider: {visual.provider === 'nano-banana' ? 'Nano Banana' : 'HeyGen'}.
              </p>
              <div className="mt-2 h-1.5 w-52 overflow-hidden rounded-full bg-line">
                <span className="block h-full w-1/2 animate-pulse rounded-full bg-ink" />
              </div>
            </div>
          ) : visual.status === 'completed' && visual.assetUrl ? (
            <div className="relative bg-paper p-4">
              {visual.kind === 'video' ? (
                <video src={visual.assetUrl} controls playsInline className="h-auto max-h-[560px] w-full rounded-xl border border-line object-cover" />
              ) : (
                <img src={visual.assetUrl} alt={`Generated visual direction for ${scentLabel}`} className="h-auto max-h-[560px] w-full rounded-xl border border-line object-cover" />
              )}
            </div>
          ) : (
            <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 bg-surface-sunken px-6 py-10 text-center">
              <p className="text-sm text-signal-red">{visual.error || 'Generation failed.'}</p>
              <Button
                variant="secondary"
                onClick={() => {
                  dispatch({ type: 'QUEUE_VISUAL_DIRECTION_GENERATION' })
                }}
              >
                Retry generation
              </Button>
            </div>
          )}
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold tracking-normal text-ink-muted">Estimated cost</h2>
        <Card className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-ink-muted">Fragrance oil over {project.brief.durationLabel.toLowerCase()}</p>
            <p className="tabular text-2xl">€{oilCost.toLocaleString()}</p>
          </div>
          <p className="text-xs text-ink-muted">estimated, not a final quote</p>
        </Card>
      </section>

      <FixedFooter>
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'ai-analysis' })}
          >
            Back
          </Button>
          <Button
            variant="primary"
            disabled={!selected || (isComplex && !isConfirmed)}
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'commercial-summary' })}
          >
            Continue to commercial summary
          </Button>
      </FixedFooter>
    </main>
  )
}
