import { Button } from './ui/button'

interface CrossfadeTimeControlProps {
    blendTime: number
    disabled: boolean
    onBlendTimeChange: (time: number) => void
    timeOptions?: number[]
}

export function CrossfadeTimeControl({
    blendTime,
    disabled,
    onBlendTimeChange,
    timeOptions = [200, 500, 1000, 2000, 4000, 8000]
}: CrossfadeTimeControlProps) {
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap justify-left items-center gap-2">
                <label className="text-sm font-medium">Crossfade Time</label>
                {timeOptions.map((time) => (
                    <Button
                        key={time}
                        variant={blendTime === time ? 'default' : 'outline'}
                        onClick={() => onBlendTimeChange(time)}
                        disabled={disabled}
                    >
                        {time}ms
                    </Button>
                ))}
            </div>
        </div>
    )
}