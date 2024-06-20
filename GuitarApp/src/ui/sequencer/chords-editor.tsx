import { BeatChord } from './beat-chord'
import React, { useContext, useEffect } from 'react'
import { getScaleChord } from '../../utility/noteFunctions'
import { ScaleDegree } from '../../data/chords'
import { ScrollContainer } from 'react-indiana-drag-scroll'
import { Beat, MusicContext } from '../../context/app-context'
import { getDefaultSubdivision } from '../../utility/sequencer-utilities'

export const ChordsEditor = () => {
  const {
    beats,
    selectedBeat,
    setBeats,
    setSelectedBeat,
    selectedMode,
    currentBeat,
    state,
    selectedScale,
    selectedNote,
  } = useContext(MusicContext)
  const addChord = () => {
    const degree = (Math.round(Math.random() * 6) + 1) as ScaleDegree

    const newBeat = {
      scaleDegree: degree,
      scaleDegrees: [1, 2, 3] as ScaleDegree[],
      subdivisions: [
        getDefaultSubdivision(),
        getDefaultSubdivision(),
        getDefaultSubdivision(),
        getDefaultSubdivision(),
      ],
      id: beats.length > 0 ? beats[beats.length - 1].id + 1 : 1,
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
      } else {
        setSelectedBeat(undefined)
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
                selectedMode,
                beat.scaleDegree,
                beat.scaleDegrees
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
