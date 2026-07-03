import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NavNewBadgeProps {
  label?: string
  className?: string
}

export default function NavNewBadge({
  label = "New",
  className,
}: NavNewBadgeProps) {
  return (
    <Badge
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 border-purple-400/40 bg-purple-600 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none tracking-[0.14em] text-white shadow-md shadow-purple-500/40 hover:bg-purple-600",
        className
      )}
    >
      {label}
    </Badge>
  )
}
