import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

const base =
  'w-full rounded-full border-none bg-surface-sunken px-5 py-3 text-[0.95rem] text-ink placeholder:text-ink-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40'

// Multi-line text doesn't suit a pill — same borderless sunken fill, softly rounded instead.
const textAreaBase =
  'w-full rounded-2xl border-none bg-surface-sunken px-5 py-4 text-[0.95rem] text-ink placeholder:text-ink-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 resize-none'

export function TextInput({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${base} ${className}`} {...rest} />
}

export function TextArea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${textAreaBase} ${className}`} {...rest} />
}

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${base} appearance-none bg-no-repeat ${className}`} {...rest}>
      {children}
    </select>
  )
}
