import { getNote } from '../utility/noteFunctions'

export const standardTuningNotes = (basePitch: number = 2) => [
  getNote('E', false, basePitch),
  getNote('A', false, basePitch),
  getNote('D', false, basePitch + 1),
  getNote('G', false, basePitch + 1),
  getNote('B', false, basePitch + 1),
  getNote('E', false, basePitch + 2),
]
