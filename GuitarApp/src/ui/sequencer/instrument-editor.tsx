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
import { Bar, MusicContext } from '../../context/app-context'
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
    bars,
    currentBarIndex,
    currentBeatIndex,
    setCurrentBeatIndex,
    selectedNote,
    selectedScale,
    selectedMode,
    currentSubdivision,
    setCurrentSubdivision,
    addSubdivision,
    removeSubdivision,
    updateBar,
    toggleInterval,
    instrument,
  } = useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex ?? 0]
  const subdivision = currentBeat?.subdivisions[currentSubdivision]

  const currentAmountOfSubdivisions = currentBeat?.subdivisions.length ?? 0
  const selectedChord =
    currentBar && currentBeat
      ? getScaleChord(
          selectedNote,
          currentBeat?.scale ?? selectedScale,
          selectedMode,
          currentBeat.scaleDegree,
          currentBeat.chordExtensionScaleDegrees
        )
      : undefined

  const getNotes = () => {
    if (!currentBar || !currentBeat) {
      return
    }

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        currentBeat?.scale ?? selectedScale,
        selectedMode,
        currentBeat.scaleDegree
      )
    )

    return currentBeat.subdivisions[
      Math.min(currentSubdivision, currentBeat.subdivisions.length - 1)
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
    if (!currentBar) return

    setCurrentSubdivision(c =>
      Math.min((currentBeat?.subdivisions.length ?? 1) - 1, c)
    )

    removeSubdivision(currentBar, barIndex)
  }

  const toggleNote = (note: Note, stringIndex: number) => {
    if (!currentBar || !currentBeat) return

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        currentBeat?.scale ?? selectedScale,
        selectedMode,
        currentBeat?.scaleDegree ?? 1
      )
    )
    const chordIndex = chordNotes.findIndex(chordNote =>
      notesAreEqual(chordNote, note, false)
    )

    const noteIndex = currentBeat.subdivisions[
      currentSubdivision
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === chordIndex &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    const stringAlreadyHasNoteIndex = currentBeat.subdivisions[
      currentSubdivision
    ].notes.findIndex(subdivisionNote => subdivisionNote.string === stringIndex)
    if (stringAlreadyHasNoteIndex !== -1) {
      currentBeat.subdivisions[currentSubdivision].notes?.splice(
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

      currentBeat?.subdivisions[currentSubdivision].notes?.push(noteToPush)
    }

    updateBar(currentBar)
  }

  const changeSubdivision = (barIndex: number, subdivisionIndex: number) => {
    setCurrentSubdivision(subdivisionIndex)
    setCurrentBeatIndex(barIndex)
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
        <h3>{currentBeat?.id}</h3>

        {selectedChord && (
          <>
            <div className={'flex gap-2 justify-between w-full items-center'}>
              <button onClick={gotoPreviousSubdivision}>
                <ChevronLeftRounded />
              </button>
              <div
                className={'flex flex-wrap items-center justify-center gap-2'}
              >
                {currentBar?.beats.map((beat, barIndex) => (
                  <div className={'flex gap-2 flex-wrap items-center'}>
                    {beat.subdivisions
                      .slice(0, currentBar.timeSignature)
                      .map((subdivision, subdivisionIndex) => (
                        <button
                          className={`rounded-full outline-2 outline-secondary-950 w-4 h-4 ${
                            currentBeat?.id === beat.id &&
                            currentSubdivision === subdivisionIndex
                              ? 'bg-secondary-950'
                              : subdivision.notes.length > 0
                                ? 'bg-secondary-700'
                                : ''
                          } ${
                            subdivisionIndex === 0
                              ? 'transform scale-110 outline-double'
                              : 'outline-dotted'
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

                  const selected =
                    currentBeat?.chordExtensionScaleDegrees?.some(
                      interval => interval === intervalIndex
                    )

                  return (
                    <button
                      className={`border-2 border-gray-950 rounded text-md grid place-items-center w-10 transition
                      h-10 ${selected ? 'shadow-accent transform scale-110 font-bold' : ''}`}
                      onClick={() =>
                        currentBar &&
                        toggleInterval(
                          currentBar,
                          currentBeatIndex,
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
                if (!subdivision || !currentBar) return

                subdivision.velocity = value

                updateBar(currentBar)
              }}
            />
            <RangeSlider
              label={'Sustain'}
              value={subdivision?.sustain}
              min={0}
              max={1}
              step={0.1}
              onSlide={value => {
                if (!subdivision || !currentBar) return

                subdivision.sustain = value

                updateBar(currentBar)
              }}
            />
            <RangeSlider
              label={'Strum speed'}
              value={subdivision?.strumSpeed}
              min={0}
              max={0.1}
              step={0.01}
              onSlide={value => {
                if (!subdivision || !currentBar) return

                subdivision.strumSpeed = value

                updateBar(currentBar)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
