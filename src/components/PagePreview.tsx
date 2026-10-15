import { fitInside, pageSize } from '../lib/buildPdf'
import { isSideways, rotatedSize, type ImageItem } from '../lib/images'
import type { PageMode } from '../lib/settings'

/** Size in CSS pixels of the preview page for an item, with `size` as its long edge. */
export function previewPageSize(item: ImageItem, mode: PageMode, size: number) {
  const image = rotatedSize(item)
  const page = pageSize(mode, image.width, image.height)
  return fitInside(page.width, page.height, size, size)
}

/** A miniature PDF page laid out exactly as buildPdf will lay it out. */
export function PagePreview({ item, mode, size }: { item: ImageItem; mode: PageMode; size: number }) {
  const page = previewPageSize(item, mode, size)
  const image = rotatedSize(item)
  const drawn = fitInside(image.width, image.height, page.width, page.height)
  // The <img> is rotated with CSS, so its own box is the unrotated size.
  const sideways = isSideways(item)

  return (
    <div className="page" style={{ width: page.width, height: page.height }}>
      <img
        src={item.thumbUrl}
        alt=""
        draggable={false}
        style={{
          width: sideways ? drawn.height : drawn.width,
          height: sideways ? drawn.width : drawn.height,
          transform: `translate(-50%, -50%) rotate(${item.turns * 90}deg)`,
        }}
      />
    </div>
  )
}
