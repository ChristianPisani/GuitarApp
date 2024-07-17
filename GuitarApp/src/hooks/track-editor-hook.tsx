import { ScaleDegree } from '../data/chords'
import { Scale } from '../types/musical-terms'
import { useContext } from 'react'
import { Bar, MusicContext } from '../context/app-context'

export const useTrackEditor = () => {
  const { bars, currentBarIndex, setBars, currentBeatIndex, updateBar } =
    useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex ?? 0]

  const removeBeat = (bar: Bar, beatIndex: number) => {
    bar.beats.splice(beatIndex, 1)
    if (bar.beats.length === 0) removeBar(bar)
    updateBar(bar)
  }

  const removeBar = (bar: Bar) => {
    const barIndex = bars.indexOf(bar)

    bars.splice(barIndex, 1)
    setBars([...bars])
  }

  const updateScaleDegree = (bar: Bar, newScaleDegree: ScaleDegree) => {
    if (!currentBeat) return
    currentBeat.scaleDegree = newScaleDegree
    updateBar(bar)
  }

  const updateScale = (bar: Bar, newScale: Scale | undefined) => {
    if (!currentBeat) return
    currentBeat.scale = newScale
    updateBar(bar)
  }

  const changeTimeSignature = (bar: Bar, timeSignature: number) => {
    if (!currentBeat) return

    bar.timeSignature = timeSignature
    updateBar(bar)
  }

  return {
    removeBeat,
    removeBar,
    updateScaleDegree,
    updateScale,
    changeTimeSignature,
  }
}
