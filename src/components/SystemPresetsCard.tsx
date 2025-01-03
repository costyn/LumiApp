import { Loader } from 'lucide-react';
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { LumiferaParams } from '@/hooks/useWebsocket'

const SYSTEM_PRESETS = [
    'Default',
    'Slow',
    'Rotate',
    'Pulsate',
    'Random',
    // 'Fullscreen',
    // 'Simmering'
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
    params: LumiferaParams
    updateParam: (name: keyof LumiferaParams, value: any) => void;
    isLoading: boolean;
    isEnabled: boolean;
}

export function SystemPresetsCard({ params, updateParam, isLoading, isEnabled }: SystemPresetsCardProps) {
    const loadSystemPreset = (index: number) => {
        updateParam('preset', index);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>System Presets</CardTitle>
                {/* {isLoading && <Loader className="h-4 w-4 animate-spin" />} */}
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