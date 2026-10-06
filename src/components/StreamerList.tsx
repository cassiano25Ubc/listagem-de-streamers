import type { Streamer } from '../types/streamer'
import StreamerCard from './StreamerCard'

type StreamerListProps = {
  streamers: Streamer[]
}

function StreamerList({ streamers }: StreamerListProps) {
  return (
    <ul className="streamer-list" aria-label="Lista de streamers">
      {streamers.map((streamer) => (
        <StreamerCard key={streamer.username.toLowerCase()} streamer={streamer} />
      ))}
    </ul>
  )
}

export default StreamerList
