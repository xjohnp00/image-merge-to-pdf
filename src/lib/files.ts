import { lang, t } from '../i18n'

const pad = (n: number) => String(n).padStart(2, '0')

/** e.g. photos-2026-10-15-1430 (no extension). */
export function defaultFileName(date: Date): string {
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return `${t('filePrefix')}-${day}-${pad(date.getHours())}${pad(date.getMinutes())}`
}

/** Cleans what the user typed into a safe file name ending in .pdf. */
export function toPdfFileName(input: string, fallback: string): string {
  const base = input
    .replace(/\.pdf$/i, '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, '-')
    .trim()
  return `${base || fallback}.pdf`
}

const decimal = new Intl.NumberFormat(lang, { maximumFractionDigits: 1 })

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kB`
  return `${decimal.format(bytes / (1024 * 1024))} MB`
}
