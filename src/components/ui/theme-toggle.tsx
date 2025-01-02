// components/ui/theme-toggle.tsx
import { Moon, Sun } from "lucide-react"
import { Button } from "./button.tsx"
import { useTheme } from "../ThemeProvider.tsx"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            {theme === "dark" ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    )
}