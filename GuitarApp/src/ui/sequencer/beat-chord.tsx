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
import { Beat, Bar, MusicContext } from '../../context/app-context'
import { ScalePicker } from '../scale-picker/scale-picker'
import { Button } from '../button/button'
import { getScaleChord } from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'

type BeatChordProps = {
  showLines: boolean
  beat: Beat
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
  beat: Beat
}

export const BeatBar: FC<BeatBarProps> = ({ beat }) => {
  const {
    beats,
    currentBeatIndex,
    setCurrentBeat,
    setBeats,
    selectedNote,
    selectedMode,
    selectedScale,
    currentBarIndex,
    setCurrentBarIndex,
    updateBeat,
  } = useContext(MusicContext)

  const currentBeat = beats[currentBeatIndex]
  const currentBar = currentBeat?.bars[currentBarIndex ?? 0]

  const removeBar = (barIndex: number) => {
    beat.bars.splice(barIndex, 1)
    if (beat.bars.length === 0) removeBeat()
    updateBeat(beat)
  }

  const removeBeat = () => {
    const beatIndex = beats.indexOf(beat)

    beats.splice(beatIndex, 1)
    setBeats([...beats])
  }

  const updateScaleDegree = (newScaleDegree: ScaleDegree) => {
    if (!currentBar) return
    currentBar.scaleDegree = newScaleDegree
    updateBeat(beat)
  }

  const updateScale = (newScale: Scale | undefined) => {
    if (!currentBar) return
    currentBar.scale = newScale
    updateBeat(beat)
  }

  const isSelectedBeat = beat.id === currentBeat?.id

  return (
    <div className={'grid place-items-center gap-4'}>
      <div className={'grid gap-4 border-2 border-primary-100 p-8'}>
        <div className={'flex gap-4'}>
          {beat.bars.map((bar, index) => {
            const chord = getScaleChord(
              selectedNote,
              bar?.scale ?? selectedScale,
              selectedMode,
              bar.scaleDegree,
              bar.chordExtensionScaleDegrees
            )
            const isSelectedBar = currentBarIndex === index && isSelectedBeat

            const selectBar = () => {
              setCurrentBarIndex(index)
              setCurrentBeat(beats.indexOf(beat))
            }

            return (
              <button
                onClick={() => selectBar()}
                className={'p-4 grid flex-1 place-items-center gap-2'}
              >
                <div className={`${isSelectedBar ? 'glow' : ''}`}>
                  <p className={'text-3xl font-bold'}>
                    {scaleDegreeNotations(bar.scaleDegree)}
                  </p>
                  <p className={'text-xl whitespace-nowrap'}>
                    {getChordName(chord, false)}
                  </p>
                  <p>{bar.scale?.name}</p>
                </div>
                <button onClick={() => removeBar(index)}>Delete</button>
              </button>
            )
          })}
        </div>

        {isSelectedBeat && (
          <>
            <div className={'flex gap-2 w-full justify-around'}>
              {Array(7)
                .fill(1)
                .map((_, scaleDegreeIndex) => {
                  const scaleDegree = (scaleDegreeIndex + 1) as ScaleDegree
                  const isSelectedScaleDegree =
                    scaleDegree ===
                    currentBeat?.bars[currentBarIndex ?? 0]?.scaleDegree

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
              value={currentBar?.scale?.name}
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
      <button onClick={removeBeat}>Delete</button>
    </div>
  )
}
