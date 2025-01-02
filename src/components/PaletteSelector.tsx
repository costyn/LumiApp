// NOT IN USE YET

// components/PaletteSelector.tsx
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import palettesJson from '@/assets/palettes.json'

export interface PalettesData {
    palettes: Palette[]
}

export const palettesData = palettesJson as PalettesData;

export interface Palette {
    index: number
    label: string
    gpName: string
    enabled: string
    tags: string[]
}

interface PaletteSelectorProps {
    value: number
    onChange: (value: number) => void
}


export function PaletteSelector({ value, onChange }: PaletteSelectorProps) {
    const palettes = palettesData.palettes
    const [open, setOpen] = useState(false)
    const selectedPalette = palettes.find(p => p.index === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedPalette?.label ?? "Select palette..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search palettes..." />
                    <CommandEmpty>No palette found.</CommandEmpty>
                    <CommandGroup>
                        {palettes.map((palette) => (
                            <CommandItem
                                key={palette.index}
                                value={palette.label}
                                onSelect={() => {
                                    onChange(palette.index)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === palette.index ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {palette.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}