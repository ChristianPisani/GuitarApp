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
import { Chord, Scale } from "../../types/musical-terms";
import { ChordVisualizer } from "../chord/chord";
import { standardTuningNotes } from "../../data/tunings";
import { getScaleChord, noteToString } from "../../utility/noteFunctions";
import { playChord } from "../../utility/instrumentFunctions";
import { acousticGuitar } from "../../utility/instruments";
import { ScalePicker } from "../scale-picker/scale-picker";
import { availableScales } from "../../data/scales";
import { getChordName, ScaleDegree } from "../../data/chords";
import { FretboardContext } from "../Fretboard/FretboardContext";

type SequencerBeat = {
  chord: Chord | undefined;
};

export const Sequencer = () => {
  const [amountOfBeats, setAmountOfBeats] = useState(32);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beats, setBeats] = useState<SequencerBeat[]>([]);
  const [bpm, setBpm] = useState(120);
  const [currentChord, setCurrentChord] = useState<Chord | undefined>(
    undefined
  );

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
    const beatChord = beats[beat].chord;

    if (beatChord) {
      setCurrentChord(beats[beat].chord);
      playChord(acousticGuitar, beatChord, 0.01);
    }
  };

  useEffect(() => {
    if (isPlaying) onBeat(currentBeat);
  }, [currentBeat]);

  useEffect(() => {
    const repeatEventId = Transport.scheduleRepeat((time) => {
      setCurrentBeat((c) => (c + 1) % amountOfBeats);
    }, "8n");

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
            min={4}
            max={32}
            step={4}
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
      <div>
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
      </div>

      <ChordVisualizer
        chord={
          currentChord ?? {
            intervals: [1, 3, 5],
            root: { name: "E", sharp: false, pitch: 2 },
          }
        }
        strings={standardTuningNotes(2)}
        showNoteIndex={true}
      ></ChordVisualizer>

      <div className={`flex gap-2 place-items-center`}>
        {beats.map((beat, index) => {
          const beatChord = beats[index]?.chord;

          return (
            <BeatCustomizer
              onSelectChord={(chord: Chord) => {
                console.log("Seleceted chord", chord);
                const beatsCopy = [...beats];
                beatsCopy[index].chord = chord;
                setBeats(beatsCopy);
              }}
            >
              <div
                className={`w-16 h-16 bg-gray-200 rounded grid place-items-center text-gray-800 text-2xl font-bold ${
                  currentBeat === index
                    ? "outline-4 outline outline-gray-200"
                    : ""
                } ${index % 4 === 0 ? "bg-green-200 outline-green-200" : ""}`}
              >
                {beatChord ? noteToString(beatChord.root) : ""}
              </div>
            </BeatCustomizer>
          );
        })}
      </div>
    </div>
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
    <div className={"relative grid place-items-center"}>
      <button onClick={() => setIsOpen(!isOpen)}>{children}</button>
      {isOpen && (
        <div
          className={
            "absolute bottom-20 bg-gray-50 text-gray-800 p-8 rounded-2xl gap-8 grid"
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
      )}
    </div>
  );
};
