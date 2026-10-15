import { cs } from './cs'
import { en, type Messages } from './en'

export type Lang = 'en' | 'cs'

function detectLang(): Lang {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const tag of preferred) {
    const code = tag.toLowerCase().slice(0, 2)
    // Slovak readers get Czech; it is far closer for them than English.
    if (code === 'cs' || code === 'sk') return 'cs'
    if (code === 'en') return 'en'
  }
  return 'en'
}

export const lang = detectLang()
document.documentElement.lang = lang

const messages: Messages = lang === 'cs' ? cs : en
const plurals = new Intl.PluralRules(lang)

export function t(key: keyof Messages, vars: Record<string, string | number> = {}): string {
  const entry = messages[key]
  const text = typeof entry === 'string' ? entry : (entry[plurals.select(Number(vars.n ?? 0))] ?? entry.other)
  return text.replace(/\{(\w+)\}/g, (_, name: string) => String(vars[name] ?? ''))
}
