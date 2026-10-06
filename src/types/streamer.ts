export type StreamerPlatform = {
  type: string
  channelUrl: string | null
  streamUrl: string | null
  isLive: boolean | null
}

export type Streamer = {
  username: string
  avatarUrl: string | null
  isLive: boolean
  profileUrl: string | null
  platforms: StreamerPlatform[]
}
