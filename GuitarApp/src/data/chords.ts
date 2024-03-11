import { Chord } from "../types/musical-terms";
import { noteToString } from "../utility/noteFunctions";

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
    name: "9th",
    interval: 3,
  },
  {
    name: "Minor 9th",
    interval: 2,
  },
];

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

  return `${noteToString(chord.root)} ${
    matchingTriad?.name
  } ${matchingExtensionName}`;
};
