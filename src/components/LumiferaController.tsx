import { useState } from 'react'
import { Card, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { BackgroundCard } from './BackgroundCard'
import { ForegroundCard } from './ForegroundCard'
import { useWebSocket } from '@/hooks/useWebsocket.tsx'
import { MainCardHeader } from './MainCardHeader.tsx'

import { Button } from './ui/button.tsx';
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PresetCard } from './PresetCard.tsx'
import { SystemPresetsCard } from './SystemPresetsCard.tsx'
import { FIX_MODES, SharedCardProps, USER_LEVELS, UserLevel } from '@/types/lumifera.ts'
import { BlendProgress } from './BlendProgress.tsx'

const WS_URL = 'ws://lumifera.local/ws'

export function LumiferaController() {
    const { wsStatus, connect, params, updateParam, isLoading, progress, updateParams } = useWebSocket(WS_URL)
    const [userLevel, setUserLevel] = useState<UserLevel>(USER_LEVELS.BASIC);
    const isEnabled = wsStatus === 'connected' && params.powerState !== 0;

    const sharedProps: SharedCardProps = {
        params,
        updateParam,
        updateParams,
        isLoading,
        isEnabled,
        userLevel,
        wsStatus
    }

    return (
        <div className="space-y-4 max-w-6xl mx-auto p-4">
            {/* Main Card */}
            <Card>
                <MainCardHeader
                    connect={connect}
                    setUserLevel={setUserLevel}
                    {...sharedProps}
                />
                <CardContent className="space-y-4">
                    {/* BPM  */}
                    <div className="space-y-2">
                        <div className="flex justify-left items-center gap-2">
                            <label className="text-sm font-medium">BPM</label>
                            <span className="text-sm text-muted-foreground">{params.bpm}</span>
                        </div>
                        <Slider
                            value={[params.bpm]}
                            onValueChange={([value]) => updateParam('bpm', value)}
                            min={0}
                            max={180}
                            step={1}
                            disabled={!isEnabled}
                        />
                        {userLevel === USER_LEVELS.ADVANCED && (
                            <div className="flex flex-wrap gap-2">
                                {[10, 30, 60, 120, 130, 140, 260].map((time) => (
                                    <Button
                                        key={time}
                                        variant={params.bpm === time ? 'default' : 'outline'}
                                        size={'sm'}
                                        onClick={() => updateParam('bpm', time)}
                                        disabled={!isEnabled}
                                    >
                                        {time}bpm
                                    </Button>
                                ))}
                            </div>)}
                        {userLevel === USER_LEVELS.BASIC_HELP && (
                            <p className="text-xs text-muted-foreground mt-2">
                                BPM controls the speed of the animation. The higher the BPM, the faster the animation.
                            </p>
                        )}
                    </div>

                    {/* Brightness */}
                    <div className="space-y-2">
                        <div className="flex justify-left items-center gap-2">
                            <label className="text-sm font-medium">Brightness</label>
                            <span className="text-sm text-muted-foreground">{params.brightness}</span>
                        </div>

                        <Slider
                            value={[params.brightness]}
                            onValueChange={([value]) => updateParam('brightness', value)}
                            min={0}
                            max={255}
                            step={1}
                            disabled={!isEnabled}
                        />
                        {userLevel === USER_LEVELS.BASIC_HELP && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Brightness controls the overall brightness of the LEDs. At lower levels the difference is more visible.
                            </p>
                        )}
                    </div>

                    {/* Direction */}
                    {userLevel === USER_LEVELS.ADVANCED && (
                        <div className="space-y-2">
                            <div className="flex justify-left items-center gap-2">
                                <label className="text-sm font-medium">Direction</label>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        key="reverse"
                                        variant={params.direction === -1 ? 'default' : 'outline'}
                                        onClick={() => updateParam('direction', -1)}
                                        size="icon"
                                        disabled={!isEnabled || params.fixMode === 'RADAR'} // TODO: Radar direction not yet working on Lumi
                                    >
                                        <ChevronLeft />
                                    </Button>

                                    <Button
                                        key="forward"
                                        variant={params.direction === 1 ? 'default' : 'outline'}
                                        onClick={() => updateParam('direction', 1)}
                                        size="icon"
                                        disabled={!isEnabled}

                                    >
                                        <ChevronRight />
                                    </Button>

                                </div>
                            </div>
                        </div>)}

                    {/* Fix Mode */}
                    {userLevel === USER_LEVELS.ADVANCED && (
                        <div className="space-y-2">
                            <div className="flex justify-left items-center gap-2">

                                <label className="text-sm font-medium">Fix Mode</label>
                                <div className="flex flex-wrap gap-2">
                                    {FIX_MODES.map(({ mode, icon: Icon }) => (
                                        <Button
                                            key={mode}
                                            variant={params.fixMode === mode ? 'default' : 'outline'}
                                            size="icon"
                                            onClick={() => updateParam('fixMode', mode)}
                                            disabled={!isEnabled}

                                        >
                                            <Icon className="h-4 w-4" />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Crossfade Time */}
                    {userLevel === USER_LEVELS.ADVANCED && (
                        <div className="space-y-2">
                            <div className="flex flex-wrap justify-left items-center gap-2">
                                <label className="text-sm font-medium">Crossfade Time</label>
                                {[200, 500, 1000, 2000, 4000, 8000].map((time) => (
                                    <Button
                                        key={time}
                                        variant={params.blendTime === time ? 'default' : 'outline'}
                                        onClick={() => updateParam('blendTime', time)}
                                        disabled={!isEnabled}
                                    >
                                        {time}ms
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <BlendProgress
                    isBlending={isLoading}
                    progress={progress}
                />
            </Card>

            {/* Additional Controls */}
            <div className="grid md:grid-cols-2 gap-4">
                <BackgroundCard {...sharedProps} />
                {userLevel === USER_LEVELS.ADVANCED && <ForegroundCard {...sharedProps} />}
                <SystemPresetsCard {...sharedProps} />
                <PresetCard {...sharedProps} />

            </div>
        </div>
    );
}
