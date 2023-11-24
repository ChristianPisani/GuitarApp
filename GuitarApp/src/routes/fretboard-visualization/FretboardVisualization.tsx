import { FretBoard } from "../../ui/Fretboard/Fretboard";

export const FretboardVisualization = () => {
  return (
    <div className={"container"}>
      <h1>Look at the fretboard, it's so nice!</h1>
      <p>
        Here you can spend some time getting to know the fretboard, and use it
        to visualize chords and scales on the guitar
      </p>

      <div className={"container grid-3"}>
        <div>
          <h2>Chords</h2>
          <select>
            <option>Major</option>
            <option>Minor</option>
          </select>
        </div>
        <div>
          <h2>Root</h2>
          <select>
            <option>A</option>
            <option>A#</option>
            <option>B</option>
            <option>B#</option>
            <option>C</option>
            <option>D</option>
            <option>D#</option>
            <option>E</option>
            <option>F</option>
            <option>F#</option>
            <option>G</option>
            <option>G#</option>
          </select>
        </div>
        <div>
          <h2>Mode</h2>
          <select>
            <option>Ionian (1st)</option>
            <option>Dorian (2nd)</option>
            <option>Phrygian (3rd)</option>
            <option>Lydian (4th)</option>
            <option>Mixolydian (5th)</option>
            <option>Aeolian (6th)</option>
            <option>Locrian (7th)</option>
          </select>
        </div>
      </div>

      <FretBoard />
    </div>
  );
};
