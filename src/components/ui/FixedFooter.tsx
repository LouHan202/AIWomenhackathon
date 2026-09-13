import type { ReactNode } from 'react'

export function FixedFooter({ children }: { children: ReactNode }) {
  return <footer className="cta-fixed-footer"><div className="cta-fixed-inner-split">{children}</div></footer>
}
