import { t } from '../i18n'
import { useInstallHint } from '../lib/install'
import { IconClose, IconPhotos, IconShare } from './icons'

export function StartScreen({ onPick }: { onPick: () => void }) {
  return (
    <div className="screen start">
      <h1 className="large-title">{t('appName')}</h1>
      <div className="empty">
        <IconPhotos className="empty-art" />
        <h2>{t('startTitle')}</h2>
        <p>{t('startText')}</p>
        <button type="button" className="btn primary" onClick={onPick}>
          {t('chooseImages')}
        </button>
      </div>
      <InstallHint />
    </div>
  )
}

function InstallHint() {
  const { kind, install, dismiss } = useInstallHint()
  if (!kind) return null

  return (
    <aside className="install-hint">
      {kind === 'ios' && <IconShare className="install-icon" />}
      <div className="install-text">
        <strong>{t('installTitle')}</strong>
        <span>{kind === 'ios' ? t('installIos') : t('installPrompt')}</span>
      </div>
      {kind === 'prompt' && (
        <button type="button" className="btn small secondary" onClick={install}>
          {t('install')}
        </button>
      )}
      <button type="button" className="icon-btn" onClick={dismiss} aria-label={t('close')}>
        <IconClose width={18} height={18} />
      </button>
    </aside>
  )
}
