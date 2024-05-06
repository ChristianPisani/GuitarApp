import {
  ButtonHTMLAttributes,
  CSSProperties,
  DetailedHTMLProps,
  useState,
} from 'react'
import './beat-chord.scss'

type BeatChordProps = {
  showLines: boolean
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

export const BeatChord = (props: BeatChordProps) => {
  const { showLines } = props

  const [amountOfBeats, setAmountOfBeats] = useState(4)
  const [selected, setSelected] = useState(false)
  const [selectedBeat, setSelectedBeat] = useState(0)

  const beatsArray = []
  const maxBeats = 8
  for (let i = 0; i < maxBeats; i++) {
    beatsArray.push(i)
  }

  const removeBeat = () => {
    setAmountOfBeats(Math.max(1, amountOfBeats - 1))
    if (selectedBeat >= amountOfBeats - 1) setSelectedBeat(amountOfBeats - 2)
  }

  const addBeat = () => {
    setAmountOfBeats(Math.min(maxBeats, amountOfBeats + 1))
  }

  return (
    <div className={'flex place-items-center gap-8'}>
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
            ;(e.target as HTMLElement).scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
            })
            setSelected(!selected)
          }}
          className={`${selected ? 'glow' : ''} flex aspect-square w-40 select-none flex-col
          justify-center items-center rounded-full border-4 border-primary-100 p-6
          text-primary-100 transition-all hover:text-primary-50 shadow-accent-2`}
        >
          <p className={'text-xl'}>I</p>
          <p className={'text-2xl font-bold'}>A MAJOR</p>
        </button>
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
