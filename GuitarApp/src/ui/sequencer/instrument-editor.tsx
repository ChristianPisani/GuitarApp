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
import { playNotes } from '../../utility/instrumentFunctions'

export const InstrumentEditor = () => {
  const {
    beats,
    currentBeatIndex,
    currentBarIndex,
    setCurrentBarIndex,
    selectedNote,
    selectedScale,
    selectedMode,
    currentSubdivision,
    setCurrentSubdivision,
    addSubdivision,
    removeSubdivision,
    updateBeat,
    toggleInterval,
    instrument,
  } = useContext(MusicContext)

  const currentBeat = beats[currentBeatIndex]
  const currentBar = currentBeat?.bars[currentBarIndex ?? 0]
  const subdivision = currentBar?.subdivisions[currentSubdivision]

  const currentAmountOfSubdivisions = currentBar?.subdivisions.length ?? 0
  const selectedChord =
    currentBeat && currentBar
      ? getScaleChord(
          selectedNote,
          currentBar?.scale ?? selectedScale,
          selectedMode,
          currentBar.scaleDegree,
          currentBar.chordExtensionScaleDegrees
        )
      : undefined

  const getNotes = () => {
    if (!currentBeat || !currentBar) {
      return
    }

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        currentBar?.scale ?? selectedScale,
        selectedMode,
        currentBar.scaleDegree
      )
    )

    return currentBar.subdivisions[
      Math.min(currentSubdivision, currentBar.subdivisions.length - 1)
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
  }

  const notes = getNotes()

  useEffect(() => {
    // setSelectedSubdivision(currentSubdivision)
  }, [currentSubdivision])

  const gotoNextSubdivision = () => {
    //setSelectedSubdivision(
    //  Math.min(currentAmountOfSubdivisions - 1, selectedSubdivision + 1)
    //)
  }
  const gotoPreviousSubdivision = () => {
    //setSelectedSubdivision(Math.max(0, selectedSubdivision - 1))
  }

  const doRemoveSubdivision = (barIndex: number) => {
    if (!currentBeat) return

    setCurrentSubdivision(c =>
      Math.min((currentBar?.subdivisions.length ?? 1) - 1, c)
    )

    removeSubdivision(currentBeat, barIndex)
  }

  const toggleNote = (note: Note, stringIndex: number) => {
    if (!currentBeat || !currentBar) return

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        currentBar?.scale ?? selectedScale,
        selectedMode,
        currentBar?.scaleDegree ?? 1
      )
    )
    const chordIndex = chordNotes.findIndex(chordNote =>
      notesAreEqual(chordNote, note, false)
    )

    const noteIndex = currentBar.subdivisions[
      currentSubdivision
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === chordIndex &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    const stringAlreadyHasNoteIndex = currentBar.subdivisions[
      currentSubdivision
    ].notes.findIndex(subdivisionNote => subdivisionNote.string === stringIndex)
    if (stringAlreadyHasNoteIndex !== -1) {
      currentBar.subdivisions[currentSubdivision].notes?.splice(
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

      instrument && playNotes(instrument, [note])

      currentBar?.subdivisions[currentSubdivision].notes?.push(noteToPush)
    }

    updateBeat(currentBeat)
  }

  const changeSubdivision = (barIndex: number, subdivisionIndex: number) => {
    setCurrentSubdivision(subdivisionIndex)
    setCurrentBarIndex(barIndex)
  }

  return (
    <div
      className={`grid grid-rows-[1fr_auto] gap-8 rounded-l-2xl rounded-r-lg bg-primary-50
        relative z-0`}
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
          strings={standardTuningNotes()}
          showNoteIndex={false}
          selectedNotes={notes}
          onClickNote={toggleNote}
        />
        <h3>{currentBar?.id}</h3>

        {selectedChord && (
          <>
            <div className={'flex gap-2 justify-between w-full items-center'}>
              <button onClick={gotoPreviousSubdivision}>
                <ChevronLeftRounded />
              </button>
              <div className={'grid cols-1 gap-2'}>
                {currentBeat?.bars.map((bar, barIndex) => (
                  <div className={'flex gap-2 max-w-48 flex-wrap items-center'}>
                    <div className={'flex gap-2'}>
                      <button
                        onClick={() =>
                          currentBeat && doRemoveSubdivision(barIndex)
                        }
                        className={
                          'hover:scale-105 active:scale-95 rounded-full'
                        }
                      >
                        <RemoveCircleOutline />
                      </button>
                      <button
                        onClick={() =>
                          currentBeat && addSubdivision(currentBeat, barIndex)
                        }
                        className={
                          'hover:scale-105 active:scale-95 rounded-full'
                        }
                      >
                        <AddCircleOutlined />
                      </button>
                    </div>
                    {bar.subdivisions.map((subdivision, subdivisionIndex) => (
                      <button
                        className={`rounded-full border-2 border-secondary-950 w-4 h-4 ${
                          currentBar?.id === bar.id &&
                          currentSubdivision === subdivisionIndex
                            ? 'bg-secondary-950'
                            : ''
                        }`}
                        onClick={() =>
                          changeSubdivision(barIndex, subdivisionIndex)
                        }
                      ></button>
                    ))}
                  </div>
                ))}
              </div>
              <button onClick={gotoNextSubdivision}>
                <ChevronRightRounded />
              </button>
            </div>
            <div className={'flex flex-col items-center gap-4'}>
              <h3>Intervals</h3>
              <div className={'flex gap-2'}>
                {selectedScale.intervals.map((_, index) => {
                  // TOOD: Not sure if this will work with all scales. Should find a better way to handle intervals generally.
                  const intervalIndex = index + 1

                  const selected = currentBar?.chordExtensionScaleDegrees?.some(
                    interval => interval === intervalIndex
                  )

                  return (
                    <button
                      className={`border-2 border-gray-950 rounded text-md grid place-items-center w-10 transition
                      h-10 ${selected ? 'shadow-accent transform scale-110 font-bold' : ''}`}
                      onClick={() =>
                        currentBeat &&
                        toggleInterval(
                          currentBeat,
                          currentSubdivision % currentBeat.bars.length,
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
                if (!subdivision || !currentBeat) return

                subdivision.velocity = value

                updateBeat(currentBeat)
              }}
            />
            <RangeSlider
              label={'Sustain'}
              value={subdivision?.sustain}
              min={0}
              max={1}
              step={0.1}
              onSlide={value => {
                if (!subdivision || !currentBeat) return

                subdivision.sustain = value

                updateBeat(currentBeat)
              }}
            />
            <RangeSlider
              label={'Strum speed'}
              value={subdivision?.strumSpeed}
              min={0}
              max={0.1}
              step={0.01}
              onSlide={value => {
                if (!subdivision || !currentBeat) return

                subdivision.strumSpeed = value

                updateBeat(currentBeat)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
