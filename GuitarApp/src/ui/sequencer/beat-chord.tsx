import React, {
  ButtonHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
  FC,
  Ref,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import './beat-chord.scss'
import { Chord, Scale } from '../../types/musical-terms'
import {
  getChordName,
  ScaleDegree,
  scaleDegreeNotations,
} from '../../data/chords'
import { Bar, Beat, MusicContext } from '../../context/app-context'
import { ScalePicker } from '../scale-picker/scale-picker'
import { Button } from '../button/button'
import { getScaleChord } from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'
import { useTrackEditor } from '../../hooks/track-editor-hook'
import { defaultBeat } from '../../utility/sequencer-utilities'

type BeatChordProps = {
  showLines: boolean
  beat: Bar
  beatBarId: number
  onDelete?: (ref?: HTMLDivElement) => void
  chord: Chord
  selected: boolean
  onClick: () => void
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

type BeatBarProps = {
  bar: Bar
}

export const BarComponent: FC<BeatBarProps> = ({ bar }) => {
  const {
    bars,
    currentBarIndex,
    setCurrentBarIndex,
    setBars,
    selectedNote,
    selectedMode,
    selectedScale,
    currentBeatIndex,
    setCurrentBeatIndex,
    updateBar,
  } = useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex ?? 0]
  const {
    addBeat,
    removeBeat,
    removeBar,
    updateScale,
    updateScaleDegree,
    changeTimeSignature,
  } = useTrackEditor()

  const isSelectedBar = bar.id === currentBar?.id

  return (
    <div className={'grid place-items-center gap-4'}>
      <div className={'grid gap-4 border-2 border-primary-100 p-8'}>
        <div className={'flex gap-4 items-center'}>
          {bar.beats.map((beat, index) => {
            const chord = getScaleChord(
              selectedNote,
              beat?.scale ?? selectedScale,
              selectedMode,
              beat.scaleDegree,
              beat.chordExtensionScaleDegrees
            )
            const isSelectedBeat = currentBeatIndex === index && isSelectedBar

            const selectBar = () => {
              setCurrentBeatIndex(index)
              setCurrentBarIndex(bars.indexOf(bar))
            }

            return (
              <button
                onClick={() => selectBar()}
                className={'p-4 grid flex-1 place-items-center gap-2'}
              >
                <div className={`${isSelectedBeat ? 'glow' : ''}`}>
                  <p className={'text-3xl font-bold'}>
                    {scaleDegreeNotations(beat.scaleDegree)}
                  </p>
                  <p className={'text-xl whitespace-nowrap'}>
                    {getChordName(chord, false)}
                  </p>
                  <p>{beat.scale?.name}</p>
                </div>
                <button onClick={() => removeBeat(bar, index)}>Delete</button>
              </button>
            )
          })}
          {bars.length > 0 && (
            <button
              onClick={addBeat}
              className={
                'text-3xl border-primary-100 border-2 p-4 rounded-full aspect-square h-16'
              }
            >
              +
            </button>
          )}
        </div>

        {/*isSelectedBar && (
          <>
            <div className={'flex gap-2 w-full justify-around'}>
              {Array(7)
                .fill(1)
                .map((_, scaleDegreeIndex) => {
                  const scaleDegree = (scaleDegreeIndex + 1) as ScaleDegree
                  const isSelectedScaleDegree =
                    scaleDegree ===
                    currentBar?.beats[currentBeatIndex ?? 0]?.scaleDegree

                  return (
                    <button
                      onClick={() => updateScaleDegree(bar, scaleDegree)}
                      className={isSelectedScaleDegree ? 'glow' : ''}
                    >
                      {scaleDegreeNotations(scaleDegree)}
                    </button>
                  )
                })}
            </div>
            <select
              value={currentBeat?.scale?.name}
              onChange={e =>
                updateScale(
                  bar,
                  availableScales.find(scale => scale.name === e.target.value)
                )
              }
            >
              {[undefined, ...availableScales].map(scale => (
                <option value={scale?.name}>{scale?.name}</option>
              ))}
            </select>
            Change time signature
            <select
              value={bar.timeSignature}
              onChange={e => changeTimeSignature(bar, Number(e.target.value))}
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
            </select>
          </>
        )*/}
      </div>
      <p>
        Time signature:{' '}
        {bar.beats.reduce((length, beat) => beat.sections.length + length, 0)}/
        {bar.timeSignature}
      </p>
      <button onClick={() => removeBar(bar)}>Delete</button>
    </div>
  )
}
