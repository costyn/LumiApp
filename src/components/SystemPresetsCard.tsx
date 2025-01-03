import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LumiferaParams } from '@/hooks/useWebsocket'

const SYSTEM_PRESETS = [
    'Default',
    'Slow',
    'Rotate',
    'Pulsate',
    'Random',
    'Fullscreen',
    'Simmering'
] as const;

const SYSTEM_PRESETS_CLAUDE = [
    'Rainbow Flow',
    'Night Pulse',
    'Ocean Waves',
    'Forest Glow',
    'Sunset Fade',
    'Storm Flash',
    'Calm Drift'
] as const;


interface SystemPresetsCardProps {
    updateParam: (name: keyof LumiferaParams, value: any) => void;
    isLoading: boolean;
    isEnabled: boolean;
}

export function SystemPresetsCard({ updateParam, isLoading, isEnabled }: SystemPresetsCardProps) {
    const loadSystemPreset = (index: number) => {
        updateParam('preset', index);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Presets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    {SYSTEM_PRESETS.map((preset, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            onClick={() => loadSystemPreset(index)}
                            disabled={isLoading || !isEnabled}
                        >
                            {preset}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}