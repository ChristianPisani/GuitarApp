import { useState } from "react";
import { Chord, Note, StringNote } from "../../types/musical-terms";
import {
  allNotes,
  chromaticScale,
  getChordNotes,
  getStringNotes,
  notesAreEqual,
} from "../../utility/noteFunctions";
import { NotePicker } from "../note-picker/note-picker";
import {
  ChordVisualizerCustomChord,
  ChordVisualizerFullChord,
} from "../chord/chord";
import { standardTuningNotes } from "../../data/tunings";
import { chordNames, getTriad, TriadType } from "../../data/chords";

export const ChordVariations = () => {
  const [rootNote, setRootNote] = useState<Note>(allNotes[0]);
  const [selectedString, setSelectedString] = useState<number>(0);
  const [inversion, setInversion] = useState<number>(0);
  const [showNoteIndex, setShowNoteIndex] = useState<boolean>(true);
  const [chordType, setChordType] = useState<TriadType>("Major");

  const strings = standardTuningNotes();

  const chord: Chord = {
    intervals: getTriad(chordType)?.intervals ?? [],
    root: rootNote,
  };

  const chordNotes = getChordNotes(chord);

  const allStringNotes = strings.map((string) => getStringNotes(string, 12));
  const stringNotes: StringNote[] = [];
  for (let i = 0; i < 3; i++) {
    const index = (i + inversion) % 2;

    const matchingNote = chordNotes[index];

    stringNotes.push({ note: matchingNote!, stringIndex: i });
  }
  console.log(stringNotes, chord);

  return (
    <>
      <input
        type={"range"}
        min={0}
        max={2}
        onChange={(e) => setInversion(Number(e.target.value))}
      ></input>

      <NotePicker selectedNote={rootNote} setSelectedNote={setRootNote} />

      <ChordVisualizerCustomChord
        chord={chord}
        chordNotes={stringNotes}
        strings={strings}
        showNoteIndex={false}
      />
    </>
  );
};
