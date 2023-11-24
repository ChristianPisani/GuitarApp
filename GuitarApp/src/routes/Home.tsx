import React from "react";
import { Link } from "react-router-dom";
import { ChillGuitarDudeSVG } from "../assets/svg/ChillGuitarDude";
import { BackgroundBlobSVG } from "../assets/svg/BackgroundBlobSVG";

export const HomePage = () => {
  return (
    <div className={"home-container"}>
      <ol>
        <li><Link className={"button"} to={"/visualizer"}>Visialize fretboard</Link></li>
        <li><Link className={"button"} to={"/memorize"}>Memorize fretboard</Link></li>
        <li><Link className={"button"} to={"/info"}>Info</Link></li>
      </ol>
      <div className={"guitar-dude-container"}>
        <BackgroundBlobSVG></BackgroundBlobSVG>
        <ChillGuitarDudeSVG class={"guitar-dude"}></ChillGuitarDudeSVG>
      </div>
    </div>
  );
};