import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

// The source icon is full-bleed with its artwork inside the maskable safe zone,
// so no extra padding is needed for any variant.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...preset,
    transparent: { ...preset.transparent, padding: 0 },
    maskable: { ...preset.maskable, padding: 0 },
    apple: { ...preset.apple, padding: 0 },
  },
  images: ['public/icon.svg'],
})
