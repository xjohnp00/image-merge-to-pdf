/**
 * Decodes an image file and hands the element to `use`. The browser applies the
 * EXIF orientation, so naturalWidth/naturalHeight and drawImage are upright.
 */
export async function withImage<T>(blob: Blob, use: (img: HTMLImageElement) => Promise<T>): Promise<T> {
  const url = URL.createObjectURL(blob)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('Image has no size')
    return await use(img)
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** A canvas pre-filled with white, so transparent images don't turn black as JPEG. */
export function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is not available')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  return { canvas, ctx }
}

export function toJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('JPEG export failed'))), 'image/jpeg', quality)
  })
}

/** iOS keeps canvas memory until the size is zeroed, even after the element is dropped. */
export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0
  canvas.height = 0
}
