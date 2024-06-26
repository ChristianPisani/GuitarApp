﻿import { getChordNotes, noteToString } from './noteFunctions'
import { Chord, Note } from '../types/musical-terms'
import { Chorus, now, Reverb, Sampler, Synth, Tremolo, Vibrato } from 'tone'

export const playChord = (
  instrument: Sampler,
  chord: Chord,
  arpeggioDelay: number = 0.1,
  sustain: number = 1,
  descend: boolean = false
) => {
  const chordNotes = getChordNotes(chord)

  playNotes(instrument, chordNotes, arpeggioDelay, sustain, descend)
}

export const playNotes = (
  instrument: Sampler | Synth,
  notes: Note[],
  arpeggioDelay: number = 0.1,
  sustain: number = 1,
  descend: boolean = false,
  velocity: number = 1
) => {
  const chordNotes = notes.map(note => noteToString(note) + note.pitch)

  if (descend) {
    chordNotes.reverse()
  }

  const timeNow = now()

  chordNotes.forEach((note, index) => {
    instrument.triggerAttack(note, timeNow + index * arpeggioDelay, velocity)
  })

  instrument.triggerRelease(
    chordNotes,
    timeNow + chordNotes.length * arpeggioDelay + sustain
  )
}
