import { useState } from 'react'
import { Card, CardContent } from './ui/card.tsx'
import { BackgroundCard } from './BackgroundCard'
// import { ForegroundCard } from './ForegroundCard'
import { useWebSocket } from '@/hooks/useWebsocket.tsx'
import { MainCardHeader } from './MainCardHeader.tsx'
import { Button } from './ui/button.tsx'
import { PresetCard } from './PresetCard.tsx'
import { SystemPresetsCard } from './SystemPresetsCard.tsx'
import { SharedCardProps, USER_LEVELS, UserLevel } from '@/types/lumifera.ts'
import { BlendProgress } from './BlendProgress.tsx'
import { SliderControl } from './SliderControl'
import { DirectionControl } from './DirectionControl'
import { FixModeControl } from './FixModeControl'
import { CrossfadeTimeControl } from './CrossfadeTimeControl'

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

                    {wsStatus === 'disconnected' && <Button onClick={connect}>Reconnect</Button>}

                    {/* BPM  */}
                    <SliderControl
                        label="BPM"
                        value={params.bpm}
                        min={0}
                        max={180}
                        step={1}
                        disabled={!isEnabled}
                        userLevel={userLevel}
                        onValueChange={(value) => updateParam('bpm', value)}
                        presetValues={[10, 30, 60, 120, 130, 140, 260]}
                        suffix="bpm"
                        helpText="BPM controls the speed of the animation. The higher the BPM, the faster the animation."
                    />

                    {/* Brightness */}
                    <SliderControl
                        label="Brightness"
                        value={params.brightness}
                        min={0}
                        max={255}
                        step={1}
                        disabled={!isEnabled}
                        userLevel={userLevel}
                        onValueChange={(value) => updateParam('brightness', value)}
                        helpText="Brightness controls the overall brightness of the LEDs. At lower levels the difference is more visible."
                    />

                    {/* Direction */}
                    {userLevel === USER_LEVELS.ADVANCED && (
                        <DirectionControl
                            direction={params.direction}
                            disabled={!isEnabled}
                            radarModeActive={params.fixMode === 'RADAR'}
                            onDirectionChange={(direction) => updateParam('direction', direction)}
                        />
                    )}

                    {/* Fix Mode */}
                    {userLevel === USER_LEVELS.ADVANCED && (
                        <FixModeControl
                            fixMode={params.fixMode}
                            disabled={!isEnabled}
                            onFixModeChange={(mode) => updateParam('fixMode', mode)}
                        />
                    )}

                    {/* Crossfade Time */}
                    {userLevel === USER_LEVELS.ADVANCED && (
                        <CrossfadeTimeControl
                            blendTime={params.blendTime}
                            disabled={!isEnabled}
                            onBlendTimeChange={(time) => updateParam('blendTime', time)}
                        />
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
                {/* Feature not yet implemented on Lumifera: */}
                {/* {userLevel === USER_LEVELS.ADVANCED && <ForegroundCard {...sharedProps} />} */}
                <SystemPresetsCard {...sharedProps} />
                <PresetCard {...sharedProps} />

            </div>
        </div>
    );
}
