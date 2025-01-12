import { SharedCardProps, USER_LEVELS } from '@/types/lumifera';
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const SYSTEM_PRESETS = [
    'Default',
    'Slow',
    'Rotate',
    'Pulsate',
    'Random',
    // 'Fullscreen',
    // 'Simmering'
] as const;

// const SYSTEM_PRESETS_CLAUDE = [
//     'Rainbow Flow',
//     'Night Pulse',
//     'Ocean Waves',
//     'Forest Glow',
//     'Sunset Fade',
//     'Storm Flash',
//     'Calm Drift'
// ] as const;

export function SystemPresetsCard({ params, updateParam, isEnabled, userLevel }: SharedCardProps) {
    const loadSystemPreset = (index: number) => {
        updateParam('preset', index);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Presets</CardTitle>
                {/* {isLoading && <Loader className="h-4 w-4 animate-spin" />} */}
                {userLevel === USER_LEVELS.BASIC_HELP && (
                    <p className="text-xs text-muted-foreground mt-2">
                        System presets are pre-configured settings on Lumifera itself.
                    </p>
                )}
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {SYSTEM_PRESETS.map((preset, index) => (
                        <Button
                            key={index}
                            variant={params.preset === index ? 'default' : 'outline'}
                            onClick={() => loadSystemPreset(index)}
                            disabled={!isEnabled}
                        >
                            {preset}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}