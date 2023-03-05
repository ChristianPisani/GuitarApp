import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FretBoard } from "../ui/Fretboard/Fretboard";
import { HomePage } from "./Home";
import { FretboardVisualization } from "./FretboardVisualization";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="visualizer" element={<FretboardVisualization />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};