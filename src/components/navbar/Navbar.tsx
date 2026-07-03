import { useState, useEffect } from "react"
import {
  X,
  Wallet,
  Bell,
  Home,
  Users,
  Building2,
  Trophy,
  Zap,
  HelpCircle,
  BookOpen,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import LanguageSwitcher from "./LanguageSwitcher"
import NavNewBadge from "./NavNewBadge"
import { cn } from "@/lib/utils"
import navbarStyles from "./navbar.module.css"
import {
  buildMobileBottomNavItems,
  getMobileBottomNavItemClassName,
  mobileBottomNavShellClass,
  type MobileBottomNavItem,
  type NavbarLinkItem,
} from "./navbarMobileNav"

const LOGO_SRC = "/lovable-uploads/094b7b2c-f299-432e-b8be-50610bed7eea.png"

const mockUser = {
  name: "Raunak",
  username: "raunak",
  profilePicture: {
    url: "https://api.dicebear.com/7.x/pixel-art/svg?seed=gaming",
  },
}

const isAuthenticated = true

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = mockUser

  const isChatPage = location.pathname === "/chat"

  const navItems: NavbarLinkItem[] = [
    { name: "Academy", href: "/academy", showNewBadge: true },
    { name: "Clan", href: "/clans" },
    { name: "Org", href: "/organizations" },
    { name: "Play", href: "/tournaments" },
    { name: "Zoop", href: "#zoop" },
  ]

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden"
      document.body.style.overflow = "hidden"
    } else {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleLogoClick = () => navigate("/")

  const handleProfileClick = () => {
    /* profile route placeholder */
  }

  const handleNavItemClick = (item: { name: string; href: string }) => {
    if (item.href.startsWith("#")) return
    if (item.href === "/tournaments") {
      navigate("/")
      return
    }
    navigate(item.href)
  }

  const handleWalletClick = () => {
    /* wallet placeholder */
  }

  const handleNotificationClick = () => {
    /* notifications placeholder */
  }

  const handleZoopClick = () => {
    setIsOpen(false)
  }

  const handleMobileMenuToggle = () => setIsOpen(!isOpen)

  const getUserInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase()
    if (user?.username) return user.username.charAt(0).toUpperCase()
    return "U"
  }

  const getDesktopNavItemClass = (item: { href: string }) => {
    const isActive =
      location.pathname === item.href ||
      (item.href === "/tournaments" && location.pathname === "/") ||
      location.pathname.startsWith(`${item.href}/`)

    if (item.href === "#zoop") {
      return cn(
        "animate-fade-in rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
        "animate-fade-in-blink text-yellow-400 hover:bg-purple-500/10"
      )
    }

    return cn(
      "px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg animate-fade-in hover:bg-purple-500/10",
      isActive ? "text-purple-400" : "text-gray-300 hover:text-purple-400"
    )
  }

  const iconButtonClass =
    "relative rounded-lg p-2 text-gray-300 transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-400"

  const getMoreItemClassName = (isActive: boolean, variant?: "zoop") => {
    const base =
      "flex flex-col items-center justify-center gap-1.5 rounded-xl py-4 transition-colors duration-100"
    if (variant === "zoop") {
      return cn(base, "animate-blink text-yellow-400")
    }
    return cn(base, isActive ? "bg-purple-600 text-white" : "text-gray-300")
  }

  const mobileBottomNavItems = buildMobileBottomNavItems({
    pathname: location.pathname,
    isMoreOpen: isOpen,
    navigate,
    onNavItemClick: handleNavItemClick,
    onWalletClick: handleWalletClick,
    onMoreToggle: handleMobileMenuToggle,
  })

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 animate-fade-in min-w-0">
              <button
                type="button"
                onClick={handleLogoClick}
                className="cursor-pointer flex items-center gap-2"
              >
                <img src={LOGO_SRC} alt="espotz" className="h-10 w-10 object-contain" />
                <span className="text-xl font-bold text-white lowercase tracking-wide hidden sm:inline">
                  espotz
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      item.href === "#zoop"
                        ? handleZoopClick()
                        : handleNavItemClick(item)
                    }
                    className={cn(
                      getDesktopNavItemClass(item),
                      item.showNewBadge && "relative pr-3"
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-sm font-medium text-inherit">{item.name}</span>
                    {item.showNewBadge ? (
                      <>
                        <span className="sr-only">, New</span>
                        <NavNewBadge
                          className={cn(
                            navbarStyles.badgePulse,
                            "-right-1 -top-2.5"
                          )}
                        />
                      </>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Buttons / Profile */}
            <div className="hidden md:flex items-center space-x-4 animate-fade-in">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleNotificationClick}
                    className={iconButtonClass}
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleWalletClick}
                    className={iconButtonClass}
                    title="Wallet"
                  >
                    <Wallet className="h-5 w-5" />
                  </button>
                  <LanguageSwitcher />
                  <Avatar
                    className="h-10 w-10 cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <AvatarImage
                      src={user.profilePicture?.url}
                      alt={user.name || user.username}
                    />
                    <AvatarFallback className="bg-purple-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <>
                  <LanguageSwitcher />
                  <Button variant="default" className="px-6">
                    Login
                  </Button>
                </>
              )}
            </div>

            {/* Mobile top-right */}
            <div className="md:hidden flex items-center space-x-2">
              {isAuthenticated && user ? (
                <>
                  <button
                    type="button"
                    onClick={handleNotificationClick}
                    className={iconButtonClass}
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                  </button>
                  <Avatar
                    className="h-8 w-8 cursor-pointer"
                    onClick={handleProfileClick}
                  >
                    <AvatarImage
                      src={user.profilePicture?.url}
                      alt={user.name || user.username}
                    />
                    <AvatarFallback className="bg-purple-600 text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </>
              ) : (
                <Button variant="default" className="px-3 py-1.5 text-sm">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar — hidden on chat (focused mode) */}
      {!isChatPage && (
      <>
      <nav
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md",
          mobileBottomNavShellClass
        )}
      >
        <div className="flex h-16 items-center justify-around">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.Icon
            const isActive = item.isActive ?? false
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className={cn(
                  getMobileBottomNavItemClassName(
                    isActive,
                    item.variant as "zoop" | undefined
                  ),
                  item.showNewBadge && "relative"
                )}
              >
                <span className="relative inline-flex">
                  <Icon className="h-6 w-6 shrink-0" />
                  {item.showNewBadge ? (
                    <>
                      <span className="sr-only">, New</span>
                      <NavNewBadge
                        className={cn(
                          navbarStyles.badgePulse,
                          "-right-2.5 -top-2 scale-[0.85] origin-top-right"
                        )}
                      />
                    </>
                  ) : null}
                </span>
                <span className="max-w-[3.25rem] truncate text-[10px] font-medium leading-none text-inherit">
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile More Panel */}
      <>
        <div
          className={cn(
            "md:hidden fixed inset-0 z-50 backdrop-blur-sm transition-opacity duration-150 bg-black/60",
            isOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl transition-transform duration-150 ease-out border-t border-white/10 bg-black shadow-2xl",
            isOpen ? "translate-y-0" : "translate-y-full"
          )}
        >
          <div className="px-4 pt-4 pb-6">
            <div className="relative flex items-center justify-center mb-5">
              <span className="text-base font-semibold text-white">Navigation</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-0 rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(
                [
                  {
                    label: "Home",
                    Icon: Home,
                    isActive: location.pathname === "/",
                    onClick: () => {
                      navigate("/")
                      setIsOpen(false)
                    },
                  },
                  {
                    label: "Academy",
                    Icon: BookOpen,
                    isActive: location.pathname.startsWith("/academy"),
                    showNewBadge: true,
                    onClick: () => {
                      handleNavItemClick({ name: "Academy", href: "/academy" })
                      setIsOpen(false)
                    },
                  },
                  {
                    label: "Clan",
                    Icon: Users,
                    isActive: location.pathname.startsWith("/clans"),
                    onClick: () => {
                      handleNavItemClick({ name: "Clan", href: "/clans" })
                      setIsOpen(false)
                    },
                  },
                  {
                    label: "Org",
                    Icon: Building2,
                    isActive: location.pathname.startsWith("/organizations"),
                    onClick: () => {
                      handleNavItemClick({ name: "Org", href: "/organizations" })
                      setIsOpen(false)
                    },
                  },
                  {
                    label: "Play",
                    Icon: Trophy,
                    isActive:
                      location.pathname.startsWith("/tournaments") ||
                      location.pathname === "/",
                    onClick: () => {
                      handleNavItemClick({ name: "Play", href: "/tournaments" })
                      setIsOpen(false)
                    },
                  },
                  {
                    label: "Zoop",
                    Icon: Zap,
                    variant: "zoop" as const,
                    onClick: handleZoopClick,
                  },
                  {
                    label: "Wallet",
                    Icon: Wallet,
                    isActive: location.pathname.startsWith("/wallet"),
                    onClick: () => {
                      handleWalletClick()
                      setIsOpen(false)
                    },
                  },
                  {
                    label: "Help",
                    Icon: HelpCircle,
                    onClick: () => setIsOpen(false),
                  },
                ] satisfies MobileBottomNavItem[]
              ).map((item) => {
                const Icon = item.Icon
                const isActive = item.isActive ?? false
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      getMoreItemClassName(isActive, item.variant),
                      item.showNewBadge && "relative overflow-visible"
                    )}
                  >
                    {item.showNewBadge ? (
                      <>
                        <span className="sr-only">, New</span>
                        <NavNewBadge
                          className={cn(
                            navbarStyles.badgePulse,
                            "right-1 top-1 scale-[0.85] origin-top-right"
                          )}
                        />
                      </>
                    ) : null}
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-medium text-inherit">{item.label}</span>
                  </button>
                )
              })}
              <div
                className={cn(
                  getMoreItemClassName(false),
                  "[&_button]:p-0 [&_button]:min-w-0 [&_svg]:h-6 [&_svg]:w-6"
                )}
              >
                <LanguageSwitcher />
                <span className="text-xs font-medium text-gray-300">Language</span>
              </div>
            </div>
          </div>
        </div>
      </>
      </>
      )}
    </>
  )
}
