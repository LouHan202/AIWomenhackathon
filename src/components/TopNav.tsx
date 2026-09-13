import { useApp } from '../lib/state'
import { ScentThreadRail } from './ScentThreadRail'

export function TopNav() {
  const { state } = useApp()

  return (
    <header className="relative flex h-14 items-center border-b border-line bg-paper px-[24px] text-ink md:px-[5vw]">
      <div className="flex shrink-0 items-center gap-2">
        <img src="/logo.svg" alt="Aeria logo" className="h-7 w-7 object-contain" />
        <div className="font-[var(--font-display)] text-xl font-semibold leading-none lowercase tracking-[-0.06em]">aeria</div>
        <span className="translate-y-[2px] border-l border-line pl-2 text-xs uppercase leading-none tracking-[0.14em] text-ink-muted">Studio</span>
      </div>

      <div className="absolute left-1/2 top-1/2 max-w-[calc(100%-12rem)] -translate-x-1/2 -translate-y-1/2 overflow-x-auto sm:max-w-[calc(100%-25rem)]">
        <div className="pointer-events-auto">
          <ScentThreadRail current={state.screen} />
        </div>
      </div>
    </header>
  )
}
