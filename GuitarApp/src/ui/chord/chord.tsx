import { Chord, NoteName } from "../../types/musical-terms";
import {
  getChordNotes,
  getStringNotes,
  notesAreEqual,
} from "../../utility/noteFunctions";
import { FC } from "react";

export const ChordVisualizer: FC<{ chord: Chord; strings: NoteName[] }> = ({
  chord,
  strings,
}) => {
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

  const stringNotes = strings.map((string) =>
    getStringNotes({ name: string, sharp: false }, 12)
  );

  const chordNotes = getChordNotes(chord);

  const notesSubset = stringNotes.slice(5, 10);

  const frets = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className={"inline-grid mr-4"}>
      <h2>
        {chord.root.name}
        {chord.root.sharp ? "#" : ""}
      </h2>
      <div
        className={
          "inline-grid grid-cols-[auto_1fr] gap-2 place-items-center min-h-[500px] min-w-64"
        }
      >
        <div className={"grid h-full items-center text-end"}>
          {frets.map((fret) => (
            <p>{fret}</p>
          ))}
        </div>
        <div
          className={
            "grid place-items-center h-full w-full rounded-xl border-4 border-gray-900 bg-orange-200"
          }
        >
          {frets.map((fret, fretIndex) => (
            <>
              <div
                className={
                  "flex h-full w-full justify-around border-2 border-gray-900 relative items-center"
                }
              >
                {strings.map((string: NoteName, index) => {
                  const currentNote = stringNotes[index][fretIndex];

                  return (
                    <div
                      className={
                        "w-2 h-full bg-gray-900 relative grid place-items-center"
                      }
                    >
                      {chordNotes.some((chordNote) =>
                        notesAreEqual(chordNote, currentNote)
                      ) && (
                        <div
                          className={`w-7 h-7 grid place-items-center bg-gray-900 rounded-full absolute ${
                            notesAreEqual(currentNote, chord.root)
                              ? "bg-green-700"
                              : ""
                          }`}
                        >
                          <p className={`text-gray-50 text-center`}>
                            {currentNote.name}
                            {currentNote.sharp ? "#" : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
