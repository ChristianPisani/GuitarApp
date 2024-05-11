import { getChordName } from '../../data/chords'
import {
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
  getScaleChord,
  getScaleDegree,
  getScaleNotes,
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
    const scaleNotes = getScaleNotes(selectedNote, selectedScale)
    const notes = selectedBeat?.subdivisions[selectedSubdivision]?.notes
      ?.map(note => {
        const scaleNote = scaleNotes[note.index]
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

  const maxSubdivisions = 8

  const currentAmountOfSubdivisions = selectedBeat?.subdivisions.length ?? 1

  const selectedChord = selectedBeat
    ? getScaleChord(
        allNotes[0],
        availableScales[0],
        selectedBeat.scaleDegree,
        3
      )
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
    const scaleDegree = getScaleDegree(selectedNote, note, selectedScale)

    const selectedBeatIndex = beats.findIndex(
      beat => beat.id === selectedBeat?.id
    )

    const noteIndex = beats[selectedBeatIndex]?.subdivisions[
      selectedSubdivision
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === scaleDegree &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    if (!hasNote) {
      beats[selectedBeatIndex]?.subdivisions[selectedSubdivision].notes?.push({
        string: stringIndex,
        index: scaleDegree,
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
