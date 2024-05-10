import { getChordName } from '../../data/chords'
import { ChordVisualizerFullChord } from '../chord/chord'
import { standardTuningNotes } from '../../data/tunings'
import {
  Add,
  AddCircleOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  RemoveCircleOutline,
} from '@mui/icons-material'
import { NumberInput, Select } from '../input/inputs'
import { useContext, useState } from 'react'
import { MusicContext } from '../../context/app-context'
import { allNotes, getScaleChord } from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'

export const InstrumentEditor = () => {
  const { selectedBeat, state, setState, beats, setBeats } =
    useContext(MusicContext)

  const maxSubdivisions = 8

  const [selectedSubdivision, setSelectedSubdivision] = useState(0)

  const currentAmountOfSubdivisions = selectedBeat?.subdivisions.length ?? 1

  const selectedChord = getScaleChord(
    allNotes[0],
    availableScales[0],
    selectedBeat?.scaleDegree ?? 0,
    3
  )

  const removeSubdivision = () => {
    if (!selectedBeat || currentAmountOfSubdivisions <= 1) return

    if (selectedSubdivision >= currentAmountOfSubdivisions - 1) {
      setSelectedSubdivision(currentAmountOfSubdivisions - 2)
    }

    const beatIndex = beats.findIndex(b => b.id === selectedBeat.id)
    beats[beatIndex].subdivisions.splice(-1, 1)
    setBeats([...beats])
  }

  const addSubdivision = () => {
    if (!selectedBeat || currentAmountOfSubdivisions >= maxSubdivisions) return

    const beatIndex = beats.findIndex(b => b.id === selectedBeat.id)
    beats[beatIndex].subdivisions.push({ noteIndexes: [] })
    setBeats([...beats])
  }

  const gotoNextSubdivision = () => {
    setSelectedSubdivision(
      Math.min(currentAmountOfSubdivisions - 1, selectedSubdivision + 1)
    )
  }
  const gotoPreviousSubdivision = () => {
    setSelectedSubdivision(Math.max(0, selectedSubdivision - 1))
  }

  return (
    <div
      className={
        'grid grid-rows-[1fr_auto] gap-8 rounded-l-2xl rounded-r-lg bg-primary-50'
      }
    >
      <div
        className={`flex w-full flex-col place-items-center justify-center rounded-3xl p-8 shadow-xl
          gap-4`}
      >
        <h2>{getChordName(selectedChord)}</h2>
        <ChordVisualizerFullChord
          chord={selectedChord}
          strings={standardTuningNotes().reverse()}
          showNoteIndex={true}
        />
        <div className={'flex gap-4'}>
          <h3>Subdivisions</h3>
          <div className={'flex gap-2'}>
            <button onClick={removeSubdivision}>
              <RemoveCircleOutline />
            </button>
            <button onClick={addSubdivision}>
              <AddCircleOutlined />
            </button>
          </div>
        </div>
        <div className={'flex place-items-center'}>
          <button onClick={gotoPreviousSubdivision}>
            <ChevronLeftRounded />
          </button>
          <p className={'font-extrabold'}>
            {selectedSubdivision + 1}/{currentAmountOfSubdivisions}
          </p>
          <button onClick={gotoNextSubdivision}>
            <ChevronRightRounded />
          </button>
        </div>
      </div>
      <div className={'flex flex-col justify-end gap-8 p-8'}>
        <div className={'grid grid-cols-2 place-items-center gap-4'}>
          <NumberInput
            label={'Amount of divisions'}
            id={'divisions-input'}
            value={4}
          ></NumberInput>
          <Select
            options={['CAGED', '3NPS']}
            label={'Visualization technique'}
            id={'visualization-select'}
          />
        </div>
      </div>
    </div>
  )
}
