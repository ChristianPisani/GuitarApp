import {
  createContext,
  Dispatch,
  SetStateAction
} from "react";
import {
  Note
} from "../../interface/Note";

interface FretboardContextProps {
  selectedNote?: Note;
  setSelectedNote?: Dispatch<SetStateAction<Note | undefined>>;
}

export const FretboardContext = createContext<FretboardContextProps>({});
