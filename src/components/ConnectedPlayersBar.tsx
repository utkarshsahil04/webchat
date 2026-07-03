import { useState, useEffect, useMemo } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { shouldDefaultExpandPlayers } from "../config/chatPresenceUi"
import type { Participant } from "../types/chat"

interface ConnectedPlayersBarProps {
  participants: Participant[]
  isLobby?: boolean
  expanded?: boolean
  onExpandedChange?: (expanded: boolean) => void
}

function StatusDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`}
      title={isOnline ? "Online" : "Offline"}
    />
  )
}

function PlayerChip({ player }: { player: Participant }) {
  return (
    <div
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#1f2942]/60 bg-[#0c0f1d]/80 px-2.5 py-1"
      title={`${player.name} — ${player.isOnline ? "Online" : "Offline"}`}
    >
      <StatusDot isOnline={player.isOnline} />
      <span className="max-w-[100px] truncate text-[11px] font-medium text-gray-200">
        {player.name}
      </span>
      {player.isCurrentUser && (
        <span className="text-[9px] font-bold uppercase text-indigo-400">You</span>
      )}
    </div>
  )
}

export default function ConnectedPlayersBar({
  participants,
  isLobby = false,
  expanded: controlledExpanded,
  onExpandedChange,
}: ConnectedPlayersBarProps) {
  const onlineCount = participants.filter((p) => p.isOnline).length
  const isControlled = controlledExpanded !== undefined

  const [internalExpanded, setInternalExpanded] = useState(() =>
    shouldDefaultExpandPlayers(isLobby, participants.length)
  )

  const expanded = isControlled ? controlledExpanded : internalExpanded

  const setExpanded = (value: boolean | ((prev: boolean) => boolean)) => {
    const next = typeof value === "function" ? value(expanded) : value
    if (isControlled) onExpandedChange?.(next)
    else setInternalExpanded(next)
  }

  useEffect(() => {
    if (isControlled) return
    setInternalExpanded(shouldDefaultExpandPlayers(isLobby, participants.length))
  }, [isLobby, participants.length, isControlled])

  const sortedParticipants = useMemo(
    () => [...participants].sort((a, b) => Number(b.isOnline) - Number(a.isOnline)),
    [participants]
  )

  return (
    <div className="border-b border-[#1f2538]/80 bg-[#090b14]/30 shrink-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#12162b]/30 cursor-pointer"
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0">
          <span className="text-xs font-semibold text-gray-300">
            <span className="text-emerald-400">{onlineCount}</span> online
            {participants.length > 0 && (
              <span className="text-gray-500">
                {" "}
                · {participants.length} {isLobby ? "players" : "in match"}
              </span>
            )}
          </span>
        </div>

        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
        )}
      </button>

      {!expanded && (
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          {sortedParticipants.map((player) => (
            <PlayerChip key={player.id} player={player} />
          ))}
        </div>
      )}

      {expanded && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 max-h-28 overflow-y-auto scrollbar-none">
          {sortedParticipants.map((player) => (
            <PlayerChip key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  )
}
