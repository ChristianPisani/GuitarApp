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
  const [currentBeat, setCurrentBeat] = useState(0)
  const [currentBar, setCurrentBar] = useState(0)
  const [currentSubdivision, setCurrentSubdivision] = useState(0)
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
          setCurrentBeat(beatIndex)
          setCurrentBar(barIndex)
          setCurrentSubdivision(subdivisionIndex)
        }, time)

        props.onTime(beat, beatIndex, subdivision, subdivisionIndex)
      },
      events: props.bars.map((bar, beatIndex) => {
        return [
          ...bar.beats.map((beat, barIndex) =>
            beat.subdivisions
              .slice(0, bar.timeSignature)
              .map((subdivision, subdivisionIndex) => ({
                beat: bar,
                beatIndex,
                barIndex,
                subdivision,
                subdivisionIndex,
              }))
          ),
        ]
      }),
      subdivision: '1n',
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
    currentBeat,
    setCurrentBeat,
    currentSubdivision,
    currentBar,
    setCurrentBar,
    setCurrentSubdivision,
  }
}
