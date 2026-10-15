import { useEffect, useReducer, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

export interface ImageItem {
  id: string
  /** The original picked file. Read again at full size when the PDF is built. */
  file: File
  /** Object URL of a small JPEG preview. */
  thumbUrl: string
  /** Size of the original, with EXIF orientation already applied. */
  width: number
  height: number
  /** Clockwise quarter turns chosen by the user. Only ever grows, so the CSS rotation animates forward. */
  turns: number
}

export type ImagesAction =
  | { type: 'add'; items: ImageItem[] }
  | { type: 'remove'; id: string }
  | { type: 'rotate'; id: string }
  | { type: 'move'; from: number; to: number }
  | { type: 'clear' }

function reducer(state: ImageItem[], action: ImagesAction): ImageItem[] {
  switch (action.type) {
    case 'add':
      return [...state, ...action.items]
    case 'remove':
      return state.filter((item) => item.id !== action.id)
    case 'rotate':
      return state.map((item) => (item.id === action.id ? { ...item, turns: item.turns + 1 } : item))
    case 'move':
      return arrayMove(state, action.from, action.to)
    case 'clear':
      return []
  }
}

export function useImages() {
  const [items, dispatch] = useReducer(reducer, [])

  // Free the preview of every item that left the list.
  const previous = useRef<ImageItem[]>([])
  useEffect(() => {
    const alive = new Set(items.map((item) => item.id))
    for (const item of previous.current) {
      if (!alive.has(item.id)) URL.revokeObjectURL(item.thumbUrl)
    }
    previous.current = items
  }, [items])

  return { items, dispatch }
}

/** True when the user's rotation turns the image on its side. */
export function isSideways(item: ImageItem): boolean {
  return item.turns % 2 === 1
}

/** Image size after the user's rotation. */
export function rotatedSize(item: ImageItem): { width: number; height: number } {
  return isSideways(item) ? { width: item.height, height: item.width } : { width: item.width, height: item.height }
}
