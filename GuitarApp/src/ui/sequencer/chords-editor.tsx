import { BarComponent } from './beat-chord'
import React, { useContext } from 'react'
import { ScrollContainer } from 'react-indiana-drag-scroll'
import { MusicContext } from '../../context/app-context'
import { useTrackEditor } from '../../hooks/track-editor-hook'

export const ChordsEditor = () => {
  const { bars, setBars, currentBarIndex, state } = useContext(MusicContext)
  const { addBar } = useTrackEditor()

  return (
    <div className={'w-auto overflow-hidden h-full min-h-96'}>
      <ScrollContainer
        hideScrollbars={true}
        className={`sequencer-chords p-16 ${state === 'editing' ? 'gap-8' : ''} h-full
        text-secondary-950 bg-primary-100 relative transition-all`}
      >
        {bars.length === 0 && (
          <div className={'absolute left-16'}>
            <h2 className={'font-extrabold text-8xl'}>No chords added.</h2>
            <button
              onClick={addBar}
              className={`border-2 border-secondary-950 text-secondary-950 rounded-2xl px-8 py-2 mt-2
                transition`}
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
            onClick={addBar}
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
