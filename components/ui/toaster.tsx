'use client'

import { useAtomValue, useSetAtom } from 'jotai'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { toastsAtom, removeToastAtom } from '@/lib/store'

export function Toaster() {
  const toasts = useAtomValue(toastsAtom)
  const removeToast = useSetAtom(removeToastAtom)

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose onClick={() => removeToast(id)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
