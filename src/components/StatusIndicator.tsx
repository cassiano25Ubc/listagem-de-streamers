type StatusIndicatorProps = {
  isLive: boolean
}

function StatusIndicator({ isLive }: StatusIndicatorProps) {
  const label = isLive ? 'Ao vivo' : 'Offline'

  return (
    <span className={`streamer-status ${isLive ? 'is-live' : 'is-offline'}`}>
      <span className="status-dot" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}

export default StatusIndicator
