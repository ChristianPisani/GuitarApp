import { createContext, Dispatch, SetStateAction } from "react";
import { Mode, Note, Scale } from "../../types/musical-terms";
import { allNotes } from "../../utility/noteFunctions";
import { majorScale } from "../../data/scales";

interface FretboardContextProps {
  selectedNote: Note;
  setSelectedNote: Dispatch<SetStateAction<Note>>;
  selectedScale: Scale;
  setSelectedScale: Dispatch<SetStateAction<Scale>>;
  selectedMode: Mode;
  setSelectedMode: Dispatch<SetStateAction<Mode>>;
}

export const FretboardContext = createContext<FretboardContextProps>({
  selectedNote: allNotes[0],
  selectedScale: majorScale,
  selectedMode: 1,
  setSelectedScale: () => null,
  setSelectedNote: () => null,
  setSelectedMode: () => null,
});
