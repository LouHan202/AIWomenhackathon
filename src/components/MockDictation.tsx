import { useEffect, useState } from 'react'
import { Mic, Square, X } from 'lucide-react'

const TRANSCRIPT = 'I imagine a welcoming space with a fresh, green opening and soft floral notes. It should feel calm and uplifting, like walking into a sunlit garden after the rain.'

/** A local demo only: never requests microphone permission or captures audio. */
export function MockDictation({ onTranscript, onRecordingChange }: {
  onTranscript: (text: string) => void
  onRecordingChange: (recording: boolean) => void
}) {
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [message, setMessage] = useState('Demo dictation · no microphone needed')

  useEffect(() => {
    if (!recording) return
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [recording])

  function finish(insert: boolean) {
    setRecording(false)
    onRecordingChange(false)
    if (insert) onTranscript(TRANSCRIPT)
    setMessage(insert ? 'Demo transcript added — edit it to make it yours.' : 'Dictation canceled.')
  }

  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-2">
      <p role="status" className="sr-only">{recording ? 'Simulating dictation… stop to add the demo transcript.' : message}</p>
      <div className="flex items-center gap-2">
        {recording ? <>
          <span aria-hidden="true" className="dictation-wave flex h-6 items-center gap-1">{[0, 1, 2, 3, 4].map((i) => <span key={i} style={{ animationDelay: `${i * -0.17}s` }} />)}</span>
          <span className="tabular text-xs text-ink-muted">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span>
          <button type="button" aria-label="Cancel dictation" onClick={() => finish(false)} className="dictation-button"><X size={16} /></button>
          <button type="button" onClick={() => finish(true)} className="dictation-button bg-ink text-paper"><Square size={12} fill="currentColor" /> Stop & insert</button>
        </> : <button type="button" aria-label="Start simulated dictation" title="Start dictation" onClick={() => { setSeconds(0); setRecording(true); onRecordingChange(true) }} className="dictation-button bg-surface-sunken"><Mic size={18} aria-hidden="true" /></button>}
      </div>
    </div>
  )
}
