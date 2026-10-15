import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base: IconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconRotate = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 12a8 8 0 1 1-2.34-5.66" />
    <path d="M20 4v5h-5" />
  </svg>
)

export const IconClose = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const IconPlus = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconSettings = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="8" cy="17" r="2" />
  </svg>
)

export const IconShare = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M7 10H6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-1" />
  </svg>
)

export const IconDownload = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 4v11M8 11l4 4 4-4" />
    <path d="M5 20h14" />
  </svg>
)

export const IconBack = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
)

export const IconPencil = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 20h4L19 9l-4-4L4 16z" />
  </svg>
)

/** Stacked photo pages, used as the start screen illustration. */
export const IconPhotos = (props: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinejoin="round" aria-hidden {...props}>
    <rect x="20" y="8" width="32" height="42" rx="4" transform="rotate(8 36 29)" opacity=".4" />
    <rect x="12" y="13" width="32" height="42" rx="4" />
    <path d="M16 46l8-10 6 7 4-4 7 7" />
    <circle cx="33" cy="24" r="3.5" />
  </svg>
)
