'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  src: string
  title?: string
  className?: string
  showDownload?: boolean
}

export function AudioPlayer({
  src,
  title,
  className,
  showDownload = true,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    const setAudioData = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime)

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioTime)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioTime)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [src])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = title || 'audio.mp3'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) {
      return '0:00'
    }
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={cn(
        'flex items-center space-x-3 p-3 bg-muted/50 rounded-lg',
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlayPause}
        disabled={isLoading}
        className="shrink-0"
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex-1 space-y-1">
        {title && <div className="text-sm font-medium truncate">{title}</div>}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 cursor-pointer" onClick={handleProgressClick}>
            <Progress value={progress} className="h-1" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        {showDownload && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="shrink-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
