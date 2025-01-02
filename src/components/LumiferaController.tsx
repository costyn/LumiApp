import { useState } from 'react'
import { Button } from './ui/button.tsx'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card.tsx'
import { Slider } from './ui/slider.tsx'
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
import { useWebSocket } from '@/hooks/useWebsocket.tsx'

const WS_URL = 'ws://lumifera.local/ws'


type UserLevel = 'beginner' | 'intermediate' | 'advanced';



export function LumiferaController() {

    const { wsStatus, connect, params, updateParam } = useWebSocket(WS_URL)
    const [userLevel, setUserLevel] = useState<UserLevel>('beginner');

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