import { FC, useContext, useState } from "react";
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

  return (
    <div className="fret">
      <FretboardNote note={note} open={false} />
    </div>
  );
};

export const FretboardNote: FC<{ note: Note; open: boolean }> = ({
  note,
  open,
}) => {
  const { selectedNote, setSelectedNote, selectedScale } =
    useContext(FretboardContext);

  const scaleDegree = getScaleDegree(selectedNote, note, selectedScale);

  const activeNotes = getScaleChromaticScaleIndexes(
    selectedNote,
    selectedScale
  );

  const highLighted = activeNotes.includes(allNotes.indexOf(note));

  return (
    <div
      className={`note ${highLighted && "active"} ${open && "open"} ${
        noteDegreeClasses[scaleDegree]
      }`}
    >
      {highLighted && (
        <p className={"font-bold"}>
          {note.name}
          {note.sharp ? "#" : ""}
        </p>
      )}
      {open && !highLighted && <p className={"font-bold text-2xl"}>X</p>}
    </div>
  );
};

export const String = ({
  startingNote,
  startIndex,
  numberOfNotes,
}: {
  startingNote: Note;
  startIndex: number;
  numberOfNotes: number;
}) => {
  const stringNotes = getStringNotes(startingNote, numberOfNotes);

  return (
    <div className="string">
      {stringNotes.splice(startIndex).map((note) => (
        <Fret note={note}></Fret>
      ))}
    </div>
  );
};

export const FretBoard = (props: any) => {
  const notes = [
    getNote("E", false),
    getNote("B", false),
    getNote("G", false),
    getNote("D", false),
    getNote("A", false),
    getNote("E", false),
  ];

  return (
    <div className="fretboard-container">
      <div className={"h-full grid place-items-stretch"}>
        {notes.map((note) => (
          <div className={"grid w-16 place-items-center"}>
            <FretboardNote note={note} open={true} />
          </div>
        ))}
      </div>
      <div className="fretboard">
        {notes.map((note) => (
          <String startIndex={1} startingNote={note} numberOfNotes={26} />
        ))}
      </div>
    </div>
  );
};
