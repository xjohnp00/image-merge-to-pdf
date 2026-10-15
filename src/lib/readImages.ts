import { createCanvas, releaseCanvas, toJpeg, withImage } from './canvas'
import type { ImageItem } from './images'

const THUMB_EDGE = 400
const THUMB_QUALITY = 0.8

let nextId = 0

/**
 * Turns picked files into list items with small previews, one file at a time to
 * keep memory low. Files the browser can't decode (e.g. HEIC on Android) are skipped.
 */
export async function readImages(
  files: File[],
  onProgress?: (done: number, total: number) => void,
): Promise<{ items: ImageItem[]; failed: number }> {
  const items: ImageItem[] = []
  let failed = 0
  for (const [index, file] of files.entries()) {
    onProgress?.(index, files.length)
    try {
      items.push(await readImage(file))
    } catch (error) {
      console.warn(`Skipping ${file.name}:`, error)
      failed++
    }
  }
  return { items, failed }
}

function readImage(file: File): Promise<ImageItem> {
  return withImage(file, async (img) => {
    const width = img.naturalWidth
    const height = img.naturalHeight
    const scale = Math.min(1, THUMB_EDGE / Math.max(width, height))
    const { canvas, ctx } = createCanvas(width * scale, height * scale)
    try {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const thumb = await toJpeg(canvas, THUMB_QUALITY)
      return {
        id: `img-${Date.now()}-${nextId++}`,
        file,
        thumbUrl: URL.createObjectURL(thumb),
        width,
        height,
        turns: 0,
      }
    } finally {
      releaseCanvas(canvas)
    }
  })
}
