import type { ButtonHTMLAttributes, ReactNode } from 'react'

// Coral is reserved for the primary CTA only (design-contract.md). Every other
// interactive state — secondary actions, ghost actions, selection — uses ink.
type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

// Only the CTA is uppercase, matching the approved preview — secondary/ghost stay normal case
// so a row of three file-upload chips doesn't read as three competing calls to action.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-coral text-ink uppercase hover:brightness-105 active:translate-y-px focus-visible:ring-ink',
  secondary:
    'bg-paper text-ink border border-line hover:border-ink active:translate-y-px focus-visible:ring-ink',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink active:translate-y-px focus-visible:ring-ink',
}

export function Button({ variant = 'primary', icon, className = '', children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm tracking-normal transition-[transform,background-color,color,border-color,filter] duration-150 ease-[var(--ease-out-quart)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
