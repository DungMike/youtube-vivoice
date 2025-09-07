'use client'

import { useSetAtom } from 'jotai'
import { addToastAtom } from '@/lib/store'
import { Toast } from '@/types'

export function useToast() {
  const addToast = useSetAtom(addToastAtom)

  const toast = (props: Omit<Toast, 'id'>) => {
    addToast(props)
  }

  const success = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'success',
    })
  }

  const error = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    })
  }

  const info = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    })
  }

  return {
    toast,
    success,
    error,
    info,
  }
}
