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

export interface Bar {
  scaleDegree: ScaleDegree
  chordExtensionScaleDegrees: ScaleDegree[]
  subdivisions: Subdivision[]
  scale?: Scale
  id: number
}

export interface Beat {
  id: number
  bars: Bar[]
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
  beats: Beat[]
  setBeats: Dispatch<SetStateAction<Beat[]>>
  currentBarIndex: number
  setCurrentBarIndex: Dispatch<SetStateAction<number>>

  state: SequencerState
  setState: (state: SequencerState) => void

  currentBeatIndex: number
  setCurrentBeat: Dispatch<SetStateAction<number>>
  currentSubdivision: number
  setCurrentSubdivision: Dispatch<SetStateAction<number>>
  addSubdivision: (beat: Beat, barIndex: number) => void
  removeSubdivision: (beat: Beat, barIndex: number) => void
  updateBeat: (beat: Beat) => void

  toggleInterval: (beat: Beat, barIndex: number, interval: ScaleDegree) => void

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
  beats: [],
  setSelectedScale: () => null,
  setSelectedNote: () => null,
  setSelectedMode: () => null,
  setBeats: () => null,
  currentBarIndex: 0,
  setCurrentBarIndex: () => undefined,

  state: 'editing',
  setState: () => null,

  currentBeatIndex: 0,
  setCurrentBeat: () => null,
  currentSubdivision: 0,
  setCurrentSubdivision: () => null,

  addSubdivision: beat => undefined,
  removeSubdivision: beat => undefined,

  updateBeat: beat => undefined,

  toggleInterval: (beat, interval) => undefined,

  effectNodes: [],
  setEffectNodes: () => undefined,

  instrument: undefined,
})
