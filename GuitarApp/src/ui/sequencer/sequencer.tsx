import { Transport } from "tone";
import {
  createRef,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Tone from "tone";
import { Chord, Note, Scale } from "../../types/musical-terms";
import { ChordVisualizer } from "../chord/chord";
import { standardTuningNotes } from "../../data/tunings";
import {
  getScaleChord,
  notesAreEqual,
  noteToString,
} from "../../utility/noteFunctions";
import { playChord, playNotes } from "../../utility/instrumentFunctions";
import { acousticGuitar } from "../../utility/instruments";
import { ScalePicker } from "../scale-picker/scale-picker";
import { availableScales } from "../../data/scales";
import { getChordName, ScaleDegree } from "../../data/chords";
import { FretboardContext } from "../Fretboard/FretboardContext";
import { FretboardNote } from "../Fretboard/Fretboard";

type SequencerBeat = {
  chord: Chord | undefined;
  notes?: Note[][];
};

export const Sequencer = () => {
  const [amountOfBeats, setAmountOfBeats] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState<SequencerBeat[]>([]);
  const [bpm, setBpm] = useState(120);
  const [currentChord, setCurrentChord] = useState<Chord | undefined>(
    undefined
  );

  const beatSplit = 4;

  const startBeat = async () => {
    setIsPlaying(true);

    await Tone.start();
    Transport.start();
  };

  const stopBeat = () => {
    setIsPlaying(false);
    Transport.stop();
  };

  const onBeat = (beat: number) => {
    const beatChord = beats[Math.floor(beat / beatSplit)].chord;

    if (beatChord && beat % beatSplit === 0) {
      setCurrentChord(beatChord);
      // playChord(acousticGuitar, beatChord, 0.05);
    }
  };

  useEffect(() => {
    if (isPlaying) onBeat(currentBeat);
  }, [currentBeat]);

  useEffect(() => {
    const repeatEventId = Transport.scheduleRepeat((time) => {
      setCurrentBeat((c) => (c + 1) % (amountOfBeats * beatSplit));
    }, `${beatSplit}n`);

    return () => {
      Transport.clear(repeatEventId);
    };
  }, [amountOfBeats, bpm]);

  useEffect(() => {
    const beatsInit = [];
    for (let i = 0; i < amountOfBeats; i++) {
      beatsInit.push({ chord: undefined });
    }
    setBeats(beatsInit);
  }, [amountOfBeats]);

  useEffect(() => {
    Transport.bpm.value = bpm;
  }, [bpm]);

  return (
    <div
      className={
        "bg-gray-900 text-gray-50 p-16 rounded-2xl flex flex-col gap-8"
      }
    >
      <div className={"flex gap-16"}>
        <div className={"flex gap-8 place-items-center"}>
          <p className={"text-2xl"}>Amount of beats:</p>
          <input
            type={"number"}
            min={1}
            max={32}
            step={1}
            value={amountOfBeats}
            inputMode={"numeric"}
            className={"bg-gray-100 px-4 py-2 text-gray-800 rounded"}
            onChange={(e) => setAmountOfBeats(Number(e.target.value))}
          />
        </div>{" "}
        <div className={"flex gap-8 place-items-center"}>
          <p className={"text-2xl"}>BPM:</p>
          <input
            type={"number"}
            min={10}
            max={420}
            step={1}
            value={bpm}
            inputMode={"numeric"}
            className={"bg-gray-100 px-4 py-2 text-gray-800 rounded"}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </div>
      </div>
      <div className={"flex gap-8"}>
        {isPlaying ? (
          <button
            className={"rounded-full bg-blue-600 px-8 py-4 hover:bg-blue-400"}
            onClick={() => stopBeat()}
          >
            Stop
          </button>
        ) : (
          <button
            className={"rounded-full bg-green-600 px-8 py-4 hover:bg-green-400"}
            onClick={() => startBeat()}
          >
            Start
          </button>
        )}
        <h2>
          Current beat: {Math.floor(currentBeat / beatSplit) + 1} ({currentBeat}
          )
        </h2>
      </div>

      <div className={`flex gap-2 place-items-center flex-wrap`}>
        {beats.map((beat, index) => {
          const beatChord = beats[index]?.chord;

          const beatSplitArr = [];
          for (let i = 0; i < beatSplit; i++) {
            beatSplitArr.push(i);
          }

          return (
            <div className={"flex flex-col gap-8"}>
              <div className={"flex justify-around gap-8"}>
                {beatSplitArr.map((beatSplitIndex) => {
                  return (
                    <div
                      className={`w-4 h-4 bg-gray-200 rounded grid place-items-center text-gray-800 text-2xl font-bold transition-all ease-in-out ${
                        currentBeat === index * beatSplit + beatSplitIndex
                          ? "outline-4 outline outline-gray-200"
                          : ""
                      } ${
                        beatSplitIndex === 0
                          ? "bg-green-200 outline-green-200 outline-8"
                          : ""
                      }`}
                    ></div>
                  );
                })}
              </div>

              <Beat
                onSelectChord={(chord: Chord) => {
                  const beatsCopy = [...beats];
                  beatsCopy[index].chord = chord;
                  setBeats(beatsCopy);
                }}
                beatChord={beatChord}
                currentBeat={currentBeat}
                beatIndex={index}
                beatSplit={beatSplit}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export type StringNote = {
  note: Note;
  stringIndex: number;
};

const Beat: FC<{
  onSelectChord: (chord: Chord) => void;
  beatChord: Chord | undefined;
  currentBeat: number;
  beatIndex: number;
  beatSplit: number;
}> = ({ onSelectChord, beatChord, currentBeat, beatSplit, beatIndex }) => {
  const beatsFill = [];
  for (let i = 0; i < beatSplit; i++) {
    beatsFill.push({ notes: [] });
  }

  const [beats, setBeats] = useState<{ notes: StringNote[] }[]>(beatsFill);
  const [activeBeat, setActiveBeat] = useState(0);

  useEffect(() => {
    if (
      currentBeat >= beatIndex * beatSplit &&
      currentBeat < beatIndex * beatSplit + beatSplit
    ) {
      playNotes(
        acousticGuitar,
        beats[currentBeat % beatSplit].notes.map((beatNote) => beatNote.note),
        0.025,
        0.2
      );
    }
  }, [currentBeat]);

  return (
    <>
      <BeatCustomizer onSelectChord={onSelectChord}>
        <div className={`flex flex-col gap-8`}>
          <div
            className={`${
              currentBeat >= beatIndex * beatSplit &&
              currentBeat + beatSplit > beatIndex * beatSplit &&
              currentBeat - beatSplit < beatIndex * beatSplit
                ? "outline-4 outline outline-gray-200"
                : ""
            }\`}`}
          >
            <ChordVisualizer
              chord={beatChord}
              strings={standardTuningNotes(2).reverse()}
              showNoteIndex={true}
              selectedNotes={beats[activeBeat].notes}
              onClickNote={(note: Note, stringIndex: number) => {
                const foundNote = beats[activeBeat].notes.find(
                  (string) =>
                    notesAreEqual(string.note, note) &&
                    string.stringIndex === stringIndex
                );
                const foundNoteOnSameString = beats[activeBeat].notes.find(
                  (string) => string.stringIndex === stringIndex
                );

                const onSameString = foundNote?.stringIndex === stringIndex;

                if (
                  foundNoteOnSameString &&
                  !notesAreEqual(foundNoteOnSameString.note, note)
                ) {
                  const sameStringIndex = beats[activeBeat].notes.indexOf(
                    foundNoteOnSameString
                  );
                  beats[activeBeat].notes.splice(sameStringIndex, 1);
                  beats[activeBeat].notes.push({ note, stringIndex });
                } else if (foundNote) {
                  const foundIndex = beats[activeBeat].notes.indexOf(foundNote);

                  beats[activeBeat].notes.splice(foundIndex, 1);
                } else {
                  beats[activeBeat].notes.push({ note, stringIndex });
                }

                beats[activeBeat].notes.sort(
                  (a, b) => a.stringIndex - b.stringIndex
                );
                setBeats([...beats]);
                playNotes(acousticGuitar, [note]);
              }}
            ></ChordVisualizer>
            {beatChord && <p>{getChordName(beatChord)}</p>}
          </div>

          <div className={"flex gap-2 justify-around"}>
            {beats.map((beat, index) => (
              <div className={"grid flex-1"}>
                <div
                  className={`flex flex-col place-items-center min-h-64 bg-gray-300 rounded flex-grow ${
                    activeBeat === index
                      ? "outline outline-2 outline-gray-50"
                      : ""
                  } ${
                    currentBeat + beatIndex ===
                    index + beatIndex * (beatSplit + 1)
                      ? "bg-green-200"
                      : ""
                  }`}
                  onClick={() => setActiveBeat(index)}
                >
                  {beat.notes.map((note) => (
                    <div className={"flex justify-center min-h-8"}>
                      <p
                        className={
                          "bg-gray-900 rounded-full w-8 h-8 grid place-items-center"
                        }
                      >
                        {noteToString(note.note)}
                      </p>
                    </div>
                  ))}
                </div>
                <p>{beatIndex * beatSplit + index}</p>
              </div>
            ))}
          </div>
        </div>
      </BeatCustomizer>
    </>
  );
};

const BeatCustomizer: FC<{
  children: ReactNode;
  onSelectChord: (chord: Chord) => void;
}> = ({ children, onSelectChord }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState<Scale>(availableScales[0]);
  const [chordLength, setChordLength] = useState(3);

  const fretBoardContext = useContext(FretboardContext);

  const availableChords: Chord[] = [];

  for (let i = 0; i < selectedScale.intervals.length - 1; i++) {
    availableChords.push(
      getScaleChord(
        fretBoardContext.selectedNote,
        selectedScale,
        i,
        chordLength
      )
    );
  }

  return (
    <div className={"relative grid place-items-center gap-8"}>
      <div>{children}</div>
      {isOpen ||
        (!isOpen && (
          <div
            className={
              "bottom-20 bg-gray-50 text-gray-800 p-8 rounded-2xl gap-8 grid"
            }
          >
            <ScalePicker onChange={setSelectedScale} />
            <select
              onChange={(e) => {
                setChordLength(Number(e.target.value));
              }}
              className={"p-3 bg-gray-100 border-gray-900 border-2 self-center"}
            >
              <option value={2}>Power chord</option>
              <option value={3}>Triad</option>
              <option value={4}>7th chord</option>
              <option value={5}>9th chord</option>
            </select>

            <select
              onChange={(e) => {
                const selectedChord = availableChords[Number(e.target.value)];
                onSelectChord(selectedChord);
              }}
              className={"p-3 bg-gray-100 border-gray-900 border-2 self-center"}
            >
              <option value={-1}>None</option>
              {availableChords?.map((chord, index) => {
                return <option value={index}>{getChordName(chord)}</option>;
              })}
            </select>
          </div>
        ))}
    </div>
  );
};
