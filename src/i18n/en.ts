import type { Plural } from './types'

export const en = {
  appName: 'Photo PDF',
  startTitle: 'Turn photos into a PDF',
  startText: 'Pick images from your gallery. Everything stays on your phone.',
  chooseImages: 'Choose images',
  loadingImages: 'Loading images…',
  loadingProgress: '{i} of {n}',

  installTitle: 'Install the app',
  installIos: 'Tap Share, then Add to Home Screen.',
  installPrompt: 'Open it from your home screen, even offline.',
  install: 'Install',
  close: 'Close',

  imageCount: { one: '{n} image', other: '{n} images' } as Plural,
  clear: 'Clear',
  clearTitle: 'Remove all images?',
  clearText: 'The images stay in your gallery. Only this selection is cleared.',
  cancel: 'Cancel',
  remove: 'Remove',
  dragHint: 'Hold and drag to change the order',
  add: 'Add',
  settings: 'Settings',
  pageLabel: 'Page {n}',
  rotateImage: 'Rotate page {n}',
  removeImage: 'Remove page {n}',
  createPdf: 'Create PDF',
  modeChipA4: 'A4 · auto',
  modeChipFit: 'Fit to image',

  settingsTitle: 'PDF settings',
  done: 'Done',
  pageSize: 'Page size',
  modeA4: 'A4',
  modeFit: 'Fit to image',
  modeA4Help: 'Each image is scaled as large as it fits, without distortion. Page orientation follows the image.',
  modeFitHelp: 'Each page takes the proportions of its image, so there are no white edges.',
  quality: 'Quality',
  qualityValue: 'Compressed automatically',

  creating: 'Creating PDF…',
  creatingProgress: 'Image {i} of {n}',
  creatingNote: 'Compressing on your device',

  ready: 'PDF is ready',
  pageCount: { one: '{n} page', other: '{n} pages' } as Plural,
  fileName: 'File name',
  share: 'Share',
  save: 'Save to device',
  startOver: 'Start over',
  edit: 'Edit',
  filePrefix: 'photos',

  skipped: {
    one: "{n} file couldn't be read and was skipped.",
    other: "{n} files couldn't be read and were skipped.",
  } as Plural,
  pdfFailed: "The PDF couldn't be created. Try again with fewer images.",
  shareFailed: "Sharing didn't work. Use Save to device instead.",
  downloadStarted: 'Download started.',
  updateAvailable: 'A new version is available.',
  update: 'Update',
}

export type Messages = { [K in keyof typeof en]: (typeof en)[K] extends string ? string : Plural }
