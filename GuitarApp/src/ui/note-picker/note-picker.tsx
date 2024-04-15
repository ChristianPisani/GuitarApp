import {
  allNotes,
  chromaticScale,
  getScaleDegree,
  noteDegreeClasses,
  noteIsInScale,
  noteToString,
} from "../../utility/noteFunctions";
import { Note, Scale } from "../../types/musical-terms";
import { FC } from "react";

type NotePickerProps = {
  selectedNote: Note;
  setSelectedNote: (note: Note) => void;
  selectedScale?: Scale;
};

export const NotePicker: FC<NotePickerProps> = ({
  selectedNote,
  setSelectedNote,
  selectedScale = chromaticScale,
}) => {
  return (
    <div className={"flex gap-2"}>
      {allNotes.map((note, index) => {
        const scaleDegree = getScaleDegree(selectedNote, note, selectedScale);
        const isInScale = noteIsInScale(selectedNote, note, selectedScale);

        return (
          <div className={"flex flex-col items-center gap-2"} key={index * 100}>
            <p>{index + 1}</p>
            <button
              onClick={() => setSelectedNote(note)}
              className={`w-12 h-12 rounded-full bg-gray-50 grid place-items-center ${
                noteDegreeClasses[scaleDegree]
              } ${
                isInScale
                  ? "shadow hover:shadow-xl hover:scale-105 transition-all note-color"
                  : ""
              }`}
            >
              {noteToString(note)}
            </button>
            {isInScale && <p className={"font-bold"}>{scaleDegree + 1}</p>}
          </div>
        );
      })}
    </div>
  );
};
