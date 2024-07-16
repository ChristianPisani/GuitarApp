import { BarComponent } from './beat-chord'
import React, { useContext, useEffect } from 'react'
import { ScaleDegree } from '../../data/chords'
import { ScrollContainer } from 'react-indiana-drag-scroll'
import { Beat, MusicContext } from '../../context/app-context'
import { getDefaultSubdivision } from '../../utility/sequencer-utilities'

var BAR_ID = 0
var BEAT_ID = 100000

export const ChordsEditor = () => {
  const { bars, setBars, currentBarIndex, state } = useContext(MusicContext)
  const addChord = () => {
    const degree: ScaleDegree = 1

    const defaultBeat = () => ({
      scaleDegree: degree,
      chordExtensionScaleDegrees: [1, 2, 3] as ScaleDegree[],
      subdivisions: [getDefaultSubdivision()],
      id: BAR_ID++,
    })

    const beats: Beat[] = [
      defaultBeat(),
      defaultBeat(),
      defaultBeat(),
      defaultBeat(),
    ]

    const newBar = {
      id: BEAT_ID++,
      beats,
    }

    setBars([...bars, newBar])
  }

  return (
    <div className={'w-auto overflow-hidden h-full min-h-96'}>
      <ScrollContainer
        hideScrollbars={true}
        className={
          'sequencer-chords p-16 gap-8 h-full text-primary-50 relative transition-all'
        }
      >
        {bars.length === 0 && (
          <div className={'absolute left-16'}>
            <h2 className={'font-extrabold text-8xl'}>No chords added.</h2>
            <button
              onClick={addChord}
              className={`border-2 rounded-2xl px-8 py-2 hover:text-secondary-950 hover:bg-primary-100
                mt-2 transition`}
            >
              Add your first chord
            </button>
          </div>
        )}
        {bars.map(bar => {
          return <BarComponent key={bar.id} bar={bar} />
        })}
        {bars.length > 0 && (
          <button
            onClick={addChord}
            className={
              'text-3xl border-primary-100 border-2 p-4 rounded-full aspect-square h-16'
            }
          >
            +
          </button>
        )}
      </ScrollContainer>
    </div>
  )
}
