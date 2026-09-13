import type { CommercialTerm, Machine } from './types'

const OIL_ML_PER_ZONE_PER_DAY = 6
const OIL_COST_PER_ML_EUR = 1.35

export function estimateOilCostOverDuration(zoneCount: number, durationDays: number): number {
  return Math.round(zoneCount * durationDays * OIL_ML_PER_ZONE_PER_DAY * OIL_COST_PER_ML_EUR)
}

export function estimateOilRemainingPercent(installedAtDay: number | null, today: number, durationDays: number): number {
  if (installedAtDay === null) return 100
  const elapsed = Math.max(0, today - installedAtDay)
  const fraction = 1 - elapsed / Math.max(durationDays, 1)
  return Math.round(Math.max(0, Math.min(100, fraction * 100)))
}

export function estimateCostToDate(zoneCount: number, installedAtDay: number | null, today: number): number {
  if (installedAtDay === null) return 0
  const elapsedDays = Math.max(0, today - installedAtDay)
  return estimateOilCostOverDuration(zoneCount, elapsedDays)
}

export function commercialTotal(machine: Machine, term: CommercialTerm, durationDays: number, zoneCount: number): number {
  const durationWeeks = Math.ceil(durationDays / 7)
  const machineCost = term === 'purchase' ? machine.priceEur : machine.rentalPerWeekEur * durationWeeks
  return machineCost + estimateOilCostOverDuration(zoneCount, durationDays)
}
