import "./sequencer-ui.scss";
import { FC } from "react";

export const SequencerUi = () => {
  return (
    <div
      className={
        "w-full min-h-[500px] bg-secondary-950 max-w-[1200px] rounded-3xl grid grid-cols-[2fr_5fr] p-2 gap-2"
      }
    >
      <div className={"bg-primary-50 rounded-r-lg rounded-l-2xl"}>
        <div className={""}></div>
        <div className={""}></div>
      </div>
      <div className={"grid grid-rows-[2fr_1fr_4fr] gap-8"}>
        <div className={"bg-primary-50 rounded-lg rounded-tr-2xl px-8 py-7"}>
          <h2>The wonderful sequencer!</h2>
          <p>Visualize the guitar fretboard in relation to music theory</p>
        </div>
        <div className={""}></div>
        <div className={"bg-primary-50 rounded-lg rounded-br-2xl"}></div>
      </div>
    </div>
  );
};
