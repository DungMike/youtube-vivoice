'use client'

import React, { useState } from 'react'
import { useAtom } from 'jotai'
import { Upload, Mic, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AudioPlayer } from '@/components/shared/audio-player'
import { voicesAtom } from '@/lib/store'
import { useToast } from '@/hooks/useToast'
import { apiService } from '@/services/api'
import { formatFileSize } from '@/lib/utils'
import { VoiceCloneRequest } from '@/types'

export default function VoiceClonePage() {
  const [voices, setVoices] = useAtom(voicesAtom)
  const [formData, setFormData] = useState<Partial<VoiceCloneRequest>>({
    name: '',
    description: '',
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('')
  const [isCloning, setIsCloning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const { success, error, info } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('audio/')) {
      error('Invalid file type', 'Please select an audio file (MP3, WAV, etc.)')
      return
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      error('File too large', `Please select a file smaller than ${formatFileSize(maxSize)}`)
      return
    }

    setAudioFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setAudioPreviewUrl(url)
    
    // Auto-generate name from filename if not set
    if (!formData.name) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
      setFormData(prev => ({
        ...prev,
        name: nameWithoutExt,
      }))
    }

    info('File selected', `${file.name} (${formatFileSize(file.size)}) ready for cloning`)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const validateForm = () => {
    if (!formData.name?.trim()) {
      error('Voice name required', 'Please enter a name for your voice clone')
      return false
    }
    if (!audioFile) {
      error('Audio file required', 'Please select an audio file to clone')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsCloning(true)
    setProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 10
        })
      }, 500)

      const request: VoiceCloneRequest = {
        name: formData.name!,
        audioFile: audioFile!,
        description: formData.description,
      }

      const response = await apiService.cloneVoice(request)
      
      clearInterval(progressInterval)
      setProgress(100)

      if (response.success && response.data) {
        // Add new voice to the voices list
        setVoices(prev => [...prev, response.data])
        
        success('Voice cloned successfully!', `${formData.name} is now available for text-to-speech conversion`)
        
        // Reset form
        setFormData({ name: '', description: '' })
        setAudioFile(null)
        setAudioPreviewUrl('')
        setProgress(0)
        
        // Close tab after a delay if opened from TTS page
        setTimeout(() => {
          if (window.opener) {
            window.close()
          }
        }, 2000)
      } else {
        error('Cloning failed', response.error || 'Failed to clone voice')
      }
    } catch (err) {
      error('Cloning failed', 'An unexpected error occurred during voice cloning')
    } finally {
      setIsCloning(false)
    }
  }

  const clearFile = () => {
    setAudioFile(null)
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl)
      setAudioPreviewUrl('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Voice Cloning</h1>
        <p className="text-muted-foreground">
          Create a custom voice clone from your audio sample
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Clone Your Voice
          </CardTitle>
          <CardDescription>
            Upload a high-quality audio sample to create your personalized voice clone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Voice Name */}
            <div className="space-y-2">
              <Label htmlFor="voice-name">Voice Name *</Label>
              <Input
                id="voice-name"
                name="name"
                type="text"
                placeholder="My Custom Voice"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={isCloning}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the characteristics of this voice..."
                value={formData.description || ''}
                onChange={handleInputChange}
                disabled={isCloning}
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label>Audio Sample *</Label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  dragActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isCloning}
                />
                
                {!audioFile ? (
                  <div className="text-center space-y-3">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="font-medium">Drop your audio file here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Supported formats: MP3, WAV, M4A, FLAC</p>
                      <p>Maximum size: 50MB</p>
                      <p>Recommended: 10-30 seconds of clear speech</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div>
                      <p className="font-medium">{audioFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(audioFile.size)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearFile}
                      disabled={isCloning}
                    >
                      Change File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Preview */}
            {audioPreviewUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <AudioPlayer 
                  src={audioPreviewUrl} 
                  title={audioFile?.name || 'Audio Preview'}
                  showDownload={false}
                />
              </div>
            )}

            {/* Progress Bar */}
            {isCloning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cloning Progress</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={isCloning || !audioFile || !formData.name?.trim()}
            >
              {isCloning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCloning ? 'Cloning Voice...' : 'Start Voice Cloning'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            Tips for Best Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Use high-quality audio with minimal background noise</li>
            <li>• Record 10-30 seconds of clear, natural speech</li>
            <li>• Speak at a consistent pace and volume</li>
            <li>• Include varied intonation and emotion</li>
            <li>• Avoid music, echo, or multiple speakers</li>
            <li>• WAV or FLAC formats provide the best quality</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
