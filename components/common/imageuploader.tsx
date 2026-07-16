'use client'

import React, { forwardRef, useState } from 'react'
import { upload, type UploadResponse } from '@imagekit/next'
import { toast } from 'sonner'

interface FileUploadProps {
  onSuccess: (res: UploadResponse) => void
  onProgress?: (progress: number) => void
  fileType?: 'image'
}

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onSuccess, onProgress, fileType = 'image', ...props }, ref) => {
    const [isUploading, setIsUploading] = useState(false)

    const sizeLimits = {
      image: 5 * 1024 * 1024,
    }

    const validTypes: { [key: string]: string[] } = {
      image: ['image/jpeg', 'image/png', 'image/webp'],
    }

    const uploadFolder = {
      image: '/images',
    }

    const fileNamePrefix = {
      image: 'image',
    }

    const acceptType = {
      image: 'image/*',
    }

    const showError = (message: string) => {
      toast.error(message, {
        duration: 3000,
        style: {
          background: '#f87171',
          color: '#fff',
          border: '1px solid #b91c1c',
          padding: '12px 16px',
          fontWeight: 'bold',
          borderRadius: '8px',
        },
        icon: '⚠️',
      })
    }

    const validateFile = (file: File) => {
      if (!validTypes[fileType].includes(file.type)) {
        showError(`Please upload a valid ${fileType} file`)
        return false
      }

      if (file.size > sizeLimits[fileType]) {
        showError(
          `${fileType[0].toUpperCase() + fileType.slice(1)} size must be less than ${
            sizeLimits[fileType] / (1024 * 1024)
          }MB`
        )
        return false
      }

      return true
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!validateFile(file)) {
        e.target.value = ''
        return
      }

      try {
        setIsUploading(true)

        const authRes = await fetch('/api/auth-imagekit')
        if (!authRes.ok) throw new Error('Failed to authenticate')
        const auth = await authRes.json()

        const result = await upload({
          file,
          fileName: `${fileNamePrefix[fileType]}-${Date.now()}`,
          folder: uploadFolder[fileType],
          useUniqueFileName: true,
          publicKey,
          signature: auth.signature,
          token: auth.token,
          expire: auth.expire,
          onProgress: (evt) => {
            if (evt.lengthComputable && onProgress) {
              const percentComplete = (evt.loaded / evt.total) * 100
              onProgress(Math.round(percentComplete))
            }
          },
        })

        onSuccess(result)
      } catch (err) {
        console.error('Upload error:', err)
        showError('Something went wrong while uploading')
      } finally {
        setIsUploading(false)
        e.target.value = ''
      }
    }

    return (
      <div className="space-y-2 w-0 h-0">
        <input
          ref={ref}
          type="file"
          accept={acceptType[fileType]}
          onChange={handleFileChange}
          disabled={isUploading}
          className="file-input file-input-bordered w-full"
          {...props}
        />
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export default FileUpload