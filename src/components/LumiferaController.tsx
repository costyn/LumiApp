import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Slider } from './ui/slider'
import { Switch } from './ui/switch'

// Update this with your ESP32's WebSocket URL
const WS_URL = 'ws://lumifera.local/ws'

type FixMode = 'PAUSE' | 'RADAR' | 'RADIATE' | 'NONE';

interface LumiferaParams {
    bpm: number;
    direction: number;
    fgAnimationEnable: number;
    fgRotSpeed: number;
    bgRotSpeed: number;
    fgLineWidth: number;
    bgLineWidth: number;
    canvasHeight: number;
    bgPaletteIndex: number;
    fgPaletteIndex: number;
    brightness: number;
    rasterSpacing: number;
    autoAdvancePalette: number;
    autoAdvanceDelay: number;
}

type ParamKey = keyof LumiferaParams;


const DEFAULT_PARAMS: LumiferaParams = {
    bpm: 26,
    direction: 1,
    fgAnimationEnable: 0,
    fgRotSpeed: 135,
    bgRotSpeed: 28,
    fgLineWidth: 4,
    bgLineWidth: 3,
    canvasHeight: 0,
    bgPaletteIndex: 1,
    fgPaletteIndex: 5,
    brightness: 150,
    rasterSpacing: 0,
    autoAdvancePalette: 1,
    autoAdvanceDelay: 60
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

    const sendWebsocket = (paramName: ParamKey, paramValue: number) => {
        if (ws?.readyState === WebSocket.OPEN) {
            const message = { [paramName]: paramValue };
            ws.send(JSON.stringify(message));
            // Update local state
            setParams(prev => ({
                ...prev,
                [paramName]: paramValue
            }));
        }
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
                {/* BPM and Direction */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">BPM</label>
                    <Slider
                        value={[params.bpm]}
                        onValueChange={([value]) => sendWebsocket('bpm', value)}
                        min={0}
                        max={180}
                        step={1}
                    />
                </div>

                {/* Brightness */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Brightness</label>
                    <Slider
                        value={[params.brightness]}
                        onValueChange={([value]) => sendWebsocket('brightness', value)}
                        min={0}
                        max={255}
                        step={1}
                    />
                </div>

                {/* Foreground Controls */}
                <div className="space-y-4">
                    <h3 className="font-medium">Foreground</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Animation Enable</label>
                        <Switch
                            checked={params.fgAnimationEnable === 1}
                            onCheckedChange={(checked) =>
                                sendWebsocket('fgAnimationEnable', checked ? 1 : 0)
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rotation Speed</label>
                        <Slider
                            value={[params.fgRotSpeed]}
                            onValueChange={([value]) => sendWebsocket('fgRotSpeed', value)}
                            min={0}
                            max={255}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Line Width</label>
                        <Slider
                            value={[params.fgLineWidth]}
                            onValueChange={([value]) => sendWebsocket('fgLineWidth', value)}
                            min={0}
                            max={20}
                            step={1}
                        />
                    </div>
                </div>

                {/* Background Controls */}
                <div className="space-y-4">
                    <h3 className="font-medium">Background</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Rotation Speed</label>
                        <Slider
                            value={[params.bgRotSpeed]}
                            onValueChange={([value]) => sendWebsocket('bgRotSpeed', value)}
                            min={0}
                            max={255}
                            step={1}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Line Width</label>
                        <Slider
                            value={[params.bgLineWidth]}
                            onValueChange={([value]) => sendWebsocket('bgLineWidth', value)}
                            min={0}
                            max={20}
                            step={1}
                        />
                    </div>
                </div>

                {/* Palette Controls */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Background Palette</label>
                        <input
                            type="number"
                            value={params.bgPaletteIndex}
                            onChange={(e) => sendWebsocket('bgPaletteIndex', Number(e.target.value))}
                            min={0}
                            max={70}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Foreground Palette</label>
                        <input
                            type="number"
                            value={params.fgPaletteIndex}
                            onChange={(e) => sendWebsocket('fgPaletteIndex', Number(e.target.value))}
                            min={0}
                            max={70}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* Auto Advance Settings */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={params.autoAdvancePalette === 1}
                            onCheckedChange={(checked) =>
                                sendWebsocket('autoAdvancePalette', checked ? 1 : 0)
                            }
                        />
                        <label className="text-sm font-medium">Auto Advance Palette</label>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Auto Advance Delay (seconds)</label>
                        <input
                            type="number"
                            value={params.autoAdvanceDelay}
                            onChange={(e) => sendWebsocket('autoAdvanceDelay', Number(e.target.value))}
                            min={0}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}