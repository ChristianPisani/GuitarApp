import {
  getChordName,
  ScaleDegree,
  scaleDegreeNotations,
} from '../../data/chords'
import { ChordVisualizerFullChord } from '../chord/chord'
import { standardTuningNotes } from '../../data/tunings'
import {
  AddCircleOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  RemoveCircleOutline,
} from '@mui/icons-material'
import { Select } from '../input/inputs'
import { useContext, useEffect, useState } from 'react'
import { Beat, MusicContext } from '../../context/app-context'
import {
  getChordNotes,
  getScaleChord,
  notesAreEqual,
} from '../../utility/noteFunctions'
import { Note, StringNote } from '../../types/musical-terms'
import { RangeSlider } from '../input/range-slider'

export const InstrumentEditor = () => {
  const {
    selectedBeat,
    state,
    setState,
    beats,
    setBeats,
    selectedNote,
    selectedScale,
    selectedMode,
    currentSubdivision,
    addSubdivision,
    removeSubdivision,
    updateBeat,
    toggleInterval,
  } = useContext(MusicContext)

  const [selectedSubdivision, setSelectedSubdivision] = useState(0)
  const [notes, setNotes] = useState<StringNote[]>([])

  const [currentTrackIndex, setCurrentTrackIndex] = useState(1)

  const subdivision = selectedBeat?.subdivisions[selectedSubdivision]

  useEffect(() => {
    setSelectedSubdivision(0)
  }, [selectedBeat])

  useEffect(() => {
    if (!selectedBeat) {
      return
    }

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        selectedScale,
        selectedMode,
        selectedBeat.scaleDegree
      )
    )

    const notes = selectedBeat.subdivisions[
      Math.min(selectedSubdivision, selectedBeat.subdivisions.length - 1)
    ]?.notes
      ?.map(note => {
        const scaleNote = chordNotes[note.index]
        return {
          note: {
            ...scaleNote,
            pitch: note.pitch,
            relativeIndex: note.relativeIndex,
          },
          stringIndex: note.string ?? 1,
        }
      })
      .filter(note => !!note)

    setNotes([...notes] ?? [])
  }, [selectedBeat, selectedSubdivision, beats, selectedScale])

  useEffect(() => {
    setSelectedSubdivision(currentSubdivision)
  }, [currentSubdivision])

  const currentAmountOfSubdivisions = selectedBeat?.subdivisions.length ?? 0

  const selectedChord = selectedBeat
    ? getScaleChord(
        selectedNote,
        selectedScale,
        selectedMode,
        selectedBeat.scaleDegree,
        selectedBeat.scaleDegrees
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

  const doRemoveSubdivision = (beat: Beat) => {
    setSelectedSubdivision(c => Math.min(beat.subdivisions.length - 1, c))

    removeSubdivision(beat)
  }

  const toggleNote = (note: Note, stringIndex: number) => {
    if (!selectedBeat) return

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        selectedScale,
        selectedMode,
        selectedBeat?.scaleDegree ?? 1
      )
    )
    const chordIndex = chordNotes.findIndex(chordNote =>
      notesAreEqual(chordNote, note, false)
    )

    const noteIndex = selectedBeat.subdivisions[
      selectedSubdivision
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === chordIndex &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    const stringAlreadyHasNoteIndex = selectedBeat.subdivisions[
      selectedSubdivision
    ].notes.findIndex(subdivisionNote => subdivisionNote.string === stringIndex)
    if (stringAlreadyHasNoteIndex !== -1) {
      selectedBeat.subdivisions[selectedSubdivision].notes?.splice(
        stringAlreadyHasNoteIndex,
        1
      )
    }

    if (!hasNote) {
      const noteToPush = {
        string: stringIndex,
        index: chordIndex,
        pitch: note.pitch,
        relativeIndex: note.relativeIndex ?? 0,
      }

      selectedBeat?.subdivisions[selectedSubdivision].notes?.push(noteToPush)
    }

    updateBeat(selectedBeat)
  }

  return (
    <div
      className={`grid grid-rows-[1fr_auto] gap-8 rounded-l-2xl rounded-r-lg bg-primary-50
        relative z-0`}
    >
      <div
        className={
          'absolute right-[100%] top-8 flex flex-col gap-2 justify-end items-end z-[-1]'
        }
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <button
            onClick={() => setCurrentTrackIndex(index)}
            className={`${
              index === currentTrackIndex
                ? 'font-bold border-secondary-950 pr-12'
                : 'border-transparent hover:bg-gray-50'
            } bg-primary-50 border-8 px-8 py-4
            rounded-l-3xl border-r-0 w-fit whitespace-nowrap transition-all`}
          >
            <p className={'text-lg'}>Track {index}</p>
          </button>
        ))}
      </div>
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
          strings={standardTuningNotes()}
          showNoteIndex={false}
          selectedNotes={notes}
          onClickNote={toggleNote}
        />
        {selectedChord && (
          <>
            <div className={'flex gap-2 justify-between w-full items-center'}>
              <button onClick={gotoPreviousSubdivision}>
                <ChevronLeftRounded />
              </button>
              <div className={'flex gap-2 max-w-48 flex-wrap items-center'}>
                {selectedBeat?.subdivisions.map((subdivision, index) => (
                  <button
                    className={`rounded-full border-2 border-secondary-950 w-4 h-4 ${
                      selectedSubdivision === index ? 'bg-secondary-950' : ''
                    }`}
                    onClick={() => setSelectedSubdivision(index)}
                  ></button>
                ))}
              </div>
              <button onClick={gotoNextSubdivision}>
                <ChevronRightRounded />
              </button>
            </div>
            <div className={'flex gap-4'}>
              <h3>
                Subdivisions ({selectedSubdivision + 1}/
                {currentAmountOfSubdivisions})
              </h3>
              <div className={'flex gap-2'}>
                <button
                  onClick={() =>
                    selectedBeat && doRemoveSubdivision(selectedBeat)
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
            <div className={'flex flex-col items-center gap-4'}>
              <h3>Intervals</h3>
              <div className={'flex gap-2'}>
                {selectedScale.intervals.map((_, index) => {
                  // TOOD: Not sure if this will work with all scales. Should find a better way to handle intervals generally.
                  const intervalIndex = index + 1

                  const selected = selectedBeat?.scaleDegrees?.some(
                    interval => interval === intervalIndex
                  )

                  return (
                    <button
                      className={`border-2 border-gray-950 rounded text-md grid place-items-center w-10 transition
                      h-10 ${selected ? 'shadow-accent transform scale-110 font-bold' : ''}`}
                      onClick={() =>
                        selectedBeat &&
                        toggleInterval(
                          selectedBeat,
                          intervalIndex as ScaleDegree
                        )
                      }
                    >
                      {intervalIndex}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
      {subdivision && (
        <div
          className={
            'flex flex-col items-center justify-start gap-2 px-4 pt-0 pb-8'
          }
        >
          <h2>Sound settings</h2>
          <div className={'w-full grid grid-cols-2 place-items-center gap-4'}>
            <RangeSlider
              label={'Velocity'}
              value={subdivision?.velocity}
              min={0}
              max={2}
              step={0.1}
              onSlide={value => {
                if (!subdivision) return

                subdivision.velocity = value

                updateBeat(selectedBeat)
              }}
            />
            <RangeSlider
              label={'Sustain'}
              value={subdivision?.sustain}
              min={0}
              max={1}
              step={0.1}
              onSlide={value => {
                if (!subdivision) return

                subdivision.sustain = value

                updateBeat(selectedBeat)
              }}
            />
            <RangeSlider
              label={'Strum speed'}
              value={subdivision?.strumSpeed}
              min={0}
              max={0.1}
              step={0.01}
              onSlide={value => {
                if (!subdivision) return

                subdivision.strumSpeed = value

                updateBeat(selectedBeat)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
