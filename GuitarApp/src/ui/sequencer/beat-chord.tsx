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
import {
  AddCircleOutlined,
  AddOutlined,
  RemoveCircleOutline,
} from '@mui/icons-material'
import { Select } from '../input/inputs'

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
    currentSectionIndex,
    state,
  } = useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex ?? 0]
  const {
    addBeat,
    removeBeat,
    removeBar,
    shortenSection,
    lengthenSection,
    updateScale,
    updateScaleDegree,
    changeTimeSignature,
  } = useTrackEditor()

  const isSelectedBar = bar.id === currentBar?.id

  return (
    <div className={'grid place-items-center gap-4 select-none'}>
      <div className={'grid gap-4 border-2 border-primary-100'}>
        <div className={'flex gap-16 items-end'}>
          <h2>
            {bar.beats.reduce(
              (sum, beat) => (beat?.sections?.length ?? 0) + sum,
              0
            )}
            /{bar.timeSignature}
          </h2>
          {state === 'editing' && (
            <Select
              options={[
                { key: '4', value: '4' },
                { key: '8', value: '8' },
                { key: '16', value: '16' },
                { key: '32', value: '32' },
              ]}
              value={bar.timeSignature}
              onChange={e => changeTimeSignature(bar, Number(e.target.value))}
              label={'Change beat division'}
              id={'change_time_signature' + bar.id}
            />
          )}
        </div>
        <div className={'flex items-center'}>
          {bar.beats.map((beat, beatIndex) => {
            const chord = getScaleChord(
              selectedNote,
              beat?.scale ?? selectedScale,
              selectedMode,
              beat.scaleDegree,
              beat.chordExtensionScaleDegrees
            )
            const isSelectedBeat =
              currentBeatIndex === beatIndex && isSelectedBar

            const selectBar = () => {
              if (state !== 'editing') {
                return
              }

              setCurrentBeatIndex(beatIndex)
              setCurrentBarIndex(bars.indexOf(bar))
            }

            return (
              <div className={'flex flex-col gap-4 h-full'}>
                <button
                  onClick={() => selectBar()}
                  className={`p-4 flex flex-col place-items-center gap-2 border-2 border-secondary-900
                  transition h-full justify-center ${
                    isSelectedBeat
                      ? 'bg-secondary-900 text-primary-50'
                      : 'bg-primary-50'
                  }`}
                  style={{ width: 8 * beat.sections.length + 'rem' }}
                >
                  <p className={'text-3xl font-bold'}>
                    {scaleDegreeNotations(beat.scaleDegree)}
                  </p>
                  <p className={'text-xl whitespace-nowrap'}>
                    {getChordName(chord, false)}
                  </p>
                  <p>{beat.scale?.name}</p>

                  {state === 'editing' && (
                    <>
                      <div
                        className={
                          'flex gap-4 justify-center place-items-center'
                        }
                      >
                        <RemoveCircleOutline
                          onClick={() => shortenSection(bar.id, beatIndex)}
                        />
                        <p>{beat.sections.length}</p>
                        <AddCircleOutlined
                          onClick={() => lengthenSection(bar.id, beatIndex)}
                        />
                      </div>
                      <button onClick={() => removeBeat(bar, beatIndex)}>
                        Delete
                      </button>

                      <div className={'flex gap-2 w-full justify-around'}>
                        {Array(7)
                          .fill(1)
                          .map((_, scaleDegreeIndex) => {
                            const scaleDegree = (scaleDegreeIndex +
                              1) as ScaleDegree
                            const isSelectedScaleDegree =
                              scaleDegree ===
                              bar?.beats[beatIndex ?? 0]?.scaleDegree

                            return (
                              <button
                                onClick={() =>
                                  updateScaleDegree(bar, beatIndex, scaleDegree)
                                }
                                className={isSelectedScaleDegree ? 'glow' : ''}
                              >
                                {scaleDegreeNotations(scaleDegree)}
                              </button>
                            )
                          })}
                      </div>
                    </>
                  )}
                </button>

                {state === 'editing' && (
                  <Select
                    value={beat?.scale?.name}
                    onChange={e =>
                      updateScale(
                        bar,
                        beatIndex,
                        availableScales.find(
                          scale => scale.name === e.target.value
                        )
                      )
                    }
                    label={'Change scale'}
                    options={[undefined, ...availableScales].map(scale => ({
                      key: scale?.name ?? '',
                      value: scale?.name ?? '',
                    }))}
                    id={'change_scale' + bar.id}
                  />
                )}
              </div>
            )
          })}
          {bars.length > 0 && state === 'editing' && (
            <button
              onClick={() => addBeat(bar)}
              className={
                'text-3xl border-primary-100 border-2 p-4 rounded-full aspect-square h-16'
              }
            >
              <AddCircleOutlined fontSize={'large'} />
            </button>
          )}
        </div>
      </div>
      {state === 'editing' && (
        <button onClick={() => removeBar(bar)}>Delete</button>
      )}
    </div>
  )
}
