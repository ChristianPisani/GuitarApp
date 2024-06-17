import { useState } from "react";
import { Chord, Note, StringNote } from "../../types/musical-terms";
import { allNotes, getChordNotes } from "../../utility/noteFunctions";
import { NotePicker } from "../note-picker/note-picker";
import { ChordVisualizerCustomChord } from "../chord/chord";
import { standardTuningNotes } from "../../data/tunings";
import { getTriad, TriadType } from "../../data/chords";
import { Toggle } from "../toggle/toggle";

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

  const stringNotes: StringNote[] = [];
  for (let i = 0; i < 6; i++) {
    const index = (i + inversion) % 3;

    const matchingNote = chordNotes[index];

    stringNotes.push({
      note: matchingNote!,
      stringIndex: (i + selectedString) % strings.length,
    });
  }

  return (
    <div className={"grid gap-8"}>
      <div className={"flex gap-8"}>
        <div className={"grid gap-2"}>
          Inversion: {inversion}
          <input
            type={"range"}
            min={0}
            max={2}
            defaultValue={inversion}
            onChange={(e) => setInversion(Number(e.target.value))}
          ></input>
        </div>
        <div className={"grid gap-2"}>
          Selected string: {selectedString}
          <input
            type={"range"}
            min={0}
            max={5}
            defaultValue={selectedString}
            onChange={(e) => setSelectedString(Number(e.target.value))}
          ></input>
        </div>
        <Toggle
          onChange={() => setShowNoteIndex(!showNoteIndex)}
          value={showNoteIndex}
          text={"Show note index"}
        />
      </div>

      <NotePicker selectedNote={rootNote} setSelectedNote={setRootNote} />

      <ChordVisualizerCustomChord
        chord={chord}
        chordNotes={stringNotes}
        strings={strings}
        showNoteIndex={showNoteIndex}
        numberOfFrets={16}
        careAboutStringIndex={true}
      />
    </div>
  );
};
