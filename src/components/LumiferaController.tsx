import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button.tsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
import { Switch } from './ui/switch.tsx'
import { ThemeToggle } from './ui/theme-toggle.tsx'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select.tsx'
import { Menu } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"
import { BackgroundCard } from './BackgroundCard'
import { ForegroundCard } from './ForegroundCard'

// Update this with your ESP32's WebSocket URL
const WS_URL = 'ws://lumifera.local/ws'

type FixMode = 'PAUSE' | 'RADAR' | 'RADIATE' | 'NONE';

type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LumiferaParams {
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

export type ParamKey = keyof LumiferaParams;


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
    const [lastChanged, setLastChanged] = useState<ParamKey | null>(null);
    const [userLevel, setUserLevel] = useState<UserLevel>('beginner');


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

    const updateParam = (name: ParamKey, value: number) => {
        setParams(prev => ({ ...prev, [name]: value }));
        setLastChanged(name);
    };

    useEffect(() => {
        if (ws?.readyState === WebSocket.OPEN && lastChanged) {
            ws.send(JSON.stringify({ [lastChanged]: params[lastChanged] }));
            setLastChanged(null);
        }
    }, [params, ws, lastChanged]);

    return (
        <div className="space-y-4 max-w-6xl mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Lumifera Controller</CardTitle>
                            <CardDescription>Status: {wsStatus}</CardDescription>
                        </div>

                        {/* Desktop Controls */}
                        <div className="hidden md:flex gap-2">
                            <Select value={userLevel} onValueChange={(value: UserLevel) => setUserLevel(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                            <ThemeToggle />
                            {wsStatus === 'disconnected' && <Button onClick={connect}>Reconnect</Button>}
                        </div>

                        {/* Mobile Menu */}
                        <Dialog>
                            <DialogTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Preferences</DialogTitle>
                                    <DialogDescription>Configure experience level and theme</DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col gap-6 py-4">
                                    <div className="space-y-4">
                                        <Select value={userLevel} onValueChange={(value: UserLevel) => setUserLevel(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="beginner">Beginner</SelectItem>
                                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                                <SelectItem value="advanced">Advanced</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <ThemeToggle />
                                    </div>
                                    {wsStatus === 'disconnected' && <Button onClick={connect}>Reconnect</Button>}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
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

            <div className="grid md:grid-cols-2 gap-4">
                <BackgroundCard params={params} updateParam={updateParam} />
                {userLevel === 'advanced' && <ForegroundCard params={params} updateParam={updateParam} />}
            </div>
        </div>
    );
}