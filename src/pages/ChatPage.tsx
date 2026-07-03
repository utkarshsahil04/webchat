import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MoreVertical,
  Send,
  PanelRight,
  X,
  SmilePlus,
  Users,
} from "lucide-react"
import { mockChats } from "../data/mockChatData"
import { currentUser } from "../data/tournamentPlayers"
import {
  mockTournamentChatTree,
  getVisibleNavigatorTree,
  findChatPath,
  getAutoExpandNodeIds,
} from "../data/chatNavigatorMock"
import ConnectedPlayersBar from "../components/ConnectedPlayersBar"
import ConnectedPlayersStrip from "../components/ConnectedPlayersStrip"
import ChatNavigatorSidebar from "../components/ChatNavigatorSidebar"
import Header from "../components/Header"
import { getChatHeaderTitle } from "../lib/chatHeader"
import {
  isChatPresenceModeA,
  shouldDefaultExpandPlayers,
} from "../config/chatPresenceUi"
import type { ChatChannel, Message } from "../types/chat"

const visibleTree = getVisibleNavigatorTree(mockTournamentChatTree)
const QUICK_REPLIES = ["GG", "WP", "GLHF"]
const usePresenceModeA = isChatPresenceModeA()

function loadExpandedNodes(): Set<string> {
  try {
    const stored = localStorage.getItem("chat-nav-expanded")
    if (stored) return new Set(JSON.parse(stored) as string[])
  } catch {
    // ignore
  }
  return new Set([mockTournamentChatTree.tournamentId])
}

