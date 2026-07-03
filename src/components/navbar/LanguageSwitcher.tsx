import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  variant?: "default" | "light"
  showLabel?: boolean
}

export default function LanguageSwitcher({
  variant = "default",
  showLabel = false,
}: LanguageSwitcherProps) {
  const triggerClassName =
    variant === "light"
      ? "text-slate-600 hover:text-violet-700 hover:bg-violet-50"
      : "text-gray-300 hover:text-purple-400 hover:bg-purple-500/10"

  return (
    <button
      type="button"
      className={cn(
        triggerClassName,
        showLabel
          ? "flex w-full items-center space-x-3 px-3 py-2 text-left"
          : "p-2",
        "rounded-lg transition-all duration-300"
      )}
      title="Change language"
    >
      <Languages className="h-5 w-5" />
      {showLabel && <span>Languages</span>}
    </button>
  )
}
