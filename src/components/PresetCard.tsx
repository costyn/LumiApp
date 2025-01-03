import { Save, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
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
    updateParam: (name: keyof LumiferaParams, value: any) => void;
}

export function PresetCard({ params, updateParam }: PresetCardProps) {
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
        Object.entries(preset.params).forEach(([key, value]) => {
            updateParam(key as keyof LumiferaParams, value)
        })
    }

    const deletePreset = (index: number) => {
        setPresets(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Presets</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {presets.map((preset, index) => (
                        <div key={index} className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => loadPreset(preset)}
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
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Preset
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}