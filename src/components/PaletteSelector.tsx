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

interface PalettesData {
    palettes: Palette[]
}

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

const palettesData = palettesJson as PalettesData;

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
                <Command >
                    <CommandInput placeholder="Search palettes..." />
                    <CommandEmpty>No palette found.</CommandEmpty>
                    <CommandGroup>
                        {palettes.map((palette) => (
                            <CommandItem
                                key={palette.index}
                                value={palette.label} // Use label instead of index for filtering
                            >
                                <button
                                    onClick={() => {
                                        console.log('Selected:', palette.label);
                                        onChange(palette.index);
                                        setOpen(false);
                                    }}
                                    className="flex w-full items-center"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === palette.index ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {palette.label}
                                </button>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}