import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Wifi, WifiOff, Trash2, RotateCcw } from 'lucide-react';
import './DebugConsole.css';
import { WS_DEBUG_URL } from '../LumiferaController.tsx'

const DebugConsole: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const consoleRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    if (wsRef.current) {
      return; // Already connected or connecting
    }

    setConnectionStatus('connecting');
    setMessages(prev => [...prev, '[Connecting to debug stream...]']);

    const ws = new WebSocket(WS_DEBUG_URL);

    ws.onopen = () => {
      setConnectionStatus('connected');
      setMessages(prev => [...prev, '[Connected to debug stream]']);
    };

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    ws.onclose = () => {
      wsRef.current = null;
      setConnectionStatus('disconnected');
      setMessages(prev => [...prev, '[Connection closed]']);
    };

    ws.onerror = (error) => {
      console.error('Debug WebSocket error:', error);
      setConnectionStatus('disconnected');
      setMessages(prev => [...prev, '[Connection error]']);
    };

    wsRef.current = ws;
  };

  // Auto-connect on mount
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const handleReconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    connectWebSocket();
  };

  const getConnectionIcon = () => {
    if (connectionStatus === 'connecting') {
      return <Activity className="h-4 w-4 animate-pulse text-yellow-500" />;
    } else if (connectionStatus === 'connected') {
      return <Wifi className="h-4 w-4 text-green-500" />;
    } else {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <span>Debug Console</span>
            {getConnectionIcon()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggle}
            >
              {isVisible ? 'Hide' : 'Show'}
            </Button>
            {isVisible && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                {connectionStatus === 'disconnected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReconnect}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {isVisible && (
        <CardContent>
          <div
            ref={consoleRef}
            className="debug-console-output"
          >
            {messages.map((msg, index) => (
              <div key={index} className="whitespace-pre-wrap break-words leading-relaxed">
                {msg}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default DebugConsole;
