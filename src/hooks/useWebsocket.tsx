import { useState, useEffect, useRef, useCallback } from 'react'

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
    powerState: number;
    nextPalette: number;
}

export type ParamKey = keyof LumiferaParams;
const DEFAULT_PARAMS: LumiferaParams = {
    bpm: 26,
    direction: 1, // 1 = forward, -1 = reverse
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
    powerState: 1,
    nextPalette: 0
}


export function useWebSocket(url: string) {
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [params, setParams] = useState<LumiferaParams>(DEFAULT_PARAMS)
    const wsRef = useRef<WebSocket | null>(null);
    const [lastChanged, setLastChanged] = useState<ParamKey | null>(null)

    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    const transitionTimerRef = useRef<NodeJS.Timeout | null>(null)
    const progressIntervalRef = useRef<number | null>(null)

    const clearTimers = () => {
        if (progressIntervalRef.current !== null) {
            clearInterval(progressIntervalRef.current)
            progressIntervalRef.current = null
        }
        if (transitionTimerRef.current) {
            clearTimeout(transitionTimerRef.current)
            transitionTimerRef.current = null
        }
    }

    const connect = useCallback(() => {
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
                console.log('Received WebSocket message:', receivedParams);
                receivedParams && setParams(prev => ({ ...prev, ...receivedParams }));
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
    }, [url]);

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
    }, [connect]);

    // Update a single param
    const updateParam = (name: ParamKey, value: (number | string)) => {
        setParams(prev => ({ ...prev, [name]: value }));
        setLastChanged(name);
        clearTimers() // Clear existing timers

        setIsLoading(true);
        setProgress(0);

        const blendDuration = name === 'blendTime' && typeof value === 'number' ? value : params.blendTime;
        const startTime = Date.now();

        progressIntervalRef.current = window.setInterval(() => {
            const elapsed = Date.now() - startTime
            const newProgress = Math.min((elapsed / blendDuration) * 100, 100)
            setProgress(newProgress)

            if (elapsed >= blendDuration) {
                clearTimers()
                setIsLoading(false)
                setProgress(0)
            }
        }, 16)

        transitionTimerRef.current = setTimeout(() => {
            clearTimers()
            setIsLoading(false)
            setProgress(0)
        }, blendDuration)
    };

    useEffect(() => {
        return () => clearTimers() // Cleanup on unmount
    }, [])

    useEffect(() => {
        // console.log('WebSocket send effect triggered:', {
        //     wsReadyState: ws?.readyState,
        //     wsOpen: ws?.readyState === WebSocket.OPEN,
        //     lastChanged,
        //     paramValue: lastChanged ? params[lastChanged] : null,
        //     isLoading
        // });

        if (ws?.readyState === WebSocket.OPEN && lastChanged) {
            const payload = { [lastChanged]: params[lastChanged] };
            console.log('Sending WebSocket message:', payload);
            ws.send(JSON.stringify(payload));
            setLastChanged(null);
        }
    }, [params, ws, lastChanged]);

    // Update multiple params at once
    const updateParams = (newParams: Partial<LumiferaParams>) => {
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(newParams));
            setParams(prev => ({ ...prev, ...newParams }));
            setIsLoading(true);
            clearTimers();

            transitionTimerRef.current = setTimeout(() => {
                setIsLoading(false);
            }, params.blendTime);
        }
    };

    return { ws, wsStatus, connect, params, updateParam, lastChanged, setLastChanged, isLoading, progress, updateParams }
}