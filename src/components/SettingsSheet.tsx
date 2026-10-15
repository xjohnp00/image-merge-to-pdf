import { t } from '../i18n'
import type { ImageItem } from '../lib/images'
import type { PageMode } from '../lib/settings'
import { useEscape } from './ConfirmDialog'
import { PagePreview } from './PagePreview'

interface Props {
  mode: PageMode
  items: ImageItem[]
  onChange: (mode: PageMode) => void
  onClose: () => void
}

const MODES: PageMode[] = ['a4', 'fit']

export function SettingsSheet({ mode, items, onChange, onClose }: Props) {
  useEscape(onClose)

  return (
    <div className="overlay bottom" onClick={onClose}>
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grabber" aria-hidden />
        <div className="sheet-head">
          <h2 id="settings-title">{t('settingsTitle')}</h2>
          <button type="button" className="text-btn strong" onClick={onClose} autoFocus>
            {t('done')}
          </button>
        </div>

        <span className="label" id="page-size-label">
          {t('pageSize')}
        </span>
        <div className="segmented" role="radiogroup" aria-labelledby="page-size-label">
          {MODES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              className={mode === value ? 'on' : undefined}
              onClick={() => onChange(value)}
            >
              {value === 'a4' ? t('modeA4') : t('modeFit')}
            </button>
          ))}
        </div>

        <div className="preview-row" aria-hidden>
          {items.slice(0, 3).map((item) => (
            <PagePreview key={item.id} item={item} mode={mode} size={92} />
          ))}
        </div>
        <p className="help">{mode === 'a4' ? t('modeA4Help') : t('modeFitHelp')}</p>

        <div className="info-row">
          <span>{t('quality')}</span>
          <span className="muted">{t('qualityValue')}</span>
        </div>
      </div>
    </div>
  )
}
