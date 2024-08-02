import { ScaleDegree } from '../../../data/chords'
import { useContext } from 'react'
import { MusicContext } from '../../../context/app-context'

export const IntervalEditor = () => {
  const {
    selectedScale,
    currentBeatIndex,
    currentBarIndex,
    bars,
    toggleInterval,
  } = useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar.beats[currentBeatIndex]

  return (
    <div className={'flex flex-col items-center gap-4'}>
      <h3>Intervals</h3>
      <div className={'flex gap-2'}>
        {selectedScale.intervals.map((_, index) => {
          // TOOD: Not sure if this will work with all scales. Should find a better way to handle intervals generally.
          const intervalIndex = index + 1

          const selected = currentBeat?.chordExtensionScaleDegrees?.some(
            interval => interval === intervalIndex
          )

          return (
            <button
              className={`border-2 border-gray-950 rounded text-md grid place-items-center w-10 transition
              h-10 ${selected ? 'shadow-accent transform scale-110 font-bold' : ''}`}
              onClick={() =>
                currentBar &&
                toggleInterval(
                  currentBar,
                  currentBeatIndex,
                  intervalIndex as ScaleDegree
                )
              }
            >
              {intervalIndex}
            </button>
          )
        })}
      </div>
    </div>
  )
}
