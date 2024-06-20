import { Subdivision } from '../context/app-context'

export const getDefaultSubdivision = (): Subdivision => ({
  notes: [],
  sustain: 0.2,
  velocity: 0.8,
  strumSpeed: 0.02,
})
