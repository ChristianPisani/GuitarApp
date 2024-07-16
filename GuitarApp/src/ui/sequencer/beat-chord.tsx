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
    setCurrentBar,
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

  const removeBeat = (beatIndex: number) => {
    bar.beats.splice(beatIndex, 1)
    if (bar.beats.length === 0) removeBar()
    updateBar(bar)
  }

  const removeBar = () => {
    const barIndex = bars.indexOf(bar)

    bars.splice(barIndex, 1)
    setBars([...bars])
  }

  const updateScaleDegree = (newScaleDegree: ScaleDegree) => {
    if (!currentBeat) return
    currentBeat.scaleDegree = newScaleDegree
    updateBar(bar)
  }

  const updateScale = (newScale: Scale | undefined) => {
    if (!currentBeat) return
    currentBeat.scale = newScale
    updateBar(bar)
  }

  const isSelectedBar = bar.id === currentBar?.id

  return (
    <div className={'grid place-items-center gap-4'}>
      <div className={'grid gap-4 border-2 border-primary-100 p-8'}>
        <div className={'flex gap-4'}>
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
              setCurrentBar(bars.indexOf(bar))
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
                <button onClick={() => removeBeat(index)}>Delete</button>
              </button>
            )
          })}
        </div>

        {isSelectedBar && (
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
                      onClick={() => updateScaleDegree(scaleDegree)}
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
                  availableScales.find(scale => scale.name === e.target.value)
                )
              }
            >
              {[undefined, ...availableScales].map(scale => (
                <option value={scale?.name}>{scale?.name}</option>
              ))}
            </select>
          </>
        )}
      </div>
      <button onClick={removeBar}>Delete</button>
    </div>
  )
}
