import {
  BookOpen,
  Home,
  Menu,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface MobileBottomNavItem {
  label: string
  Icon: LucideIcon
  isActive?: boolean
  variant?: "zoop"
  showNewBadge?: boolean
  onClick: () => void
}

export interface NavbarLinkItem {
  name: string
  href: string
  showNewBadge?: boolean
}

export const mobileBottomNavItemBaseClass =
  "flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 py-2 transition-all duration-200"

export const getMobileBottomNavItemClassName = (
  isActive: boolean,
  variant?: "zoop"
): string => {
  if (variant === "zoop") {
    return cn(mobileBottomNavItemBaseClass, "animate-blink text-yellow-400")
  }

  return cn(
    mobileBottomNavItemBaseClass,
    isActive ? "text-purple-400" : "text-gray-400 hover:text-gray-200"
  )
}

export const mobileBottomNavShellClass =
  "bg-black/90 border-t border-purple-500/20"

interface BuildMobileBottomNavItemsParams {
  pathname: string
  isMoreOpen: boolean
  navigate: (path: string) => void
  onNavItemClick: (item: { name: string; href: string }) => void
  onWalletClick: () => void
  onMoreToggle: () => void
}

export const buildMobileBottomNavItems = ({
  pathname,
  isMoreOpen,
  navigate,
  onNavItemClick,
  onWalletClick,
  onMoreToggle,
}: BuildMobileBottomNavItemsParams): MobileBottomNavItem[] => [
  {
    label: "Home",
    Icon: Home,
    isActive: pathname === "/",
    onClick: () => navigate("/"),
  },
  {
    label: "Learn",
    Icon: BookOpen,
    isActive: pathname.startsWith("/academy"),
    showNewBadge: true,
    onClick: () =>
      onNavItemClick({
        name: "Academy",
        href: "/academy",
      }),
  },
  {
    label: "Play",
    Icon: Trophy,
    isActive: pathname.startsWith("/tournaments") || pathname === "/",
    onClick: () =>
      onNavItemClick({
        name: "Play",
        href: "/tournaments",
      }),
  },
  {
    label: "Clan",
    Icon: Users,
    isActive: pathname.startsWith("/clans"),
    onClick: () =>
      onNavItemClick({
        name: "Clan",
        href: "/clans",
      }),
  },
  {
    label: "Wallet",
    Icon: Wallet,
    isActive: pathname.startsWith("/wallet"),
    onClick: onWalletClick,
  },
  {
    label: "More",
    Icon: Menu,
    isActive: isMoreOpen,
    onClick: onMoreToggle,
  },
]
