import { useState } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import TournamentHeader from "./components/TournamentHeader"
import TournamentTabs from "./components/TournamentTabs"
import FloatingChatWidget from "./components/FloatingChatWidget"
import ChatPage from "./pages/ChatPage"
import { useIsDesktop } from "./hooks/useIsDesktop"
import "./App.css"

function TournamentPage() {
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()
  const [chatOpen, setChatOpen] = useState(false)

  const openChat = () => {
    if (isDesktop) setChatOpen(true)
    else navigate("/chat")
  }

  return (
    <div className="min-h-screen bg-[#080a12] text-white pt-16 pb-16 md:pb-0">
      <Header />

      <main className="mx-auto max-w-7xl pb-16">
        <TournamentHeader onOpenChat={openChat} />
        <TournamentTabs />
      </main>

      {/* Messenger popup only on desktop — mobile uses full /chat page */}
      {isDesktop && (
        <FloatingChatWidget open={chatOpen} onOpenChange={setChatOpen} />
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TournamentPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
