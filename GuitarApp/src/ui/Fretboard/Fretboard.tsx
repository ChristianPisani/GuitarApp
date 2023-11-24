import { useContext, useState } from "react";
import { FretboardContext } from "./FretboardContext";
import { Note } from "../../interface/Note";
import {
  getNote,
  getStringNotes,
  isScaleInterval
} from "../../utility/noteFunctions";

export const Fret = ({ note }: { note: Note }) => {
  const { selectedNote, setSelectedNote } = useContext(FretboardContext);

  const isMajorThird = isScaleInterval(selectedNote, note, 4);
  const isMajorFifth = isScaleInterval(selectedNote, note, 7);

  const highLighted = selectedNote === note || isMajorThird || isMajorFifth;

  return (
    <div className="fret">
      <div
        className={`
          note 
          ${highLighted ? "active" : ""}
          ${isMajorThird ? "third" : ""}
          ${isMajorFifth ? "fifth" : ""}`}
        onClick={() => {
          setSelectedNote?.(note);
        }}
      >
        {(!note?.sharp || highLighted) &&
          `${note?.name}${note.sharp ? "#" : ""}`}
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
  const [selectedNote, setSelectedNote] = useState<Note>();

  return (
    <FretboardContext.Provider value={{ setSelectedNote, selectedNote }}>
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
    </FretboardContext.Provider>
  );
};
