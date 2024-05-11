import {
  ButtonHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
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
import { Beat, MusicContext } from '../../context/app-context'

type BeatChordProps = {
  showLines: boolean
  beat: Beat
  onDelete?: (ref?: HTMLDivElement) => void
  chord: Chord
  selected: boolean
  onClick: () => void
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const BeatChord = (props: BeatChordProps) => {
  const { selected, beat } = props

  const ref = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)
  const { showLines, onDelete, chord } = props

  const [selectedBeatIndex, setSelectedBeatIndex] = useState(0)

  const maxBeats = 8
  const beatsArray = Array(maxBeats).fill(1)

  const { beats, currentBeat, currentSubdivision, state, setBeats } =
    useContext(MusicContext)

  const removeBeat = () => {
    const currentAmountOfSubdivisions = beat.subdivisions.length

    if (currentAmountOfSubdivisions <= 1) return

    if (selectedBeatIndex >= currentAmountOfSubdivisions - 1) {
      setSelectedBeatIndex(currentAmountOfSubdivisions - 2)
    }

    const beatIndex = beats.findIndex(b => b.id === beat.id)
    beats[beatIndex].subdivisions.splice(-1, 1)
    setBeats([...beats])
  }

  const addBeat = () => {
    if (amountOfSubdivisions >= maxBeats) return

    const beatIndex = beats.findIndex(b => b.id === beat.id)
    beats[beatIndex].subdivisions.push({ notes: [] })
    setBeats([...beats])
  }

  const onRemove = () => {
    setRemoved(true)

    onDelete?.(ref.current ?? undefined)
  }

  useEffect(() => {
    if (selected) {
      const targetElement = ref.current
      targetElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      })
    }
  }, [selected])

  useEffect(() => {
    setSelectedBeatIndex(currentSubdivision)
  }, [currentSubdivision])

  const amountOfSubdivisions = beat?.subdivisions?.length ?? 0

  return (
    <div
      className={`flex place-items-center gap-8 ${
        removed ? 'animation-fade-out' : 'animation-fade-in'
      }`}
      ref={ref}
    >
      <div
        className={`grid place-items-center relative transition-all ${
          amountOfSubdivisions === 2 ? 'only-two' : ''
        } ${amountOfSubdivisions === 1 ? 'only-one' : ''}`}
        style={
          {
            '--total': Math.max(amountOfSubdivisions - 1, 1),
          } as CSSProperties
        }
      >
        {beatsArray.map((beat, index) => (
          <button
            key={beat.id + 'button' + index}
            onClick={() => setSelectedBeatIndex(index)}
            className={`beat-chord-circle text-primary-100 grid place-items-center w-8 h-8
            shadow-accent-2 absolute border-2 border-primary-200 rounded-full ${
              selected ? '' : 'out'
            } ${index <= amountOfSubdivisions - 1 ? '' : 'inactive'} ${
              selectedBeatIndex === index ? 'glow' : ''
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
          <p className={'text-xl'}>{scaleDegreeNotations(beat.scaleDegree)}</p>
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
