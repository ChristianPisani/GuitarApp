import { useEffect, useState } from 'react'
import { Chord, Note, Scale } from '../types/musical-terms'
import * as Tone from 'tone'
import { Loop, Sampler, Synth, Transport } from 'tone'
import { Beat } from '../context/app-context'

type SequencerHookProps = {
  onBeat: (beat: Beat, subdivision: number) => void
  instrument: Sampler | Synth
  beats: Beat[]
  selectedNote: Note
  selectedScale: Scale
}

export const useSequencer = (props: SequencerHookProps) => {
  const [currentBeat, setCurrentBeat] = useState(0)
  const [currentSubdivision, setCurrentSubdivision] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(130)
  const [currentChord, setCurrentChord] = useState<Chord | undefined>(undefined)

  const [loop, setLoop] = useState<Loop>()

  const startBeat = async () => {
    setIsPlaying(true)

    await Tone.start()
    Tone.Transport.start()
  }

  const stopBeat = () => {
    setIsPlaying(false)
    Tone.Transport.stop()
    loop?.dispose()
    setLoop(undefined)
  }

  useEffect(() => {
    /* if (!isPlaying || props.beats.length === 0) {
      return
    }

    const beatScaleDegree =
      props.beats[Math.floor(currentBeat / amountOfSubdivisions)].scaleDegree
    const beatChord = getScaleChord(
      props.selectedNote,
      props.selectedScale,
      beatScaleDegree,
      3
    )

    if (beatChord && currentBeat % amountOfSubdivisions === 0) {
      setCurrentChord(beatChord)
      // playChord(acousticGuitar, beatChord, 0.05);
    }

    props.onBeat(currentBeat) */
  }, [currentBeat])

  const onPulse = (subdivision: number) => {
    if (props.beats.length === 0) return

    const shouldChangeBeat = subdivision === 0

    if (shouldChangeBeat) {
      setCurrentBeat(c => {
        const newBeat = (c + 1) % props.beats.length

        props.onBeat(props.beats[newBeat], subdivision)
        return (c + 1) % props.beats.length
      })
    } else {
      props.onBeat(props.beats[currentBeat], subdivision)
    }
  }

  useEffect(() => {
    if (!isPlaying || props.beats.length === 0) {
      return
    }

    const currentBeatBeat = props.beats[currentBeat] ?? []
    const subdivisions = currentBeatBeat?.subdivisions ?? []
    const amountOfSubdivisions = subdivisions?.length ?? 1

    const interval = `${amountOfSubdivisions}n`

    if (loop) {
      loop.dispose()
    }

    const newLoop = new Loop(time => {
      setCurrentSubdivision(c => {
        const newSubdivision = (c + 1) % amountOfSubdivisions

        onPulse(newSubdivision)
        return newSubdivision
      })
    }, interval).start(0)

    setLoop(newLoop)

    return () => {
      newLoop?.dispose()
    }
  }, [props.beats.length, bpm, isPlaying, currentBeat])

  useEffect(() => {
    Transport.bpm.rampTo(bpm)
  }, [bpm])

  return { startBeat, stopBeat, currentBeat, currentSubdivision }
}
