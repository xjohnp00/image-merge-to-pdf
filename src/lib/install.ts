import { useState, useSyncExternalStore } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// Chrome can fire this before React mounts, so listen at module load.
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})
window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  notify()
})

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true

// iPadOS reports itself as a Mac; touch support gives it away.
const isIos = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

const DISMISSED_KEY = 'photo-pdf:install-hint-dismissed'

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Which install hint to show: 'prompt' where the browser offers an install
 * dialog (Android, desktop Chrome), 'ios' where it must be done by hand, or null.
 */
export function useInstallHint() {
  const canPrompt = useSyncExternalStore(subscribe, () => deferredPrompt !== null)
  const [dismissed, setDismissed] = useState(wasDismissed)

  const kind = isStandalone() || dismissed ? null : canPrompt ? 'prompt' : isIos() ? 'ios' : null

  async function install() {
    const event = deferredPrompt
    if (!event) return
    deferredPrompt = null
    notify()
    await event.prompt()
  }

  function dismiss() {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Not remembered; the hint returns next launch.
    }
  }

  return { kind, install, dismiss } as const
}
