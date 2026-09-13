import { Card as ChakraCard } from '@chakra-ui/react'
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'default' | 'tight'
  children: ReactNode
}

export function Card({ padding = 'default', className = '', children, ...rest }: CardProps) {
  const pad = padding === 'tight' ? 'p-4' : 'p-6'
  return (
    <ChakraCard.Root className={`${pad} ${className}`} {...rest}>
      {children}
    </ChakraCard.Root>
  )
}
