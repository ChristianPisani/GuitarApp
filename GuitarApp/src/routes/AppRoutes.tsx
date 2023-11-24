import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./Home";
import { FretboardVisualization } from "./fretboard-visualization/FretboardVisualization";
import {
  InfoSections
} from "./info-sections/InfoSections";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="visualizer" element={<FretboardVisualization />} />
          <Route path={"info"} element={<InfoSections/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};