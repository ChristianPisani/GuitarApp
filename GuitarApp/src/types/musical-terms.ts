export type NoteName = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface Note {
  name: NoteName;
  sharp: boolean;
  pitch: number;
}

export type Chord = {
  root: Note;
  intervals: number[];
};

export type Interval = "w" | "h" | "wh";

export type Scale = {
  name: string;
  intervals: Interval[];
};
export type Mode = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type StringNote = {
  note: Note;
  stringIndex: number;
};
