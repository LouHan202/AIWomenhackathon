import { Slider as ChakraSlider } from '@chakra-ui/react'

export function Slider({ value, onChange, min = 0, max = 100, disabled = false, ariaLabel }: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  disabled?: boolean
  ariaLabel: string
}) {
  return (
    <ChakraSlider.Root value={[value]} onValueChange={({ value }) => onChange(value[0])}
      min={min} max={max} disabled={disabled} aria-label={[ariaLabel]}>
      <ChakraSlider.Control className="h-8">
        <ChakraSlider.Track><ChakraSlider.Range /></ChakraSlider.Track>
        <ChakraSlider.Thumb index={0}><ChakraSlider.HiddenInput /></ChakraSlider.Thumb>
      </ChakraSlider.Control>
    </ChakraSlider.Root>
  )
}
