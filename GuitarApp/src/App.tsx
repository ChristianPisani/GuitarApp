import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import {
  FretBoard
} from "./ui/Fretboard/Fretboard";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <FretBoard></FretBoard>
    </div>
  )
}

export default App
