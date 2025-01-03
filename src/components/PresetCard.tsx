import { Save, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Input } from './ui/input'
import { useState, useEffect } from 'react'
import { LumiferaParams } from '@/hooks/useWebsocket'
import Cookies from 'js-cookie'

interface Preset {
    name: string;
    params: Partial<LumiferaParams>;
}

interface PresetCardProps {
    params: LumiferaParams;
    updateParams: (params: LumiferaParams) => void;
    isEnabled: boolean
}

export function PresetCard({ params, updateParams, isEnabled }: PresetCardProps) {
    const [presets, setPresets] = useState<Preset[]>([])
    const [newPresetName, setNewPresetName] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    // Load presets from cookie on mount
    useEffect(() => {
        const savedPresets = Cookies.get('lumifera-presets')
        if (savedPresets) {
            setPresets(JSON.parse(savedPresets))
        }
    }, [])

    // Save presets to cookie whenever they change
    useEffect(() => {
        if (presets.length > 0) {
            try {
                const serializedPresets = JSON.stringify(presets)
                Cookies.set('lumifera-presets', serializedPresets, { expires: 365 })
                console.log('Saved presets:', serializedPresets)
            } catch (error) {
                console.error('Failed to save presets:', error)
            }
        }
    }, [presets])

    const savePreset = () => {
        if (!newPresetName.trim()) return

        setPresets(prev => [...prev, {
            name: newPresetName,
            params: {
                bpm: params.bpm,
                brightness: params.brightness,
                direction: params.direction,
                fixMode: params.fixMode,
                bgRotSpeed: params.bgRotSpeed,
                fgRotSpeed: params.fgRotSpeed,
                blendTime: params.blendTime,
                bgPaletteIndex: params.bgPaletteIndex,
                fgPaletteIndex: params.fgPaletteIndex
            }
        }])
        setNewPresetName('')
        setIsCreating(false)
    }

    const loadPreset = (preset: Preset) => {
        updateParams(preset.params as LumiferaParams)
    }

    const [presetToDelete, setPresetToDelete] = useState<number | null>(null)

    const deletePreset = (index: number) => {
        setPresetToDelete(index)
    }

    const confirmDelete = () => {
        if (presetToDelete !== null) {
            setPresets(prev => prev.filter((_, i) => i !== presetToDelete))
            setPresetToDelete(null)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Presets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {presets.map((preset, index) => (
                        <div key={index} className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => loadPreset(preset)}
                                disabled={!isEnabled}
                            >
                                {preset.name}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deletePreset(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <AlertDialog open={presetToDelete !== null} onOpenChange={() => setPresetToDelete(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Preset</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this preset? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {isCreating ? (
                    <div className="mt-4 flex gap-2">
                        <Input
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            placeholder="Preset name"
                        />
                        <Button onClick={savePreset}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setIsCreating(true)}
                        disabled={!isEnabled}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Preset
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}