# Photo PDF

An installable web app (PWA) that merges photos from the phone's gallery into one PDF and shares it through the system share sheet. Works on iPhone and Android, in Czech and English (picked from the device language), light and dark. Everything happens on the device; nothing is uploaded.

The original design and build plan, with screen mockups, the app flow and architecture, is in [`docs/design.html`](docs/design.html). Open it in a browser.

## Use

1. **Choose images** opens the gallery (iOS photo library / Android photo picker).
2. Arrange: long-press and drag to reorder, rotate or remove a page, **Add** to append more.
3. Optional: the settings icon switches page size between **A4** (default; orientation follows each image, image scaled as large as it fits without distortion) and **Fit to image**.
4. **Create PDF**, then **Share** (system share sheet) or **Save to device**.

Images are always compressed: long edge at most 2000 px, JPEG quality 0.8.

## Develop

```sh
npm install
npm run dev          # http://localhost:5173
npm run dev:phone    # HTTPS on your LAN IP, for testing on a phone
npm run build        # type-check + production build into dist/
npm run preview      # serve dist/ locally
npm run icons        # regenerate PNG icons from public/icon.svg
```

`dev:phone` uses a self-signed certificate. Pages load after you accept the warning, but iOS will not run the service worker on an untrusted certificate, so test install and offline behavior against the real HTTPS deployment.

## Deploy

`npm run build` produces a static `dist/` folder. Copy its contents to your web server.

- **HTTPS is required** for installing to the home screen and for offline use.
- The build uses relative paths, so it works at the domain root or in any sub-folder.
- Don't let browsers cache `sw.js`, `workbox-*.js`, `index.html` and `manifest.webmanifest`; cache `assets/` forever. Ready-made configs: [`deploy/nginx.conf.example`](deploy/nginx.conf.example) and [`deploy/.htaccess.example`](deploy/.htaccess.example).

When a new version is deployed, open apps show "A new version is available" with an **Update** button.

## Install on a phone

- **iPhone:** open the site in Safari, tap Share, then **Add to Home Screen**. The app shows this hint on first visit.
- **Android:** Chrome offers to install; the app also shows an **Install** button.

## How it works

| File | Role |
| --- | --- |
| `src/App.tsx` | Screen flow: start → arrange → creating → ready |
| `src/lib/images.ts` | Image list state (add, remove, rotate, move, clear) |
| `src/lib/readImages.ts` | Decodes picked files into small previews; skips unreadable files |
| `src/lib/buildPdf.ts` | Per image: decode → rotate + downscale on a canvas → JPEG → embed with pdf-lib → place on page |
| `src/lib/share.ts` | Web Share with the PDF file, download fallback |
| `src/lib/install.ts` | iOS install hint and Android install prompt |
| `src/i18n/` | Czech and English texts, with plurals |

Notes:

- Sharing has to start straight from a tap, so creating and sharing are two taps.
- Images are processed one at a time and canvases are released right away, which keeps iPhones from running out of memory on large selections.
- pdf-lib is loaded only when the first PDF is created, and is precached for offline use.
