import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'
import { withTimeout } from '@/server/timeout'
import { optimizePetImage } from '@/server/image'

const PETS_FOLDER = 'pets_apata'
const UPLOAD_TIMEOUT_MS = 10_000

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  ...(process.env.CLOUDINARY_UPLOAD_PREFIX ? { upload_prefix: process.env.CLOUDINARY_UPLOAD_PREFIX } : {}),
})

export async function uploadPetPhoto(file: File): Promise<UploadApiResponse> {
  const rawBuffer = Buffer.from(await file.arrayBuffer())
  const optimizedBuffer = await optimizePetImage(rawBuffer)

  const upload = new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: PETS_FOLDER, format: 'webp' },
      (error, result) => {
        if (error) reject(error)
        else if (result) resolve(result)
        else reject(new Error('Upload sem resposta'))
      },
    )
    uploadStream.end(optimizedBuffer)
  })

  return withTimeout(upload, UPLOAD_TIMEOUT_MS, 'Tempo esgotado ao enviar a imagem')
}

export function destroyPhoto(publicId: string): Promise<unknown> {
  return cloudinary.uploader.destroy(publicId)
}
