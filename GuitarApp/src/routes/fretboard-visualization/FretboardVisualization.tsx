﻿import { FretBoard } from "../../ui/Fretboard/Fretboard";
import "./fretboard-visualization.scss";
import {
  allNotes,
  getScaleChord,
  getScaleDegree,
  noteDegreeClasses,
  noteIsInScale,
} from "../../utility/noteFunctions";
import { useContext, useState } from "react";
import { FretboardContext } from "../../ui/Fretboard/FretboardContext";
import { Mode, Note, Scale } from "../../types/musical-terms";
import { availableScales, majorScale } from "../../data/scales";
import { ChordDegreeVisualizer } from "../../ui/chord/chord";

const Settings = () => {
  const { selectedScale, selectedNote, setSelectedScale, setSelectedNote } =
    useContext(FretboardContext);

  return (
    <div className={"flex flex-col gap-4 p-8"}>
      <p className={"font-bold mb-0"}>Select scale</p>

      <div className={"flex gap-2"}>
        {allNotes.map((note, index) => {
          const scaleDegree = getScaleDegree(selectedNote, note, selectedScale);
          const isInScale = noteIsInScale(selectedNote, note, selectedScale);

          return (
            <div className={"flex flex-col items-center gap-2"}>
              <p>{index + 1}</p>
              <button
                onClick={() => setSelectedNote(note)}
                className={`w-12 h-12 rounded-full bg-gray-50 grid place-items-center ${
                  noteDegreeClasses[scaleDegree]
                } ${isInScale ? "border-2 border-blue-950 note-color" : ""} ${
                  note === selectedNote ? "border-fuchsia-500" : ""
                }`}
              >
                {note.name}
                {note.sharp ? "#" : ""}
              </button>
              {isInScale && <p>{scaleDegree + 1}</p>}
            </div>
          );
        })}
        <select
          onChange={(e) =>
            setSelectedScale(availableScales[Number(e.target.value)])
          }
          className={"p-3 bg-gray-100"}
        >
          {availableScales.map((scale, index) => (
            <option value={index}>{scale.name}</option>
          ))}
        </select>
      </div>

      <p>Intervals:</p>
      <div className={"flex gap-2"}>
        {selectedScale.intervals.map((i) => (
          <span
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
      <main className={"grid max-w-[100svw] overflow-hidden"}>
        <Settings />
        <div className={"main-content overflow-auto"}>
          <FretBoard />
        </div>
        <div className={"p-8"}>
          <h2>Chords in this scale:</h2>

          <ChordDegreeVisualizer
            degrees={degrees}
            scale={selectedScale}
            note={selectedNote}
          />
        </div>
      </main>
    </FretboardContext.Provider>
  );
};
