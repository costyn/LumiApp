import { LumiferaParams, ParamKey } from '@/hooks/useWebsocket.tsx'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { Switch } from './ui/switch.tsx'
import { palettesData } from './PaletteSelector.tsx'
import { Loader } from 'lucide-react'

interface ForegroundCardProps {
    params: LumiferaParams
    updateParam: (name: ParamKey, value: number) => void
    isLoading: boolean
}

export function ForegroundCard({ params, updateParam, isLoading }: ForegroundCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-right gap-4">
                    <CardTitle>Foreground</CardTitle>
                    {isLoading && <Loader className="h-4 w-4 animate-spin" />}
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
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Palette</label>
                        <span className="text-sm text-muted-foreground">
                            {palettesData.palettes[params.bgPaletteIndex]?.label ?? 'Unknown'}
                        </span>
                    </div>
                    <Slider
                        value={[params.bgPaletteIndex]}
                        onValueChange={([value]) => updateParam('bgPaletteIndex', value)}
                        min={0}
                        max={palettesData.palettes.length - 1}
                        step={1}
                    />
                </div>
            </CardContent>
        </Card>
    );
}