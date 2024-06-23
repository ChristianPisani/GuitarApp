import { Interval, Mode, Note, Scale } from '../types/musical-terms'
import { createContext, Dispatch, SetStateAction } from 'react'

import { allNotes } from '../utility/noteFunctions'
import { majorScale } from '../data/scales'
import { ScaleDegree } from '../data/chords'
import { EffectNode, EffectType } from '../routes/sequencer-page/sequencer-page'

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
  scaleDegrees: ScaleDegree[]
  subdivisions: Subdivision[]
  id: number
  bars: number
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
  selectedBeat: Beat | undefined
  setSelectedBeat: Dispatch<SetStateAction<Beat | undefined>>

  state: SequencerState
  setState: (state: SequencerState) => void

  currentBeat: number
  currentSubdivision: number
  addSubdivision: (beat: Beat) => void
  removeSubdivision: (beat: Beat) => void
  updateBeat: (beat: Beat) => void
  removeBeat: (beat: Beat) => void

  toggleInterval: (beat: Beat, interval: ScaleDegree) => void

  effectNodes: EffectNode[]
  setEffectNodes: (effectNodes: EffectNode[]) => void
}

export const MusicContext = createContext<MusicContextProps>({
  selectedNote: allNotes[0],
  selectedScale: majorScale,
  selectedMode: 1,
  bpm: 130,
  setBpm: () => undefined,
  beats: [],
  selectedBeat: undefined,
  setSelectedScale: () => null,
  setSelectedNote: () => null,
  setSelectedMode: () => null,
  setBeats: () => null,
  setSelectedBeat: () => null,

  state: 'editing',
  setState: () => null,

  currentBeat: 0,
  currentSubdivision: 0,

  addSubdivision: beat => undefined,
  removeSubdivision: beat => undefined,

  updateBeat: beat => undefined,
  removeBeat: beat => undefined,

  toggleInterval: (beat, interval) => undefined,

  effectNodes: [],
  setEffectNodes: () => undefined,
})
