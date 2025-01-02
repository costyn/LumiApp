import { palettesData } from './PaletteSelector.tsx'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { LumiferaParams, ParamKey } from '@/hooks/useWebsocket.tsx'

interface BackgroundCardProps {
    params: LumiferaParams
    updateParam: (name: ParamKey, value: number) => void
}

export function BackgroundCard({ params, updateParam }: BackgroundCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Rotation Speed</label>
                        <span className="text-sm text-muted-foreground">{params.bgRotSpeed}</span>
                    </div>
                    <Slider
                        value={[params.bgRotSpeed]}
                        onValueChange={(value) => { updateParam('bgRotSpeed', value[0]); }}
                        min={0} max={255} step={1}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Line Width</label>
                        <span className="text-sm text-muted-foreground">{params.bgLineWidth}</span>
                    </div>
                    <Slider
                        value={[params.bgLineWidth]}
                        onValueChange={(value) => updateParam('bgLineWidth', value[0])}
                        min={0} max={20} step={1}
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