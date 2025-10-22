import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { BackgroundCard } from './BackgroundCard'
// import { ForegroundCard } from './ForegroundCard'
import { useWebSocket } from '@/hooks/useWebsocket'
import { MainCardHeader } from './MainCardHeader'
import { Button } from './ui/button'
import { PresetCard } from './PresetCard'
import { SystemPresetsCard } from './SystemPresetsCard'
import { SharedCardProps, USER_LEVELS, UserLevel } from '@/types/lumifera.ts'
import { BlendProgress } from './BlendProgress'
import { SliderControl } from './SliderControl'
import { DirectionControl } from './DirectionControl'
import { FixModeControl } from './FixModeControl'
import { CrossfadeTimeControl } from './CrossfadeTimeControl'
import DebugConsole from './DebugConsole/DebugConsole'

const CONTOLLER_HOSTNAME = 'lumifera.local'
const WS_URL = `ws://${CONTOLLER_HOSTNAME}/ws`
export const WS_DEBUG_URL = `ws://${CONTOLLER_HOSTNAME}/debug`

export function LumiferaController() {
    const { wsStatus, connectionState, manualReconnect, params, updateParam, isLoading, progress, updateParams } = useWebSocket(WS_URL)
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
                    manualReconnect={manualReconnect}
                    connectionState={connectionState}
                    setUserLevel={setUserLevel}
                    {...sharedProps}
                />
                <CardContent className="space-y-4">

                    {/* Only show reconnect button after all automatic retries have failed */}
                    {!connectionState.isConnected && !connectionState.isConnecting &&
                        connectionState.reconnectAttempts >= 3 &&
                        <Button onClick={manualReconnect}>Reconnect</Button>}

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
            {userLevel === USER_LEVELS.ADVANCED && (
                <DebugConsole />
            )}
        </div>
    );
}
