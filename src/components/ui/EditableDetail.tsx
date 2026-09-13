import { useState } from 'react'
import { Check, Pencil, Plus, X } from 'lucide-react'
import { TextArea, TextInput } from './Inputs'

export function EditableDetail({ label, value, missing, placeholder, numeric, onSave }: {
  label: string
  value: string
  missing: boolean
  placeholder: string
  numeric?: boolean
  onSave: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const open = () => { setDraft(value); setEditing(true) }
  return (
    <div data-analysis-gap={missing || undefined} className={`border-b border-line last:border-b-0 ${missing ? 'bg-amber-50/60' : 'bg-paper'}`}>
      {editing ? (
        <form className="p-5 sm:p-6" onSubmit={(event) => { event.preventDefault(); if (!draft.trim() || (numeric && Number(draft) <= 0)) return; onSave(draft); setEditing(false) }}>
          <label className="mb-3 block text-sm font-semibold" htmlFor={`edit-${label}`}>{label}</label>
          <div className="relative">
            {numeric ? (
              <TextInput
                id={`edit-${label}`}
                autoFocus
                required
                type="number"
                min={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="pr-24"
              />
            ) : (
              <TextArea
                id={`edit-${label}`}
                autoFocus
                required
                rows={2}
                value={draft}
                placeholder={placeholder}
                onChange={(e) => setDraft(e.target.value)}
                className="pr-24"
              />
            )}
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              <button
                type="button"
                aria-label="Close edit"
                onClick={() => setEditing(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-ink-muted transition-colors duration-150 hover:border-ink/40 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <X size={16} />
              </button>
              <button
                type="submit"
                aria-label="Save"
                disabled={!draft.trim() || (numeric && Number(draft) <= 0)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-signal-green bg-signal-green text-white transition-colors duration-150 enabled:hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:border-signal-green/45 disabled:bg-paper disabled:text-signal-green disabled:opacity-40"
              >
                <Check size={16} />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button type="button" onClick={open} className="group flex w-full gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink sm:p-6" aria-label={`Edit ${label}`}>
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${missing ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-700'}`}>{missing ? <Plus size={15} /> : <Check size={15} />}</span>
          <span className="min-w-0 flex-1"><span className="block text-base font-semibold">{label}</span><span className={`mt-2 block text-sm leading-6 ${missing ? 'text-amber-800' : 'text-ink'}`}>{missing ? placeholder : value}</span>{missing && <span className="mt-2 block text-xs text-amber-700">We couldn't find this in your brief.</span>}</span>
          <Pencil size={17} aria-hidden="true" className="mt-1 shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
        </button>
      )}
    </div>
  )
}
