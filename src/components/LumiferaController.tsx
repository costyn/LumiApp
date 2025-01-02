import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button.tsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { Switch } from './ui/switch.tsx'
import { ThemeToggle } from './ui/theme-toggle.tsx'

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
    fixMode: FixMode;
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
    autoAdvanceDelay: 60,
    fixMode: 'NONE'
}

export function LumiferaController() {
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [params, setParams] = useState<LumiferaParams>(DEFAULT_PARAMS)
    const wsRef = useRef<WebSocket | null>(null);

    const connect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        const websocket = new WebSocket(WS_URL);
        wsRef.current = websocket;
        setWsStatus('connecting');

        websocket.onopen = () => {
            setWsStatus('connected');
            setWs(websocket);
        };

        websocket.onclose = () => {
            setWsStatus('disconnected');
            setWs(null);
            wsRef.current = null;
        };

        websocket.onmessage = (event) => {
            try {
                const receivedParams = JSON.parse(event.data);
                setParams(prev => ({ ...prev, ...receivedParams }));
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
    };

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    const sendWebsocket = (paramName: ParamKey, paramValue: number) => {
        // console.log('Attempting send:', paramName, paramValue);
        setParams(prev => ({
            ...prev,
            [paramName]: paramValue
        }));
        if (ws?.readyState === WebSocket.OPEN) {
            const message = { [paramName]: paramValue };
            ws.send(JSON.stringify(message));
            // Update local state

        }
    };

    const BackgroundCard = () => (
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
                        onValueChange={([value]) => sendWebsocket('bgRotSpeed', value)}
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
                        onValueChange={([value]) => sendWebsocket('bgLineWidth', value)}
                        min={0} max={20} step={1}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Palette</label>
                    <input
                        type="number"
                        value={params.bgPaletteIndex}
                        onChange={(e) => sendWebsocket('bgPaletteIndex', Number(e.target.value))}
                        min={0} max={70}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </CardContent>
        </Card>
    );

    const ForegroundCard = () => (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-right gap-4">
                    <CardTitle>Foreground</CardTitle>
                    <Switch
                        checked={params.fgAnimationEnable === 1}
                        onCheckedChange={(checked) => sendWebsocket('fgAnimationEnable', checked ? 1 : 0)}
                    />
                    <label className="text-sm font-medium">Enable Animation</label>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Rotation Speed</label>
                    <Slider
                        disabled={params.fgAnimationEnable === 0}
                        value={[params.fgRotSpeed]}
                        onValueChange={([value]) => sendWebsocket('fgRotSpeed', value)}
                        min={0} max={255} step={1}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Line Width</label>
                    <Slider
                        disabled={params.fgAnimationEnable === 0}
                        value={[params.fgLineWidth]}
                        onValueChange={([value]) => sendWebsocket('fgLineWidth', value)}
                        min={0} max={20} step={1}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Palette</label>
                    <input
                        type="number"
                        disabled={params.fgAnimationEnable === 0}
                        value={params.fgPaletteIndex}
                        onChange={(e) => sendWebsocket('fgPaletteIndex', Number(e.target.value))}
                        min={0} max={70}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4 max-w-6xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Lumifera Controller</CardTitle>
                            <CardDescription>Status: {wsStatus}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <ThemeToggle />
                            {wsStatus === 'disconnected' && <Button onClick={connect}>Reconnect</Button>}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-left items-center gap-2">
                            <label className="text-sm font-medium">BPM</label>
                            <span className="text-sm text-muted-foreground">{params.bpm}</span>
                        </div>
                        <Slider value={[params.bpm]} onValueChange={([value]) => sendWebsocket('bpm', value)} min={0} max={180} step={1} />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-left items-center gap-2">
                            <label className="text-sm font-medium">Brightness</label>
                            <span className="text-sm text-muted-foreground">{params.brightness}</span>
                        </div>

                        <Slider value={[params.brightness]} onValueChange={([value]) => sendWebsocket('brightness', value)} min={0} max={255} step={1} />
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
                <BackgroundCard />
                <ForegroundCard />
            </div>
        </div>
    );
}