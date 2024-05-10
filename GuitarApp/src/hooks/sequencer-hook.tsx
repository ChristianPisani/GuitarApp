import { useContext, useEffect, useState } from 'react'
import { Chord, Note, Scale } from '../types/musical-terms'
import * as Tone from 'tone'
import { Loop, Sampler, Synth, Transport } from 'tone'
import { Beat, MusicContext } from '../context/app-context'
import { getScaleChord } from '../utility/noteFunctions'
import { playChord } from '../utility/instrumentFunctions'
import { acousticGuitar } from '../utility/instruments'

type SequencerHookProps = {
  onBeat: (beat: number) => void
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

  useEffect(() => {
    if (props.beats.length === 0) return

    if (currentSubdivision === 0) {
      setCurrentBeat(c => (c + 1) % props.beats.length)
    }
  }, [currentSubdivision])

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
      // instrument.triggerAttackRelease('A2', interval, time)

      const beatScaleDegree = props.beats[currentBeat].scaleDegree
      const beatChord = getScaleChord(
        props.selectedNote,
        props.selectedScale,
        beatScaleDegree,
        3
      )

      playChord(acousticGuitar, beatChord, 0.01, 0.1, true)

      setCurrentSubdivision(c => (c + 1) % amountOfSubdivisions)
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
