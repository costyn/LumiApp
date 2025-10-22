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

export interface ConnectionState {
    isConnected: boolean;
    isConnecting: boolean;
    reconnectAttempts: number;
    lastError?: string;
}

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
    const [connectionState, setConnectionState] = useState<ConnectionState>({
        isConnected: false,
        isConnecting: false,
        reconnectAttempts: 0,
        lastError: undefined
    })
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [params, setParams] = useState<LumiferaParams>(DEFAULT_PARAMS)
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const maxReconnectAttempts = 3;
    const reconnectDelay = 2000;
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

    const cleanup = useCallback(() => {
        console.log('Cleanup called');
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
        }

        if (wsRef.current) {
            console.log('Closing existing WebSocket');
            wsRef.current.close()
            wsRef.current = null
        }
    }, [])

    const connect = useCallback(() => {
        // Guard against duplicate connections (e.g., React StrictMode double-invocation)
        if (wsRef.current) {
            const state = wsRef.current.readyState;
            if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
                console.log('WebSocket already connected or connecting, skipping');
                return;
            }
            // If there's a CLOSING or CLOSED socket, clean it up first
            if (state === WebSocket.CLOSING || state === WebSocket.CLOSED) {
                console.log('Cleaning up old WebSocket before creating new one');
                wsRef.current = null;
            }
        }

        console.log('Connecting to WebSocket:', url);
        const websocket = new WebSocket(url);
        wsRef.current = websocket;

        setConnectionState(prev => ({
            ...prev,
            isConnecting: true,
            lastError: undefined
        }));

        websocket.onopen = () => {
            console.log('WebSocket connected');
            setConnectionState({
                isConnected: true,
                isConnecting: false,
                reconnectAttempts: 0,
                lastError: undefined
            });
            setWs(websocket);
        };

        websocket.onclose = (event) => {
            console.log('WebSocket disconnected:', event.code, event.reason);
            setConnectionState(prev => {
                const newState = {
                    ...prev,
                    isConnected: false,
                    isConnecting: false
                };

                // Attempt reconnection if under max attempts
                if (prev.reconnectAttempts < maxReconnectAttempts) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setConnectionState(prevState => ({
                            ...prevState,
                            reconnectAttempts: prevState.reconnectAttempts + 1
                        }));
                        connect();
                    }, reconnectDelay);
                }

                return newState;
            });
            setWs(null);
            wsRef.current = null;
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnectionState(prev => ({
                ...prev,
                lastError: 'Connection failed'
            }));
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

    const manualReconnect = useCallback(() => {
        cleanup();
        setConnectionState({
            isConnected: false,
            isConnecting: false,
            reconnectAttempts: 0,
            lastError: undefined
        });
        connect();
    }, [cleanup, connect]);

    // Initialize connection
    useEffect(() => {
        console.log('useEffect: initializing connection');
        connect();

        const handleBeforeUnload = () => {
            cleanup();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('useEffect: cleanup on unmount');
            window.removeEventListener('beforeunload', handleBeforeUnload);
            cleanup();
        };
    }, [connect, cleanup]);

    // Page visibility detection - reconnect when page becomes visible
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' &&
                !connectionState.isConnected &&
                !connectionState.isConnecting) {
                console.log('Page became visible, attempting to reconnect...');
                manualReconnect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [connectionState.isConnected, connectionState.isConnecting, manualReconnect]);

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

    // Computed wsStatus for backward compatibility
    const wsStatus: 'connecting' | 'connected' | 'disconnected' =
        connectionState.isConnecting ? 'connecting' :
            connectionState.isConnected ? 'connected' : 'disconnected';

    return {
        ws,
        wsStatus,
        connectionState,
        connect,
        manualReconnect,
        params,
        updateParam,
        lastChanged,
        setLastChanged,
        isLoading,
        progress,
        updateParams
    }
}