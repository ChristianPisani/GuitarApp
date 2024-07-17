import { BarComponent } from './beat-chord'
import React, { useContext, useEffect } from 'react'
import { ScaleDegree } from '../../data/chords'
import { ScrollContainer } from 'react-indiana-drag-scroll'
import { Beat, MusicContext } from '../../context/app-context'
import { createNewBar, defaultBeat } from '../../utility/sequencer-utilities'

export const ChordsEditor = () => {
  const { bars, setBars, currentBarIndex, state } = useContext(MusicContext)
  const addChord = () => {
    const beats: Beat[] = [
      defaultBeat(),
      defaultBeat(),
      defaultBeat(),
      defaultBeat(),
    ]

    const newBar = createNewBar(beats)

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
