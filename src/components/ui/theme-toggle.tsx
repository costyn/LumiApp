import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "./button"
import { useTheme } from "../ThemeProvider"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const cycleTheme = () => {
        const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"]
        const currentIndex = themes.indexOf(theme)
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
    }

    const themeIcons = {
        light: { icon: <Sun className="h-4 w-4 mr-2" />, text: "Light" },
        dark: { icon: <Moon className="h-4 w-4 mr-2" />, text: "Dark" },
        system: { icon: <Monitor className="h-4 w-4 mr-2" />, text: "System" }
    }

    return (
        <Button
            variant="outline"
            size="default"
            onClick={cycleTheme}
            className="min-w-[100px]"
        >
            <div className="flex items-center">
                {themeIcons[theme].icon}
                {themeIcons[theme].text}
            </div>
        </Button>
    )
}