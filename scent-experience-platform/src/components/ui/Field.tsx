import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  hint?: string
  gapFilled?: boolean
  children: ReactNode
}

/** Label + hint wrapper for a single form field, with an optional "AI couldn't find this" marker. */
export function Field({ label, hint, gapFilled, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-ink-muted">
        {label}
        {gapFilled && (
          <span className="rounded-full border border-signal-amber/50 bg-signal-amber/10 px-2 py-0.5 text-[10px] font-medium normal-case tracking-normal text-signal-amber">
            not found in brief
          </span>
        )}
      </span>
      {children}
      {hint && <span className="text-xs text-ink-muted">{hint}</span>}
    </label>
  )
}
