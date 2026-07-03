import type { ChatBreadcrumbSegment } from "../types/chat"

export function getChatHeaderTitle(
  isLobby: boolean | undefined,
  channelName: string,
  segments: ChatBreadcrumbSegment[]
): string {
  if (isLobby) return "Tournament Lobby"

  if (segments.length >= 3) {
    const stage = segments[1]?.label
    const leaf = segments[segments.length - 1]?.label
    if (stage && leaf) return `${leaf} · ${stage}`
  }

  return channelName
}
