import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'

// Update this with your ESP32's WebSocket URL
const WS_URL = 'ws://lumifera.local/ws'

type FixMode = 'PAUSE' | 'RADAR' | 'RADIATE' | 'NONE';

interface LumiferaParams {
    preset: number;
    palette: number;
    bpm: number;
    bpmReverse: boolean;
    rotation: number;
    line: number;
    autoAdvancePalette: number;
    autoAdvanceDelay: number;
    brightness: number;
    fixmode?: FixMode;
    manualCrossfade: boolean;
    blend: number;
    crossfadeTime: number;
}

type ParamKey = keyof LumiferaParams;

const DEFAULT_PARAMS: LumiferaParams = {
    preset: 1,
    palette: 1,
    bpm: 1,
    bpmReverse: false,
    rotation: 128,
    line: 2,
    autoAdvancePalette: 1,
    autoAdvanceDelay: 180,
    brightness: 128,
    manualCrossfade: false,
    blend: 0,
    crossfadeTime: 128
}

export function LumiferaController() {
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [params, setParams] = useState<LumiferaParams>(DEFAULT_PARAMS)

    useEffect(() => {
        const websocket = new WebSocket(WS_URL)

        websocket.onopen = () => {
            console.log('Connected to ESP32')
            setWsStatus('connected')
            setWs(websocket)
        }

        websocket.onclose = () => {
            console.log('Disconnected from ESP32')
            setWsStatus('disconnected')
            setWs(null)
        }

        return () => {
            websocket.close()
        }
    }, [])

    type SendWebsocketFn = (paramName: ParamKey, paramValue: number | boolean) => void;

    const sendWebsocket: SendWebsocketFn = (paramName, paramValue) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            const message = { [paramName]: paramValue };
            console.log('Sending:', JSON.stringify(message));
            ws.send(JSON.stringify(message));
        }
    };

    const updateParam = (paramName: ParamKey, value: number | boolean) => {
        setParams(prev => ({ ...prev, [paramName]: value }));
        sendWebsocket(paramName, value);
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Lumifera Controller</CardTitle>
                <CardDescription>
                    Status: {wsStatus === 'connected' ?
                        'Connected to LED Installation' :
                        wsStatus === 'connecting' ?
                            'Connecting...' :
                            'Disconnected'}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Basic Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Preset</label>
                        <input
                            type="number"
                            value={params.preset}
                            onChange={(e) => updateParam('preset', Number(e.target.value))}
                            min={0}
                            max={5}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Palette</label>
                        <input
                            type="number"
                            value={params.palette}
                            onChange={(e) => updateParam('palette', Number(e.target.value))}
                            min={0}
                            max={70}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* BPM Controls */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">BPM</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="number"
                            value={params.bpm}
                            onChange={(e) => updateParam('bpm', Number(e.target.value))}
                            min={0}
                            max={180}
                            step={0.1}
                            className="w-32 p-2 border rounded"
                        />
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={params.bpmReverse}
                                onCheckedChange={(checked) => updateParam('bpmReverse', checked)}
                            />
                            <label className="text-sm">Reverse</label>
                        </div>
                    </div>
                </div>

                {/* Brightness Slider */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Brightness</label>
                    <Slider
                        value={[params.brightness]}
                        onValueChange={([value]) => updateParam('brightness', value)}
                        max={255}
                        step={1}
                    />
                </div>

                {/* Fixmode Buttons */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Fixmode</label>
                    <div className="grid grid-cols-4 gap-2">
                        {(['PAUSE', 'RADAR', 'RADIATE', 'NONE'] as FixMode[]).map((mode) => (
                            <Button
                                key={mode}
                                variant={params.fixmode === mode ? 'default' : 'outline'}
                                onClick={() => updateParam('fixmode', mode)}
                            >
                                {mode}
                            </Button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}