import { Chord } from "../types/musical-terms";
import { noteToString } from "../utility/noteFunctions";

export type TriadType = "Major" | "Minor" | "Augmented" | "Diminished";

export const chordNames = [
  {
    // 1, 3, 5 degrees of the major scale
    name: "Major",
    intervals: [1, 5, 8],
  },
  {
    // 1, minor 3, 5 degrees of the major scale
    name: "Minor",
    intervals: [1, 4, 8],
  },
  {
    // 1, 3, augmented 5 (raised one halftone) degrees of the major scale
    name: "Augmented",
    intervals: [1, 5, 9],
  },
  {
    // 1, minor 3, dimished 5 (lowered one halftone) degrees of the major scale
    name: "Diminished",
    intervals: [1, 4, 7],
  },
];

export const chordExtensions = [
  {
    name: "7th",
    interval: 12,
  },
  {
    name: "Minor 7th",
    interval: 11,
  },
  {
    name: "Diminished 7th",
    interval: 10,
  },
  {
    name: "9th",
    interval: 3,
  },
  {
    name: "Minor 9th",
    interval: 2,
  },
];

export const getTriad = (type: TriadType) => {
  return chordNames.find((triad) => triad.name === type);
};

export const getChordName = (chord: Chord) => {
  const matchingTriad = chordNames.find((triad) =>
    triad.intervals.every((interval) => chord.intervals.includes(interval))
  );

  const matchingExtensions = chordExtensions.filter((extension) =>
    chord.intervals.includes(extension.interval)
  );
  const matchingExtensionName =
    matchingExtensions.length > 0
      ? matchingExtensions[matchingExtensions.length - 1].name
      : "";

  const chordName = `${noteToString(chord.root)} ${
    matchingTriad?.name
  } ${matchingExtensionName}`;

  const chordNameNoDuplicates = [...new Set(chordName.split(" "))].join(" ");

  return chordNameNoDuplicates;
};

export type ScaleDegree = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const scaleDegreeNotations = (degree: ScaleDegree) => {
  const notations = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
  };

  return notations[degree];
};
