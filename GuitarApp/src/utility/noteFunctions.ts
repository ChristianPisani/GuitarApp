import {
  Note
} from "../interface/Note";

export const chromaticScale: Note[] = [
  {
    name: "A",
    sharp: false,
  },
  {
    name: "A",
    sharp: true,
  },
  {
    name: "B",
    sharp: false,
  },
  {
    name: "C",
    sharp: false,
  },
  {
    name: "C",
    sharp: true,
  },
  {
    name: "D",
    sharp: false,
  },
  {
    name: "D",
    sharp: true,
  },
  {
    name: "E",
    sharp: false,
  },
  {
    name: "F",
    sharp: false,
  },
  {
    name: "F",
    sharp: true,
  },
  {
    name: "G",
    sharp: false,
  },
  {
    name: "G",
    sharp: true,
  },
];

export const getNote = (name: string, sharp: boolean) => {
  return chromaticScale.find(n => n.name === name && n.sharp === sharp) ?? chromaticScale[0];
}

export const isScaleInterval = (rootNote: Note | undefined, note: Note, interval: number) => {
  const noteIndex = rootNote ? chromaticScale.indexOf(rootNote) : 0;
  
  if (noteIndex === -1) return undefined;

  const chromaticScaleNote = chromaticScale[(noteIndex + interval) % chromaticScale.length];
  const isInterval = note.name === chromaticScaleNote.name && note.sharp === chromaticScaleNote.sharp;
  
  return isInterval;
};

export const getStringNotes = (startingNote: Note, numberOfNotes: number) => {
  const indexOfStartingNote = chromaticScale.indexOf(startingNote);
  const stringNotes = [];
  
  for (let i = 0; i <= numberOfNotes; i++) {
    stringNotes.push(chromaticScale[(indexOfStartingNote + i) % chromaticScale.length]);
  }
  
  return stringNotes;
}