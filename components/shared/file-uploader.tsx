'use client'

import React, { useCallback } from 'react'
import { Upload, X, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatFileSize } from '@/lib/utils'

interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void
  acceptedTypes?: string
  multiple?: boolean
  maxSize?: number // in bytes
  className?: string
  children?: React.ReactNode
}

export function FileUploader({
  onFilesSelect,
  acceptedTypes = '.txt,.docx,.pdf',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  className,
  children,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} is too large (${formatFileSize(file.size)})`)
        return false
      }
      return true
    })

    setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles)
    onFilesSelect(validFiles)
  }, [maxSize, multiple, onFilesSelect])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index)
      onFilesSelect(newFiles)
      return newFiles
    })
  }, [onFilesSelect])

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-colors',
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {children || (
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: {acceptedTypes.replace(/\./g, '').toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-muted rounded-md"
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="h-6 w-6"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
