import "./sequencer-page.scss";
import { allNotes } from "../../utility/noteFunctions";
import { useState } from "react";
import { FretboardContext } from "../../ui/Fretboard/FretboardContext";
import { Mode, Note, Scale } from "../../types/musical-terms";
import { majorScale } from "../../data/scales";
import { Sequencer } from "../../ui/sequencer/sequencer";
import { SequencerUi } from "../../ui/sequencer/sequencer-ui";

export const SequencerPage = () => {
  const [selectedNote, setSelectedNote] = useState<Note>(allNotes[0]);
  const [selectedScale, setSelectedScale] = useState<Scale>(majorScale);
  const [selectedMode, setSelectedMode] = useState<Mode>(1);

  return (
    <FretboardContext.Provider
      value={{
        setSelectedNote,
        selectedNote,
        selectedScale,
        selectedMode,
        setSelectedMode,
        setSelectedScale,
      }}
    >
      <main className={"flex flex-col w-full h-full place-items-center"}>
        <h2 className={"p-4 md:p-8"}>Sequencer</h2>
        <SequencerUi />
      </main>
    </FretboardContext.Provider>
  );
};
