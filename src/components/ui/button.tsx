import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          variant === "default" &&
            "bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50",
          variant === "outline" &&
            "border border-gray-600 text-gray-400 hover:bg-gray-500/10 hover:text-gray-300",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
