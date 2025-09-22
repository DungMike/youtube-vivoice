'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Youtube, Lightbulb, Copy, ArrowRight, Loader2 } from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/useToast'
import { apiService } from '@/services/api'
import { isValidYouTubeUrl } from '@/lib/utils'

export default function ScriptGeneratorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [idea, setIdea] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('youtube')
  const router = useRouter()
  const { success, error } = useToast()

  const handleGenerateFromYoutube = async () => {
    if (!youtubeUrl.trim()) {
      error('Please enter a YouTube URL')
      return
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      error('Please enter a valid YouTube URL')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiService.generateScriptFromYoutube(youtubeUrl)

      if (response.success && response.data) {
        setGeneratedScript(response.data.content)
        success(
          'Script generated!',
          'Your script has been created from the YouTube video.'
        )
      } else {
        error(
          'Generation failed',
          response.error || 'Failed to generate script from YouTube video'
        )
      }
    } catch (err) {
      error('Generation failed', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateFromIdea = async () => {
    if (!idea.trim()) {
      error('Please enter your idea')
      return
    }

    if (idea.trim().length < 10) {
      error('Please provide a more detailed idea (at least 10 characters)')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiService.generateScriptFromIdea(idea)

      if (response.success && response.data) {
        setGeneratedScript(response.data.content)
        success(
          'Script generated!',
          'Your script has been created from your idea.'
        )
      } else {
        error(
          'Generation failed',
          response.error || 'Failed to generate script from idea'
        )
      }
    } catch (err) {
      error('Generation failed', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyScript = async () => {
    if (!generatedScript) {
      return
    }

    try {
      await navigator.clipboard.writeText(generatedScript)
      success('Copied!', 'Script copied to clipboard')
    } catch (err) {
      error('Copy failed', 'Failed to copy script to clipboard')
    }
  }

  const handleSendToTTS = () => {
    if (!generatedScript) {
      return
    }

    // Store the script in localStorage to pass to TTS page
    localStorage.setItem('scriptForTTS', generatedScript)
    router.push('/tts?from=script')
    success('Redirecting...', 'Taking you to the Text-to-Speech page')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Script Generator</h1>
        <p className="text-muted-foreground">
          Generate compelling scripts from YouTube videos or your own ideas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Script</CardTitle>
          <CardDescription>
            Choose your preferred method to generate a script
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                From YouTube
              </TabsTrigger>
              <TabsTrigger value="idea" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                From Idea
              </TabsTrigger>
            </TabsList>

            <TabsContent value="youtube" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="youtube-url">YouTube URL</Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  Paste a YouTube video URL to generate a script based on its
                  content
                </p>
              </div>
              <Button
                onClick={handleGenerateFromYoutube}
                disabled={isLoading || !youtubeUrl.trim()}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Script from YouTube
              </Button>
            </TabsContent>

            <TabsContent value="idea" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="idea-input">Your Idea</Label>
                <Textarea
                  id="idea-input"
                  placeholder="Describe your idea, topic, or concept that you'd like to turn into a script..."
                  value={idea}
                  onChange={e => setIdea(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  Provide a detailed description of your idea or topic
                </p>
              </div>
              <Button
                onClick={handleGenerateFromIdea}
                disabled={isLoading || !idea.trim()}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Script from Idea
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Section */}
      {(isLoading || generatedScript) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Script</CardTitle>
            <CardDescription>Your AI-generated script is ready</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {generatedScript}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyScript}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Script
                  </Button>
                  <Button
                    onClick={handleSendToTTS}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Convert to Speech
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
