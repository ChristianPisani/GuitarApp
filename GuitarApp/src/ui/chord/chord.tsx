import { Chord, Note, NoteName, Scale } from "../../types/musical-terms";
import {
  chromaticScale,
  getChordNotes,
  getScaleChord,
  getScaleDegree,
  getStringNotes,
  notesAreEqual,
  noteToString,
} from "../../utility/noteFunctions";
import { Component, FC, JSX, ReactNode, useState } from "react";
import {
  getChordName,
  ScaleDegree,
  scaleDegreeNotations,
} from "../../data/chords";
import { standardTuningNotes } from "../../data/tunings";
import { acousticGuitar } from "../../utility/instruments";
import { playChord, playNotes } from "../../utility/instrumentFunctions";
import { StringNote } from "../sequencer/sequencer";

export type ChordDegreeVisualizerProps = {
  degrees: number[];
  scale: Scale;
  note: Note;
};

export const ChordDegreeVisualizer: FC<ChordDegreeVisualizerProps> = ({
  degrees,
  scale,
  note,
}) => {
  type ChordType = "power" | "triad" | "7th" | "9th";
  const [chordType, setChordType] = useState<ChordType>("triad");
  const [showNoteIndex, setShowNoteIndex] = useState(true); // TODO: Move this into context??

  const chordTypeIndexes = {
    power: 2,
    triad: 3,
    "7th": 4,
    "9th": 5,
  };

  return (
    <div className={"flex flex-col max-w-[99svw] p-4 md:p-8"}>
      <div className={"flex flex-col gap-8 my-8 md:flex-row"}>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            value={showNoteIndex ? 1 : 0}
            onChange={() => setShowNoteIndex(!showNoteIndex)}
            className="sr-only peer"
            defaultChecked={showNoteIndex}
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900">
            Show note index
          </span>
        </label>
        <select
          className={
            "bg-gray-50 font-bold text-xl p-2 border-2 border-gray-900"
          }
          value={chordType}
          onChange={(e) => setChordType(e.target.value as ChordType)}
        >
          <option value={"power"}>Power chords</option>
          <option value={"triad"}>Triads</option>
          <option value={"7th"}>7th chords</option>
          <option value={"9th"}>9th chords</option>
        </select>
      </div>

      <div className={"flex overflow-x-auto w-full h-fit gap-8"}>
        {degrees.map((degree, index) => {
          const chord = getScaleChord(
            note,
            scale,
            degree,
            chordTypeIndexes[chordType]
          );

          const chordName = getChordName(chord);
          const isMajor = chordName.includes("Major");
          const isDiminished = chordName.includes("Diminished");
          const isAugmented = chordName.includes("Augmented");

          const notation = scaleDegreeNotations((degree + 1) as ScaleDegree);

          return (
            <div className={"inline-grid gap-4 place-items-center"} key={index}>
              <p className={"font-bold text-xl"}>
                {isAugmented ? "+" : ""}
                {isMajor ? notation : notation.toLowerCase()}
                {isDiminished ? "°" : ""}
              </p>
              <h2>{getChordName(chord)}</h2>
              <ChordVisualizer
                chord={chord}
                strings={standardTuningNotes().reverse()}
                showNoteIndex={showNoteIndex}
                onClickNote={(note: Note) => playNotes(acousticGuitar, [note])}
              />
              <button
                onClick={() => {
                  playChord(acousticGuitar, chord, 0.025, 1);
                }}
              >
                Play chord
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChordNoteComponent: FC<{
  currentNote: Note;
  chord: Chord | undefined;
  chordNotes: Note[];
  showNoteIndex: boolean;
  showString: boolean;
  fallBack: ReactNode | null;
  onClick?: (note: Note) => void;
  selected?: boolean;
}> = ({
  currentNote,
  chordNotes,
  chord,
  showNoteIndex,
  showString,
  fallBack,
  onClick,
  selected = false,
}) => {
  const fingerIndex =
    chord?.intervals.indexOf(
      getScaleDegree(chord.root, currentNote, chromaticScale) + 1
    ) ?? 0;

  const fingerNumberClasses = new Map<number, string>([
    [1, "bg-lime-500 rounded-full outline outline-2 outline-lime-500"],
    [2, "bg-gray-900 rounded-full outline outline-2 outline-gray-900"],
    [3, "bg-gray-900 rotate-45"],
    [4, "bg-yellow-600 rotate-45"],
    [5, "bg-blue-700 rounded-full"],
  ]);

  const Wrapper = (props: { children?: ReactNode; className?: string }) =>
    onClick ? (
      <button className={props.className} onClick={() => onClick(currentNote)}>
        {props.children}
      </button>
    ) : (
      <p className={props.className}>{props.children}</p>
    );

  return (
    <div
      className={`w-2 h-full ${
        showString ? "bg-gray-900" : ""
      } relative grid place-items-center transition-all ${
        onClick ? "hover:scale-105" : ""
      }`}
    >
      {chordNotes.some((chordNote) => notesAreEqual(chordNote, currentNote)) ? (
        <>
          <div
            className={`w-8 h-8 grid place-items-center absolute ${
              fingerNumberClasses.get(fingerIndex + 1) ?? "bg-gray-900"
            } ${selected ? "outline-2 outline-gray-100 outline" : ""}`}
          ></div>

          <Wrapper
            className={`text-white text-center absolute text-xl select-none p-4`}
          >
            {showNoteIndex ? `${fingerIndex + 1}` : noteToString(currentNote)}
          </Wrapper>
        </>
      ) : (
        fallBack
      )}
    </div>
  );
};

export const ChordVisualizer: FC<{
  chord: Chord | undefined;
  strings: Note[];
  showNoteIndex: boolean;
  onClickNote?: (note: Note, stringIndex: number) => void;
  selectedNotes?: StringNote[];
}> = ({ chord, strings, showNoteIndex, onClickNote, selectedNotes }) => {
  // First
  // Do the first inversion chords
  // Starting from first string, then second, third etc
  // Then
  // Do the inversions as well
  // How to do this?
  // Sort the intervals
  // Find the notes from the intervals in the chord
  // Find note on first string, then next on second string etc
  // Could also try string skip variants?

  // Alternatively
  // Just show the actual chord from the intervals sent in in this component
  // Then write what chord it is by analysing the intervals

  const stringNotes = strings.map((stringNote) =>
    getStringNotes(
      {
        name: stringNote.name,
        sharp: stringNote.sharp,
        pitch: stringNote.pitch,
      },
      12
    )
  );

  const chordNotes = getChordNotes(chord);

  const frets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const fretNoOpen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div
      className={
        "inline-grid grid-cols-[auto_1fr_auto] gap-2 place-items-center min-h-[500px] w-80"
      }
    >
      <div className={"grid h-full items-center text-end"}>
        {frets.map((fret) => (
          <p key={fret}>{fret}</p>
        ))}
      </div>

      <div className={"flex flex-col h-full w-full"}>
        <div
          className={"flex w-full h-10 justify-around text-center items-center"}
        >
          {strings.map((string, fretIndex) => {
            const currentNote = stringNotes[fretIndex][0];

            return (
              <ChordNoteComponent
                currentNote={currentNote}
                chord={chord}
                chordNotes={chordNotes}
                showNoteIndex={showNoteIndex}
                showString={false}
                selected={selectedNotes?.some(
                  (selectedNote) =>
                    selectedNote.stringIndex === fretIndex &&
                    noteToString(selectedNote.note) ===
                      noteToString(currentNote)
                )}
                fallBack={<h2 className={"select-none"}>X</h2>}
                key={fretIndex}
                onClick={
                  onClickNote
                    ? () => onClickNote(currentNote, fretIndex)
                    : undefined
                }
              />
            );
          })}
        </div>
        <div
          className={
            "grid place-items-center h-full w-full rounded-xl border-4 border-gray-900 bg-orange-200"
          }
        >
          {fretNoOpen.map((fret, fretIndex) => (
            <div
              className={
                "flex h-full w-full justify-around border-2 border-gray-900 relative items-center"
              }
              key={fretIndex}
            >
              {strings.map((string: Note, stringIndex) => {
                const currentNote = stringNotes[stringIndex][fret];

                return (
                  <ChordNoteComponent
                    currentNote={currentNote}
                    chordNotes={chordNotes}
                    chord={chord}
                    showNoteIndex={showNoteIndex}
                    showString={true}
                    fallBack={null}
                    key={stringIndex}
                    onClick={
                      onClickNote
                        ? () => onClickNote(currentNote, stringIndex)
                        : undefined
                    }
                    selected={selectedNotes?.some(
                      (selectedNote) =>
                        selectedNote.stringIndex === stringIndex &&
                        noteToString(selectedNote.note) ===
                          noteToString(currentNote)
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
