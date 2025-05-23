import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DirectionControlProps {
    direction: number
    disabled: boolean
    radarModeActive?: boolean
    onDirectionChange: (direction: number) => void
}

export function DirectionControl({
    direction,
    disabled,
    radarModeActive = false,
    onDirectionChange
}: DirectionControlProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-left items-center gap-2">
                <label className="text-sm font-medium">Direction</label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={direction === -1 ? 'default' : 'outline'}
                        onClick={() => onDirectionChange(-1)}
                        size="icon"
                        disabled={disabled || radarModeActive}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant={direction === 1 ? 'default' : 'outline'}
                        onClick={() => onDirectionChange(1)}
                        size="icon"
                        disabled={disabled}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
        </div>
    )
}