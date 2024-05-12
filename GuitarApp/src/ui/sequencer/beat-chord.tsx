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
  const [mode, setMode] = useState<'chord' | 'beats'>('chord')

  const ref = useRef<HTMLDivElement>(null)
  const [removed, setRemoved] = useState(false)
  const { showLines, onDelete, chord } = props

  const [selectedBeatIndex, setSelectedBeatIndex] = useState(0)

  const maxBars = 8
  const beatsArray = Array(maxBars).fill(1)

  const {
    beats,
    currentBeat,
    currentSubdivision,
    updateBeat,
    state,
    setBeats,
  } = useContext(MusicContext)

  const removeBar = (beat: Beat) => {
    if (beat.bars <= 1) return

    if (selectedBeatIndex >= beat.bars - 1) {
      setSelectedBeatIndex(beats[currentBeat].bars - 2)
    }

    beat.bars -= 1
    updateBeat(beat)
  }

  const addBar = (beat: Beat) => {
    if (beat.bars >= maxBars) return

    beat.bars += 1
    updateBeat(beat)
  }

  const onRemove = () => {
    setRemoved(true)

    onDelete?.(ref.current ?? undefined)
  }

  const updateScaleDegree = (newScaleDegree: ScaleDegree) => {
    beat.scaleDegree = newScaleDegree
    updateBeat(beat)
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

  return (
    <div
      className={`flex place-items-center gap-8 ${
        removed ? 'animation-fade-out' : 'animation-fade-in'
      }`}
      ref={ref}
    >
      <div
        className={`grid place-items-center relative transition-all ${
          beat.bars === 2 ? 'only-two' : ''
        } ${beat.bars === 1 ? 'only-one' : ''}`}
        style={
          {
            '--total': Math.max(beat.bars - 1, 1),
          } as CSSProperties
        }
      >
        {mode === 'beats' && (
          <>
            {beatsArray.map((_, index) => (
              <button
                key={beat.id + 'button' + index}
                onClick={() => setSelectedBeatIndex(index)}
                className={`beat-chord-circle text-primary-100 grid place-items-center w-8 h-8
                shadow-accent-2 absolute border-2 border-primary-200 rounded-full ${
                  selected ? '' : 'out'
                } ${index < beat.bars ? '' : 'inactive'} ${
                  selectedBeatIndex === index ? 'glow' : ''
                }`}
                style={{ '--index': index } as CSSProperties}
              >
                {index + 1}
              </button>
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
                  onClick={() => updateScaleDegree((index + 1) as ScaleDegree)}
                  className={`beat-chord-circle text-primary-100 grid place-items-center w-8 h-8
                  shadow-accent-2 absolute border-2 border-primary-200 rounded-full ${
                    selected ? '' : 'out'
                  } ${beat.scaleDegree === index + 1 ? 'glow' : ''}`}
                  style={{ '--index': index, '--total': 6 } as CSSProperties}
                >
                  {scaleDegreeNotations((index + 1) as ScaleDegree)}
                </button>
              ))}
          </>
        )}
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
