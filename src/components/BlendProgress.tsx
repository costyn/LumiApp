import { cn } from "@/lib/utils"

interface BlendProgressProps {
    isBlending: boolean
    progress: number // in ms
}

export function BlendProgress({ isBlending, progress }: BlendProgressProps) {
    return (
        <div className="h-2 w-full bg-muted overflow-hidden">
            <div
                className={cn(
                    "h-full bg-primary transition-all duration-100",
                    isBlending ? "opacity-100" : "opacity-0"
                )}
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}