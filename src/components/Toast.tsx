import { useEffect } from 'react'

interface Props {
  message: string
  action?: { label: string; onClick: () => void }
  /** Hides itself after a few seconds unless it has an action. */
  onDismiss?: () => void
}

export function Toast({ message, action, onDismiss }: Props) {
  useEffect(() => {
    if (action || !onDismiss) return
    const timer = setTimeout(onDismiss, 4500)
    return () => clearTimeout(timer)
  }, [message, action, onDismiss])

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      {action && (
        <button type="button" className="toast-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
