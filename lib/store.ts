import { atom } from 'jotai'
import { User, Voice, TextBlock, Toast } from '@/types'

// User authentication state
export const userAtom = atom<User | null>(null)
export const isAuthenticatedAtom = atom(get => get(userAtom) !== null)

// Available voices
export const voicesAtom = atom<Voice[]>([
  {
    id: 'default-en-male',
    name: 'Default English Male',
    language: 'en',
    gender: 'male',
    isCustom: false,
  },
  {
    id: 'default-en-female',
    name: 'Default English Female',
    language: 'en',
    gender: 'female',
    isCustom: false,
  },
  {
    id: 'default-vi-male',
    name: 'Default Vietnamese Male',
    language: 'vi',
    gender: 'male',
    isCustom: false,
  },
  {
    id: 'default-vi-female',
    name: 'Default Vietnamese Female',
    language: 'vi',
    gender: 'female',
    isCustom: false,
  },
])

// Text blocks for TTS conversion
export const textBlocksAtom = atom<TextBlock[]>([])

// Add new text block
export const addTextBlockAtom = atom(
  null,
  (get, set, content: string, fileName?: string) => {
    const currentBlocks = get(textBlocksAtom)
    const newBlock: TextBlock = {
      id: Date.now().toString(),
      content,
      voice: 'default-en-female',
      status: 'pending',
      fileName,
    }
    set(textBlocksAtom, [...currentBlocks, newBlock])
  }
)

// Update text block
export const updateTextBlockAtom = atom(
  null,
  (get, set, id: string, updates: Partial<TextBlock>) => {
    const currentBlocks = get(textBlocksAtom)
    set(
      textBlocksAtom,
      currentBlocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    )
  }
)

// Remove text block
export const removeTextBlockAtom = atom(null, (get, set, id: string) => {
  const currentBlocks = get(textBlocksAtom)
  set(
    textBlocksAtom,
    currentBlocks.filter(block => block.id !== id)
  )
})

// Toast notifications
export const toastsAtom = atom<Toast[]>([])

// Add toast
export const addToastAtom = atom(null, (get, set, toast: Omit<Toast, 'id'>) => {
  const currentToasts = get(toastsAtom)
  const newToast: Toast = {
    ...toast,
    id: Date.now().toString(),
    duration: toast.duration || 5000,
  }
  set(toastsAtom, [...currentToasts, newToast])

  // Auto remove toast after duration
  setTimeout(() => {
    set(
      toastsAtom,
      get(toastsAtom).filter(t => t.id !== newToast.id)
    )
  }, newToast.duration)
})

// Remove toast
export const removeToastAtom = atom(null, (get, set, id: string) => {
  set(
    toastsAtom,
    get(toastsAtom).filter(toast => toast.id !== id)
  )
})

// Theme
export const themeAtom = atom<'light' | 'dark' | 'system'>('system')
