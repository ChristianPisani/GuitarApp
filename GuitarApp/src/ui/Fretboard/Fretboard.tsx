import { useContext, useState } from "react";
import { FretboardContext } from "./FretboardContext";
import {
  allNotes,
  getNote,
  getScaleChromaticScaleIndexes,
  getScaleDegree,
  getStringNotes,
  noteDegreeClasses,
} from "../../utility/noteFunctions";
import { Mode, Note, Scale } from "../../types/musical-terms";

export const Fret = ({ note }: { note: Note }) => {
  const { selectedNote, setSelectedNote, selectedScale } =
    useContext(FretboardContext);

  const scaleDegree = getScaleDegree(selectedNote, note, selectedScale);

  const activeNotes = getScaleChromaticScaleIndexes(
    selectedNote,
    selectedScale
  );

  const highLighted = activeNotes.includes(allNotes.indexOf(note));

  return (
    <div className="fret">
      <div
        className={`note active ${noteDegreeClasses[scaleDegree]}`}
        onClick={() => {
          setSelectedNote?.(note);
        }}
      >
        {highLighted && `${note.name}${note.sharp ? "#" : ""}`}
      </div>
    </div>
  );
};

export const String = ({ startingNote }: { startingNote: Note }) => {
  const stringNotes = getStringNotes(startingNote, 24);

  return (
    <div className="string">
      {stringNotes.map((note) => (
        <Fret note={note}></Fret>
      ))}
    </div>
  );
};

export const FretBoard = (props: any) => {
  return (
    <div className="fretboard-container">
      <div className="fretboard">
        <String startingNote={getNote("E", false)} />
        <String startingNote={getNote("B", false)} />
        <String startingNote={getNote("G", false)} />
        <String startingNote={getNote("D", false)} />
        <String startingNote={getNote("A", false)} />
        <String startingNote={getNote("E", false)} />
      </div>
    </div>
  );
};
