import { Note, Scale } from "../types/musical-terms";

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
    chromaticScale.find((n) => n.name === name && n.sharp === sharp) ??
    chromaticScale[0]
  );
};

export const chromaticScaleIndexOf = (note: Note) => {
  const chromaticNote = chromaticScale.find(
    (n) => n.name === note.name && n.sharp === note.sharp
  );

  if (!chromaticNote) return -1;

  return chromaticScale.indexOf(chromaticNote);
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

  console.log({ scaleIndexes });
  return scaleIndexes.indexOf(chromaticScaleIndexOf(note));
};

export const getStringNotes = (startingNote: Note, numberOfNotes: number) => {
  const indexOfStartingNote = chromaticScaleIndexOf(startingNote);
  const stringNotes = [];

  for (let i = 0; i <= numberOfNotes; i++) {
    stringNotes.push(
      chromaticScale[(indexOfStartingNote + i) % chromaticScale.length]
    );
  }

  return stringNotes;
};

export const getScaleChromaticScaleIndexes = (rootNote: Note, scale: Scale) => {
  const chromaticScaleRootIndex = chromaticScaleIndexOf(rootNote);
  const indexes: number[] = [chromaticScaleRootIndex];

  let intervalIndex = 0;
  for (let i = 0; i < scale.intervals.length; i++) {
    if (scale.intervals[i] === "w") {
      intervalIndex += 2;
    } else {
      intervalIndex += 1;
    }

    indexes.push(
      (intervalIndex + chromaticScaleRootIndex) % chromaticScale.length
    );
  }

  return indexes;
};

export const noteIsInScale = (rootNote: Note, note: Note, scale: Scale) => {
  const chromaticScaleIndex = chromaticScaleIndexOf(note);

  return getScaleChromaticScaleIndexes(rootNote, scale).includes(
    chromaticScaleIndex
  );
};
