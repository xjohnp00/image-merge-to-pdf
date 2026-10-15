import { createCanvas, releaseCanvas, toJpeg, withImage } from './canvas'
import { rotatedSize, type ImageItem } from './images'
import type { PageMode } from './settings'

/** Long edge of the image embedded in the PDF, in pixels. */
const MAX_EDGE = 2000
const JPEG_QUALITY = 0.8

/** A4 in PDF points (1/72 inch). */
const A4_SHORT = 595.28
const A4_LONG = 841.89

/** Page size in points for an image of the given (rotated) size. */
export function pageSize(mode: PageMode, width: number, height: number): { width: number; height: number } {
  if (mode === 'fit') {
    // Same proportions as the image, printed at A4's long edge.
    const scale = A4_LONG / Math.max(width, height)
    return { width: width * scale, height: height * scale }
  }
  return width > height ? { width: A4_LONG, height: A4_SHORT } : { width: A4_SHORT, height: A4_LONG }
}

/** Scales a box to fit inside another without distortion. */
export function fitInside(width: number, height: number, boxWidth: number, boxHeight: number) {
  const scale = Math.min(boxWidth / width, boxHeight / height)
  return { width: width * scale, height: height * scale }
}

/**
 * Builds the PDF one image at a time: decode, rotate, downscale, encode as JPEG,
 * embed. Only one full-size image is in memory at once, which keeps iPhones from
 * killing the tab on large selections.
 */
export async function buildPdf(
  items: ImageItem[],
  mode: PageMode,
  onProgress: (done: number, total: number) => void,
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  pdf.setCreator('Photo PDF')
  pdf.setProducer('Photo PDF')

  for (const [index, item] of items.entries()) {
    onProgress(index, items.length)
    const jpeg = await renderPage(item)
    const image = await pdf.embedJpg(jpeg)

    const size = rotatedSize(item)
    const pageDims = pageSize(mode, size.width, size.height)
    const page = pdf.addPage([pageDims.width, pageDims.height])
    const drawn = fitInside(size.width, size.height, page.getWidth(), page.getHeight())
    page.drawImage(image, {
      x: (page.getWidth() - drawn.width) / 2,
      y: (page.getHeight() - drawn.height) / 2,
      width: drawn.width,
      height: drawn.height,
    })

    // Give the progress dialog a chance to repaint.
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  onProgress(items.length, items.length)
  return pdf.save()
}

/** Draws one image upright, rotated and downscaled, and returns it as JPEG bytes. */
function renderPage(item: ImageItem): Promise<Uint8Array> {
  return withImage(item.file, async (img) => {
    const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight))
    const width = Math.round(img.naturalWidth * scale)
    const height = Math.round(img.naturalHeight * scale)
    const size = rotatedSize({ ...item, width, height })

    const { canvas, ctx } = createCanvas(size.width, size.height)
    try {
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(((item.turns % 4) * Math.PI) / 2)
      ctx.drawImage(img, -width / 2, -height / 2, width, height)
      const blob = await toJpeg(canvas, JPEG_QUALITY)
      return new Uint8Array(await blob.arrayBuffer())
    } finally {
      releaseCanvas(canvas)
    }
  })
}
