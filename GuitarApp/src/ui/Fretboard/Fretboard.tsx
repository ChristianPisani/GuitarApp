import { useContext, useState } from "react";
import { FretboardContext } from "./FretboardContext";
import { Note } from "../../interface/Note";

const Notes: Note[] = [
  {
    name: "A",
    sharp: false,
  },
  {
    name: "A",
    sharp: true,
  },
  {
    name: "B",
    sharp: false,
  },
  {
    name: "C",
    sharp: false,
  },
  {
    name: "C",
    sharp: true,
  },
  {
    name: "D",
    sharp: false,
  },
  {
    name: "D",
    sharp: true,
  },
  {
    name: "E",
    sharp: false,
  },
  {
    name: "F",
    sharp: false,
  },
  {
    name: "F",
    sharp: true,
  },
  {
    name: "G",
    sharp: false,
  },
  {
    name: "G",
    sharp: true,
  },
];

const strings = [
  {
    startNote: "E",
  },
  {
    startNote: "A",
  },
  {
    startNote: "D",
  },
  {
    startNote: "G",
  },
  {
    startNote: "B",
  },
  {
    startNote: "E",
  },
];

export const Fret = ({ note }: { note: Note }) => {
  const { selectedNote, setSelectedNote } = useContext(FretboardContext);
  
  const noteIndex = selectedNote ? Notes.indexOf(Notes.find(x => x === selectedNote ?? {}) ?? {name: "", sharp: false}) : 0;
  
  const isMajorThird = note === Notes[(noteIndex + 4) % Notes.length];
  const isMajorFifth = note === Notes[(noteIndex + 7) % Notes.length];
  
  const highLighted = selectedNote === note 
    || isMajorThird
    || isMajorFifth;

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
        {(!note?.sharp || highLighted) && `${note?.name}${note.sharp ? "#" : ""}`}
      </div>
    </div>
  );
};

export const String = ({ startingNote }: { startingNote: Note }) => {
  const fretNotes = [];
  const indexOfStartingNote = Notes.indexOf(
    Notes.find((x) => x.name === startingNote.name) ?? {
      name: "E",
      sharp: false,
    }
  );
  const numberOfNotes = 12;

  for (let i = 0; i <= numberOfNotes; i++) {
    fretNotes.push(Notes[(indexOfStartingNote + i) % Notes.length]);
  }

  return (
    <div className="string">
      {fretNotes.map((fretNote) => (
        <Fret note={fretNote}></Fret>
      ))}
    </div>
  );
};

export const FretBoard = (props: any) => {
  const [selectedNote, setSelectedNote] = useState<Note>();

  return (
    <div className="fretboard">
      <FretboardContext.Provider value={{ setSelectedNote, selectedNote }}>
        <String startingNote={{ name: "E", sharp: false }} />
        <String startingNote={{ name: "B", sharp: false }} />
        <String startingNote={{ name: "G", sharp: false }} />
        <String startingNote={{ name: "D", sharp: false }} />
        <String startingNote={{ name: "A", sharp: false }} />
        <String startingNote={{ name: "E", sharp: false }} />
      </FretboardContext.Provider>
    </div>
  );
};
