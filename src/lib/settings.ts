export type PageMode = 'a4' | 'fit'

const KEY = 'photo-pdf:page-mode'

export function loadPageMode(): PageMode {
  try {
    return localStorage.getItem(KEY) === 'fit' ? 'fit' : 'a4'
  } catch {
    return 'a4'
  }
}

export function savePageMode(mode: PageMode) {
  try {
    localStorage.setItem(KEY, mode)
  } catch {
    // Private mode or storage disabled: the choice just isn't remembered.
  }
}
