export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Voice {
  id: string
  name: string
  language: string
  gender: 'male' | 'female' | 'neutral'
  isCustom: boolean
  previewUrl?: string
}

export interface TextBlock {
  id: string
  content: string
  voice: string
  status: 'pending' | 'loading' | 'completed' | 'error'
  audioUrl?: string
  error?: string
  fileName?: string
}

export interface Script {
  id: string
  title: string
  content: string
  source: 'youtube' | 'idea'
  sourceUrl?: string
  createdAt: string
}

export interface AudioFile {
  id: string
  name: string
  url: string
  duration?: number
  size: number
  type: string
}

export interface VoiceCloneRequest {
  name: string
  audioFile: File
  description?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  duration?: number
}
