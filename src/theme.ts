import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

// CSS variables remain shared with Tailwind layouts during the migration.
const colors = Object.fromEntries(
  ['paper', 'surface-sunken', 'line', 'ink', 'ink-muted', 'coral', 'coral-soft',
    'signal-amber', 'signal-green', 'signal-red'].map((name) => [name, { value: `var(--color-${name})` }]),
)
const focus = { outline: '2px solid', outlineColor: 'ink', outlineOffset: '2px' }
const input = {
  width: '100%', height: 'auto', minWidth: 0, border: '1px solid', borderColor: 'line', borderRadius: '0.5rem',
  bg: 'paper', color: 'ink', px: '0.875rem', py: '0.75rem', fontSize: '0.95rem',
  _placeholder: { color: 'ink-muted', opacity: 0.85 }, _focusVisible: focus,
}

export const system = createSystem(defaultConfig, defineConfig({
  preflight: false, // Tailwind owns the reset while both styling systems coexist.
  globalCss: { body: { bg: 'paper', color: 'ink', fontFamily: 'body' } },
  theme: {
    tokens: {
      colors,
      fonts: { body: { value: 'Commissioner, "Noto Sans", sans-serif' }, heading: { value: 'Commissioner, "Noto Sans", sans-serif' } },
    },
    recipes: {
      button: {
        base: {
          borderRadius: '0.5rem', fontWeight: '500', letterSpacing: 'normal',
          transition: 'transform 150ms, background-color 150ms, color 150ms, border-color 150ms, filter 150ms',
          _focusVisible: focus, _disabled: { opacity: 0.4, pointerEvents: 'none' },
          _active: { transform: 'translateY(1px)' },
        },
        variants: {
          size: { md: { h: 'auto', minW: 0, px: '1.5rem', py: '0.75rem', gap: '0.5rem', fontSize: '0.875rem', lineHeight: '1.25rem' } },
          variant: {
            solid: { bg: 'coral', color: 'ink', textTransform: 'none', border: 'none', _hover: { bg: 'coral', filter: 'brightness(1.05)' } },
            outline: { bg: 'paper', color: 'ink', border: '1px solid', borderColor: 'line', _hover: { bg: 'paper', borderColor: 'ink' } },
            ghost: { bg: 'transparent', color: 'ink-muted', _hover: { bg: 'transparent', color: 'ink' } },
          },
        },
      },
      input: { base: input, variants: { variant: { outline: input } } },
      textarea: { base: { ...input, borderRadius: '0.75rem', py: '1rem', resize: 'none' }, variants: { variant: { outline: { border: '1px solid', borderColor: 'line', bg: 'paper' } } } },
    },
    slotRecipes: {
      nativeSelect: { slots: ['root', 'field', 'indicator'], base: { field: input, indicator: { color: 'ink-muted' } }, variants: { variant: { outline: { field: input } } } },
      card: { slots: ['root'], base: { root: { display: 'block', borderRadius: '0.75rem', bg: 'paper', color: 'ink', border: '1px solid', borderColor: 'line', boxShadow: 'none' } }, variants: { variant: { outline: { root: { bg: 'paper', borderColor: 'line' } } } } },
      field: { slots: ['root', 'label', 'helperText'], base: {
        root: { gap: '0.5rem' }, label: { color: 'ink', fontSize: '0.875rem', fontWeight: '500', textTransform: 'none', letterSpacing: 'normal' },
        helperText: { color: 'ink-muted', fontSize: '0.75rem' },
      } },
      switch: { slots: ['root', 'control', 'thumb'], base: {
        control: { bg: 'line', _checked: { bg: 'ink' }, _focusVisible: focus },
        thumb: { bg: 'paper', _checked: { bg: 'paper' } },
      }, variants: { variant: { solid: { control: { bg: 'line', _checked: { bg: 'ink' }, _focusVisible: focus }, thumb: { bg: 'paper', _checked: { bg: 'paper' } } } }, size: { lg: { root: { '--switch-height': '1.75rem', '--switch-width': '3rem' } } } } },
      slider: { slots: ['root', 'track', 'range', 'thumb'], base: {
        root: { _disabled: { opacity: 0.4 } }, track: { bg: 'line', height: '0.375rem' }, range: { bg: 'ink' },
        thumb: { width: '1.25rem', height: '1.25rem', bg: 'paper', border: '2px solid', borderColor: 'ink', _focusVisible: focus },
      }, variants: { variant: { outline: { track: { bg: 'line', shadow: 'none' }, range: { bg: 'ink' }, thumb: { bg: 'paper', borderColor: 'ink' } } }, orientation: { horizontal: { track: { height: '0.375rem' } } } } },
    },
  },
}))
