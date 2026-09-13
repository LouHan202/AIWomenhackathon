import { Switch as ChakraSwitch } from '@chakra-ui/react'

export function Switch({ checked, onChange, label }: {
  checked: boolean
  onChange: (next: boolean) => void
  label?: string
}) {
  return (
    <ChakraSwitch.Root checked={checked} onCheckedChange={({ checked }) => onChange(checked)} size="lg">
      <ChakraSwitch.HiddenInput aria-label={label} />
      <ChakraSwitch.Control><ChakraSwitch.Thumb /></ChakraSwitch.Control>
    </ChakraSwitch.Root>
  )
}
