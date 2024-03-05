import { useContext, useState } from "react";
import { FretboardContext } from "./FretboardContext";
import {
  chromaticScale,
  getNote,
  getScaleChromaticScaleIndexes,
  getStringNotes,
  isScaleInterval,
} from "../../utility/noteFunctions";
import { Mode, Note, Scale } from "../../types/musical-terms";
import { majorScale } from "../../data/scales";

export const Fret = ({ note }: { note: Note }) => {
  const { selectedNote, setSelectedNote, selectedScale } =
    useContext(FretboardContext);

  const isMajorSecond = isScaleInterval(selectedNote, note, 2);
  const isMajorThird = isScaleInterval(selectedNote, note, 4);
  const isMajorFourth = isScaleInterval(selectedNote, note, 5);
  const isMajorFifth = isScaleInterval(selectedNote, note, 7);
  const isMajorSixth = isScaleInterval(selectedNote, note, 9);
  const isMajorSeventh = isScaleInterval(selectedNote, note, 11);

  const activeNotes = getScaleChromaticScaleIndexes(
    selectedNote,
    selectedScale
  );

  const highLighted = activeNotes.includes(chromaticScale.indexOf(note));

  return (
    <div className="fret">
      <div
        className={`note`}
        onClick={() => {
          setSelectedNote?.(note);
        }}
      >
        {highLighted && `${note?.name}${note.sharp ? "#" : ""}`}
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
