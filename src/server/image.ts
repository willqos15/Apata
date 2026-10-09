import sharp from 'sharp'

export const MAX_DIMENSION = 1600
export const MAX_SIZE_BYTES = 1.5 * 1024 * 1024 // 1,5 MB
export const INITIAL_QUALITY = 82
export const QUALITY_STEP = 5
export const MIN_QUALITY = 20

export interface OptimizeOptions {
  maxWidth?: number
  maxHeight?: number
  maxSizeBytes?: number
  initialQuality?: number
  qualityStep?: number
  minQuality?: number
}

/**
 * Otimiza uma imagem antes de enviar para armazenamento:
 * - Respeita a proporção original, sem distorção e sem aumentar imagens menores (máximo 1600x1600px).
 * - Converte para WebP iniciando em 82 de qualidade.
 * - Caso ultrapasse 1,5MB, reduz a qualidade em passos de 5 até caber no limite ou atingir a qualidade mínima.
 */
export async function optimizePetImage(
  input: Buffer | Uint8Array | ArrayBuffer,
  options?: OptimizeOptions,
): Promise<Buffer> {
  const maxWidth = options?.maxWidth ?? MAX_DIMENSION
  const maxHeight = options?.maxHeight ?? MAX_DIMENSION
  const maxSizeBytes = options?.maxSizeBytes ?? MAX_SIZE_BYTES
  const initialQuality = options?.initialQuality ?? INITIAL_QUALITY
  const qualityStep = options?.qualityStep ?? QUALITY_STEP
  const minQuality = options?.minQuality ?? MIN_QUALITY

  const buffer = Buffer.isBuffer(input)
    ? input
    : input instanceof ArrayBuffer
      ? Buffer.from(input)
      : Buffer.from(input.buffer, input.byteOffset, input.byteLength)

  const pipeline = sharp(buffer)
    .rotate() // Normaliza orientação EXIF se presente
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })

  let quality = initialQuality
  let outputBuffer: Buffer

  while (true) {
    outputBuffer = await pipeline
      .clone()
      .webp({ quality })
      .toBuffer()

    if (outputBuffer.length <= maxSizeBytes || quality <= minQuality) {
      break
    }

    quality = Math.max(minQuality, quality - qualityStep)
  }

  return outputBuffer
}
