import { ChevronDown, ChevronRight, Megaphone, Swords, Trophy } from "lucide-react"
import type { TournamentChatTree, MatchChatNode, StageChatNode } from "../types/chat"

interface ChatNavigatorSidebarProps {
  tree: TournamentChatTree
  activeChatId: string
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
  onSelectChat: (chatId: string) => void
  onClose?: () => void
  className?: string
  hideHeader?: boolean
}

function stageMatchCount(stage: StageChatNode): number {
  return stage.matchDays.reduce((sum, day) => sum + day.matches.length, 0)
}

function MatchRow({
  match,
  isActive,
  onSelect,
}: {
  match: MatchChatNode
  isActive: boolean
  onSelect: () => void
}) {
  const isLive = match.status === "live"

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-sm transition-all cursor-pointer ${
        isActive
          ? "border-purple-400/60 bg-purple-600/20 text-white ring-1 ring-purple-400/30"
          : isLive
            ? "border-emerald-500/40 bg-gray-900/70 text-gray-200 hover:border-emerald-400/50 hover:bg-emerald-500/10"
            : "border-purple-500/25 bg-gray-900/70 text-gray-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
          isActive ? "bg-purple-500/25" : "bg-purple-500/15"
        }`}
      >
        <Swords className="h-3.5 w-3.5 text-purple-300" />
      </span>
      <span className="flex-1 truncate font-semibold">{match.label}</span>
      {isLive && (
        <span className="shrink-0 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400">
          Live
        </span>
      )}
      {match.unreadCount != null && match.unreadCount > 0 && (
        <span className="shrink-0 rounded-full bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
          {match.unreadCount}
        </span>
      )}
    </button>
  )
}

export default function ChatNavigatorSidebar({
  tree,
  activeChatId,
  expandedNodes,
  onToggleNode,
  onSelectChat,
  onClose,
  className = "",
  hideHeader = false,
}: ChatNavigatorSidebarProps) {
  const isTournamentExpanded = expandedNodes.has(tree.tournamentId)
  const isLobbyActive = activeChatId === tree.lobbyChatId

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    onClose?.()
  }

  return (
    <div className={`flex flex-col bg-[#0c0f1d] text-left ${className}`}>
      {!hideHeader && (
        <div className="shrink-0 border-b border-purple-500/20 px-4 py-3">
          <span className="text-sm font-bold tracking-wide text-white">Chats</span>
          <div className="mt-2 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-transparent" />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3">
        {/* Tournament root card */}
        <div className="rounded-xl border border-purple-500/20 bg-gray-900/50 overflow-hidden">
          <button
            type="button"
            onClick={() => onToggleNode(tree.tournamentId)}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm font-bold text-white transition-colors hover:bg-purple-500/10 cursor-pointer"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-purple-500/15">
              <Trophy className="h-3.5 w-3.5 text-purple-300" />
            </span>
            <span className="min-w-0 flex-1 truncate">{tree.tournamentName}</span>
            {isTournamentExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
            )}
          </button>

          {isTournamentExpanded && (
            <div className="space-y-2 border-t border-purple-500/10 p-2">
              {/* Tournament Lobby pill */}
              <button
                type="button"
                onClick={() => handleSelectChat(tree.lobbyChatId)}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-left text-sm transition-all cursor-pointer ${
                  isLobbyActive
                    ? "border-purple-400/50 bg-gradient-to-r from-purple-600/40 to-indigo-600/30 text-white shadow-md shadow-purple-500/20"
                    : "border-purple-500/30 bg-purple-500/10 text-purple-200 hover:border-purple-400/50 hover:bg-purple-500/20"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    isLobbyActive ? "bg-purple-500/30" : "bg-purple-500/15"
                  }`}
                >
                  <Megaphone className="h-3.5 w-3.5 text-purple-300" />
                </span>
                <span className="font-semibold">Tournament Lobby</span>
              </button>

              {/* Stage blocks */}
              {tree.stages.map((stage) => {
                const isStageExpanded = expandedNodes.has(stage.id)
                const matchCount = stageMatchCount(stage)

                return (
                  <div
                    key={stage.id}
                    className="rounded-xl border border-[#1f2942] bg-[#12162b]/60 transition-colors hover:border-purple-500/30"
                  >
                    <button
                      type="button"
                      onClick={() => onToggleNode(stage.id)}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-bold text-white transition-colors hover:bg-purple-500/5 cursor-pointer"
                    >
                      <span className="min-w-0 flex-1 truncate">{stage.name}</span>
                      {matchCount > 0 && (
                        <span className="shrink-0 rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300">
                          {matchCount} {matchCount === 1 ? "chat" : "chats"}
                        </span>
                      )}
                      {isStageExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      )}
                    </button>

                    {isStageExpanded && (
                      <div className="space-y-1.5 px-2 pb-2">
                        {stage.matchDays.map((day) => {
                          const isDayExpanded = expandedNodes.has(day.id)

                          return (
                            <div key={day.id} className="space-y-1.5">
                              <button
                                type="button"
                                onClick={() => onToggleNode(day.id)}
                                className="flex w-full items-center gap-2 rounded-md border border-[#1f2942] bg-[#0c0f1d] px-2 py-1.5 text-left text-xs font-semibold text-gray-400 transition-colors hover:border-purple-500/20 hover:text-gray-300 cursor-pointer"
                              >
                                {isDayExpanded ? (
                                  <ChevronDown className="h-3 w-3 shrink-0 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 shrink-0 text-gray-500" />
                                )}
                                <span className="truncate uppercase tracking-wider text-[10px]">
                                  {day.label}
                                </span>
                              </button>

                              {isDayExpanded && (
                                <div className="space-y-1.5 pl-0.5">
                                  {day.matches.map((m) => (
                                    <MatchRow
                                      key={m.chatId}
                                      match={m}
                                      isActive={activeChatId === m.chatId}
                                      onSelect={() => handleSelectChat(m.chatId)}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
