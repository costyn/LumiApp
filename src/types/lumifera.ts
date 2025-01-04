import { Pause, Radar, Radio, X } from 'lucide-react'

export const USER_LEVELS = {
    BASIC: 'basic',
    BASIC_HELP: 'basicHelp',
    ADVANCED: 'advanced'
} as const;

export type UserLevel = typeof USER_LEVELS[keyof typeof USER_LEVELS];

export const FIX_MODES = [
    { mode: 'PAUSE', icon: Pause },
    { mode: 'RADAR', icon: Radar },
    { mode: 'RADIATE', icon: Radio },
    { mode: 'NONE', icon: X }
] as const;