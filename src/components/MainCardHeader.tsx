
import { Button } from './ui/button.tsx'
import { CardHeader, CardTitle, CardDescription } from './ui/card.tsx'
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
import { UserLevel } from './LumiferaController.tsx'

interface MainCardHeaderProps {
    wsStatus: string
    connect: () => void
    userLevel: string
    setUserLevel: (level: UserLevel) => void
}

export function MainCardHeader({ wsStatus, connect, userLevel, setUserLevel }: MainCardHeaderProps) {
    return (<>
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
    </>
    );

}
