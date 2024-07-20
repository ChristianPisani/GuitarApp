import { useEffect, useState } from 'react'
import { Note, Scale } from '../types/musical-terms'
import * as Tone from 'tone'
import { getTransport, Sampler, Synth } from 'tone'
import { Bar, Subdivision } from '../context/app-context'

type SequencerHookProps = {
  onTime: (
    bar: Bar,
    barIndex: number,
    subdivision: Subdivision,
    subdivisionIndex: number
  ) => void
  instrument: Sampler | Synth
  bars: Bar[]
  selectedNote: Note
  selectedScale: Scale
  bpm: number
}

export const useSequencer = (props: SequencerHookProps) => {
  const [currentBarIndex, setCurrentBarIndex] = useState(0)
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0)
  const [currentSubdivisionIndex, setCurrentSubdivisionIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const startBeat = async () => {
    setIsPlaying(true)

    await Tone.start()
    getTransport().start()
  }

  const stopBeat = () => {
    setIsPlaying(false)
    getTransport().stop()
  }

  useEffect(() => {
    if (!isPlaying || props.bars.length === 0) {
      return
    }

    // Create a new sequence from the beats
    const sequence = new Tone.Sequence({
      callback: function (
        time,
        { beat, beatIndex, barIndex, subdivision, subdivisionIndex }
      ) {
        Tone.getDraw().schedule(() => {
          setCurrentBarIndex(barIndex)
          setCurrentBeatIndex(beatIndex)
          setCurrentSubdivisionIndex(subdivisionIndex)
        }, time)

        props.onTime(beat, beatIndex, subdivision, subdivisionIndex)
      },
      events: props.bars.flatMap((bar, barIndex) => {
        return [
          ...bar.beats.map((beat, beatIndex) =>
            beat.subdivisions
              .slice(0, bar.timeSignature)
              .map((subdivision, subdivisionIndex) => ({
                beat: bar,
                barIndex: barIndex,
                beatIndex: beatIndex,
                subdivision,
                subdivisionIndex,
              }))
          ),
        ]
      }),
      subdivision: '4n',
    }).start()

    return () => {
      sequence.dispose()
    }
  }, [props.bars.length, isPlaying])

  useEffect(() => {
    getTransport().bpm.rampTo(props.bpm)
  }, [props.bpm])

  return {
    startBeat,
    stopBeat,
    currentBarIndex: currentBarIndex,
    setCurrentBarIndex: setCurrentBarIndex,
    currentSubdivisionIndex: currentSubdivisionIndex,
    currentBeatIndex: currentBeatIndex,
    setCurrentBeatIndex: setCurrentBeatIndex,
    setCurrentSubdivisionIndex: setCurrentSubdivisionIndex,
  }
}
