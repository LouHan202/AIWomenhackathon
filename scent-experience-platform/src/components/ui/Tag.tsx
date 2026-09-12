import type { ReactNode } from 'react'

// 'amber'/'green'/'red' are functional status colors, unrelated to the coral brand accent.
// 'ai'/'neutral' use ink — coral is reserved for the primary CTA only (design-contract.md).
type Kind = 'neutral' | 'amber' | 'green' | 'ai' | 'expert'

const KIND_CLASSES: Record<Kind, string> = {
  neutral: 'border-line text-ink-muted',
  amber: 'border-signal-amber/50 bg-signal-amber/10 text-signal-amber',
  green: 'border-signal-green/50 bg-signal-green/10 text-signal-green',
  ai: 'border-ink/25 text-ink-muted',
  expert: 'border-signal-green/50 bg-signal-green/10 text-signal-green',
}

export function Tag({ children, kind = 'neutral' }: { children: ReactNode; kind?: Kind }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] ${KIND_CLASSES[kind]}`}
    >
      {children}
    </span>
  )
}

/** Marks any predicted/derived number per PRD §10 honesty requirement — never presented as a live reading. */
export function EstimateBadge() {
  return <span className="text-[10px] uppercase tracking-[0.08em] text-ink-muted">estimated</span>
}
