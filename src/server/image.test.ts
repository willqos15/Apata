import { describe, it, expect } from 'vitest'
import sharp from 'sharp'
import {
  optimizePetImage,
  MAX_DIMENSION,
  MAX_SIZE_BYTES,
  INITIAL_QUALITY,
  QUALITY_STEP,
  MIN_QUALITY,
} from './image'

describe('optimizePetImage', () => {
  it('deve converter uma imagem PNG para WebP', async () => {
    // Cria imagem de teste 200x200 PNG
    const inputBuffer = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer()

    const outputBuffer = await optimizePetImage(inputBuffer)
    const metadata = await sharp(outputBuffer).metadata()

    expect(metadata.format).toBe('webp')
  })

  it('não deve aumentar dimensões de imagens menores que 1600x1600', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 600,
        height: 400,
        channels: 3,
        background: { r: 0, g: 255, b: 0 },
      },
    })
      .jpeg()
      .toBuffer()

    const outputBuffer = await optimizePetImage(inputBuffer)
    const metadata = await sharp(outputBuffer).metadata()

    expect(metadata.width).toBe(600)
    expect(metadata.height).toBe(400)
  })

  it('deve redimensionar respeitando proporção para imagens maiores que 1600x1600 (largura dominante)', async () => {
    // 3200 x 1600 -> deve virar 1600 x 800 mantendo ratio 2:1
    const inputBuffer = await sharp({
      create: {
        width: 3200,
        height: 1600,
        channels: 3,
        background: { r: 0, g: 0, b: 255 },
      },
    })
      .png()
      .toBuffer()

    const outputBuffer = await optimizePetImage(inputBuffer)
    const metadata = await sharp(outputBuffer).metadata()

    expect(metadata.width).toBe(1600)
    expect(metadata.height).toBe(800)
  })

  it('deve redimensionar respeitando proporção para imagens maiores que 1600x1600 (altura dominante)', async () => {
    // 1000 x 2000 -> deve virar 800 x 1600 mantendo ratio 1:2
    const inputBuffer = await sharp({
      create: {
        width: 1000,
        height: 2000,
        channels: 3,
        background: { r: 120, g: 120, b: 120 },
      },
    })
      .png()
      .toBuffer()

    const outputBuffer = await optimizePetImage(inputBuffer)
    const metadata = await sharp(outputBuffer).metadata()

    expect(metadata.width).toBe(800)
    expect(metadata.height).toBe(1600)
  })

  it('deve reduzir a qualidade em passos de 5 quando o arquivo excede o limite de tamanho', async () => {
    // Imagem com ruído para não comprimir trivialmente
    const inputBuffer = await sharp({
      create: {
        width: 800,
        height: 800,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
        noise: { type: 'gaussian', mean: 128, sigma: 30 },
      },
    })
      .png()
      .toBuffer()

    // Tamanho do WebP na qualidade 82
    const bufferAt82 = await sharp(inputBuffer).webp({ quality: 82 }).toBuffer()

    // Definimos um limite menor que a qualidade 82 para forçar o loop de redução
    const targetLimit = Math.floor(bufferAt82.length * 0.85)

    const outputBuffer = await optimizePetImage(inputBuffer, {
      maxSizeBytes: targetLimit,
      initialQuality: 82,
      qualityStep: 5,
      minQuality: 20,
    })

    expect(outputBuffer.length).toBeLessThanOrEqual(targetLimit)
    expect(outputBuffer.length).toBeLessThan(bufferAt82.length)
  })

  it('deve parar ao atingir minQuality se o arquivo ainda exceder o limite', async () => {
    const inputBuffer = await sharp({
      create: {
        width: 800,
        height: 800,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
        noise: { type: 'gaussian', mean: 128, sigma: 30 },
      },
    })
      .png()
      .toBuffer()

    // Limite irrealisticamente baixo (1 byte)
    const outputBuffer = await optimizePetImage(inputBuffer, {
      maxSizeBytes: 1,
      initialQuality: 82,
      qualityStep: 5,
      minQuality: 50,
    })

    // Deve ter parado em minQuality = 50
    const bufferAt50 = await sharp(inputBuffer)
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 50 })
      .toBuffer()

    expect(outputBuffer.length).toBe(bufferAt50.length)
  })

  it('deve exportar as constantes padrão corretas', () => {
    expect(MAX_DIMENSION).toBe(1600)
    expect(MAX_SIZE_BYTES).toBe(1.5 * 1024 * 1024)
    expect(INITIAL_QUALITY).toBe(82)
    expect(QUALITY_STEP).toBe(5)
    expect(MIN_QUALITY).toBe(20)
  })
})
