'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAtom, useAtomValue } from 'jotai'
import { 
  Upload, 
  Plus, 
  Trash2, 
  Volume2, 
  Download,
  ExternalLink,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUploader } from '@/components/shared/file-uploader'
import { AudioPlayer } from '@/components/shared/audio-player'
import { 
  textBlocksAtom, 
  addTextBlockAtom, 
  updateTextBlockAtom, 
  removeTextBlockAtom,
  voicesAtom 
} from '@/lib/store'
import { useToast } from '@/hooks/useToast'
import { apiService } from '@/services/api'
import { TextBlock } from '@/types'

export default function TTSPage() {
  const [textBlocks, setTextBlocks] = useAtom(textBlocksAtom)
  const addTextBlock = useAtom(addTextBlockAtom)[1]
  const updateTextBlock = useAtom(updateTextBlockAtom)[1]
  const removeTextBlock = useAtom(removeTextBlockAtom)[1]
  const voices = useAtomValue(voicesAtom)
  const [newText, setNewText] = useState('')
  const [isConverting, setIsConverting] = useState(false)
  const searchParams = useSearchParams()
  const { success, error } = useToast()

  // Load script from previous page if coming from script generator
  useEffect(() => {
    const fromScript = searchParams?.get('from') === 'script'
    if (fromScript) {
      const scriptContent = localStorage.getItem('scriptForTTS')
      if (scriptContent) {
        addTextBlock(scriptContent)
        localStorage.removeItem('scriptForTTS')
      }
    }
  }, [searchParams, addTextBlock])

  const handleAddTextBlock = () => {
    if (!newText.trim()) {
      error('Please enter some text')
      return
    }
    addTextBlock(newText.trim())
    setNewText('')
    success('Text added', 'New text block has been added')
  }

  const handleFilesUpload = async (files: File[]) => {
    try {
      const response = await apiService.uploadTextFiles(files)
      
      if (response.success && response.data) {
        response.data.forEach(({ content, fileName }) => {
          addTextBlock(content, fileName)
        })
        success('Files uploaded', `${files.length} file(s) processed successfully`)
      } else {
        error('Upload failed', response.error || 'Failed to process files')
      }
    } catch (err) {
      error('Upload failed', 'An unexpected error occurred')
    }
  }

  const handleVoiceChange = (blockId: string, voiceId: string) => {
    updateTextBlock(blockId, { voice: voiceId })
  }

  const handleConvertSingle = async (block: TextBlock) => {
    updateTextBlock(block.id, { status: 'loading' })
    
    try {
      const response = await apiService.convertTextToSpeech(block.content, block.voice)
      
      if (response.success && response.data) {
        updateTextBlock(block.id, { 
          status: 'completed', 
          audioUrl: response.data.audioUrl 
        })
        success('Conversion complete', 'Your text has been converted to speech')
      } else {
        updateTextBlock(block.id, { 
          status: 'error', 
          error: response.error || 'Conversion failed' 
        })
        error('Conversion failed', response.error || 'Failed to convert text to speech')
      }
    } catch (err) {
      updateTextBlock(block.id, { 
        status: 'error', 
        error: 'Network error' 
      })
      error('Conversion failed', 'An unexpected error occurred')
    }
  }

  const handleConvertAll = async () => {
    const pendingBlocks = textBlocks.filter(block => 
      block.status === 'pending' || block.status === 'error'
    )
    
    if (pendingBlocks.length === 0) {
      error('No pending conversions', 'All text blocks have already been converted')
      return
    }

    setIsConverting(true)
    
    // Set all pending blocks to loading
    pendingBlocks.forEach(block => {
      updateTextBlock(block.id, { status: 'loading' })
    })

    try {
      const requests = pendingBlocks.map(block => ({
        text: block.content,
        voiceId: block.voice
      }))

      const response = await apiService.convertMultipleTexts(requests)
      
      if (response.success && response.data) {
        response.data.forEach((result, index) => {
          const block = pendingBlocks[index]
          updateTextBlock(block.id, {
            status: 'completed',
            audioUrl: result.audioUrl
          })
        })
        success('All conversions complete', `${pendingBlocks.length} text blocks converted successfully`)
      } else {
        pendingBlocks.forEach(block => {
          updateTextBlock(block.id, { 
            status: 'error', 
            error: response.error || 'Conversion failed' 
          })
        })
        error('Batch conversion failed', response.error || 'Failed to convert texts')
      }
    } catch (err) {
      pendingBlocks.forEach(block => {
        updateTextBlock(block.id, { 
          status: 'error', 
          error: 'Network error' 
        })
      })
      error('Batch conversion failed', 'An unexpected error occurred')
    } finally {
      setIsConverting(false)
    }
  }

  const handleOpenVoiceClone = () => {
    window.open('/voice-clone', '_blank')
  }

  const pendingCount = textBlocks.filter(block => 
    block.status === 'pending' || block.status === 'error'
  ).length

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Text-to-Speech</h1>
        <p className="text-muted-foreground">
          Convert your text content into natural-sounding speech
        </p>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Content</CardTitle>
          <CardDescription>
            Add text manually or upload text files to convert to speech
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Enter Text</TabsTrigger>
              <TabsTrigger value="upload">Upload Files</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="new-text">Text Content</Label>
                <Textarea
                  id="new-text"
                  placeholder="Enter the text you want to convert to speech..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleAddTextBlock}
                disabled={!newText.trim()}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Text Block
              </Button>
            </TabsContent>

            <TabsContent value="upload" className="mt-6">
              <FileUploader
                onFilesSelect={handleFilesUpload}
                acceptedTypes=".txt,.docx,.pdf"
                multiple={true}
                maxSize={5 * 1024 * 1024} // 5MB
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Text Blocks Section */}
      {textBlocks.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Text Blocks ({textBlocks.length})</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleOpenVoiceClone}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Clone New Voice
              </Button>
              <Button
                onClick={handleConvertAll}
                disabled={isConverting || pendingCount === 0}
                className="flex items-center gap-2"
              >
                {isConverting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Volume2 className="h-4 w-4" />
                Convert All ({pendingCount})
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {textBlocks.map((block) => (
              <Card key={block.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {block.fileName && (
                        <span className="text-sm font-medium text-muted-foreground">
                          {block.fileName}
                        </span>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        block.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : block.status === 'loading'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : block.status === 'error'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {block.status === 'loading' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                        {block.status}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTextBlock(block.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm line-clamp-3">{block.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-xs">Voice</Label>
                      <Select
                        value={block.voice}
                        onValueChange={(value) => handleVoiceChange(block.id, value)}
                        disabled={block.status === 'loading'}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name} ({voice.language})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {block.status === 'pending' || block.status === 'error' ? (
                      <Button
                        onClick={() => handleConvertSingle(block)}
                        disabled={block.status === 'loading'}
                        size="sm"
                      >
                        <Volume2 className="h-4 w-4 mr-1" />
                        Convert
                      </Button>
                    ) : null}
                  </div>

                  {block.status === 'error' && block.error && (
                    <div className="text-sm text-red-600 dark:text-red-400">
                      Error: {block.error}
                    </div>
                  )}

                  {block.status === 'completed' && block.audioUrl && (
                    <AudioPlayer 
                      src={block.audioUrl} 
                      title={block.fileName || 'Generated Audio'}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {textBlocks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Volume2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No text blocks yet</h3>
            <p className="text-muted-foreground text-center">
              Add some text or upload files to get started with text-to-speech conversion
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
