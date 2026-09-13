import { Dialog, Portal } from '@chakra-ui/react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({ open, onClose, title, hideTitle = false, initialFocusEl, children }: { open: boolean; onClose: () => void; title: string; hideTitle?: boolean; initialFocusEl?: () => HTMLElement | null; children: ReactNode }) {
  return (
    <Dialog.Root open={open} onOpenChange={(e) => { if (!e.open) onClose() }} placement="center" initialFocusEl={initialFocusEl}>
      <Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" />
        <Dialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content className="w-full max-w-md rounded-2xl border border-line bg-paper p-6 shadow-xl sm:p-8">
            <div className={`flex items-start gap-4 ${hideTitle ? 'justify-end' : 'mb-6 justify-between'}`}>
              <Dialog.Title className={hideTitle ? 'sr-only' : 'text-xl'}>{title}</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="shrink-0 rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </Dialog.CloseTrigger>
            </div>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
