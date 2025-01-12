import { SharedCardProps } from "@/types/lumifera"
import { Button } from './ui/button.tsx'
import { Power } from "lucide-react";

export function PowerButton({ params, updateParam, wsStatus }: SharedCardProps) {
    return (
        <Button
            key="reverse"
            variant={params.powerState === 1 ? 'default' : 'outline'}
            onClick={() => {
                updateParam('powerState', params.powerState === 1 ? 0 : 1)
            }}
            size="default"
            disabled={wsStatus !== 'connected'}
        >
            <Power />
        </Button>
    );
}