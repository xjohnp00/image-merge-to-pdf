import { useCallback, useRef, useState, type ChangeEvent } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { t } from './i18n'
import { buildPdf } from './lib/buildPdf'
import { useImages } from './lib/images'
import { readImages } from './lib/readImages'
import { loadPageMode, savePageMode, type PageMode } from './lib/settings'
import { ArrangeScreen } from './components/ArrangeScreen'
import { ProgressDialog } from './components/ProgressDialog'
import { ReadyScreen, type PdfResult } from './components/ReadyScreen'
import { SettingsSheet } from './components/SettingsSheet'
import { StartScreen } from './components/StartScreen'
import { Toast } from './components/Toast'

type Busy = { kind: 'reading' | 'creating'; done: number; total: number }

const UPDATE_CHECK_MS = 60 * 60 * 1000

export default function App() {
  const { items, dispatch } = useImages()
  const [pageMode, setPageMode] = useState<PageMode>(loadPageMode)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [busy, setBusy] = useState<Busy | null>(null)
  const [result, setResult] = useState<PdfResult | null>(null)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) setInterval(() => registration.update(), UPDATE_CHECK_MS)
    },
  })

  const showMessage = useCallback((message: string) => setToast({ id: Date.now(), message }), [])
  const hideMessage = useCallback(() => setToast(null), [])

  // Must run inside the tap handler, or iOS won't open the picker.
  const openPicker = () => fileInput.current?.click()

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = '' // Picking the same files again should still fire change.
    if (files.length === 0) return

    setBusy({ kind: 'reading', done: 0, total: files.length })
    try {
      const { items: added, failed } = await readImages(files, (done, total) =>
        setBusy({ kind: 'reading', done, total }),
      )
      dispatch({ type: 'add', items: added })
      if (failed > 0) showMessage(t('skipped', { n: failed }))
    } finally {
      setBusy(null)
    }
  }

  async function createPdf() {
    setBusy({ kind: 'creating', done: 0, total: items.length })
    try {
      const bytes = await buildPdf(items, pageMode, (done, total) => setBusy({ kind: 'creating', done, total }))
      setResult({ bytes, pages: items.length, createdAt: new Date(), firstItem: items[0], mode: pageMode })
    } catch (error) {
      console.error('PDF creation failed', error)
      showMessage(t('pdfFailed'))
    } finally {
      setBusy(null)
    }
  }

  function changePageMode(mode: PageMode) {
    setPageMode(mode)
    savePageMode(mode)
  }

  function startOver() {
    setResult(null)
    dispatch({ type: 'clear' })
  }

  let screen
  if (result) {
    screen = (
      <ReadyScreen result={result} onEdit={() => setResult(null)} onStartOver={startOver} onMessage={showMessage} />
    )
  } else if (items.length === 0) {
    screen = <StartScreen onPick={openPicker} />
  } else {
    screen = (
      <ArrangeScreen
        items={items}
        mode={pageMode}
        onMove={(from, to) => dispatch({ type: 'move', from, to })}
        onRotate={(id) => dispatch({ type: 'rotate', id })}
        onRemove={(id) => dispatch({ type: 'remove', id })}
        onClear={() => dispatch({ type: 'clear' })}
        onAdd={openPicker}
        onOpenSettings={() => setSettingsOpen(true)}
        onCreate={createPdf}
      />
    )
  }

  return (
    <>
      {screen}

      <input
        ref={fileInput}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
        tabIndex={-1}
        aria-hidden
        onChange={handleFiles}
      />

      {settingsOpen && !result && items.length > 0 && (
        <SettingsSheet
          mode={pageMode}
          items={items}
          onChange={changePageMode}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {busy && (
        <ProgressDialog
          title={busy.kind === 'reading' ? t('loadingImages') : t('creating')}
          detail={
            busy.kind === 'reading'
              ? t('loadingProgress', { i: Math.min(busy.done + 1, busy.total), n: busy.total })
              : t('creatingProgress', { i: Math.min(busy.done + 1, busy.total), n: busy.total })
          }
          note={busy.kind === 'creating' ? t('creatingNote') : undefined}
          done={busy.done}
          total={busy.total}
        />
      )}

      {needRefresh ? (
        <Toast
          message={t('updateAvailable')}
          action={{ label: t('update'), onClick: () => updateServiceWorker(true) }}
        />
      ) : (
        toast && <Toast key={toast.id} message={toast.message} onDismiss={hideMessage} />
      )}
    </>
  )
}
