export interface Note {
  name: string;
  sharp: boolean;
}

export type Chord = {
  intervals: Number[];
};

export type Interval = "w" | "h";

export type Scale = {
  name: string;
  intervals: Interval[];
};
export type Mode = 1 | 2 | 3 | 4 | 5 | 6 | 7;
