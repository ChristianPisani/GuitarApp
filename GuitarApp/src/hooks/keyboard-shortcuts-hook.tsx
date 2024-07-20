import { Key, useCallback, useContext, useEffect, useState } from 'react'
import { MusicContext, Subdivision } from '../context/app-context'
import { getDefaultSubdivision } from '../utility/sequencer-utilities'
import { useTrackEditor } from './track-editor-hook'

export const useKeyboardShortcuts = () => {
  const [copiedValue, setCopiedValue] = useState<Subdivision | undefined>()
  const [cutValue, setCutValue] = useState<
    | (Subdivision & {
        subdivisionIndex: number
        barIndex: number
        beatIndex: number
      })
    | undefined
  >()

  const {
    bars,
    currentBeatIndex,
    currentSubdivisionIndex,
    currentBarIndex,
    updateBar,
  } = useContext(MusicContext)

  const { gotoPreviousSubdivision, gotoNextSubdivision } = useTrackEditor()

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex]
  const currentSubdivision = currentBeat?.subdivisions[currentSubdivisionIndex]

  const clearSubdivision = (
    barIndex: number,
    beatIndex: number,
    subdivisionIndex: number
  ) => {
    const bar = bars[barIndex]

    bar.beats[beatIndex].subdivisions[subdivisionIndex] =
      getDefaultSubdivision()

    updateBar(bar)
  }

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        setCopiedValue({ ...currentSubdivision })
      }
      if (event.ctrlKey && event.key === 'x') {
        setCutValue({
          ...currentSubdivision,
          subdivisionIndex: currentSubdivisionIndex,
          barIndex: currentBarIndex,
          beatIndex: currentBeatIndex,
        })
      }
      if (event.ctrlKey && event.key === 'v' && copiedValue && !cutValue) {
        currentBeat.subdivisions[currentSubdivisionIndex] = { ...copiedValue }
        updateBar(currentBar)
      }
      if (event.ctrlKey && event.key === 'v' && cutValue) {
        currentBeat.subdivisions[currentSubdivisionIndex] = { ...cutValue }
        clearSubdivision(
          cutValue.barIndex,
          cutValue.beatIndex,
          cutValue.subdivisionIndex
        )
        setCutValue(undefined)
      }
      if (!event.ctrlKey && event.key === 'x') {
        clearSubdivision(
          currentBarIndex,
          currentBeatIndex,
          currentSubdivisionIndex
        )
      }
      if (event.key === 'q') {
        gotoPreviousSubdivision()
      }
      if (event.key === 'e') {
        gotoNextSubdivision()
      }
    },
    [currentSubdivision]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])
}
