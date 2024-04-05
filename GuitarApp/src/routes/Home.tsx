import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className={"home-container"}>
      <ol>
        <li>
          <Link className={"button"} to={"/visualizer"}>
            Visualize fretboard
          </Link>
        </li>
        <li>
          <Link className={"button"} to={"/memorize"}>
            Memorize fretboard
          </Link>
        </li>
        <li>
          <Link className={"button"} to={"/articles/"}>
            Articles
          </Link>
        </li>
      </ol>
    </div>
  );
};
