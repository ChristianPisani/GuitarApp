import { FretBoard } from "../../ui/Fretboard/Fretboard";
import "./fretboard-visualization.scss";

const Settings = () => (
  <div className={"settings"}>
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
);

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
  return (
    <main className={"main"}>
      <SideBar />
      <div className={"content"}>
        <Settings></Settings>
        <div className={"main-content"}>
          <FretBoard />
        </div>
      </div>
    </main>
  );
};
