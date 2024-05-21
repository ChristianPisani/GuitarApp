import { BeatChord } from './beat-chord'
import React, { Ref, useContext, useEffect, useState } from 'react'
import { getNote, getScaleChord } from '../../utility/noteFunctions'
import { majorScale } from '../../data/scales'
import { ScaleDegree } from '../../data/chords'
import { ScrollContainer, useScrollContainer } from 'react-indiana-drag-scroll'
import { Beat, MusicContext } from '../../context/app-context'

export const ChordsEditor = () => {
  const {
    beats,
    selectedBeat,
    setBeats,
    setSelectedBeat,
    currentBeat,
    currentSubdivision,
    state,
    selectedScale,
    selectedNote,
  } = useContext(MusicContext)
  const [currentId, setCurrentId] = useState(1)

  const addChord = () => {
    setCurrentId(currentId + 1)

    const degree = (Math.round(Math.random() * 6) + 1) as ScaleDegree

    console.log({ degree })

    // TODO: Not quite sure how to index these. The notes should change when user changes scale,
    // so it needs to use indexes, but not sure how to do this correctly with major/minor/etc chords
    const newBeat = {
      scaleDegree: degree,
      subdivisions: [{ notes: [] }],
      id: currentId,
      bars: 4,
    }

    setBeats([...beats, newBeat])
    setSelectedBeat(newBeat)
  }

  const removeChord = (index: number, divRef?: HTMLDivElement) => {
    const copy = [...beats]
    copy.splice(index, 1)

    if (copy.length > 0) {
      setSelectedBeat(copy[copy.length - 1])
    }

    // Want to animate out, so just wait until that is completed before actually deleting the element
    divRef?.addEventListener('animationend', () => {
      setBeats(copy)

      if (copy.length > 0) {
        setSelectedBeat(copy[copy.length - 1])
      }

      return undefined
    })
  }

  const onBeatChordClick = (beat: Beat) => {
    if (state !== 'editing') return

    const selected = beat.id === selectedBeat?.id

    if (selected) setSelectedBeat(undefined)
    else setSelectedBeat(beat)
  }

  useEffect(() => {
    if (state !== 'playing') return

    setSelectedBeat(beats[currentBeat])
  }, [currentBeat])

  return (
    <div className={'w-auto overflow-hidden h-full'}>
      <ScrollContainer
        hideScrollbars={true}
        className={
          'sequencer-chords p-16 gap-8 h-full text-primary-50 relative transition-all'
        }
      >
        {beats.length === 0 && (
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
        {beats.map((beat, index) => {
          return (
            <BeatChord
              key={beat.id}
              showLines={index !== beats.length}
              onDelete={ref => removeChord(index, ref)}
              chord={getScaleChord(
                selectedNote,
                selectedScale,
                beat.scaleDegree,
                3
              )}
              beat={beat}
              selected={selectedBeat?.id === beat.id}
              onClick={() => onBeatChordClick(beat)}
            />
          )
        })}
        {beats.length > 0 && (
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
