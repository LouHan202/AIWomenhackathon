import { useApp } from '../lib/state'
import { ScentThreadRail } from './ScentThreadRail'

export function TopNav() {
  const { state } = useApp()

  return (
    <header className="flex h-14 items-center border-b border-line bg-paper text-ink">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-3 px-5 sm:px-8">
        <div className="flex shrink-0 items-center gap-2">
          <img src="/logo.svg" alt="Aeria logo" className="h-7 w-7 object-contain" />
          <div className="font-[var(--font-display)] text-xl font-semibold leading-none lowercase tracking-[-0.06em]">aeria</div>
          <span className="hidden sm:inline translate-y-[2px] border-l border-line pl-2 text-xs uppercase leading-none tracking-[0.14em] text-ink-muted">Studio</span>
        </div>

        <div className="ml-auto min-w-0 overflow-x-auto lg:hidden"><ScentThreadRail current={state.screen} compact /></div>
        <div className="ml-auto hidden min-w-0 overflow-x-auto lg:block">
          <ScentThreadRail current={state.screen} />
        </div>
      </div>
    </header>
  )
}
