import './sequencer-ui.scss'
import { Button } from '../button/button'
import { InputWrapper, NumberInput, Select } from '../input/inputs'
import {
  allNotes,
  getScaleChord,
  noteToString,
} from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'
import { ChordVisualizerFullChord } from '../chord/chord'
import { standardTuningNotes } from '../../data/tunings'
import { BeatChord } from './beat-chord'
import { ChordsEditor } from './chords-editor'
import { useContext } from 'react'
import { MusicContext } from '../../context/app-context'
import { getChordName } from '../../data/chords'

export const SequencerUi = () => {
  const beats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  const { selectedBeat, state, setState } = useContext(MusicContext)

  const selectedChord = getScaleChord(
    allNotes[0],
    availableScales[0],
    selectedBeat?.scaleDegree ?? 0,
    3
  )

  return (
    <div
      className={`grid min-h-[500px] w-full max-w-[1600px] grid-cols-[2fr_5fr] gap-2 rounded-3xl
        bg-secondary-950 p-2`}
    >
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
      <div
        className={
          'flex flex-col justify-between gap-4 max-w-full overflow-hidden'
        }
      >
        <div
          className={
            'flex flex-col justify-center rounded-lg rounded-tr-2xl bg-primary-50 px-8 py-7'
          }
        >
          <h2>The wonderful sequencer!</h2>
          <p>Visualize the guitar fretboard in relation to music theory</p>
        </div>
        <ChordsEditor />
        <div
          className={`flex flex-col place-items-start gap-8 rounded-lg rounded-br-2xl bg-primary-50
            p-8`}
        >
          <div className={'flex gap-4'}>
            <Button
              text={'Play'}
              id={'play-button'}
              icon={<p>Needs icon</p>}
            ></Button>
            <NumberInput
              value={130}
              label={'BPM'}
              id={'bpm-input'}
            ></NumberInput>
          </div>
          <div className={'flex gap-4'}>
            <Select
              label={'Root note'}
              id={'root-note-select'}
              options={allNotes.map(note => noteToString(note))}
            />
            <Select
              label={'Scale'}
              id={'scale-select'}
              options={availableScales.map(scale => scale.name)}
            />

            <Select
              label={'Mode'}
              id={'mode-select'}
              options={['1st', '2nd', '3rd', '4th', '5th', '6th', '7th']}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
