import type { Participant } from "../types/chat"

const TEAM_NAMES = [
  "Nova Squad",
  "Vortex Elite",
  "Shadow Legion",
  "Iron Wolves",
  "Phoenix Rising",
  "Storm Breakers",
  "Crimson Hawks",
  "Neon Strikers",
  "Ghost Protocol",
  "Titan Force",
  "Apex Hunters",
  "Blaze Unit",
  "Frost Guard",
  "Omega Clan",
  "Pulse Gaming",
  "Rogue Syndicate",
] as const

const PLAYER_HANDLES = ["Ace", "Blitz", "Cipher", "Dash"] as const

const REGISTERED_FIRST = [
  "Chandan",
  "Amanul",
  "Priya",
  "Jordan",
  "Samir",
  "Elena",
  "Marcus",
  "Yuki",
  "Omar",
  "Sofia",
  "Dev",
  "Nina",
  "Kai",
  "Lara",
  "Ravi",
  "Mia",
] as const

const REGISTERED_LAST = [
  "Kumar",
  "Haque",
  "Shah",
  "Lee",
  "Patel",
  "Rossi",
  "Chen",
  "Tanaka",
  "Hassan",
  "Martinez",
  "Singh",
  "Volkov",
  "Nakamura",
  "Costa",
  "Mehta",
  "Kim",
] as const

function isPlayerOnline(teamIndex: number, playerIndex: number): boolean {
  return (teamIndex * 4 + playerIndex) % 3 !== 0
}

function gameIdFor(teamIndex: number, playerIndex: number): string {
  return String(55_000_000_000 + teamIndex * 10_000 + playerIndex * 137)
}

function buildPlayer(
  teamIndex: number,
  playerIndex: number,
  teamName: string,
  isCurrentUser = false
): Participant {
  const id = `team-${teamIndex}-player-${playerIndex}`
  const handle = PLAYER_HANDLES[playerIndex]
  const shortTeam = teamName.replace(/\s+/g, "")
  const first = REGISTERED_FIRST[teamIndex % REGISTERED_FIRST.length]
  const last = REGISTERED_LAST[(teamIndex + playerIndex) % REGISTERED_LAST.length]
  const registeredName = isCurrentUser ? "Raunak Verma" : `${first} ${last}`
  const username = isCurrentUser
    ? "raunak"
    : `${first}${last}${playerIndex + 1}`.toLowerCase().replace(/\s+/g, "")

  return {
    id,
    name: isCurrentUser ? "Raunak" : `${shortTeam}_${handle}`,
    avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${id}`,
    isOnline: isPlayerOnline(teamIndex, playerIndex),
    isCurrentUser,
    teamName,
    registeredName,
    username,
    gameId: isCurrentUser ? "55678021073" : gameIdFor(teamIndex, playerIndex),
    isLeader: playerIndex === 0,
  }
}

export const currentUser: Participant = {
  id: "me",
  name: "Raunak",
  avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gaming",
  isOnline: true,
  isCurrentUser: true,
  teamName: "Nova Squad",
  registeredName: "Raunak Verma",
  username: "raunak",
  gameId: "55678021073",
  isLeader: true,
}

/** All players across 16 teams (4 players per team = 64 players). */
export const allTournamentPlayers: Participant[] = TEAM_NAMES.flatMap((teamName, teamIndex) =>
  PLAYER_HANDLES.map((_, playerIndex) => {
    const isCurrentUser = teamIndex === 0 && playerIndex === 0
    return isCurrentUser ? currentUser : buildPlayer(teamIndex, playerIndex, teamName)
  })
)

export function getMatchPlayers(matchIndex: number): Participant[] {
  const players: Participant[] = []

  for (let i = 0; i < 4; i++) {
    const teamIndex = matchIndex * 4 + i
    if (teamIndex >= TEAM_NAMES.length) break
    const playerIndex = i % PLAYER_HANDLES.length
    const teamName = TEAM_NAMES[teamIndex]
    const handle = PLAYER_HANDLES[playerIndex]
    const shortTeam = teamName.replace(/\s+/g, "")

    const player = allTournamentPlayers.find(
      (p) => p.teamName === teamName && (p.isCurrentUser || p.name === `${shortTeam}_${handle}`)
    )
    if (player) players.push(player)
  }

  return players
}

export const tournamentAdmin: Participant = {
  id: "admin",
  name: "NOVA_Admin",
  avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=admin",
  isOnline: true,
  isCurrentUser: false,
  teamName: "Tournament Staff",
  registeredName: "NOVA Admin",
  username: "nova_admin",
  gameId: "10000000001",
  isLeader: true,
}

/** Tournament chat includes admin + every registered player. */
export const tournamentChatParticipants: Participant[] = [
  tournamentAdmin,
  ...allTournamentPlayers.filter((p) => !p.isCurrentUser),
  currentUser,
]
