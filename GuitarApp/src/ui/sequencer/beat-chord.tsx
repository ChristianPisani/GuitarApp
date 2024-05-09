﻿import {
  ButtonHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
  Ref,
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
import { useSequencer } from '../../hooks/sequencer-hook'

type BeatChordProps = {
  showLines: boolean
  onDelete?: (ref?: HTMLDivElement) => void
  chord: Chord
  scaleDegree: ScaleDegree
  selected: boolean
  onClick: () => void
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const BeatChord = (props: BeatChordProps) => {
  const { selected } = props

  const ref = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)
  const { showLines, onDelete, chord, scaleDegree } = props

  const [amountOfBeats, setAmountOfBeats] = useState(2)
  const [selectedBeat, setSelectedBeat] = useState(0)

  const maxBeats = 8
  const beatsArray = Array(maxBeats).fill(1)

  const removeBeat = () => {
    setAmountOfBeats(Math.max(1, amountOfBeats - 1))
    if (selectedBeat >= amountOfBeats - 1) setSelectedBeat(amountOfBeats - 2)
  }

  const addBeat = () => {
    setAmountOfBeats(Math.min(maxBeats, amountOfBeats + 1))
  }

  const onRemove = () => {
    setRemoved(true)

    onDelete?.(ref.current ?? undefined)
  }

  const onBeat = (currentBeat: number) => {
    setSelectedBeat(currentBeat)
  }

  const sequencer = useSequencer({
    subdivisions: amountOfBeats,
    onBeat,
  })

  useEffect(() => {}, [])

  useEffect(() => {
    if (selected) {
      sequencer?.startBeat()

      const targetElement = ref.current
      targetElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    } else {
      sequencer.stopBeat()
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
          amountOfBeats === 2 ? 'only-two' : ''
        } ${amountOfBeats === 1 ? 'only-one' : ''}`}
        style={{ '--total': Math.max(amountOfBeats - 1, 1) } as CSSProperties}
      >
        {beatsArray.map((beat, index) => (
          <button
            onClick={() => setSelectedBeat(index)}
            className={`beat-chord-circle text-primary-100 grid place-items-center w-8 h-8
            shadow-accent-2 absolute border-2 border-primary-200 rounded-full ${
              selected ? '' : 'out'
            } ${index <= amountOfBeats - 1 ? '' : 'inactive'} ${
              selectedBeat === index ? 'glow' : ''
            }`}
            style={{ '--index': index } as CSSProperties}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => removeBeat()}
          className={`remove-button beat-chord-circle w-12 h-12 absolute border-2 text-primary-100
          border-primary-100 rounded-full ${selected ? '' : 'out'} hover:bg-primary-100
          hover:text-primary-900`}
        >
          -
        </button>
        <button
          onClick={() => addBeat()}
          className={`add-button beat-chord-circle w-12 h-12 absolute border-2 text-primary-50
          border-primary-100 rounded-full ${selected ? '' : 'out'} transition-all
          hover:bg-primary-100 hover:text-primary-900`}
        >
          +
        </button>
        <button
          onClick={e => {
            props.onClick()
          }}
          className={`${selected ? 'glow' : ''} flex aspect-square w-40 select-none flex-col
          justify-center items-center rounded-full border-4 border-primary-100 p-6
          text-primary-100 transition-all hover:text-primary-50 shadow-accent-2`}
        >
          <p className={'text-xl'}>{scaleDegreeNotations(scaleDegree)}</p>
          <p className={'text-2xl font-bold'}>{getChordName(chord)}</p>
        </button>
        {selected && onDelete && (
          <button className={'absolute bottom-[-2.5rem]'} onClick={onRemove}>
            Remove
          </button>
        )}
      </div>
      {showLines && (
        <div
          className={
            'glow h-0 w-48 border-t-8 border-dotted border-primary-100 text-primary-100'
          }
        ></div>
      )}
    </div>
  )
}
