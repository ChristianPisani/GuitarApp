import { Mode, Note, Scale } from '../types/musical-terms'
import { createContext, Dispatch, SetStateAction } from 'react'

import { allNotes } from '../utility/noteFunctions'
import { majorScale } from '../data/scales'
import { ScaleDegree } from '../data/chords'

export interface Subdivision {
  notes: Note[]
}

export interface Beat {
  scaleDegree: ScaleDegree
  subdivisions: Subdivision[]
  id: number
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
})
