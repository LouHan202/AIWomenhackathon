import type { Machine, Visibility } from './types'

// Mock catalog — prototype-level, not a real product line.
export const MACHINE_CATALOG: Machine[] = [
  {
    id: 'm-drift-20',
    model: 'Drift 20',
    priceTierLabel: 'Essential',
    priceEur: 320,
    rentalPerWeekEur: 45,
    visibility: 'Hidden / concealed',
    capacityRangeSqm: [0, 35],
    reasoning: 'compact cold-air diffusion, fits a single small room, concealable behind a vent or plinth',
  },
  {
    id: 'm-current-60',
    model: 'Current 60',
    priceTierLabel: 'Signature',
    priceEur: 890,
    rentalPerWeekEur: 110,
    visibility: 'Hidden / concealed',
    capacityRangeSqm: [30, 90],
    reasoning: 'ceiling-mounted HVAC-integrated unit, covers mid-size rooms without a visible fixture',
  },
  {
    id: 'm-plinth-90',
    model: 'Plinth 90',
    priceTierLabel: 'Signature',
    priceEur: 1150,
    rentalPerWeekEur: 140,
    visibility: 'Visible / on display',
    capacityRangeSqm: [30, 110],
    reasoning: 'a designed floor fixture meant to be seen, doubles as a wayfinding or brand moment',
  },
  {
    id: 'm-array-hall',
    model: 'Array Hall',
    priceTierLabel: 'Bespoke',
    priceEur: 1980,
    rentalPerWeekEur: 260,
    visibility: 'Hidden / concealed',
    capacityRangeSqm: [80, 260],
    reasoning: 'multi-head zoned array for large or irregular floor plans, each head independently scheduled',
  },
]

export function recommendMachine(spaceSizeSqm: number | null, visibility: Visibility | null): Machine {
  const size = spaceSizeSqm ?? 40
  const fits = MACHINE_CATALOG.filter((m) => size >= m.capacityRangeSqm[0] && size <= m.capacityRangeSqm[1])
  const pool = fits.length > 0 ? fits : MACHINE_CATALOG
  const byVisibility = visibility ? pool.filter((m) => m.visibility === visibility) : pool
  const chosen = (byVisibility.length > 0 ? byVisibility : pool).reduce((smallest, m) =>
    m.capacityRangeSqm[1] - m.capacityRangeSqm[0] < smallest.capacityRangeSqm[1] - smallest.capacityRangeSqm[0]
      ? m
      : smallest,
  )
  return chosen
}
