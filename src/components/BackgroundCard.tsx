import { Loader } from 'lucide-react'
import { palettesData } from './PaletteSelector.tsx'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { LumiferaParams, ParamKey } from '@/hooks/useWebsocket.tsx'
import { Switch } from './ui/switch.tsx'
import { Button } from './ui/button.tsx'

interface BackgroundCardProps {
    params: LumiferaParams
    updateParam: (name: ParamKey, value: number) => void
    isLoading: boolean
    isEnabled: boolean
    userLevel: 'basic' | 'advanced'
}

export function BackgroundCard({ params, updateParam, isLoading, isEnabled, userLevel }: BackgroundCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-right gap-4">
                    <CardTitle>{userLevel === 'advanced' ? 'Background Animation' : 'Animation'}</CardTitle>
                    {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Rotation Speed</label>
                        <span className="text-sm text-muted-foreground">{params.bgRotSpeed}</span>
                    </div>
                    <Slider
                        value={[params.bgRotSpeed]}
                        disabled={!isEnabled}
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
                        disabled={!isEnabled}
                        onValueChange={(value) => updateParam('bgLineWidth', value[0])}
                        min={0} max={20} step={1}
                    />
                    {userLevel === 'advanced' && (
                        <div className="flex flex-wrap gap-2">
                            {[2, 4, 8].map((width) => (
                                <Button
                                    key={width}
                                    variant={params.bgLineWidth === width ? 'default' : 'outline'}
                                    size={'sm'}
                                    onClick={() => updateParam('bgLineWidth', width)}
                                    disabled={!isEnabled}
                                >
                                    {width}
                                </Button>
                            ))}
                        </div>)}
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
                        disabled={!isEnabled}
                        onValueChange={([value]) => updateParam('bgPaletteIndex', value)}
                        min={0}
                        max={palettesData.palettes.length - 1}
                        step={1}
                    />
                    {userLevel === 'advanced' && (
                        <div className="flex flex-wrap gap-2">
                            {[7, 60].map((bgPaletteIndex) => (
                                <Button
                                    key={bgPaletteIndex}
                                    variant={params.bgPaletteIndex === bgPaletteIndex ? 'default' : 'outline'}
                                    size={'sm'}
                                    onClick={() => updateParam('bgPaletteIndex', bgPaletteIndex)}
                                    disabled={!isEnabled}
                                >
                                    {bgPaletteIndex}
                                </Button>
                            ))}
                        </div>)}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Palette Auto Mode</label>
                        <Switch
                            checked={params.autoAdvancePalette === 1}
                            onCheckedChange={(checked) => updateParam('autoAdvancePalette', checked ? 1 : 0)}
                            disabled={!isEnabled}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Palette Auto Mode Delay</label>
                        <span className="text-sm text-muted-foreground">{params.autoAdvanceDelay} sec</span>
                    </div>
                    <Slider
                        value={[params.autoAdvanceDelay]}
                        disabled={!isEnabled || params.autoAdvancePalette === 0}
                        onValueChange={([value]) => updateParam('autoAdvanceDelay', value)}
                        min={0}
                        max={300}
                        step={1}
                    />

                </div>
            </CardContent>
        </Card>
    );
}