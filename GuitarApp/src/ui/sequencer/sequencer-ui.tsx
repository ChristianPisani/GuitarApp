import './sequencer-ui.scss'
import { Button } from '../button/button'
import { NumberInput, Select } from '../input/inputs'
import {
  allNotes,
  getScaleChord,
  noteToString,
} from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'
import { ChordsEditor } from './chords-editor'
import { ChangeEvent, FormEvent, useContext } from 'react'
import { MusicContext } from '../../context/app-context'
import { InstrumentEditor } from './instrument-editor'
import { PlayArrowOutlined, StopOutlined } from '@mui/icons-material'
import { NotePicker } from '../note-picker/note-picker'
import { ScalePicker } from '../scale-picker/scale-picker'

export const SequencerUi = () => {
  const beats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  const {
    selectedBeat,
    state,
    setState,
    setSelectedNote,
    selectedNote,
    selectedScale,
    setSelectedScale,
  } = useContext(MusicContext)

  return (
    <div
      className={`grid min-h-[500px] w-full max-w-[1600px] grid-cols-[2fr_5fr] gap-2 rounded-3xl
        bg-secondary-950 p-2`}
    >
      <InstrumentEditor />
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
            {state !== 'playing' && (
              <Button
                onClick={() => {
                  setState('playing')
                }}
                text={'Play'}
                id={'play-button'}
                icon={<PlayArrowOutlined />}
              ></Button>
            )}
            {state === 'playing' && (
              <Button
                onClick={() => {
                  setState('editing')
                }}
                text={'Stop'}
                id={'stop-button'}
                icon={<StopOutlined />}
              ></Button>
            )}
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
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const note = allNotes[Number(e.target.value)]
                if (note) setSelectedNote(note)
              }}
              options={allNotes.map((note, index) => ({
                key: noteToString(note),
                value: index.toString(),
              }))}
            />
            <Select
              label={'Scale'}
              id={'scale-select'}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                const scale = availableScales[Number(e.target.value)]
                if (scale) setSelectedScale(scale)
              }}
              options={availableScales.map((scale, index) => ({
                key: scale.name,
                value: index.toString(),
              }))}
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
