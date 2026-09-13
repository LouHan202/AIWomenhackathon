import { Button as ChakraButton } from '@chakra-ui/react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}
const variants = { primary: 'solid', secondary: 'outline', ghost: 'ghost' } as const

export function Button({ variant = 'primary', icon, children, ...rest }: ButtonProps) {
  return <ChakraButton variant={variants[variant]} {...rest}>{icon}{children}</ChakraButton>
}
