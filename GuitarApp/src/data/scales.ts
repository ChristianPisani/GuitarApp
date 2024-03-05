import { Scale } from "../types/musical-terms";

// w, w, h, w, w, w, h
export const majorScale: Scale = {
  name: "Major",
  intervals: ["w", "w", "h", "w", "w", "w", "h"],
};

// Minor scale is just major scale starting from the sixth degree
export const minorScale: Scale = {
  name: "Minor",
  intervals: ["w", "h", "w", "w", "h", "w", "w"],
};

export const availableScales = [majorScale, minorScale];
