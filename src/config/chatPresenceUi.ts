export type ChatPresenceMode = "A" | "B"

const AUTO_EXPAND_THRESHOLD = 8

/** Switch between Option A (collapsible bar) and Option B (name strip). Set VITE_CHAT_PRESENCE_MODE=B in .env */
export function getChatPresenceMode(): ChatPresenceMode {
  const raw = import.meta.env.VITE_CHAT_PRESENCE_MODE
  return raw === "B" ? "B" : "A"
}

export function isChatPresenceModeA(): boolean {
  return getChatPresenceMode() === "A"
}

/** Match chats (≤8 players) start expanded; tournament lobby starts collapsed. */
export function shouldDefaultExpandPlayers(
  isLobby: boolean,
  participantCount: number
): boolean {
  return !isLobby && participantCount <= AUTO_EXPAND_THRESHOLD
}

export { AUTO_EXPAND_THRESHOLD }
