import { Loader, StepForward } from 'lucide-react'
import { palettesData } from './PaletteSelector.tsx'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card.tsx'
import { Switch } from './ui/switch.tsx'
import { Button } from './ui/button.tsx'
import { USER_LEVELS, SharedCardProps } from '@/types/lumifera.ts'
import { SliderControl } from './SliderControl'

export function BackgroundCard({ params, updateParam, isLoading, isEnabled, userLevel }: SharedCardProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-right gap-4">
                    <CardTitle>{userLevel === USER_LEVELS.ADVANCED ? 'Background Animation' : 'Animation'}</CardTitle>
                    {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <SliderControl
                    label="Rotation Speed"
                    value={params.bgRotSpeed}
                    min={0}
                    max={255}
                    step={1}
                    disabled={!isEnabled}
                    userLevel={userLevel}
                    onValueChange={(value) => updateParam('bgRotSpeed', value)}
                    helpText="Rotation speed controls how fast the animation rotates in on itself. 128 is the middle value. Lower and higher will rotate different directions."
                />
                <SliderControl
                    label="Line Width"
                    value={params.bgLineWidth}
                    min={0}
                    max={20}
                    step={1}
                    disabled={!isEnabled}
                    userLevel={userLevel}
                    onValueChange={(value) => updateParam('bgLineWidth', value)}
                    presetValues={[2, 4, 8]}
                    helpText="Line width controls the width of the palettes as they are drawn. Lower values is wider bands, higher values are thinner bands."
                />
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">
                        <label className="text-sm font-medium">Palette</label>
                        <span className="text-sm text-muted-foreground">
                            {palettesData.palettes[params.bgPaletteIndex]?.label ?? 'Unknown'}
                        </span>
                    </div>
                    <SliderControl
                        label=""
                        value={params.bgPaletteIndex}
                        min={0}
                        max={palettesData.palettes.length - 1}
                        step={1}
                        disabled={!isEnabled}
                        userLevel={userLevel}
                        onValueChange={(value) => updateParam('bgPaletteIndex', value)}
                        presetValues={[7, 60]}
                        helpText="The palette controls the colors used in the animation. Different palettes will create different effects."
                    />
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
                    {userLevel === USER_LEVELS.BASIC_HELP && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Palette auto mode will automatically cycle through the palettes. The duration can be adjusted below.
                        </p>
                    )}

                </div>
                <SliderControl
                    label="Palette Auto Mode Delay"
                    value={params.autoAdvanceDelay}
                    min={0}
                    max={300}
                    step={1}
                    disabled={!isEnabled || params.autoAdvancePalette === 0}
                    userLevel={userLevel}
                    onValueChange={(value) => updateParam('autoAdvanceDelay', value)}
                    suffix=" sec"
                    helpText="Palette auto mode delay controls how long each palette is displayed before crossfading to the next one."
                />
                <div className="space-y-2">
                    <div className="flex justify-left items-center gap-2">

                        <label className="text-sm font-medium">Instant Next Palette</label>
                        <div className="flex justify-left items-center gap-2">
                            <Button
                                key="nextPalette"
                                variant={'outline'}
                                onClick={() => {
                                    updateParam('nextPalette', 1)
                                }}
                                size="default"
                                disabled={!isEnabled}
                            >
                                <StepForward />
                            </Button>
                        </div>
                    </div>
                    {userLevel === USER_LEVELS.BASIC_HELP && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Getting bored of these colors and don't want to wait? Click the button to instantly switch to the next palette.
                        </p>
                    )}
                </div>

            </CardContent>
        </Card>
    );
}