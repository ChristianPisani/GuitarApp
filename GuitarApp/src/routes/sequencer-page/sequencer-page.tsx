import './sequencer-page.scss'
import {
  allNotes,
  getChordNotes,
  getScaleChord,
  getScaleNotes,
} from '../../utility/noteFunctions'
import { useEffect, useState } from 'react'
import { FretboardContext } from '../../ui/Fretboard/FretboardContext'
import { Mode, Note, Scale } from '../../types/musical-terms'
import { majorScale } from '../../data/scales'
import { Sequencer } from '../../ui/sequencer/sequencer'
import { SequencerUi } from '../../ui/sequencer/sequencer-ui'
import { Beat, MusicContext, SequencerState } from '../../context/app-context'
import { useSequencer } from '../../hooks/sequencer-hook'
import { acousticGuitar } from '../../utility/instruments'
import { playNotes } from '../../utility/instrumentFunctions'

export const SequencerPage = () => {
  const [selectedNote, setSelectedNote] = useState<Note>(allNotes[0])
  const [selectedScale, setSelectedScale] = useState<Scale>(majorScale)
  const [selectedMode, setSelectedMode] = useState<Mode>(1)
  const [selectedBeat, setSelectedBeat] = useState<Beat | undefined>(undefined)
  const [beats, setBeats] = useState<Beat[]>([])
  const [state, setState] = useState<SequencerState>('editing')

  const scaleNotes = getScaleNotes(selectedNote, selectedScale)

  const sequencer = useSequencer({
    instrument: acousticGuitar,
    onBeat: (beat: Beat, subdivision: number) => {
      const notes = beat.subdivisions[subdivision].notes.map(beatNote => {
        const scaleChord = getScaleChord(
          selectedNote,
          selectedScale,
          beat.scaleDegree,
          13
        )
        const chordNotes = getChordNotes(scaleChord)
        const chordNote = chordNotes[beatNote.index]

        return {
          pitch: beatNote.pitch,
          sharp: chordNote.sharp,
          name: chordNote.name,
        }
      })

      playNotes(acousticGuitar, notes, 0.01, 0.1, true)
    },
    beats,
    selectedNote,
    selectedScale,
  })

  const removeBeat = (beat: Beat) => {
    const beatIndex = beats.findIndex(b => b.id === beat.id)
    beats[beatIndex].subdivisions.splice(-1, 1)
    setBeats([...beats])
  }

  const updateBeat = (beat: Beat) => {
    const beatIndex = beats.findIndex(b => b.id === beat.id)
    beats[beatIndex] = beat
    setBeats([...beats])
  }

  const removeSubdivision = (beat: Beat) => {
    const currentAmountOfSubdivisions = beat.subdivisions.length

    if (currentAmountOfSubdivisions <= 1) return

    beat.subdivisions.splice(-1, 1)
    updateBeat(beat)
  }

  const addSubdivision = (beat: Beat) => {
    const maxAmountOfSubdivisions = 8

    const currentAmountOfSubdivisions = beat.subdivisions.length

    if (!selectedBeat || currentAmountOfSubdivisions >= maxAmountOfSubdivisions)
      return

    beat.subdivisions.push({ notes: [] })
    updateBeat(beat)
  }

  useEffect(() => {
    if (state === 'playing') {
      sequencer.startBeat()
    } else {
      sequencer.stopBeat()
    }
  }, [state])

  return (
    <MusicContext.Provider
      value={{
        setSelectedNote,
        selectedNote,
        selectedScale,
        selectedMode,
        setSelectedMode,
        setSelectedScale,
        beats,
        setBeats,
        selectedBeat,
        setSelectedBeat,
        state,
        setState,
        currentBeat: sequencer.currentBeat,
        currentSubdivision: sequencer.currentSubdivision,
        removeSubdivision,
        addSubdivision,
        updateBeat,
        removeBeat,
      }}
    >
      <main
        className={
          'flex h-full w-full flex-col place-items-center bg-primary-100'
        }
      >
        <h2 className={'p-4 md:p-8'}>Sequencer</h2>
        <h3>Beats: {beats.length}</h3>
        <h4>
          Subdivisions:
          {beats[sequencer.currentBeat]?.subdivisions?.length ?? 0}
        </h4>
        <h3>
          {sequencer.currentBeat}:{sequencer.currentSubdivision}
        </h3>
        <SequencerUi />
      </main>
    </MusicContext.Provider>
  )
}
