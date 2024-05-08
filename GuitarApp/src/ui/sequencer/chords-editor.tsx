import { BeatChord } from './beat-chord'
import { useState } from 'react'
import { Chord } from '../../types/musical-terms'
import { getNote, getScaleChord } from '../../utility/noteFunctions'
import { majorScale } from '../../data/scales'

type EditorChord = Chord & {
  id: number
}

export const ChordsEditor = () => {
  const [chords, setChords] = useState<EditorChord[]>([])
  const [currentId, setCurrentId] = useState(1)

  const addChord = () => {
    setCurrentId(currentId+1)
    
    setChords([
      ...chords,
          {...getScaleChord(
        getNote('A', false),
        majorScale,
        Math.round(Math.random() * 7),
        4
      ), id: currentId},
    ])
  }

  const removeChord = (index: number) => {
    const copy = [...chords]
    copy.splice(index, 1)
    setChords(copy)
  }

  return (
    <div className={'w-auto overflow-hidden h-full'}>
      <div
        className={
          'sequencer-chords p-16 gap-8 h-full text-primary-50 relative transition-all'
        }
      >
        {chords.length === 0 && (
          <div className={'absolute left-16'}>
            <p className={'font-extrabold text-8xl'}>No chords added.</p>
            <button
              onClick={addChord}
              className={'border-2 rounded-full px-8 py-4'}
            >
              Add you first chord
            </button>
          </div>
        )}
        {chords.map((chord, index) => {
          return (
            <BeatChord 
              key={chord.id}
              showLines={index !== chords.length}
              onDelete={() => removeChord(index)}
              chord={chord}
              scaleDegree={2}
            />
          )
        })}
        {chords.length > 0 && (
          <button
            onClick={addChord}
            className={
              'text-3xl border-primary-100 border-2 p-4 rounded-full aspect-square h-16'
            }
          >
            +
          </button>
        )}
      </div>
    </div>
  )
}
