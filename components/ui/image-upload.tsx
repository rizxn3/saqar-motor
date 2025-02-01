"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Cloud, File, Loader2, CheckCircle2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  currentImage?: string
  onImageUpload: (file: File) => Promise<void>
  isUploading?: boolean
}

export function ImageUpload({
  currentImage,
  onImageUpload,
  isUploading,
  className,
  ...props
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(null)
  
  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setPreview(URL.createObjectURL(file))
        try {
          await onImageUpload(file)
          toast.custom((t) => (
            <div className="bg-black/80 text-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <p>Image uploaded successfully</p>
            </div>
          ), {
            duration: 2000,
            position: 'bottom-right'
          })
        } catch (error) {
          // Error handling is already done in the parent component
        }
      }
    },
    [onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    multiple: false
  })

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative grid w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-3 py-4 md:px-5 text-center transition-colors hover:bg-accent hover:bg-opacity-5",
        isDragActive && "border-primary bg-accent bg-opacity-10",
        isUploading && "pointer-events-none opacity-60",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />

      {(currentImage || preview) ? (
        <div className="relative aspect-square w-32 md:w-40 overflow-hidden rounded-lg">
          {preview ? (
            <img
              src={preview}
              alt="Upload preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={currentImage || ''}
              alt="Current image"
              width={160}
              height={160}
              className="object-cover"
              unoptimized
            />
          )}
        </div>
      ) : (
        <div className="grid place-items-center gap-1 px-2 sm:px-5">
          <Cloud className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
          <p className="mt-2 text-xs md:text-sm font-medium text-muted-foreground">
            Drag & Drop your image here or click to browse
          </p>
          <p className="text-xs text-muted-foreground hidden md:block">
            Supported formats: JPEG, PNG, GIF
          </p>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 grid place-items-center rounded-lg bg-background/50 backdrop-blur-sm">
          <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
} 