import { Chord, Note, Scale } from "../types/musical-terms";
import { majorScale } from "../data/scales";

export const chromaticScale: Scale = {
  name: "Chromatic scale",
  intervals: ["h", "h", "h", "h", "h", "h", "h", "h", "h", "h", "h", "h"],
};

export const allNotes: Note[] = [
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

export const noteDegreeClasses = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
];

export const getNote = (name: string, sharp: boolean) => {
  return (
    allNotes.find((n) => n.name === name && n.sharp === sharp) ?? allNotes[0]
  );
};

export const notesAreEqual = (noteA: Note, noteB: Note) => {
  return noteA.name === noteB.name && noteA.sharp === noteB.sharp;
};

export const chromaticScaleIndexOf = (note: Note) => {
  const chromaticNote = allNotes.find(
    (n) => n.name === note.name && n.sharp === note.sharp
  );

  if (!chromaticNote) return -1;

  return allNotes.indexOf(chromaticNote);
};

export const isScaleInterval = (
  rootNote: Note,
  note: Note,
  interval: number,
  scale: Scale
) => {
  const scaleIndexes = getScaleChromaticScaleIndexes(rootNote, scale);

  const noteChromaticScaleIndex = chromaticScaleIndexOf(note);
  const scaleIndex = scaleIndexes.indexOf(noteChromaticScaleIndex);

  return scaleIndex === interval;
};

export const getScaleDegree = (rootNote: Note, note: Note, scale: Scale) => {
  const scaleIndexes = getScaleChromaticScaleIndexes(rootNote, scale);

  return scaleIndexes.indexOf(chromaticScaleIndexOf(note));
};

export const getStringNotes = (startingNote: Note, numberOfNotes: number) => {
  const indexOfStartingNote = chromaticScaleIndexOf(startingNote);
  const stringNotes = [];

  for (let i = 0; i <= numberOfNotes; i++) {
    stringNotes.push(allNotes[(indexOfStartingNote + i) % allNotes.length]);
  }

  return stringNotes;
};

export const getScaleChromaticScaleIndexes = (rootNote: Note, scale: Scale) => {
  const chromaticScaleRootIndex = chromaticScaleIndexOf(rootNote);
  const indexes: number[] = [chromaticScaleRootIndex];

  let intervalIndex = 0;
  for (let i = 0; i < scale.intervals.length - 1; i++) {
    if (scale.intervals[i] === "wh") {
      intervalIndex += 3;
    } else if (scale.intervals[i] === "w") {
      intervalIndex += 2;
    } else {
      intervalIndex += 1;
    }

    indexes.push((intervalIndex + chromaticScaleRootIndex) % allNotes.length);
  }

  return indexes;
};

export const getScaleNotes = (rootNote: Note, scale: Scale) => {
  const chromaticIndexes = getScaleChromaticScaleIndexes(rootNote, scale);

  return chromaticIndexes.map((index) => allNotes[index]);
};

export const noteIsInScale = (rootNote: Note, note: Note, scale: Scale) => {
  const chromaticScaleIndex = chromaticScaleIndexOf(note);

  return getScaleChromaticScaleIndexes(rootNote, scale).includes(
    chromaticScaleIndex
  );
};

export const getChordNotes = (chord: Chord) => {
  const chromaticScaleNotes = getScaleNotes(chord.root, chromaticScale);

  return chord.intervals.map((interval) => {
    return chromaticScaleNotes[interval - 1];
  });
};

export const getScaleChord = (
  rootNote: Note,
  scale: Scale,
  degree: number,
  length: number
): Chord => {
  const scaleNotes = getScaleNotes(rootNote, scale);
  const majorScaleNotes = getScaleNotes(rootNote, majorScale);
  const relativeRoot = scaleNotes[degree];
  const chromaticScaleNotes = getScaleNotes(relativeRoot, chromaticScale);

  const chordIntervals = [];

  for (let i = 0; i < length; i++) {
    chordIntervals.push(
      chromaticScaleNotes.indexOf(
        scaleNotes[(degree + i * 2) % scaleNotes.length]
      ) + 1
    );
  }

  return { intervals: chordIntervals, root: relativeRoot };
};
