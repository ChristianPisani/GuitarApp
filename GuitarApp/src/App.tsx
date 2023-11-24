import { useState } from "react";
import "./scss/index.ts";
import "./App.scss";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const [count, setCount] = useState(0);

  return <AppRoutes></AppRoutes>;
}

export default App;
