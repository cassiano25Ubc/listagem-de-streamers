import { useState } from 'react'
import type { Streamer, StreamerPlatform } from '../types/streamer'
import StatusIndicator from './StatusIndicator'

type StreamerCardProps = {
  streamer: Streamer
}

function getPlatformLabel(type: string): string {
  switch (type.toLowerCase()) {
    case 'twitch':
      return 'Twitch'
    case 'youtube':
      return 'YouTube'
    default:
      return type
  }
}

function getPlatformDestination(platform: StreamerPlatform): string | null {
  if (platform.isLive === true && platform.streamUrl) {
    return platform.streamUrl
  }

  return platform.channelUrl
}

function StreamerCard({ streamer }: StreamerCardProps) {
  const [avatarFailed, setAvatarFailed] = useState(false)
  const showAvatar = streamer.avatarUrl !== null && !avatarFailed

  return (
    <li className="streamer-card">
      <div className="streamer-identity">
        {showAvatar ? (
          <img
            className="streamer-avatar"
            src={streamer.avatarUrl ?? undefined}
            alt={`Avatar de ${streamer.username}`}
            loading="lazy"
            onError={() => setAvatarFailed(true)}
          />
        ) : (
          <span className="streamer-avatar avatar-fallback" aria-hidden="true">
            {streamer.username.slice(0, 1).toUpperCase()}
          </span>
        )}

        <div className="streamer-details">
          {streamer.profileUrl ? (
            <a
              className="streamer-name"
              href={streamer.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {streamer.username}
            </a>
          ) : (
            <span className="streamer-name">{streamer.username}</span>
          )}
          <StatusIndicator isLive={streamer.isLive} />
        </div>
      </div>

      <ul className="streamer-platforms" aria-label={`Plataformas de ${streamer.username}`}>
        {streamer.platforms.length === 0 ? (
          <li className="platform-unavailable">Nenhuma plataforma informada</li>
        ) : (
          streamer.platforms.map((platform, index) => {
            const destination = getPlatformDestination(platform)
            const label = getPlatformLabel(platform.type)

            return (
              <li
                key={`${streamer.username}-${platform.type}-${platform.channelUrl ?? platform.streamUrl ?? index}`}
              >
                {destination ? (
                  <a
                    className="platform-link"
                    href={destination}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {label}
                    <span className="external-link-hint">↗</span>
                    <span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                ) : (
                  <span className="platform-label">{label}</span>
                )}
              </li>
            )
          })
        )}
      </ul>
    </li>
  )
}

export default StreamerCard
