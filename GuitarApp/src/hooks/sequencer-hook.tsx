import { FC, useEffect, useState } from 'react'
import { Chord, Note } from '../types/musical-terms'
import * as Tone from 'tone'
import { getTransport, Loop, Transport } from 'tone'
import { playChord, playNotes } from '../utility/instrumentFunctions'
import { acousticGuitar, synth } from '../utility/instruments'

type SequencerBeat = {
  chord: Chord | undefined
  notes?: Note[][]
}

type SequencerHookProps = {
  subdivisions: number
  onBeat: (beat: number) => void
}

export const useSequencer: ({
  onBeat,
  subdivisions,
}: {
  onBeat: any
  subdivisions: any
}) => {
  onBeat: (beat: number) => void
  startBeat: () => Promise<void>
  stopBeat: () => void
} = ({ onBeat, subdivisions }) => {
  const [amountOfBeats, setAmountOfBeats] = useState(1)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [beats, setBeats] = useState<SequencerBeat[]>([])
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
    if (isPlaying) {
      const beatChord = beats[Math.floor(currentBeat / subdivisions)].chord

      if (beatChord && currentBeat % subdivisions === 0) {
        setCurrentChord(beatChord)
        // playChord(acousticGuitar, beatChord, 0.05);
      }

      onBeat(currentBeat)
    }
  }, [currentBeat])

  useEffect(() => {
    const interval = `${subdivisions * 4}n`

    const newLoop = new Loop(time => {
      acousticGuitar.triggerAttackRelease(['A2'], interval, time)
      setCurrentBeat(c => (c + 1) % (amountOfBeats * subdivisions))
    }, interval).start(0)

    return () => {
      newLoop?.dispose()
    }
  }, [amountOfBeats, bpm, subdivisions])

  useEffect(() => {
    const beatsInit = []
    for (let i = 0; i < amountOfBeats; i++) {
      beatsInit.push({ chord: undefined })
    }
    setBeats(beatsInit)
  }, [amountOfBeats])

  useEffect(() => {
    Transport.bpm.rampTo(bpm)
  }, [bpm])

  return { onBeat, startBeat, stopBeat }
}
