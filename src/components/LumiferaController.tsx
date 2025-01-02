import { useState } from 'react'
import { Card, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { BackgroundCard } from './BackgroundCard'
import { ForegroundCard } from './ForegroundCard'
import { useWebSocket } from '@/hooks/useWebsocket.tsx'
import { MainCardHeader } from './MainCardHeader.tsx'

const WS_URL = 'ws://lumifera.local/ws'

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export function LumiferaController() {

    const { wsStatus, connect, params, updateParam, isLoading } = useWebSocket(WS_URL)
    const [userLevel, setUserLevel] = useState<UserLevel>('beginner');

    return (
        <div className="space-y-4 max-w-6xl mx-auto p-4">
            {/* Main Card */}
            <Card>
                <MainCardHeader
                    wsStatus={wsStatus}
                    connect={connect}
                    userLevel={userLevel}
                    setUserLevel={setUserLevel}
                    isLoading={isLoading}
                />
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-left items-center gap-2">
                            <label className="text-sm font-medium">BPM</label>
                            <span className="text-sm text-muted-foreground">{params.bpm}</span>
                        </div>
                        <Slider value={[params.bpm]} onValueChange={([value]) => updateParam('bpm', value)} min={0} max={180} step={1} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-left items-center gap-2">
                            <label className="text-sm font-medium">Brightness</label>
                            <span className="text-sm text-muted-foreground">{params.brightness}</span>
                        </div>

                        <Slider value={[params.brightness]} onValueChange={([value]) => updateParam('brightness', value)} min={0} max={255} step={1} />
                    </div>
                </CardContent>
            </Card>

            {/* Additional Controls */}
            <div className="grid md:grid-cols-2 gap-4">
                <BackgroundCard params={params} updateParam={updateParam} isLoading={isLoading} />
                {userLevel === 'advanced' && <ForegroundCard params={params} updateParam={updateParam} isLoading={isLoading} />}
            </div>
        </div>
    );
}