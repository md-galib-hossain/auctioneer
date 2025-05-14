import { cn } from "@/lib/utils"

interface ProgressProps {
  value?: number
  max?: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ value = 0, max = 100, className, indicatorClassName }: ProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full bg-primary transition-all", indicatorClassName)} style={{ width: `${percentage}%` }} />
    </div>
  )
}
