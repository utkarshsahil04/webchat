import { cn } from "@/lib/utils"
import { type HTMLAttributes } from "react"

const badgeVariants =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"

export function Badge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(badgeVariants, className)} {...props} />
}
