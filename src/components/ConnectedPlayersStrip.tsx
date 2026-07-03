import type { Participant } from "../types/chat"

interface ConnectedPlayersStripProps {
  participants: Participant[]
}

/**
 * Option B presence UI — always-visible horizontal name strip.
 * Full implementation pending; say "apply option B" to enable.
 */
export default function ConnectedPlayersStrip({ participants }: ConnectedPlayersStripProps) {
  const sorted = [...participants].sort(
    (a, b) => Number(b.isOnline) - Number(a.isOnline)
  )

  return (
    <div className="shrink-0 border-b border-[#1f2538]/80 bg-[#090b14]/30 px-4 py-2">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {sorted.map((player) => (
          <div
            key={player.id}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#1f2942]/60 bg-[#0c0f1d]/80 px-2.5 py-1"
            title={`${player.name} — ${player.isOnline ? "Online" : "Offline"}`}
          >
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                player.isOnline ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            <span className="max-w-[100px] truncate text-[11px] font-medium text-gray-200">
              {player.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
