'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export interface UseAudioReturn {
  isPlaying: boolean
  duration: number
  currentTime: number
  isLoading: boolean
  error: string | null
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  volume: number
}

export function useAudio(src?: string): UseAudioReturn {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [volume, setVolumeState] = useState(1)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (src) {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
      
      audioRef.current = new Audio(src)
      const audio = audioRef.current
      
      audio.volume = volume
      setIsLoading(true)
      setError(null)

      const handleLoadedMetadata = () => {
        setDuration(audio.duration)
        setIsLoading(false)
      }

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleEnded = () => {
        setIsPlaying(false)
        setCurrentTime(0)
      }

      const handleError = () => {
        setError('Failed to load audio')
        setIsLoading(false)
        setIsPlaying(false)
      }

      const handleCanPlay = () => {
        setIsLoading(false)
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('error', handleError)
      audio.addEventListener('canplay', handleCanPlay)

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('error', handleError)
        audio.removeEventListener('canplay', handleCanPlay)
        audio.pause()
      }
    }
  }, [src, volume])

  const play = useCallback(async () => {
    if (!audioRef.current) return
    
    try {
      setIsLoading(true)
      await audioRef.current.play()
      setIsPlaying(true)
      setError(null)
    } catch (err) {
      setError('Failed to play audio')
      setIsPlaying(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration))
    }
  }, [duration])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume
    }
  }, [])

  return {
    isPlaying,
    duration,
    currentTime,
    isLoading,
    error,
    play,
    pause,
    stop,
    seek,
    setVolume,
    volume,
  }
}
