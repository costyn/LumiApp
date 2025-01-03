import { useState, useEffect, useRef } from 'react'

export type FixMode = 'PAUSE' | 'RADAR' | 'RADIATE' | 'NONE';

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
    blendTime: number;
    preset: number;
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
    fixMode: 'NONE',
    blendTime: 4000, // default blendtime in milliseconds
    preset: 0,
}


export function useWebSocket(url: string) {
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [params, setParams] = useState<LumiferaParams>(DEFAULT_PARAMS)
    const wsRef = useRef<WebSocket | null>(null);
    const [lastChanged, setLastChanged] = useState<ParamKey | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const timer = useRef<number>();

    const connect = () => {
        if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
            return;
        }

        const websocket = new WebSocket(url);
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
        const reconnectDelay = 1000; // 1 second delay

        const cleanup = () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };

        // Add unload handler
        window.addEventListener('beforeunload', cleanup);

        // Delayed connect
        const timeoutId = setTimeout(connect, reconnectDelay);

        return () => {
            window.removeEventListener('beforeunload', cleanup);
            clearTimeout(timeoutId);
            cleanup();
        };
    }, []);

    // Update a single param
    const updateParam = (name: ParamKey, value: (number | string)) => {
        setParams(prev => ({ ...prev, [name]: value }));
        setLastChanged(name);
        setIsLoading(true);
        // Clear any existing timer
        if (timer.current) {
            window.clearTimeout(timer.current);
        }
        // Set new timer for blendTime milliseconds
        // Use the new value if we're updating blendTime itself, otherwise uses the existing value.
        timer.current = window.setTimeout(() => {
            setIsLoading(false);
        }, name === 'blendTime' && typeof value === 'number' ? value : params.blendTime);
    };

    useEffect(() => {
        if (ws?.readyState === WebSocket.OPEN && lastChanged) {
            ws.send(JSON.stringify({ [lastChanged]: params[lastChanged] }));
            setLastChanged(null);
        }
    }, [params, ws, lastChanged, isLoading]);

    // Update multiple params at once
    const updateParams = (newParams: Partial<LumiferaParams>) => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(newParams));
            setParams(prev => ({ ...prev, ...newParams }));
            setIsLoading(true);
            if (timer.current) {
                window.clearTimeout(timer.current);
            }
            timer.current = window.setTimeout(() => {
                setIsLoading(false);
            }, params.blendTime);
        }
    };

    return { ws, wsStatus, connect, params, updateParam, lastChanged, setLastChanged, isLoading, updateParams }
}