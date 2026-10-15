const RADIUS = 24
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface Props {
  title: string
  detail: string
  note?: string
  done: number
  total: number
}

export function ProgressDialog({ title, detail, note, done, total }: Props) {
  const fraction = total > 0 ? done / total : 0

  return (
    <div className="overlay center">
      <div className="dialog progress" role="dialog" aria-modal="true" aria-labelledby="progress-title">
        <svg className="ring" viewBox="0 0 60 60" aria-hidden>
          <circle className="ring-track" cx="30" cy="30" r={RADIUS} />
          <circle
            className="ring-value"
            cx="30"
            cy="30"
            r={RADIUS}
            strokeDasharray={`${CIRCUMFERENCE * fraction} ${CIRCUMFERENCE}`}
            transform="rotate(-90 30 30)"
          />
          <text x="30" y="34" textAnchor="middle">
            {Math.min(done + 1, total)}/{total}
          </text>
        </svg>
        <h2 id="progress-title">{title}</h2>
        <p className="muted">{detail}</p>
        <div
          className="bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done}
        >
          <i style={{ width: `${fraction * 100}%` }} />
        </div>
        {note && <p className="muted small">{note}</p>}
      </div>
    </div>
  )
}
