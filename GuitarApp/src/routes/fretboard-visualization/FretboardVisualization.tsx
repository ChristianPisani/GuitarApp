import { FretBoard } from "../../ui/Fretboard/Fretboard";
import "./fretboard-visualization.scss";
import {
  allNotes,
  getScaleDegree,
  noteDegreeClasses,
  noteIsInScale,
  noteToString,
} from "../../utility/noteFunctions";
import { useContext, useState } from "react";
import { FretboardContext } from "../../ui/Fretboard/FretboardContext";
import { Mode, Note, Scale } from "../../types/musical-terms";
import { availableScales, majorScale } from "../../data/scales";
import { ChordDegreeVisualizer } from "../../ui/chord/chord";
import { Sequencer } from "../../ui/sequencer/sequencer";
import { ScalePicker } from "../../ui/scale-picker/scale-picker";

const Settings = () => {
  const { selectedScale, selectedNote, setSelectedScale, setSelectedNote } =
    useContext(FretboardContext);

  return (
    <div className={"flex flex-col gap-4 overflow-auto mx-4 md:mx-8"}>
      <p className={"font-bold mb-0"}>Select scale</p>

      <div className={"flex gap-2"}>
        {allNotes.map((note, index) => {
          const scaleDegree = getScaleDegree(selectedNote, note, selectedScale);
          const isInScale = noteIsInScale(selectedNote, note, selectedScale);

          return (
            <div
              className={"flex flex-col items-center gap-2"}
              key={index * 100}
            >
              <p>{index + 1}</p>
              <button
                onClick={() => setSelectedNote(note)}
                className={`w-12 h-12 rounded-full bg-gray-50 grid place-items-center ${
                  noteDegreeClasses[scaleDegree]
                } ${isInScale ? "border-2 border-blue-950 note-color" : ""}`}
              >
                {noteToString(note)}
              </button>
              {isInScale && <p className={"font-bold"}>{scaleDegree + 1}</p>}
            </div>
          );
        })}
        <ScalePicker onChange={setSelectedScale} />
      </div>

      <p>Intervals:</p>
      <div className={"flex gap-2"}>
        {selectedScale.intervals.map((i, index) => (
          <span
            key={index}
            className={"bg-orange-200 rounded py-4 px-8 uppercase font-bold"}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
};

const SideBar = () => {
  return (
    <div className={"sidebar text-content vh-scroll"}>
      <a href={"../"}>
        <h2>How to use</h2>
      </a>
      <h2>Suggestions</h2>
      <p>
        Under the fretboard there will be shown suggestions for different chords
        and inversions. Click of these to see them on the fretboard, or just
        hover to get a preview.
      </p>
      <h2>Settings</h2>
      <p>
        The top section of the page is the settings. Here you can select whether
        you want to look at scales, chords or intervals.{" "}
      </p>
      <p>
        Your selection will alter what happens when you click on a note on the
        fretboard.{" "}
      </p>
      <p>
        Clicking a note on the fretboard will select the root note of whatever
        settings you have made. The settings control which notes are highlighted
        based on your selection.
      </p>
      <h2>Note colors</h2>
      <p>
        Notes on the fretboard are colored based on their scale degree. This
        makes it easier to see how notes relate to each other.
      </p>
    </div>
  );
};

export const FretboardVisualization = () => {
  const [selectedNote, setSelectedNote] = useState<Note>(allNotes[0]);
  const [selectedScale, setSelectedScale] = useState<Scale>(majorScale);
  const [selectedMode, setSelectedMode] = useState<Mode>(1);

  const degrees = [];
  for (let i = 0; i < selectedScale.intervals.length; i++) {
    degrees.push(i);
  }

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
      <main className={"grid max-w-[100svw]"}>
        <Settings />
        <div className={"main-content overflow-auto"}>
          <FretBoard />
        </div>
        <div className={"p-4 md:p-8"}>
          <h2>Chords in this scale:</h2>

          <ChordDegreeVisualizer
            degrees={degrees}
            scale={selectedScale}
            note={selectedNote}
          />

          <h2 className={"p-4 md:p-8"}>Sequencer</h2>
          <Sequencer />
        </div>
      </main>
    </FretboardContext.Provider>
  );
};
