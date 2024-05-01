import './sequencer-ui.scss'
import { PlayArrow, PlayArrowOutlined } from '@material-ui/icons'
import { Button } from '../button/button'
import { NumberInput, Select } from '../input/inputs'
import { allNotes, noteToString } from '../../utility/noteFunctions'
import { availableScales } from '../../data/scales'

export const SequencerUi = () => {
  const beats = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

  return (
    <div
      className={
        'grid min-h-[500px] w-full max-w-[1200px] grid-cols-[2fr_5fr] gap-2 rounded-3xl bg-secondary-950 p-2'
      }
    >
      <div
        className={
          'grid grid-rows-[auto_auto] rounded-l-2xl rounded-r-lg bg-primary-50 p-8'
        }
      >
        <div className={''}></div>
        <div className={'flex flex-col justify-end'}>
          <div className={'flex gap-4'}>
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
      <div className={'grid grid-rows-[2fr_1fr_4fr] gap-8'}>
        <div
          className={
            'flex flex-col justify-center rounded-lg rounded-tr-2xl bg-primary-50 px-8 py-4'
          }
        >
          <h2>The wonderful sequencer!</h2>
          <p>Visualize the guitar fretboard in relation to music theory</p>
        </div>
        <div className={''}></div>
        <div
          className={
            'flex flex-col place-items-start gap-8 rounded-lg rounded-br-2xl bg-primary-50 p-8'
          }
        >
          <div className={'grid w-full grid-cols-8 justify-between gap-4'}>
            <p
              className={
                'col-span-8 text-center text-xs font-bold text-secondary-950'
              }
            >
              Play
            </p>

            {beats.map(beat => (
              <div
                className={
                  'shadow-accent h-12 w-12 rounded border-2 border-secondary-950 bg-transparent'
                }
              />
            ))}
          </div>
          <div className={'flex gap-4'}>
            <Button
              text={'Play'}
              id={'play-button'}
              icon={<PlayArrowOutlined fontSize={'large'} />}
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
