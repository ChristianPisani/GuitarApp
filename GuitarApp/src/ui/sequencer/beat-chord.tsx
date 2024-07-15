﻿import React, {
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
import { Chord } from '../../types/musical-terms'
import {
  getChordName,
  ScaleDegree,
  scaleDegreeNotations,
} from '../../data/chords'
import { Beat, Bar, MusicContext } from '../../context/app-context'
import { ScalePicker } from '../scale-picker/scale-picker'
import { Button } from '../button/button'
import { getScaleChord } from '../../utility/noteFunctions'

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
    setBeats,
    selectedNote,
    selectedMode,
    selectedScale,
    updateBeat,
  } = useContext(MusicContext)

  const removeBar = (barIndex: number) => {
    beat.bars.splice(barIndex, 1)
    updateBeat(beat)
  }

  const removeBeat = () => {
    const beatIndex = beats.indexOf(beat)

    beats.splice(beatIndex, 1)
    setBeats([...beats])
  }

  return (
    <div className={'grid place-items-center gap-4'}>
      <div className={'flex gap-4 border-2 border-primary-100 p-8'}>
        {beat.bars.map((bar, index) => {
          const chord = getScaleChord(
            selectedNote,
            bar?.scale ?? selectedScale,
            selectedMode,
            bar.scaleDegree,
            bar.chordExtensionScaleDegrees
          )

          return (
            <div className={'p-4 grid flex-1 place-items-center gap-2'}>
              <p className={'text-2xl font-bold'}>
                {scaleDegreeNotations(bar.scaleDegree)}
              </p>
              <p className={'text-xl whitespace-nowrap'}>
                {getChordName(chord, false)}
              </p>
              <button onClick={() => removeBar(index)}>Delete</button>
            </div>
          )
        })}
      </div>
      <button onClick={removeBeat}>Delete</button>
    </div>
  )
}

