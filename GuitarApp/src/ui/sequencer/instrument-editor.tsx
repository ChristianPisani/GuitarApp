import { getChordName } from '../../data/chords'
import {
  ChordDegreeVisualizer,
  ChordVisualizerCustomChord,
  ChordVisualizerFullChord,
} from '../chord/chord'
import { standardTuningNotes } from '../../data/tunings'
import {
  Add,
  AddCircleOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  RemoveCircleOutline,
} from '@mui/icons-material'
import { NumberInput, Select } from '../input/inputs'
import { useContext, useEffect, useState } from 'react'
import { MusicContext } from '../../context/app-context'
import {
  allNotes,
  getChordNotes,
  getScaleChord,
  getScaleDegree,
  getScaleNotes,
  notesAreEqual,
} from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'
import { Note, StringNote } from '../../types/musical-terms'

export const InstrumentEditor = () => {
  const {
    selectedBeat,
    state,
    setState,
    beats,
    setBeats,
    selectedNote,
    selectedScale,
    currentSubdivision,
    addSubdivision,
    removeSubdivision,
  } = useContext(MusicContext)

  const [selectedSubdivision, setSelectedSubdivision] = useState(0)
  const [notes, setNotes] = useState<StringNote[]>([])

  useEffect(() => {
    setSelectedSubdivision(0)
  }, [selectedBeat])

  useEffect(() => {
    if (!selectedBeat) return

    const chordNotes = getChordNotes(
      getScaleChord(selectedNote, selectedScale, selectedBeat.scaleDegree, 13)
    )

    const notes = selectedBeat.subdivisions[selectedSubdivision]?.notes
      ?.map(note => {
        const scaleNote = chordNotes[note.index]
        return {
          note: scaleNote,
          stringIndex: note.string ?? 1,
        }
      })
      .filter(note => !!note)

    setNotes(notes ?? [])
  }, [selectedBeat, selectedSubdivision, beats])

  useEffect(() => {
    setSelectedSubdivision(currentSubdivision)
  }, [currentSubdivision])

  const currentAmountOfSubdivisions = selectedBeat?.subdivisions.length ?? 0

  const selectedChord = selectedBeat
    ? getScaleChord(selectedNote, selectedScale, selectedBeat.scaleDegree, 3)
    : undefined

  const gotoNextSubdivision = () => {
    setSelectedSubdivision(
      Math.min(currentAmountOfSubdivisions - 1, selectedSubdivision + 1)
    )
  }
  const gotoPreviousSubdivision = () => {
    setSelectedSubdivision(Math.max(0, selectedSubdivision - 1))
  }

  const toggleNote = (note: Note, stringIndex: number) => {
    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        selectedScale,
        selectedBeat?.scaleDegree ?? 1,
        13
      )
    )
    const chordIndex = chordNotes.findIndex(chordNote =>
      notesAreEqual(chordNote, note)
    )

    const selectedBeatIndex = beats.findIndex(
      beat => beat.id === selectedBeat?.id
    )

    const noteIndex = beats[selectedBeatIndex]?.subdivisions[
      selectedSubdivision
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === chordIndex &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    if (!hasNote) {
      beats[selectedBeatIndex]?.subdivisions[selectedSubdivision].notes?.push({
        string: stringIndex,
        index: chordIndex,
        pitch: note.pitch,
      })
    } else {
      beats[selectedBeatIndex]?.subdivisions[selectedSubdivision].notes?.splice(
        noteIndex,
        1
      )
    }

    setBeats([...beats])
  }

  return (
    <div
      className={
        'grid grid-rows-[1fr_auto] gap-8 rounded-l-2xl rounded-r-lg bg-primary-50'
      }
    >
      <div
        className={`flex w-full flex-col place-items-center justify-center rounded-3xl p-8 shadow-xl
          gap-4`}
      >
        <h2>
          {selectedChord ? getChordName(selectedChord) : 'No chord selected'}
        </h2>
        {!selectedChord && (
          <p>
            Select a chord to select different ways of playing it on the
            selected instrument
          </p>
        )}
        <ChordVisualizerFullChord
          chord={selectedChord}
          strings={standardTuningNotes().reverse()}
          showNoteIndex={true}
          selectedNotes={notes}
          onClickNote={toggleNote}
        />
        {selectedChord && (
          <>
            <div className={'flex gap-4'}>
              <h3>Subdivisions</h3>
              <div className={'flex gap-2'}>
                <button
                  onClick={() =>
                    selectedBeat && removeSubdivision(selectedBeat)
                  }
                  className={'hover:scale-105 active:scale-95 rounded-full'}
                >
                  <RemoveCircleOutline />
                </button>
                <button
                  onClick={() => selectedBeat && addSubdivision(selectedBeat)}
                  className={'hover:scale-105 active:scale-95 rounded-full'}
                >
                  <AddCircleOutlined />
                </button>
              </div>
            </div>
            <div className={'flex place-items-center'}>
              <button onClick={gotoPreviousSubdivision}>
                <ChevronLeftRounded />
              </button>
              <p className={'font-extrabold'}>
                {selectedSubdivision + 1}/{currentAmountOfSubdivisions}
              </p>
              <button onClick={gotoNextSubdivision}>
                <ChevronRightRounded />
              </button>
            </div>
          </>
        )}
      </div>
      <div className={'flex flex-col justify-end gap-8 p-8'}>
        <div className={'grid grid-cols-2 place-items-center gap-4'}>
          <Select
            options={['CAGED', '3NPS']}
            label={'Visualization technique'}
            id={'visualization-select'}
          />
        </div>
      </div>
    </div>
  )
}
