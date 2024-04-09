import { getChordNotes, noteToString } from "./noteFunctions";
import { Chord, Note } from "../types/musical-terms";
import { now, Sampler } from "tone";

export const playChord = (
  instrument: Sampler,
  chord: Chord,
  arpeggioDelay: number = 0.1,
  sustain: number = 1,
  descend: boolean = false
) => {
  const chordNotes = getChordNotes(chord);

  playNotes(instrument, chordNotes, arpeggioDelay, sustain, descend);
};

export const playNotes = (
  instrument: Sampler,
  notes: Note[],
  arpeggioDelay: number = 0.1,
  sustain: number = 1,
  descend: boolean = false
) => {
  const chordNotes = notes.map((note) => noteToString(note) + note.pitch);

  if (descend) {
    const reversed = [...chordNotes];
    reversed.pop();
    reversed.reverse();
    chordNotes.push(...reversed);
  }

  const timeNow = now();

  chordNotes.forEach((note, index) => {
    instrument.triggerAttack(note, timeNow + index * arpeggioDelay);
  });

  instrument.triggerRelease(
    chordNotes,
    timeNow + chordNotes.length * arpeggioDelay + sustain
  );
};
