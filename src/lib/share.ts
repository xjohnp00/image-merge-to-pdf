export type ShareOutcome = 'shared' | 'cancelled' | 'unsupported' | 'failed'

/**
 * Opens the system share sheet with the file. Must be called straight from a
 * tap handler: browsers refuse to share once the tap's activation has expired.
 */
export async function shareFile(file: File): Promise<ShareOutcome> {
  let supported = false
  try {
    supported = typeof navigator.share === 'function' && navigator.canShare?.({ files: [file] }) === true
  } catch {
    supported = false
  }
  if (!supported) return 'unsupported'

  try {
    await navigator.share({ files: [file] })
    return 'shared'
  } catch (error) {
    return error instanceof DOMException && error.name === 'AbortError' ? 'cancelled' : 'failed'
  }
}

export function downloadFile(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.append(link)
  link.click()
  link.remove()
  // Revoking right away can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