export default function ChatPage() {
  const navigate = useNavigate()
  const [channels, setChannels] = useState<ChatChannel[]>(mockChats)
  const [activeChannelId, setActiveChannelId] = useState<string>("tournament")
  const [inputText, setInputText] = useState<string>("")
  const [isNavigatorOpen, setIsNavigatorOpen] = useState<boolean>(false)
  const [isPlayersExpanded, setIsPlayersExpanded] = useState<boolean>(() =>
    shouldDefaultExpandPlayers(
      mockChats.find((c) => c.id === "tournament")?.isLobby ?? true,
      mockChats.find((c) => c.id === "tournament")?.participants.length ?? 0
    )
  )
  const [showQuickReplies, setShowQuickReplies] = useState<boolean>(false)
  const [activeMenu, setActiveMenu] = useState<boolean>(false)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(loadExpandedNodes)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0]

  const breadcrumbSegments = useMemo(
    () => findChatPath(mockTournamentChatTree, activeChannelId),
    [activeChannelId]
  )

  const chatTitle = useMemo(
    () =>
      getChatHeaderTitle(activeChannel.isLobby, activeChannel.name, breadcrumbSegments),
    [activeChannel.isLobby, activeChannel.name, breadcrumbSegments]
  )

  const onlineCount = activeChannel.participants.filter((p) => p.isOnline).length

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChannelId, activeChannel.messages])

  useEffect(() => {
    const autoIds = getAutoExpandNodeIds(mockTournamentChatTree, activeChannelId)
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      autoIds.forEach((id) => next.add(id))
      return next
    })
    setIsPlayersExpanded(
      shouldDefaultExpandPlayers(
        activeChannel.isLobby ?? false,
        activeChannel.participants.length
      )
    )
  }, [activeChannelId, activeChannel.isLobby, activeChannel.participants.length])

  useEffect(() => {
    localStorage.setItem("chat-nav-expanded", JSON.stringify([...expandedNodes]))
  }, [expandedNodes])

  const handleToggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }, [])

  const handleSelectChat = useCallback((chatId: string) => {
    setActiveChannelId(chatId)
  }, [])

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: `user_${Date.now()}`,
      senderId: "me",
      senderName: currentUser.name,
      senderAvatarUrl: currentUser.avatarUrl,
      content: inputText,
      type: "text",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannelId ? { ...c, messages: [...c.messages, newMessage] } : c
      )
    )
    setInputText("")
    setShowQuickReplies(false)
  }

  const handleQuickReply = (pill: string) => {
    setInputText((prev) => (prev ? `${prev} ${pill}` : pill))
  }

  return (
    <div className="flex h-screen flex-col bg-[#080a12] text-white overflow-hidden">
      <Header />

      <div className="flex flex-1 min-h-0 flex-col overflow-hidden pt-20 px-4 pb-4 md:px-6 md:pb-6">
        <div className="mx-auto flex w-full max-w-7xl flex-1 min-h-0 flex-col">
          <div className="flex min-h-0 flex-1 overflow-hidden rounded-xl border border-[#1f2942]/60 bg-[#0c0f1d]/70 backdrop-blur-md shadow-2xl shadow-black/50">
            {/* Chat column */}
            <div className="flex flex-1 flex-col overflow-hidden min-w-0">
              {/* Chat header: Back to Tournament | chat title */}
              <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[#1f2538] bg-[#0a0d18] px-3 md:px-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border-2 border-indigo-500/60 bg-indigo-600/15 px-3 text-sm font-semibold text-indigo-200 transition-colors hover:border-indigo-400 hover:bg-indigo-600 hover:text-white cursor-pointer"
                    aria-label="Back to Tournament"
                  >
                    <ArrowLeft className="h-4 w-4 shrink-0" />
                    Back to Tournament
                  </button>
                  <h1 className="truncate text-base font-semibold text-white">{chatTitle}</h1>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  {usePresenceModeA && (
                    <button
                      type="button"
                      onClick={() => setIsPlayersExpanded((v) => !v)}
                      className={`flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium transition-colors cursor-pointer ${
                        isPlayersExpanded
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-gray-400 hover:bg-[#141829] hover:text-white"
                      }`}
                      aria-label="Expand or collapse players list"
                      aria-expanded={isPlayersExpanded}
                    >
                      <Users className="h-4 w-4" />
                      <span className="text-emerald-400">{onlineCount}</span>
                    </button>
                  )}

                  {!usePresenceModeA && (
                    <div
                      className="flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-gray-400"
                      aria-label="Players online"
                    >
                      <Users className="h-4 w-4" />
                      <span className="text-emerald-400">{onlineCount}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsNavigatorOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#141829] hover:text-white lg:hidden cursor-pointer"
                    aria-label="Open chat navigator"
                  >
                    <PanelRight className="h-4 w-4" />
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenu(!activeMenu)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#141829] hover:text-white cursor-pointer"
                      aria-label="Chat options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {activeMenu && (
                      <div className="absolute right-0 mt-1 w-44 rounded-lg border border-[#1f2942] bg-[#0c0f1d] py-1 shadow-2xl z-50">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(false)
                            alert("Notifications muted for this chat.")
                          }}
                          className="w-full px-3 py-2 text-left text-xs hover:bg-[#141829] transition-colors"
                        >
                          Mute notifications
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(false)
                            alert("Chat cleared locally.")
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-[#141829] transition-colors"
                        >
                          Clear chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </header>

              <div className="relative flex flex-1 flex-col overflow-hidden min-h-0">
                {usePresenceModeA ? (
                  <ConnectedPlayersBar
                    participants={activeChannel.participants}
                    isLobby={activeChannel.isLobby}
                    expanded={isPlayersExpanded}
                    onExpandedChange={setIsPlayersExpanded}
                  />
                ) : (
                  <ConnectedPlayersStrip participants={activeChannel.participants} />
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#0c0f1d]/20 to-transparent">
                  {activeChannel.messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-gray-500">No messages yet. Say GLHF!</p>
                    </div>
                  ) : (
                    activeChannel.messages.map((msg) => {
                      const isOwn = msg.senderId === "me"

                      if (msg.type === "system") {
                        return (
                          <div key={msg.id} className="flex justify-center my-2">
                            <span className="rounded-full border border-[#1f2942]/40 bg-[#12162b]/60 px-3 py-1 text-[11px] text-gray-400">
                              {msg.content}
                            </span>
                          </div>
                        )
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-2 ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          {!isOwn && (
                            <img
                              src={msg.senderAvatarUrl}
                              alt={msg.senderName}
                              className="h-7 w-7 shrink-0 rounded-full ring-1 ring-indigo-500/30 object-cover"
                            />
                          )}
                          <div
                            className={`max-w-[75%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                          >
                            {!isOwn && (
                              <span className="mb-0.5 ml-1 text-[10px] font-medium text-gray-500">
                                {msg.senderName}
                              </span>
                            )}
                            <div
                              className={`rounded-2xl px-3.5 py-2 text-sm ${
                                isOwn
                                  ? "bg-indigo-600 text-white rounded-br-sm"
                                  : "border border-[#1f2942]/50 bg-[#13182d] text-gray-100 rounded-bl-sm"
                              }`}
                            >
                              {msg.type === "image" ? (
                                <div className="space-y-1.5">
                                  <p>{msg.content}</p>
                                  <img
                                    src={msg.imageUrl}
                                    alt="Attachment"
                                    className="max-h-40 rounded-lg object-cover"
                                  />
                                </div>
                              ) : (
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                              )}
                            </div>
                            <span className="mt-0.5 text-[9px] text-gray-600">{msg.timestamp}</span>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="shrink-0 border-t border-[#1f2538]/80 bg-[#0c0f1d]/50 p-3">
                  {showQuickReplies && (
                    <div className="mb-2 flex gap-1.5">
                      {QUICK_REPLIES.map((pill) => (
                        <button
                          key={pill}
                          type="button"
                          onClick={() => handleQuickReply(pill)}
                          className="rounded-full border border-[#1f2942] bg-[#12162b] px-3 py-0.5 text-xs font-semibold text-gray-300 transition-colors hover:border-indigo-500 hover:text-white cursor-pointer"
                        >
                          {pill}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end gap-2 rounded-xl border border-[#1f2942] bg-[#090b14]/80 p-1.5 focus-within:border-indigo-500/70 transition-colors">
                    <button
                      type="button"
                      onClick={() => setShowQuickReplies((v) => !v)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                        showQuickReplies
                          ? "bg-indigo-600/20 text-indigo-300"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                      aria-label="Quick replies"
                    >
                      <SmilePlus className="h-4 w-4" />
                    </button>

                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="max-h-16 flex-1 resize-none bg-transparent py-1.5 text-sm text-white placeholder-gray-500 outline-none"
                    />

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all cursor-pointer ${
                        inputText.trim()
                          ? "bg-indigo-600 text-white hover:bg-indigo-500"
                          : "bg-[#12162b] text-gray-600 cursor-not-allowed"
                      }`}
                      aria-label="Send message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile navigator drawer */}
                {isNavigatorOpen && (
                  <div className="lg:hidden absolute inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
                    <div className="flex h-full w-72 flex-col border-l border-[#1f2538] bg-[#0c0f1d]">
                      <div className="flex items-center justify-between border-b border-[#1f2538] px-4 py-3">
                        <span className="text-sm font-bold text-white">Chats</span>
                        <button
                          type="button"
                          onClick={() => setIsNavigatorOpen(false)}
                          className="rounded-lg p-1 text-gray-400 hover:bg-[#12162b] hover:text-white cursor-pointer"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <ChatNavigatorSidebar
                        tree={visibleTree}
                        activeChatId={activeChannelId}
                        expandedNodes={expandedNodes}
                        onToggleNode={handleToggleNode}
                        onSelectChat={handleSelectChat}
                        onClose={() => setIsNavigatorOpen(false)}
                        hideHeader
                        className="flex-1 overflow-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop navigator */}
            <ChatNavigatorSidebar
              tree={visibleTree}
              activeChatId={activeChannelId}
              expandedNodes={expandedNodes}
              onToggleNode={handleToggleNode}
              onSelectChat={handleSelectChat}
              className="hidden lg:flex w-72 shrink-0 border-l border-[#1f2538]/80 bg-[#0c0f1d]/40"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
