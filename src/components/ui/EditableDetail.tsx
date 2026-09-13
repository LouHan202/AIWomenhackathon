import { useState } from 'react'
import { Check, Pencil, Plus } from 'lucide-react'
import { TextArea, TextInput } from './Inputs'
import { Button } from './Button'

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
          {numeric ? <TextInput id={`edit-${label}`} autoFocus required type="number" min={1} value={draft} onChange={(e) => setDraft(e.target.value)} /> : <TextArea id={`edit-${label}`} autoFocus required rows={2} value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} />}
          <div className="mt-3 flex gap-2"><Button type="submit" variant="secondary">Save</Button><Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button></div>
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
