import { useState } from 'react'
import { t } from '../i18n'
import { defaultFileName, formatSize, toPdfFileName } from '../lib/files'
import type { ImageItem } from '../lib/images'
import type { PageMode } from '../lib/settings'
import { downloadFile, shareFile } from '../lib/share'
import { IconBack, IconDownload, IconPencil, IconShare } from './icons'
import { PagePreview, previewPageSize } from './PagePreview'

export interface PdfResult {
  bytes: Uint8Array
  pages: number
  createdAt: Date
  firstItem: ImageItem
  mode: PageMode
}

interface Props {
  result: PdfResult
  onEdit: () => void
  onStartOver: () => void
  onMessage: (message: string) => void
}

const PREVIEW_SIZE = 150

export function ReadyScreen({ result, onEdit, onStartOver, onMessage }: Props) {
  const fallbackName = defaultFileName(result.createdAt)
  const [name, setName] = useState(fallbackName)

  // Built inside the tap handler: share() must start before the tap's activation expires.
  const makeFile = () =>
    new File([result.bytes as Uint8Array<ArrayBuffer>], toPdfFileName(name, fallbackName), { type: 'application/pdf' })

  async function handleShare() {
    const file = makeFile()
    const outcome = await shareFile(file)
    if (outcome === 'unsupported') save(file)
    else if (outcome === 'failed') onMessage(t('shareFailed'))
  }

  function save(file = makeFile()) {
    downloadFile(file)
    onMessage(t('downloadStarted'))
  }

  const page = previewPageSize(result.firstItem, result.mode, PREVIEW_SIZE)

  return (
    <div className="screen ready">
      <header className="topbar">
        <button type="button" className="text-btn back" onClick={onEdit}>
          <IconBack width={20} height={20} />
          {t('edit')}
        </button>
      </header>

      <main className="ready-main">
        <div className="stack" style={{ width: page.width + 16, height: page.height + 12 }} aria-hidden>
          {result.pages > 2 && <div className="page back-2" style={{ width: page.width, height: page.height }} />}
          {result.pages > 1 && <div className="page back-1" style={{ width: page.width, height: page.height }} />}
          <PagePreview item={result.firstItem} mode={result.mode} size={PREVIEW_SIZE} />
        </div>

        <h1 className="ready-title">{t('ready')}</h1>
        <p className="muted">
          {t('pageCount', { n: result.pages })} · {formatSize(result.bytes.byteLength)}
        </p>

        <label className="field">
          <span className="visually-hidden">{t('fileName')}</span>
          <input
            id="file-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setName((value) => value.trim() || fallbackName)}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
          />
          <span className="field-ext">.pdf</span>
          <IconPencil className="field-icon" width={16} height={16} />
        </label>

        <div className="ready-actions">
          <button type="button" className="btn primary" onClick={handleShare}>
            <IconShare width={20} height={20} />
            {t('share')}
          </button>
          <button type="button" className="btn secondary" onClick={() => save()}>
            <IconDownload width={20} height={20} />
            {t('save')}
          </button>
          <button type="button" className="btn plain" onClick={onStartOver}>
            {t('startOver')}
          </button>
        </div>
      </main>
    </div>
  )
}
