import { LumiferaParams, ParamKey } from '@/hooks/useWebsocket.tsx'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { Switch } from './ui/switch.tsx'

interface ForegroundCardProps {
    params: LumiferaParams
    updateParam: (name: ParamKey, value: number) => void
}

export function ForegroundCard({ params, updateParam }: ForegroundCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-right gap-4">
                    <CardTitle>Foreground</CardTitle>
                    <Switch
                        checked={params.fgAnimationEnable === 1}
                        onCheckedChange={(checked) => updateParam('fgAnimationEnable', checked ? 1 : 0)}
                    />
                    <label className="text-sm font-medium">Enable Animation</label>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Rotation Speed</label>
                    <Slider
                        disabled={params.fgAnimationEnable === 0}
                        value={[params.fgRotSpeed]}
                        onValueChange={([value]) => updateParam('fgRotSpeed', value)}
                        min={0} max={255} step={0.1}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Line Width</label>
                    <Slider
                        disabled={params.fgAnimationEnable === 0}
                        value={[params.fgLineWidth]}
                        onValueChange={([value]) => updateParam('fgLineWidth', value)}
                        min={0} max={20} step={0.1}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Palette</label>
                    <input
                        type="number"
                        disabled={params.fgAnimationEnable === 0}
                        value={params.fgPaletteIndex}
                        onChange={(e) => updateParam('fgPaletteIndex', Number(e.target.value))}
                        min={0} max={70}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </CardContent>
        </Card>
    );
}