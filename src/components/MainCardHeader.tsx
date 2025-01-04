
import { Button } from './ui/button.tsx'
import { CardHeader, CardTitle, CardDescription } from './ui/card.tsx'
import { ThemeToggle } from './ui/theme-toggle.tsx'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select.tsx'
import { Loader, Menu, Power } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"
import { UserLevel } from './LumiferaController.tsx'
import { LumiferaParams, ParamKey } from '@/hooks/useWebsocket.tsx'

interface MainCardHeaderProps {
    params: LumiferaParams
    wsStatus: string
    connect: () => void
    userLevel: string
    setUserLevel: (level: UserLevel) => void
    isLoading: boolean
    isEnabled: boolean
    updateParam: (name: ParamKey, value: number) => void
}

export function MainCardHeader({ params, wsStatus, connect, userLevel, setUserLevel, isLoading, isEnabled, updateParam }: MainCardHeaderProps) {
    return (<>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-right gap-4">
                        <CardTitle>Lumifera Controller</CardTitle>
                        {(isLoading || wsStatus === 'connecting') && <Loader className="h-4 w-4 animate-spin" />}
                    </div>

                    <CardDescription>Status: {wsStatus} {wsStatus === 'disconnected' && "⚠️"}
                    </CardDescription>
                </div>

                {/* Desktop Controls */}
                <div className="hidden md:flex gap-2">
                    {params.powerState === 0 && '⚠️'}
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
                    <Select value={userLevel} onValueChange={(value: UserLevel) => setUserLevel(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                    </Select>
                    <ThemeToggle />
                    {wsStatus === 'disconnected' && <Button onClick={connect} size="default">Reconnect</Button>}
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
                                        <SelectItem value="basic">Basic</SelectItem>
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
    </>
    );

}
