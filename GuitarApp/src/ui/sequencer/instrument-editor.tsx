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
import { useTrackEditor } from '../../hooks/track-editor-hook'
import { useKeyboardShortcuts } from '../../hooks/keyboard-shortcuts-hook'
import { IntervalEditor } from './elements/interval-editor'
import { SubdivisionEditor } from './elements/subdivision-editor'

export const InstrumentEditor = () => {
  const {
    bars,
    currentBarIndex,
    currentBeatIndex,
    selectedScale,
    currentSubdivisionIndex,
    updateBar,
    toggleInterval,
    addSubdivision,
    removeSubdivision,
    state,
  } = useContext(MusicContext)

  const {
    toggleNote,
    getCurrentBeatNotes,
    getCurrentBeatChord,
    currentSubdivision,
    currentSection,
    currentBeat,
    currentBar,
  } = useTrackEditor()

  const selectedChord = getCurrentBeatChord()
  const notes = getCurrentBeatNotes()
  useKeyboardShortcuts()

  return (
    <div
      className={`grid grid-rows-[1fr_auto] gap-8 rounded-l-2xl rounded-r-lg bg-primary-100
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
        <h3>
          {currentBarIndex}:{currentBeatIndex}:{currentSubdivisionIndex}
        </h3>

        {selectedChord && (
          <>
            <SubdivisionEditor />
            <IntervalEditor />
          </>
        )}
      </div>
      {currentSubdivision && (
        <div
          className={
            'flex flex-col items-center justify-start gap-2 px-4 pt-0 pb-8'
          }
        >
          <h2>Sound settings</h2>
          <div className={'w-full grid grid-cols-2 place-items-center gap-4'}>
            <RangeSlider
              label={'Velocity'}
              value={currentSubdivision?.velocity}
              min={0}
              max={2}
              step={0.1}
              onSlide={value => {
                if (!currentSubdivision || !currentBar) return

                currentSubdivision.velocity = value

                updateBar(currentBar)
              }}
            />
            <RangeSlider
              label={'Sustain'}
              value={currentSubdivision?.sustain}
              min={0}
              max={1}
              step={0.1}
              onSlide={value => {
                if (!currentSubdivision || !currentBar) return

                currentSubdivision.sustain = value

                updateBar(currentBar)
              }}
            />
            <RangeSlider
              label={'Strum speed'}
              value={currentSubdivision?.strumSpeed}
              min={0}
              max={0.1}
              step={0.01}
              onSlide={value => {
                if (!currentSubdivision || !currentBar) return

                currentSubdivision.strumSpeed = value

                updateBar(currentBar)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
