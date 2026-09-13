import { useApp } from '../lib/state'
import { ScentThreadRail } from './ScentThreadRail'

export function TopNav() {
  const { state, dispatch } = useApp()
  const canShowRail = state.project !== null

  return (
    <header className="flex items-center justify-between gap-6 border-b border-line bg-paper px-6 py-4 text-ink sm:px-10">
      <div className="font-[var(--font-display)] text-lg lowercase tracking-tight">aeria</div>

      {canShowRail && (
        <div className="hidden md:flex">
          <ScentThreadRail current={state.screen} />
        </div>
      )}

      <div className="flex items-center gap-1 rounded-full border border-line p-1 text-xs">
        {(['customer', 'expert'] as const).map((r) => (
          <button
            key={r}
            onClick={() => dispatch({ type: 'SET_ROLE', role: r })}
            className={`rounded-full px-3.5 py-1.5 uppercase tracking-[0.04em] transition-colors duration-150 ${
              state.role === r ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {r === 'customer' ? 'Client view' : 'Expert view'}
          </button>
        ))}
      </div>
    </header>
  )
}
