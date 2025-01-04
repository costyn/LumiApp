import { useState } from 'react'
import { Card, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { BackgroundCard } from './BackgroundCard'
import { ForegroundCard } from './ForegroundCard'
import { useWebSocket } from '@/hooks/useWebsocket.tsx'
import { MainCardHeader } from './MainCardHeader.tsx'

import { Button } from './ui/button.tsx';
import { ChevronLeft, ChevronRight, Pause, Radar, Radio, X } from 'lucide-react'
import { PresetCard } from './PresetCard.tsx'
import { SystemPresetsCard } from './SystemPresetsCard.tsx'

const WS_URL = 'ws://lumifera.local/ws'

export type UserLevel = 'basic' | 'advanced';
const FIX_MODES = [
    { mode: 'PAUSE', icon: Pause },
    { mode: 'RADAR', icon: Radar },
    { mode: 'RADIATE', icon: Radio },
    { mode: 'NONE', icon: X }
] as const;

export function LumiferaController() {

    const { wsStatus, connect, params, updateParam, isLoading, updateParams } = useWebSocket(WS_URL)
    const [userLevel, setUserLevel] = useState<UserLevel>('basic');
    const isEnabled = wsStatus === 'connected' && params.powerState !== 0;

    return (
        <div className="space-y-4 max-w-6xl mx-auto p-4">
            {/* Main Card */}
            <Card>
                <MainCardHeader
                    params={params}
                    wsStatus={wsStatus}
                    connect={connect}
                    userLevel={userLevel}
                    setUserLevel={setUserLevel}
                    isLoading={isLoading}
                    isEnabled={isEnabled}
                    updateParam={updateParam}
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
                        {userLevel === 'advanced' && (
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
                    </div>

                    {/* Direction */}
                    {userLevel === 'advanced' && (
                        <div className="space-y-2">
                            <div className="flex justify-left items-center gap-2">
                                <label className="text-sm font-medium">Direction</label>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        key="reverse"
                                        variant={params.direction === 0 ? 'default' : 'outline'}
                                        onClick={() => updateParam('direction', 0)}
                                        size="icon"
                                        disabled={!isEnabled}

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
                    {userLevel === 'advanced' && (
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
                    {userLevel === 'advanced' && (
                        <div className="space-y-2">
                            <div className="flex justify-left items-center gap-2">
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
            </Card>

            {/* Additional Controls */}
            <div className="grid md:grid-cols-2 gap-4">
                <BackgroundCard params={params} updateParam={updateParam} isLoading={isLoading} isEnabled={isEnabled} userLevel={userLevel} />
                {userLevel === 'advanced' && <ForegroundCard params={params} updateParam={updateParam} isLoading={isLoading} isEnabled={isEnabled} />}
                <SystemPresetsCard params={params} updateParam={updateParam} isLoading={isLoading} isEnabled={isEnabled} />
                <PresetCard params={params} updateParams={updateParams} isEnabled={isEnabled} />

            </div>
        </div>
    );
}