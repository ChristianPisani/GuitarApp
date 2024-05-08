import { BeatChord } from './beat-chord'
import { useState } from 'react'
import { Chord } from '../../types/musical-terms'
import { getNote, getScaleChord } from '../../utility/noteFunctions'
import { majorScale } from '../../data/scales'
import {ScaleDegree} from "../../data/chords";

type EditorChord = Chord & {
  id: number
}

export const ChordsEditor = () => {
  const [chordDegrees, setChordDegrees] = useState<{ degree: ScaleDegree, id: number }[]>([])
  const [currentId, setCurrentId] = useState(1)

  const addChord = () => {
    setCurrentId(currentId+1)
      
    const degree = Math.round(Math.random() * 7) as ScaleDegree
    setChordDegrees([...chordDegrees, {degree, id: currentId}]);
  }

  const removeChord = (index: number) => {
    const copy = [...chordDegrees]
    copy.splice(index, 1)
    setChordDegrees(copy)
  }

  return (
    <div className={'w-auto overflow-hidden h-full'}>
      <div
        className={
          'sequencer-chords p-16 gap-8 h-full text-primary-50 relative transition-all'
        }
      >
        {chordDegrees.length === 0 && (
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
        {chordDegrees.map((chordDegree, index) => {
          return (
            <BeatChord 
              key={chordDegree.id}
              showLines={index !== chordDegrees.length}
              onDelete={() => removeChord(index)}
              chord={getScaleChord(getNote("A", false), majorScale, chordDegree.degree, 3)}
              scaleDegree={chordDegree.degree}
            />
          )
        })}
        {chordDegrees.length > 0 && (
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
