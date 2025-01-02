import { useState, useEffect, useRef } from 'react'

type FixMode = 'PAUSE' | 'RADAR' | 'RADIATE' | 'NONE';

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


export function useWebSocket(url: string) {
    const [wsStatus, setWsStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
    const [ws, setWs] = useState<WebSocket | null>(null)
    const [params, setParams] = useState<LumiferaParams>(DEFAULT_PARAMS)
    const wsRef = useRef<WebSocket | null>(null);
    const [lastChanged, setLastChanged] = useState<ParamKey | null>(null);


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

    return { ws, wsStatus, connect, params, updateParam, lastChanged, setLastChanged }
}