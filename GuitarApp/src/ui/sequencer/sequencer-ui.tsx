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
import { ChangeEvent, FC, ReactNode, useContext } from 'react'
import { MusicContext } from '../../context/app-context'
import { InstrumentEditor } from './instrument-editor'
import { PlayArrowOutlined, StopOutlined } from '@mui/icons-material'
import { Mode } from '../../types/musical-terms'
import { SequencerMode } from '../../routes/sequencer-page/sequencer-page'
import { Link } from 'react-router-dom'
import { ScalePicker } from '../scale-picker/scale-picker'

type SequencerUiProps = {
  children: ReactNode | ReactNode[]
  sequencerMode: SequencerMode
}

export const SequencerUi: FC<SequencerUiProps> = ({
  children,
  sequencerMode,
}) => {
  const {
    state,
    setState,
    setSelectedNote,
    setSelectedScale,
    selectedScale,
    setSelectedMode,
    bpm,
    setBpm,
  } = useContext(MusicContext)

  return (
    <div
      className={`grid min-h-[500px] w-full max-w-[1600px] grid-cols-[2fr_5fr] gap-2 rounded-3xl
        bg-secondary-950 p-2 border-8 border-secondary-500`}
    >
      <InstrumentEditor />
      <div
        className={
          'flex flex-col justify-between gap-4 max-w-full overflow-hidden'
        }
      >
        <div className={'flex gap-8 px-8 py-7 text-primary-100 items-center'}>
          <h2 className={'text-primary-100'}>Mode</h2>
          <Link
            to={'chords'}
            className={`text-2xl ${sequencerMode === 'Chords' && 'font-bold text-primary-50'}`}
          >
            Chords
          </Link>
          <Link
            to={'effects'}
            className={`text-2xl ${sequencerMode === 'Effects' && 'font-bold text-primary-50'}`}
          >
            Effects
          </Link>
        </div>
        {children}
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
                labelPlacement={'over'}
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
                labelPlacement={'over'}
              ></Button>
            )}
            <NumberInput
              value={bpm}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setBpm(Number(e.target.value))
              }
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
            <ScalePicker
              selectedScale={selectedScale}
              onChange={scale => {
                setSelectedScale(scale ?? availableScales[0])
              }}
            />

            <Select
              label={'Mode'}
              id={'mode-select'}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedMode(Number(e.target.value) as Mode)
              }
              options={[
                { key: '1st', value: '1' },
                { key: '2nd', value: '2' },
                { key: '3rd', value: '3' },
                { key: '4th', value: '4' },
                { key: '5th', value: '5' },
                { key: '6th', value: '6' },
                { key: '7th', value: '7' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
