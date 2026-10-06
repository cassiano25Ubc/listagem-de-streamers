import type { Streamer, StreamerPlatform } from '../types/streamer'

const STREAMERS_API_URL = 'https://api.chess.com/pub/streamers'

type ApiRecord = Record<string, unknown>

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Resposta inválida da API do Chess.com: "${field}" ausente ou inválido.`)
  }

  return value.trim()
}

function optionalHttpsUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function optionalBoolean(value: unknown, field: string): boolean | null {
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value !== 'boolean') {
    throw new Error(`Resposta inválida da API do Chess.com: "${field}" deve ser booleano.`)
  }

  return value
}

function mapPlatform(value: unknown, index: number, username: string): StreamerPlatform {
  if (!isRecord(value)) {
    throw new Error(
      `Resposta inválida da API do Chess.com: plataforma ${index} de "${username}" não é um objeto.`,
    )
  }

  return {
    type: requiredString(value.type, `platforms[${index}].type`),
    channelUrl: optionalHttpsUrl(value.channel_url),
    streamUrl: optionalHttpsUrl(value.stream_url),
    isLive: optionalBoolean(value.is_live, `platforms[${index}].is_live`),
  }
}

function mapStreamer(value: unknown, index: number): Streamer {
  if (!isRecord(value)) {
    throw new Error(
      `Resposta inválida da API do Chess.com: streamer ${index} não é um objeto.`,
    )
  }

  const username = requiredString(value.username, `streamers[${index}].username`)

  if (typeof value.is_live !== 'boolean') {
    throw new Error(
      `Resposta inválida da API do Chess.com: "is_live" de "${username}" deve ser booleano.`,
    )
  }

  if (
    value.platforms !== undefined &&
    value.platforms !== null &&
    !Array.isArray(value.platforms)
  ) {
    throw new Error(
      `Resposta inválida da API do Chess.com: "platforms" de "${username}" deve ser uma lista.`,
    )
  }

  const platforms = Array.isArray(value.platforms)
    ? value.platforms.map((platform, platformIndex) =>
        mapPlatform(platform, platformIndex, username),
      )
    : []

  return {
    username,
    avatarUrl: optionalHttpsUrl(value.avatar),
    isLive: value.is_live,
    profileUrl: optionalHttpsUrl(value.url),
    platforms,
  }
}

export function normalizeStreamersResponse(value: unknown): Streamer[] {
  if (!isRecord(value) || !Array.isArray(value.streamers)) {
    throw new Error(
      'Resposta inválida da API do Chess.com: esperado um objeto com uma lista "streamers".',
    )
  }

  return value.streamers.map(mapStreamer)
}

export async function fetchStreamers(signal?: AbortSignal): Promise<Streamer[]> {
  let response: Response

  try {
    response = await fetch(STREAMERS_API_URL, { signal })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }

    throw new Error('Não foi possível conectar à API do Chess.com.', { cause: error })
  }

  if (!response.ok) {
    throw new Error(
      `A API do Chess.com respondeu com erro HTTP ${response.status}.`,
    )
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch (error) {
    throw new Error('A API do Chess.com retornou um JSON inválido.', { cause: error })
  }

  return normalizeStreamersResponse(payload)
}
