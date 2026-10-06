import assert from 'node:assert/strict'
import test from 'node:test'
import {
  fetchStreamers,
  normalizeStreamersResponse,
} from '../src/services/streamersApi.ts'

test('normalizes streamer data and supports multiple platforms', () => {
  const streamers = normalizeStreamersResponse({
    streamers: [
      {
        username: 'ChessPlayer',
        avatar: 'https://images.example/avatar.png',
        url: 'https://www.chess.com/member/ChessPlayer',
        is_live: true,
        platforms: [
          {
            type: 'twitch',
            channel_url: 'https://twitch.tv/chessplayer',
            stream_url: 'https://twitch.tv/chessplayer',
            is_live: true,
          },
          {
            type: 'youtube',
            channel_url: 'https://youtube.com/@chessplayer',
            is_live: false,
          },
        ],
      },
    ],
  })

  assert.deepEqual(streamers, [
    {
      username: 'ChessPlayer',
      avatarUrl: 'https://images.example/avatar.png',
      isLive: true,
      profileUrl: 'https://www.chess.com/member/ChessPlayer',
      platforms: [
        {
          type: 'twitch',
          channelUrl: 'https://twitch.tv/chessplayer',
          streamUrl: 'https://twitch.tv/chessplayer',
          isLive: true,
        },
        {
          type: 'youtube',
          channelUrl: 'https://youtube.com/@chessplayer',
          streamUrl: null,
          isLive: false,
        },
      ],
    },
  ])
})

test('normalizes absent optional fields and rejects unsafe URLs', () => {
  const [streamer, noPlatformStreamer] = normalizeStreamersResponse({
    streamers: [
      {
        username: 'OfflinePlayer',
        avatar: 'javascript:alert(1)',
        url: 'http://www.chess.com/member/OfflinePlayer',
        is_live: false,
        platforms: [],
      },
      {
        username: 'NoPlatformPlayer',
        is_live: false,
      },
    ],
  })

  assert.equal(streamer.avatarUrl, null)
  assert.equal(streamer.profileUrl, null)
  assert.deepEqual(streamer.platforms, [])
  assert.deepEqual(noPlatformStreamer.platforms, [])
})

test('rejects an incompatible response and invalid required fields', () => {
  assert.throws(
    () => normalizeStreamersResponse({ users: [] }),
    /esperado um objeto com uma lista "streamers"/,
  )
  assert.throws(
    () =>
      normalizeStreamersResponse({
        streamers: [{ username: 'MissingStatus' }],
      }),
    /"is_live".*deve ser booleano/,
  )
})

test('fetches and normalizes the Chess.com endpoint response', async () => {
  const originalFetch = globalThis.fetch
  let requestedUrl = ''

  globalThis.fetch = async (input) => {
    requestedUrl = String(input)
    return new Response(
      JSON.stringify({
        streamers: [{ username: 'ApiPlayer', is_live: false }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    const streamers = await fetchStreamers()
    assert.equal(requestedUrl, 'https://api.chess.com/pub/streamers')
    assert.equal(streamers[0].username, 'ApiPlayer')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('reports HTTP errors instead of returning a success-shaped fallback', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(null, { status: 429 })

  try {
    await assert.rejects(fetchStreamers(), /erro HTTP 429/)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('reports network errors and preserves request cancellation', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => {
    throw new TypeError('network unavailable')
  }

  try {
    await assert.rejects(fetchStreamers(), /Não foi possível conectar/)
  } finally {
    globalThis.fetch = originalFetch
  }

  const abortError = new DOMException('Request aborted', 'AbortError')
  globalThis.fetch = async () => {
    throw abortError
  }

  try {
    await assert.rejects(fetchStreamers(), (error: unknown) => error === abortError)
  } finally {
    globalThis.fetch = originalFetch
  }
})
