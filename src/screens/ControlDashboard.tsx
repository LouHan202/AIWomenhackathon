import { FastForward } from '@phosphor-icons/react'
import { useApp } from '../lib/state'
import { estimateCostToDate, estimateOilRemainingPercent } from '../lib/costs'
import { truncateWords } from '../lib/text'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Inputs'
import { Slider } from '../components/ui/Slider'
import { Switch } from '../components/ui/Switch'
import { EstimateBadge } from '../components/ui/Tag'

const INTERVAL_OPTIONS = [5, 10, 15, 30, 60]

export function ControlDashboard() {
  const { state, dispatch } = useApp()
  const project = state.project!
  const oilRemaining = estimateOilRemainingPercent(project.installedAtDay, state.today, project.brief.durationDays)
  const costToDate = estimateCostToDate(project.zones.length, project.installedAtDay, state.today)
  const daysLive = project.installedAtDay !== null ? state.today - project.installedAtDay : 0

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.1em] text-ink-muted">Control</p>
          <h1 className="mt-1 text-2xl">{truncateWords(project.brief.concept.value, 9) || 'Installation'}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Live for {daysLive} {daysLive === 1 ? 'day' : 'days'} of {project.brief.durationLabel.toLowerCase()}
          </p>
        </div>
        <Button variant="secondary" icon={<FastForward className="h-4 w-4" />} onClick={() => dispatch({ type: 'ADVANCE_DAY' })}>
          Simulate next day
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Remaining fragrance oil</p>
            <EstimateBadge />
          </div>
          <p className="tabular mt-2 text-3xl">{oilRemaining}%</p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
            <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${oilRemaining}%` }} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.08em] text-ink-muted">Cost to date</p>
            <EstimateBadge />
          </div>
          <p className="tabular mt-2 text-3xl">€{costToDate.toLocaleString()}</p>
          <p className="mt-3 text-xs text-ink-muted">derived from runtime, not a sensor reading</p>
        </Card>
      </div>

      <h2 className="mt-10 text-sm font-semibold tracking-normal text-ink-muted">Zones</h2>
      <div className="mt-3 space-y-3">
        {project.zones.map((zone) => (
          <Card key={zone.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  checked={zone.on}
                  onChange={(on) => dispatch({ type: 'UPDATE_ZONE', zoneId: zone.id, patch: { on } })}
                  label={`${zone.name} power`}
                />
                <span className="text-sm font-medium">{zone.name}</span>
              </div>

              <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
                <span className="w-16 text-xs text-ink-muted">Intensity</span>
                <Slider
                  ariaLabel={`${zone.name} intensity`}
                  value={zone.intensity}
                  disabled={!zone.on}
                  onChange={(intensity) => dispatch({ type: 'UPDATE_ZONE', zoneId: zone.id, patch: { intensity } })}
                />
                <span className="tabular w-9 text-right text-xs text-ink-muted">{zone.intensity}%</span>
              </div>

              <Select
                className="w-auto"
                disabled={!zone.on}
                value={zone.intervalMinutes}
                onChange={(e) => dispatch({ type: 'UPDATE_ZONE', zoneId: zone.id, patch: { intervalMinutes: Number(e.target.value) } })}
              >
                {INTERVAL_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    every {m} min
                  </option>
                ))}
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </main>
  )
}
