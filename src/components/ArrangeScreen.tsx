import { useState, type SyntheticEvent } from 'react'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { t } from '../i18n'
import { isSideways, type ImageItem } from '../lib/images'
import type { PageMode } from '../lib/settings'
import { ConfirmDialog } from './ConfirmDialog'
import { IconClose, IconPlus, IconRotate, IconSettings } from './icons'

interface Props {
  items: ImageItem[]
  mode: PageMode
  onMove: (from: number, to: number) => void
  onRotate: (id: string) => void
  onRemove: (id: string) => void
  onClear: () => void
  onAdd: () => void
  onOpenSettings: () => void
  onCreate: () => void
}

export function ArrangeScreen({ items, mode, onMove, onRotate, onRemove, onClear, onAdd, onOpenSettings, onCreate }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    // A short hold starts a drag, so a normal swipe still scrolls the grid.
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const activeIndex = items.findIndex((item) => item.id === activeId)

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
    navigator.vibrate?.(10)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over || active.id === over.id) return
    onMove(
      items.findIndex((item) => item.id === active.id),
      items.findIndex((item) => item.id === over.id),
    )
  }

  return (
    <div className="screen arrange">
      <header className="topbar">
        <button type="button" className="text-btn" onClick={() => setConfirmClear(true)}>
          {t('clear')}
        </button>
        <h1 className="topbar-title">{t('imageCount', { n: items.length })}</h1>
        <button type="button" className="icon-btn accent" onClick={onOpenSettings} aria-label={t('settings')}>
          <IconSettings width={22} height={22} />
        </button>
      </header>

      <main className="arrange-main">
        <p className="drag-hint">{t('dragHint')}</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
            <ul className="grid">
              {items.map((item, index) => (
                <SortableTile
                  key={item.id}
                  item={item}
                  index={index}
                  onRotate={() => onRotate(item.id)}
                  onRemove={() => onRemove(item.id)}
                />
              ))}
              <li>
                <button type="button" className="tile tile-add" onClick={onAdd}>
                  <IconPlus width={26} height={26} />
                  <span>{t('add')}</span>
                </button>
              </li>
            </ul>
          </SortableContext>
          <DragOverlay>
            {activeIndex >= 0 ? <Tile item={items[activeIndex]} index={activeIndex} lifted /> : null}
          </DragOverlay>
        </DndContext>
      </main>

      <footer className="bottombar">
        <div className="bottombar-inner">
          <button type="button" className="mode-chip" onClick={onOpenSettings}>
            {mode === 'a4' ? t('modeChipA4') : t('modeChipFit')}
          </button>
          <button type="button" className="btn primary grow" onClick={onCreate}>
            {t('createPdf')}
          </button>
        </div>
      </footer>

      {confirmClear && (
        <ConfirmDialog
          title={t('clearTitle')}
          text={t('clearText')}
          confirmLabel={t('remove')}
          onConfirm={() => {
            setConfirmClear(false)
            onClear()
          }}
          onCancel={() => setConfirmClear(false)}
        />
      )}
    </div>
  )
}

interface TileProps {
  item: ImageItem
  index: number
  lifted?: boolean
  onRotate?: () => void
  onRemove?: () => void
}

function SortableTile({ item, index, onRotate, onRemove }: TileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <li
      ref={setNodeRef}
      className={isDragging ? 'tile-slot dragging' : 'tile-slot'}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      aria-label={t('pageLabel', { n: index + 1 })}
    >
      <Tile item={item} index={index} onRotate={onRotate} onRemove={onRemove} />
    </li>
  )
}

// Keeps a tap on a tile button from starting a drag of the whole tile.
const stopDrag = {
  onPointerDown: (e: SyntheticEvent) => e.stopPropagation(),
  onMouseDown: (e: SyntheticEvent) => e.stopPropagation(),
  onTouchStart: (e: SyntheticEvent) => e.stopPropagation(),
  onKeyDown: (e: SyntheticEvent) => e.stopPropagation(),
}

function Tile({ item, index, lifted, onRotate, onRemove }: TileProps) {
  return (
    <div className={lifted ? 'tile lifted' : 'tile'}>
      <img
        className={isSideways(item) ? 'tile-img sideways' : 'tile-img'}
        src={item.thumbUrl}
        alt=""
        draggable={false}
        style={{ transform: `translate(-50%, -50%) rotate(${item.turns * 90}deg)` }}
      />
      <span className="tile-num">{index + 1}</span>
      {onRotate && onRemove && (
        <div className="tile-actions">
          <button type="button" onClick={onRotate} aria-label={t('rotateImage', { n: index + 1 })} {...stopDrag}>
            <IconRotate width={15} height={15} strokeWidth={2.4} />
          </button>
          <button type="button" onClick={onRemove} aria-label={t('removeImage', { n: index + 1 })} {...stopDrag}>
            <IconClose width={15} height={15} strokeWidth={2.4} />
          </button>
        </div>
      )}
    </div>
  )
}
