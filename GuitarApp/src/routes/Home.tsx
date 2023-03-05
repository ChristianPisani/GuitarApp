import React
  from "react";
import {
  Link
} from "react-router-dom";

export const HomePage = () => {
  return (
    <ol>
      <Link to={"/visualizer"}>Visialize fretboard</Link>
    </ol>
  )
}