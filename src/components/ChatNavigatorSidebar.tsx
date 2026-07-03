import { useEffect, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  Megaphone,
  MessageSquare,
  Swords,
  Trophy,
} from "lucide-react"
import type { TournamentChatTree, MatchChatNode, StageChatNode } from "../types/chat"

export interface RecentChatItem {
  chatId: string
  label: string
  isLobby?: boolean
}

type NavTab = "recent" | "tournament"

interface ChatNavigatorSidebarProps {
  tree: TournamentChatTree
  activeChatId: string
  expandedNodes: Set<string>
  onToggleNode: (nodeId: string) => void
  onSelectChat: (chatId: string) => void
  onClose?: () => void
  className?: string
  hideHeader?: boolean
  recentChats?: RecentChatItem[]
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

function tabClass(active: boolean) {
  return active
    ? "flex-1 rounded-lg border border-purple-400/50 bg-purple-600/20 px-2 py-1.5 text-xs font-semibold text-purple-200 transition-colors cursor-pointer"
    : "flex-1 rounded-lg border border-transparent px-2 py-1.5 text-xs font-semibold text-gray-400 transition-colors hover:bg-purple-500/10 hover:text-purple-200 cursor-pointer"
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
  recentChats = [],
}: ChatNavigatorSidebarProps) {
  const [navTab, setNavTab] = useState<NavTab>(() =>
    recentChats.length > 0 ? "recent" : "tournament"
  )

  const isTournamentExpanded = expandedNodes.has(tree.tournamentId)
  const isLobbyActive = activeChatId === tree.lobbyChatId

  // Switch to Recent when opening a messaged chat, or after first send in a room
  useEffect(() => {
    if (recentChats.some((c) => c.chatId === activeChatId)) {
      setNavTab("recent")
    }
    // recentChats.length: first send adds a room; activeChatId: open another recent chat
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid fighting manual Tournament tab
  }, [activeChatId, recentChats.length])

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId)
    onClose?.()
  }

  return (
    <div className={`flex flex-col bg-[#0c0f1d] text-left ${className}`}>
      {!hideHeader && (
        <div className="shrink-0 border-b border-purple-500/20 px-4 pt-3 pb-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40">
              <MessageSquare className="h-4 w-4" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">Chats</span>
          </div>
          <div className="mt-2.5 h-0.5 w-full rounded-full bg-gradient-to-r from-purple-500 to-transparent" />
        </div>
      )}

      {/* Subheaders: Recent | Tournament */}
      <div className="shrink-0 border-b border-purple-500/20 px-3 py-2">
        <div className="flex gap-1.5 rounded-xl border border-purple-500/20 bg-gray-900/50 p-1">
          <button
            type="button"
            onClick={() => setNavTab("recent")}
            className={tabClass(navTab === "recent")}
          >
            Recent
          </button>
          <button
            type="button"
            onClick={() => setNavTab("tournament")}
            className={tabClass(navTab === "tournament")}
          >
            Tournament
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {navTab === "recent" && (
          <div className="space-y-1.5">
            {recentChats.length === 0 ? (
              <div className="rounded-xl border border-purple-500/20 bg-gray-900/50 px-3 py-6 text-center">
                <p className="text-xs text-gray-500">
                  No recent chats yet. Send a message to add one.
                </p>
              </div>
            ) : (
              recentChats.map((item) => {
                const isActive = activeChatId === item.chatId
                return (
                  <button
                    key={item.chatId}
                    type="button"
                    onClick={() => handleSelectChat(item.chatId)}
                    className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-sm transition-all cursor-pointer ${
                      isActive
                        ? "border-purple-400/60 bg-purple-600/20 text-white ring-1 ring-purple-400/30"
                        : "border-purple-500/25 bg-gray-900/70 text-gray-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                        isActive ? "bg-purple-500/25" : "bg-purple-500/15"
                      }`}
                    >
                      {item.isLobby ? (
                        <Megaphone className="h-3.5 w-3.5 text-purple-300" />
                      ) : (
                        <Swords className="h-3.5 w-3.5 text-purple-300" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                  </button>
                )
              })
            )}
          </div>
        )}

        {navTab === "tournament" && (
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
        )}
      </div>
    </div>
  )
}
