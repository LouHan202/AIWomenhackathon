import type { ScreenId } from '../lib/types'

// The one memorable element: a thread that carries the brief through the customer journey,
// echoing scent moving through a room rather than a generic numbered stepper. Ink-colored —
// coral stays reserved for the primary CTA (design-contract.md).
const STEPS: { screens: ScreenId[]; label: string }[] = [
  { screens: ['brief-upload'], label: 'Brief' },
  { screens: ['ai-analysis'], label: 'Analysis' },
  { screens: ['suggestion', 'expert-review'], label: 'Direction' },
  { screens: ['commercial-summary'], label: 'Commercial' },
  { screens: ['control-dashboard'], label: 'Live' },
]

export function ScentThreadRail({ current }: { current: ScreenId }) {
  const currentIndex = STEPS.findIndex((s) => s.screens.includes(current))

  return (
    <div className="flex items-center gap-0" aria-label="Journey progress">
      {STEPS.map((step, i) => {
        const passed = i < currentIndex
        const active = i === currentIndex
        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`relative flex h-2.5 w-2.5 items-center justify-center rounded-full transition-colors duration-300 ${
                  passed || active ? 'bg-ink' : 'bg-line'
                }`}
              >
                {active && (
                  <span className="absolute -inset-2 animate-[thread-pulse_2.4s_ease-in-out_infinite] rounded-full bg-ink/30" />
                )}
              </div>
              <span
                className={`text-[10px] uppercase tracking-[0.08em] ${
                  active ? 'text-ink' : passed ? 'text-ink-muted' : 'text-ink-muted/50'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="relative -mt-4 h-px w-10 overflow-hidden sm:w-16">
                <div className="absolute inset-0 bg-line" />
                <div
                  className={`absolute inset-y-0 left-0 bg-ink transition-[width] duration-500 ease-[var(--ease-out-quart)] ${
                    passed ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
