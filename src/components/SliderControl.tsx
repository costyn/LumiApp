import { Slider } from './ui/slider'
import { Button } from './ui/button'
import { USER_LEVELS, UserLevel } from '@/types/lumifera'

interface SliderControlProps {
    label: string
    value: number
    min: number
    max: number
    step: number
    disabled: boolean
    userLevel?: UserLevel
    onValueChange: (value: number) => void
    presetValues?: number[]
    helpText?: string
    suffix?: string
}

export function SliderControl({
    label,
    value,
    min,
    max,
    step,
    disabled,
    userLevel,
    onValueChange,
    presetValues,
    helpText,
    suffix = ''
}: SliderControlProps) {
    return (
        <div className="space-y-2">
            <div className="flex justify-left items-center gap-2">
                <label className="text-sm font-medium">{label}</label>
                <span className="text-sm text-muted-foreground">{value}</span>
            </div>
            <Slider
                value={[value]}
                onValueChange={([newValue]) => onValueChange(newValue)}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
            />
            {userLevel === USER_LEVELS.ADVANCED && presetValues && (
                <div className="flex flex-wrap gap-2">
                    {presetValues.map((presetValue) => (
                        <Button
                            key={presetValue}
                            variant={value === presetValue ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onValueChange(presetValue)}
                            disabled={disabled}
                        >
                            {presetValue}{suffix}
                        </Button>
                    ))}
                </div>
            )}
            {userLevel === USER_LEVELS.BASIC_HELP && helpText && (
                <p className="text-xs text-muted-foreground mt-2">
                    {helpText}
                </p>
            )}
        </div>
    )
}