export const BeatChord = (props: BeatChordProps) => {
  const { selected, beat, beatBarId } = props
  const [mode, setMode] = useState<'chord' | 'bars'>('chord')

  const ref = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)
  const { showLines, onDelete, chord } = props

  const maxBars = 8
  const beatsArray = Array(maxBars).fill(1)

  const {
    beats,
    currentBeat,
    currentSubdivision,
    updateBeat,
    state,
    setBeats,
    setSelectedBarIndex,
  } = useContext(MusicContext)

  const removeBar = (beat: Beat) => {
    if (beat.bars.length <= 1) return

    beat.bars.splice(-1, 1)
    updateBeat(beat)
  }

  const addBar = (beat: Beat) => {
    if (beat.bars.length >= maxBars) return

    beat.bars.push()
    updateBeat(beat)
  }

  const removeChord = (id: number, divRef?: HTMLDivElement) => {
    const copy = [...beat.bars]
    const index = copy.findIndex(bar => bar.id === id)
    copy.splice(index, 1)
    setRemoved(true)
    setSelectedBarIndex(undefined)

    if (copy.length > 0) {
      //setSelectedBarIndex(copy.length - 1)
    }

    // Want to animate out, so just wait until that is completed before actually deleting the element
    divRef?.addEventListener('animationend', () => {
      beat.bars = copy
      updateBeat(beat)

      if (copy.length > 0) {
        //setSelectedBarIndex(copy.length - 1)
      } else {
        //setSelectedBarIndex(undefined)
      }

      return undefined
    })
  }

  const onRemove = () => {
    setRemoved(true)

    removeChord?.(beatBarId, ref.current ?? undefined)
  }

  const updateScaleDegree = (newScaleDegree: ScaleDegree) => {
    beat.bars[beatBarId].scaleDegree = newScaleDegree
    updateBeat(beat)
  }

  useEffect(() => {
    if (selected) {
      const targetElement = ref.current

      // targetElement?.scrollIntoView({
      //   behavior: 'smooth',
      //   block: 'center',
      //   inline: 'center',
      // })
    }
  }, [selected])

  return (
    <div
      className={`flex place-items-center gap-8 ${
        removed ? 'animation-fade-out' : 'animation-fade-in'
      }`}
      ref={ref}
    >
      <div
        className={`grid place-items-center relative transition-all ${
          beat.bars.length === 2 ? 'only-two' : ''
        } ${beat.bars.length === 1 ? 'only-one' : ''}`}
        style={
          {
            '--total': Math.max(beat.bars.length - 1, 1),
          } as CSSProperties
        }
      >
        <div className={'grid place-items-center relative transition-all'}>
          {mode === 'bars' && (
            <>
              {beatsArray.map((_, index) => (
                <div
                  key={beat.id + 'button' + index}
                  className={`beat-chord-circle text-primary-100 grid place-items-center w-8 h-8
                  shadow-accent-2 absolute border-2 border-primary-200 rounded-full ${
                    selected ? '' : 'out'
                  } ${index < beat.bars.length ? '' : 'inactive'}`}
                  style={{ '--index': index } as CSSProperties}
                >
                  {index + 1}
                </div>
              ))}
              <button
                onClick={() => removeBar(beat)}
                className={`remove-button beat-chord-circle w-12 h-12 absolute border-2 text-primary-100
                border-primary-100 rounded-full ${selected ? '' : 'out'} hover:bg-primary-100
                hover:text-primary-900`}
              >
                -
              </button>
              <button
                onClick={() => addBar(beat)}
                className={`add-button beat-chord-circle w-12 h-12 absolute border-2 text-primary-50
                border-primary-100 rounded-full ${selected ? '' : 'out'} transition-all
                hover:bg-primary-100 hover:text-primary-900`}
              >
                +
              </button>
            </>
          )}
          {mode === 'chord' && (
            <>
              {Array(7)
                .fill(1)
                .map((_, index) => (
                  <button
                    key={beat.id + 'degreebutton' + index}
                    onClick={() =>
                      updateScaleDegree((index + 1) as ScaleDegree)
                    }
                    className={`beat-chord-circle text-primary-100 grid place-items-center w-8 h-8
                    shadow-accent-2 absolute border-2 border-primary-200 rounded-full ${
                      selected ? '' : 'out'
                    } ${beat.bars[beatBarId].scaleDegree === index + 1 ? 'glow' : ''}`}
                    style={{ '--index': index, '--total': 6 } as CSSProperties}
                  >
                    {scaleDegreeNotations((index + 1) as ScaleDegree)}
                  </button>
                ))}
            </>
          )}
          {mode === 'bars' && <></>}

          <button
            onClick={e => {
              props.onClick()
            }}
            className={`${selected ? 'glow' : ''} flex aspect-square w-40 select-none flex-col
            justify-center items-center rounded-full border-4 border-primary-100 p-6
            text-primary-100 transition-all hover:text-primary-50 shadow-accent-2`}
          >
            <p className={'text-2xl font-bold'}>
              {scaleDegreeNotations(beat.bars[beatBarId].scaleDegree)}
            </p>
            <p className={'text-xl'}>{getChordName(chord, false)}</p>
          </button>
        </div>

        <div className={'absolute top-full mt-4 grid gap-4'}>
          {state === 'editing' && selected && (
            <ScalePicker
              bgColor={'bg-primary-100 text-fuchsia-950 border-fuchsia-200'}
              onChange={scale => {
                beat.bars[beatBarId].scale = scale
                updateBeat(beat)
              }}
              selectedScale={beat.bars[beatBarId].scale}
              defaultValue={'Change scale'}
            />
          )}

          {(state === 'playing' || !selected) && beat.bars[beatBarId].scale && (
            <p>{beat.bars[beatBarId]?.scale?.name}</p>
          )}

          {state === 'editing' && selected && (
            <>
              <button
                className={'mt-2'}
                onClick={() => setMode(mode === 'chord' ? 'bars' : 'chord')}
              >
                {mode === 'chord' ? 'Adjust bars' : 'Adjust chord'}
              </button>
              {onDelete && <button onClick={onRemove}>Remove</button>}
            </>
          )}
        </div>
      </div>
      {showLines && (
        <div
          className={
            'glow h-0 w-16 border-t-8 border-dotted border-primary-100 text-primary-100'
          }
        ></div>
      )}
    </div>
  )
}
