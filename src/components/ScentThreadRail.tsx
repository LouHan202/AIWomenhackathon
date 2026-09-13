import { useApp } from '../lib/state'
import type { ScreenId } from '../lib/types'
import { Activity, FileText, FlaskConical, HandCoins, Radio } from 'lucide-react'

// The one memorable element: a thread that carries the brief through the customer journey,
// echoing scent moving through a room rather than a generic numbered stepper. Ink-colored —
// coral stays reserved for the primary CTA (design-contract.md).
const STEPS: { screens: ScreenId[]; label: string; Icon: typeof FileText }[] = [
  { screens: ['brief-upload'], label: 'Brief', Icon: FileText },
  { screens: ['ai-analysis'], label: 'Analysis', Icon: Activity },
  { screens: ['suggestion', 'expert-review'], label: 'Direction', Icon: FlaskConical },
  { screens: ['machine'], label: 'Machine', Icon: Radio },
  { screens: ['commercial-summary'], label: 'Offer', Icon: HandCoins },
]

export function ScentThreadRail({ current }: { current: ScreenId }) {
  const { state, dispatch } = useApp()
  const currentIndex = STEPS.findIndex((s) => s.screens.includes(current))

  const navigateToStep = (screens: ScreenId[]) => {
    const target = state.role === 'expert' && screens.includes('expert-review') ? 'expert-review' : screens[0]
    dispatch({ type: 'NAVIGATE', screen: target })
  }

  return (
    <nav className="flex items-center whitespace-nowrap" aria-label="Journey progress">
      {STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className={`mx-1 h-px w-3 sm:w-5 ${i <= currentIndex ? 'bg-ink' : 'bg-line'}`} />}
          <button type="button" onClick={() => navigateToStep(step.screens)}
            aria-label={`Go to ${step.label}`} aria-current={i === currentIndex ? 'step' : undefined}
            className="flex shrink-0 items-center gap-2 rounded-md p-1 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${i <= currentIndex ? 'border-ink bg-ink text-paper' : 'border-line text-ink-muted'}`}><step.Icon size={12} aria-hidden="true" /></span>
            <span className={`hidden md:inline ${i === currentIndex ? 'font-medium text-ink' : 'text-ink-muted'}`}>{step.label}</span>
          </button>
        </div>
      ))}
    </nav>
  )
}
