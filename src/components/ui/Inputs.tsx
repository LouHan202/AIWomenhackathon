import { Input, Textarea, NativeSelect } from '@chakra-ui/react'
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, Ref } from 'react'

export function TextInput({ size, ...props }: InputHTMLAttributes<HTMLInputElement> & { ref?: Ref<HTMLInputElement> }) {
  return <Input htmlSize={size} {...props} />
}
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
  return <Textarea {...props} />
}
export function Select({ children, disabled, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <NativeSelect.Root disabled={disabled}>
      <NativeSelect.Field {...rest}>{children}</NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}
