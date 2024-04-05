import { getNote } from "../utility/noteFunctions";

export const standardTuningNotes = (basePitch: number = 2) => [
  getNote("E", false, basePitch + 2),
  getNote("B", false, basePitch + 1),
  getNote("G", false, basePitch + 1),
  getNote("D", false, basePitch + 1),
  getNote("A", false, basePitch),
  getNote("E", false, basePitch),
];
