import { Scale } from "../types/musical-terms";

// w, w, h, w, w, w, h
export const majorScale: Scale = {
  name: "Major (Ionian)",
  intervals: ["w", "w", "h", "w", "w", "w", "h"],
};

export const dorian: Scale = {
  name: "Dorian",
  intervals: ["w", "h", "w", "w", "w", "h", "w"],
};

export const phrygian: Scale = {
  name: "Phrygian",
  intervals: ["h", "w", "w", "w", "h", "w", "w"],
};

export const lydian: Scale = {
  name: "Lydian",
  intervals: ["w", "w", "w", "h", "w", "w", "h"],
};

export const mixolydian: Scale = {
  name: "Mixolydian",
  intervals: ["w", "w", "h", "w", "w", "h", "w"],
};

export const locrian: Scale = {
  name: "Locrian",
  intervals: ["h", "w", "w", "h", "w", "w", "w"],
};

// Minor scale is just major scale starting from the sixth degree
export const minorScale: Scale = {
  name: "Minor (Aeolian)",
  intervals: ["w", "h", "w", "w", "h", "w", "w"],
};

export const melodicMinorScale: Scale = {
  name: "Melodic minor",
  intervals: ["w", "h", "w", "w", "w", "w", "h"],
};

export const harmonicMinor: Scale = {
  name: "Harmonic minor",
  intervals: ["w", "h", "w", "w", "h", "wh", "h"],
};

export const minorPentatonic: Scale = {
  name: "Minor pentatonic",
  intervals: ["wh", "w", "w", "wh", "w"],
};

export const majorPentatonic: Scale = {
  name: "Major pentatonic",
  intervals: ["w", "w", "wh", "w", "wh"],
};

export const minorBlues: Scale = {
  name: "Minor blues",
  intervals: ["wh", "w", "h", "h", "wh", "w"],
};

export const majorBlues: Scale = {
  name: "Major blues",
  intervals: ["w", "h", "h", "wh", "w", "wh"],
};

export const augmented: Scale = {
  name: "Augmented",
  intervals: ["wh", "h", "wh", "h", "wh", "h"],
};

export const diminished: Scale = {
  name: "Diminished",
  intervals: ["w", "h", "w", "h", "w", "h", "w", "h"],
};

export const availableScales = [
  majorScale,
  dorian,
  phrygian,
  lydian,
  mixolydian,
  minorScale,
  locrian,
  melodicMinorScale,
  harmonicMinor,
  minorPentatonic,
  majorPentatonic,
  minorBlues,
  majorBlues,
  augmented,
  diminished,
];
