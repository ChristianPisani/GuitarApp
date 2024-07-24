import { Beat, Subdivision } from '../context/app-context'
import { ScaleDegree } from '../data/chords'

var BAR_ID = 0
var BEAT_ID = 100000

export const getDefaultSubdivision = (): Subdivision => ({
  notes: [],
  sustain: 0.2,
  velocity: 0.8,
  strumSpeed: 0.02,
})

export const defaultBeat = (): Beat => ({
  scaleDegree: 1,
  chordExtensionScaleDegrees: [1, 2, 3] as ScaleDegree[],
  subdivisions: [getDefaultSubdivision()],
  id: BAR_ID++,
})

export const createNewBar = (beats: Beat[]) => {
  return {
    id: BEAT_ID++,
    timeSignature: 4,
    beats,
  }
}
