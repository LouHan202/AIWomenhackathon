import { useApp } from '../lib/state'
import { ScentThreadRail } from './ScentThreadRail'

export function TopNav() {
  const { state, dispatch } = useApp()

  return (
    <header className="relative flex h-14 items-center justify-between gap-3 border-b border-line bg-paper px-5 text-ink sm:px-10">
      <div className="font-[var(--font-display)] text-xl font-semibold lowercase tracking-[-0.06em]">aeria</div>

      <div className="absolute left-1/2 top-1/2 max-w-[calc(100%-12rem)] -translate-x-1/2 -translate-y-1/2 overflow-x-auto sm:max-w-[calc(100%-25rem)]">
        <div className="pointer-events-auto">
          <ScentThreadRail current={state.screen} />
        </div>
      </div>

      <div className="ml-auto hidden shrink-0 items-center gap-1 text-xs sm:flex">
        {(['customer', 'expert'] as const).map((r) => (
          <button
            key={r}
            aria-pressed={state.role === r}
            onClick={() => dispatch({ type: 'SET_ROLE', role: r })}
            className={`rounded-md px-3 py-1.5 font-medium transition-colors duration-150 ${
              state.role === r ? 'bg-surface-sunken text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {r === 'customer' ? 'Client view' : 'Expert view'}
          </button>
        ))}
      </div>
      <select aria-label="View role" value={state.role} onChange={(event) => dispatch({ type: 'SET_ROLE', role: event.target.value as 'customer' | 'expert' })} className="w-20 rounded-md border border-line bg-paper p-1 text-xs sm:hidden"><option value="customer">Client</option><option value="expert">Expert</option></select>
    </header>
  )
}
