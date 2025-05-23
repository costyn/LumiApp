import { Button } from './ui/button'
import { FIX_MODES } from '@/types/lumifera'

interface FixModeControlProps {
    fixMode: string
    disabled: boolean
    onFixModeChange: (mode: string) => void
}

export function FixModeControl({
    fixMode,
    disabled,
    onFixModeChange
}: FixModeControlProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-left items-center gap-2">
                <label className="text-sm font-medium">Fix Mode</label>
                <div className="flex flex-wrap gap-2">
                    {FIX_MODES.map(({ mode, icon: Icon }) => (
                        <Button
                            key={mode}
                            variant={fixMode === mode ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => onFixModeChange(mode)}
                            disabled={disabled}
                        >
                            <Icon className="h-4 w-4" />
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}