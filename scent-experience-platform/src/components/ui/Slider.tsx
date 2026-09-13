export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
  ariaLabel,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  disabled?: boolean
  ariaLabel: string
}) {
  const percent = ((value - min) / (max - min)) * 100
  return (
    <div className="relative flex h-8 items-center">
      <div className="absolute inset-x-0 h-1.5 rounded-full bg-line" />
      <div className="absolute h-1.5 rounded-full bg-ink" style={{ width: `${percent}%` }} />
      <input
        type="range"
        aria-label={ariaLabel}
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="relative z-10 w-full appearance-none bg-transparent
          [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink
          [&::-webkit-slider-thumb]:bg-paper [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-paper [&::-moz-range-thumb]:cursor-pointer
          disabled:opacity-40 focus-visible:outline-none"
      />
    </div>
  )
}
