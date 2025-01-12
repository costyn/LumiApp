
import { Button } from './ui/button.tsx'
import { CardHeader, CardTitle, CardDescription } from './ui/card.tsx'
import { ThemeToggle } from './ui/theme-toggle.tsx'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from './ui/select.tsx'
import { Loader, Menu } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog"
import { SharedCardProps, UserLevel } from '@/types/lumifera.ts'
import { USER_LEVELS } from '@/types/lumifera.ts'
import { PowerButton } from './PowerButton.tsx'

interface MainCardHeaderProps extends SharedCardProps {
    connect: () => void;
    setUserLevel: (level: UserLevel) => void;
}

export function MainCardHeader({
    connect,
    setUserLevel,
    params,
    wsStatus,
    userLevel,
    isLoading,
    isEnabled,
    updateParam,
    updateParams
}: MainCardHeaderProps) {
    return (<>
        <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-right gap-4">
                        <CardTitle>Lumifera Controller</CardTitle>
                        {(isLoading || wsStatus === 'connecting') && <Loader className="h-4 w-4 animate-spin" />}
                    </div>

                    <CardDescription>
                        Status: {wsStatus}
                        {wsStatus === 'connected' &&
                            `${params.powerState === 0 ? " & powered off ⚠️" : " & powered on"}`
                        }
                        {wsStatus === 'disconnected' && " ⚠️"}
                    </CardDescription>
                    {userLevel === USER_LEVELS.BASIC_HELP && (
                        <p className="text-xs text-muted-foreground mt-2">
                            The status text shows the current connection status to Lumifera and power state.
                        </p>
                    )}
                </div>

                {/* Desktop Controls */}
                <div className="hidden md:flex gap-2">
                    <PowerButton params={params} updateParam={updateParam} wsStatus={wsStatus} isEnabled={isEnabled} updateParams={updateParams} />
                    {userLevel === USER_LEVELS.BASIC_HELP && (
                        <p className="text-xs text-muted-foreground mt-2">
                            The power button will turn off the LEDs and on selected models also turn off the power supply.
                            Toggle it back on to resume.
                        </p>
                    )}
                    <Select value={userLevel} onValueChange={(value: UserLevel) => setUserLevel(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={USER_LEVELS.BASIC}>Basic</SelectItem>
                            <SelectItem value={USER_LEVELS.BASIC_HELP}>Basic Help</SelectItem>
                            <SelectItem value={USER_LEVELS.ADVANCED}>Advanced</SelectItem>
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
                                <PowerButton params={params} updateParam={updateParam} wsStatus={wsStatus} isEnabled={isEnabled} updateParams={updateParams} />
                                {userLevel === USER_LEVELS.BASIC_HELP && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        The power button will turn off the LEDs and on selected models also turn off the power supply.
                                        Toggle it back on to resume.
                                    </p>
                                )}
                                <Select value={userLevel} onValueChange={(value: UserLevel) => setUserLevel(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={USER_LEVELS.BASIC}>Basic</SelectItem>
                                        <SelectItem value={USER_LEVELS.BASIC_HELP}>Basic Help</SelectItem>
                                        <SelectItem value={USER_LEVELS.ADVANCED}>Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                                <ThemeToggle />
                            </div>
                            {wsStatus === 'disconnected' && <Button onClick={connect}>Reconnect</Button>}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </CardHeader >
    </>
    );

}
