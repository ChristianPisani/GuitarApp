import { Interval, Mode, Note, Scale } from '../types/musical-terms'
import { createContext, Dispatch, SetStateAction } from 'react'

import { allNotes } from '../utility/noteFunctions'
import { majorScale } from '../data/scales'
import { ScaleDegree } from '../data/chords'
import { EffectNode, EffectType } from '../routes/sequencer-page/sequencer-page'
import { Sampler, Synth } from 'tone'

export type SubdivisionNote = {
  index: number
  // Pitch fails if you change the chord, as sometimes the correct note will be a pitch higher or lower.
  // RelativeScaleIndex instead keeps track of where in the scale the note is in relation to its context
  // So for example it could be in relation to a string.
  // Where 1 is first time it appears on the string, 2 is second etc...
  relativeIndex: number
  pitch: number
  string?: number
}

export interface Subdivision {
  notes: SubdivisionNote[]
  strumSpeed: number
  velocity: number
  sustain: number
}

export interface Beat {
  scaleDegree: ScaleDegree
  chordExtensionScaleDegrees: ScaleDegree[]
  subdivisions: Subdivision[]
  scale?: Scale
  id: number
}

export interface Bar {
  id: number
  timeSignature: number
  beats: Beat[]
}

export type SequencerState = 'playing' | 'paused' | 'stopped' | 'editing'

interface MusicContextProps {
  selectedNote: Note
  setSelectedNote: Dispatch<SetStateAction<Note>>
  selectedScale: Scale
  setSelectedScale: Dispatch<SetStateAction<Scale>>
  bpm: number
  setBpm: Dispatch<SetStateAction<number>>
  selectedMode: Mode
  setSelectedMode: Dispatch<SetStateAction<Mode>>
  bars: Bar[]
  setBars: Dispatch<SetStateAction<Bar[]>>
  currentBeatIndex: number
  setCurrentBeatIndex: Dispatch<SetStateAction<number>>

  state: SequencerState
  setState: (state: SequencerState) => void

  currentBarIndex: number
  setCurrentBarIndex: Dispatch<SetStateAction<number>>
  currentSubdivisionIndex: number
  setCurrentSubdivisionIndex: Dispatch<SetStateAction<number>>
  addSubdivision: (barIndex: number, beatIndex: number) => void
  removeSubdivision: (barIndex: number, beatIndex: number) => void
  updateBar: (beat: Bar) => void

  toggleInterval: (bar: Bar, beatIndex: number, interval: ScaleDegree) => void

  effectNodes: EffectNode[]
  setEffectNodes: (effectNodes: EffectNode[]) => void

  instrument: Sampler | Synth | undefined
}

export const MusicContext = createContext<MusicContextProps>({
  selectedNote: allNotes[0],
  selectedScale: majorScale,
  selectedMode: 1,
  bpm: 130,
  setBpm: () => undefined,
  bars: [],
  setSelectedScale: () => null,
  setSelectedNote: () => null,
  setSelectedMode: () => null,
  setBars: () => null,
  currentBeatIndex: 0,
  setCurrentBeatIndex: () => undefined,

  state: 'editing',
  setState: () => null,

  currentBarIndex: 0,
  setCurrentBarIndex: () => null,
  currentSubdivisionIndex: 0,
  setCurrentSubdivisionIndex: () => null,

  addSubdivision: beat => undefined,
  removeSubdivision: beat => undefined,

  updateBar: beat => undefined,

  toggleInterval: (beat, interval) => undefined,

  effectNodes: [],
  setEffectNodes: () => undefined,

  instrument: undefined,
})
