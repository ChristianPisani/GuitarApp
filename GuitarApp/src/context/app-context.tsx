import { Mode, Note, Scale } from '../types/musical-terms'
import { createContext, Dispatch, SetStateAction } from 'react'

import { allNotes } from '../utility/noteFunctions'
import { majorScale } from '../data/scales'
import { ScaleDegree } from '../data/chords'

export type SubdivisionNote = {
  index: number
  pitch: number
  string?: number
}

export interface Subdivision {
  notes: SubdivisionNote[]
}

export interface Beat {
  scaleDegree: ScaleDegree
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
}

export const MusicContext = createContext<MusicContextProps>({
  selectedNote: allNotes[0],
  selectedScale: majorScale,
  selectedMode: 1,
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
})
