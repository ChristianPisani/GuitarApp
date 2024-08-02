import { useEffect, useState } from 'react'
import { Note, Scale } from '../types/musical-terms'
import * as Tone from 'tone'
import { getTransport, Loop, now, Sampler, Sequence, Synth, Time } from 'tone'
import { Bar, BeatSection, Subdivision } from '../context/app-context'
import { TimeSignature } from 'tone/build/esm/core/type/Units'
import { get } from 'react-indiana-drag-scroll/dist/utils'

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
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentSubdivisionIndex, setCurrentSubdivisionIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const startBeat = async () => {
    setIsPlaying(true)
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
    const sequences = props.bars.flatMap((bar, barIndex) => {
      return new Tone.Sequence({
        callback: function (
          time,
          {
            beat,
            beatIndex,
            barIndex,
            subdivision,
            subdivisionIndex,
            sectionIndex,
          }
        ) {
          Tone.getDraw().schedule(() => {
            setCurrentBarIndex(barIndex)
            setCurrentBeatIndex(beatIndex)
            setCurrentSectionIndex(sectionIndex)
            setCurrentSubdivisionIndex(subdivisionIndex)
          }, time)

          props.onTime(beat, beatIndex, subdivision, subdivisionIndex)
        },
        events: [
          ...bar.beats.flatMap((beat, beatIndex) =>
            beat.sections.map((section, sectionIndex) =>
              section.subdivisions.map((subdivision, subdivisionIndex) => ({
                beat: bar,
                barIndex: barIndex,
                beatIndex: beatIndex,
                subdivision,
                subdivisionIndex,
                section,
                sectionIndex,
              }))
            )
          ),
        ],
        subdivision: `${bar.timeSignature}n`,
        humanize: true,
      })
    })

    const getDuration = (sequence: Sequence) => {
      return (
        sequence.events.length * Tone.Time(sequence.subdivision).toSeconds()
      )
    }

    const totalDuration = sequences.reduce(
      (duration, seq) => duration + getDuration(seq),
      0
    )

    const transport = getTransport()
    transport.loopStart = 0
    transport.loopEnd = totalDuration

    let start = 0.1
    const loop = new Loop(time => {
      console.log(time)

      sequences.forEach((sequence, sequenceIndex) => {
        const duration = getDuration(sequence)
        sequence.start(start).stop(start + duration)

        start += duration
      })
    }, totalDuration).start()

    transport.start()

    return () => {
      sequences.forEach(sequence => sequence.dispose())
      loop.dispose()
    }
  }, [props.bars.length, isPlaying])

  useEffect(() => {
    getTransport().bpm.rampTo(props.bpm)
  }, [props.bpm])

  return {
    startBeat,
    stopBeat,
    currentBarIndex,
    setCurrentBarIndex,
    currentSubdivisionIndex,
    currentBeatIndex,
    setCurrentBeatIndex,
    setCurrentSubdivisionIndex,
    currentSectionIndex,
    setCurrentSectionIndex,
  }
}
