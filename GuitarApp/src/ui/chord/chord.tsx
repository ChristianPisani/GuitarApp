import {
  Chord,
  Mode,
  Note,
  NoteName,
  Scale,
  StringNote,
} from '../../types/musical-terms'
import {
  chromaticScale,
  getChordNotes,
  getScaleChord,
  getScaleDegree,
  getStringNotes,
  notesAreEqual,
  noteToString,
  stringNotesAreEqual,
} from '../../utility/noteFunctions'
import { Component, FC, JSX, ReactNode, useContext, useState } from 'react'
import {
  getChordName,
  ScaleDegree,
  scaleDegreeNotations,
} from '../../data/chords'
import { standardTuningNotes } from '../../data/tunings'
import { acousticGuitar } from '../../utility/instruments'
import { playChord, playNotes } from '../../utility/instrumentFunctions'
import { Toggle } from '../toggle/toggle'
import { MusicContext } from '../../context/app-context'
import { AnimatedString } from '../animated-string/animated-string'

export type ChordDegreeVisualizerProps = {
  degrees: ScaleDegree[]
  scale: Scale
  mode: Mode
  note: Note
}

export const ChordDegreeVisualizer: FC<ChordDegreeVisualizerProps> = ({
  degrees,
  scale,
  mode,
  note,
}) => {
  type ChordType = 'power' | 'triad' | '7th' | '9th'
  const [chordType, setChordType] = useState<ChordType>('triad')
  const [showNoteIndex, setShowNoteIndex] = useState(true) // TODO: Move this into context??

  const chordTypeIndexes = {
    power: 2,
    triad: 3,
    '7th': 4,
    '9th': 5,
  }

  return (
    <div className={'flex max-w-[99svw] flex-col p-4 md:p-8'}>
      <div className={'my-8 flex flex-col gap-8 md:flex-row'}>
        <Toggle
          onChange={() => setShowNoteIndex(!showNoteIndex)}
          value={showNoteIndex}
          text={'Show note index'}
        />
        <select
          className={
            'border-2 border-gray-900 bg-gray-50 p-2 text-xl font-bold'
          }
          value={chordType}
          onChange={e => setChordType(e.target.value as ChordType)}
        >
          <option value={'power'}>Power chords</option>
          <option value={'triad'}>Triads</option>
          <option value={'7th'}>7th chords</option>
          <option value={'9th'}>9th chords</option>
        </select>
      </div>

      <div className={'flex h-fit w-full gap-8 overflow-x-auto'}>
        {degrees.map((degree, index) => {
          const chord = getScaleChord(note, scale, mode, degree, degrees)

          const chordName = getChordName(chord)
          const isMajor = chordName.includes('Major')
          const isDiminished = chordName.includes('Diminished')
          const isAugmented = chordName.includes('Augmented')

          const notation = scaleDegreeNotations((degree + 1) as ScaleDegree)

          return (
            <div className={'inline-grid place-items-center gap-4'} key={index}>
              <p className={'text-xl font-bold'}>
                {isAugmented ? '+' : ''}
                {isMajor ? notation : notation.toLowerCase()}
                {isDiminished ? '°' : ''}
              </p>
              <h2>{getChordName(chord)}</h2>
              <ChordVisualizerFullChord
                chord={chord}
                strings={standardTuningNotes()}
                showNoteIndex={showNoteIndex}
                onClickNote={(note: Note) => playNotes(acousticGuitar, [note])}
              />
              <button
                onClick={() => {
                  playChord(acousticGuitar, chord, 0.025, 1)
                }}
              >
                Play chord
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChordNoteComponent: FC<{
  currentNote: Note
  chord: Chord | undefined
  chordNotes: StringNote[]
  showNoteIndex: boolean
  stringIndex: number
  fallBack: ReactNode | null
  onClick?: (note: Note) => void
  selected?: boolean
  careAboutStringIndex: boolean
  onionSkinned?: boolean
}> = ({
  currentNote,
  chordNotes,
  chord,
  showNoteIndex,
  fallBack,
  onClick,
  selected = false,
  stringIndex,
  careAboutStringIndex = false,
  onionSkinned = false,
}) => {
  const fingerIndex =
    chord?.intervals.indexOf(
      getScaleDegree(chord.root, currentNote, chromaticScale, 1) + 1
    ) ?? 0

  const Wrapper = (props: { children?: ReactNode; className?: string }) =>
    onClick ? (
      <button className={props.className} onClick={() => onClick(currentNote)}>
        {props.children}
      </button>
    ) : (
      <p className={props.className}>{props.children}</p>
    )

  const currentChordNote = chordNotes.find(sn => sn.stringIndex === stringIndex)

  return (
    <div
      className={
        'grid w-full h-full place-items-center drop-shadow-[6px_0_4px_rgba(0,0,0,0.25)]'
      }
    >
      {(!careAboutStringIndex &&
        chordNotes.some(cn => notesAreEqual(cn.note, currentNote))) ||
      stringNotesAreEqual(currentChordNote, {
        note: currentNote,
        stringIndex,
      }) ? (
        <Wrapper
          className={`select-none text-center text-xl grid h-8 w-8 place-items-center rounded-full
            ${selected ? 'bg-amber-950 text-amber-100' : 'bg-amber-200'} ${
              !selected && onionSkinned ? 'bg-amber-500 text-amber-950' : ''
            }`}
        >
          {showNoteIndex ? `${fingerIndex + 1}` : noteToString(currentNote)}
        </Wrapper>
      ) : (
        fallBack
      )}
    </div>
  )
}

type ChordVizualiserProps = {
  chord: Chord | undefined
  strings: Note[]
  showNoteIndex: boolean
  onClickNote?: (note: Note, stringIndex: number) => void
  selectedNotes?: StringNote[]
  numberOfFrets?: number
  careAboutStringIndex?: boolean
}

export const ChordVisualizerFullChord: FC<ChordVizualiserProps> = ({
  chord,
  strings,
  showNoteIndex,
  onClickNote,
  selectedNotes,
  numberOfFrets = 13,
}) => {
  const chordNotes = getChordNotes(chord).map(chordNote => ({
    note: chordNote,
    stringIndex: -1,
  }))

  return (
    <ChordVisualizerCustomChord
      chord={chord}
      strings={strings}
      chordNotes={chordNotes}
      showNoteIndex={showNoteIndex}
      onClickNote={onClickNote}
      selectedNotes={selectedNotes}
      numberOfFrets={numberOfFrets}
    />
  )
}

export const ChordVisualizerCustomChord: FC<
  ChordVizualiserProps & { chordNotes: StringNote[] }
> = ({
  chord,
  strings,
  showNoteIndex,
  onClickNote,
  selectedNotes,
  chordNotes,
  numberOfFrets = 13,
  careAboutStringIndex = false,
}) => {
  const { currentBarIndex, bars } = useContext(MusicContext)
  const selectedBeat = bars[currentBarIndex]

  const frets = []

  for (let i = 0; i < numberOfFrets; i++) frets.push(i)

  const fretNoOpen = [...frets]
  fretNoOpen.splice(0, 1)

  const stringNotes = strings.map(stringNote =>
    getStringNotes(
      {
        name: stringNote.name,
        sharp: stringNote.sharp,
        pitch: stringNote.pitch,
        relativeIndex: 0,
      },
      numberOfFrets + 1
    )
  )

  const markedFrets: { [id: number]: boolean } = {
    3: true,
    5: true,
    7: true,
    9: true,
    12: true,
  }

  return (
    <div
      className={`inline-grid min-h-[500px] w-72 grid-cols-[auto_1fr_auto] place-items-center
        gap-2`}
    >
      <div className={'grid h-full items-center text-end'}>
        {frets.map(fret => (
          <p key={fret}>{fret}</p>
        ))}
      </div>

      <div className={'flex h-full w-full flex-col'}>
        <div
          className={'flex h-10 w-full items-center justify-around text-center'}
        >
          {strings.map((string, fretIndex) => {
            const currentNote = stringNotes[fretIndex][0]

            return (
              <ChordNoteComponent
                currentNote={currentNote}
                chord={chord}
                chordNotes={chordNotes}
                showNoteIndex={showNoteIndex}
                stringIndex={fretIndex}
                careAboutStringIndex={careAboutStringIndex}
                selected={selectedNotes?.some(
                  selectedNote =>
                    (selectedNote.stringIndex === -1 ||
                      selectedNote.stringIndex === fretIndex) &&
                    notesAreEqual(selectedNote.note, currentNote, false) &&
                    selectedNote.note.relativeIndex ===
                      currentNote.relativeIndex
                )}
                onionSkinned={selectedBeat?.beats
                  .flatMap(bar => bar.sections)
                  .flatMap(bar => bar.subdivisions)
                  .flatMap(subdivision => subdivision.notes)
                  ?.some(
                    selectedNote =>
                      notesAreEqual(
                        chordNotes[selectedNote.index]?.note,
                        currentNote,
                        false
                      ) &&
                      selectedNote.relativeIndex ===
                        currentNote.relativeIndex &&
                      fretIndex === selectedNote.string
                  )}
                fallBack={<h2 className={'select-none'}>X</h2>}
                key={fretIndex}
                onClick={
                  onClickNote
                    ? () => onClickNote(currentNote, fretIndex)
                    : undefined
                }
              />
            )
          })}
        </div>
        <div
          className={`relative rounded-4xl grid auto-rows-fr h-full w-full place-items-center
            overflow-hidden border-8 border-gray-900 bg-[#BA6210] z-0`}
        >
          <div className={'absolute inset-0 grid auto-rows-fr'}>
            {fretNoOpen.map(fret => (
              <div
                className={
                  'h-full w-full border-y-2 border-gray-950 flex justify-around items-center'
                }
              >
                {markedFrets[fret] && fret % 12 !== 0 && (
                  <div className={'h-4 w-4 rounded-full bg-primary-100'} />
                )}
                {markedFrets[fret] && fret % 12 === 0 && (
                  <>
                    <div className={'h-4 w-4 rounded-full bg-primary-100'} />
                    <div className={'h-4 w-4 rounded-full bg-primary-100'} />
                    <div className={'h-4 w-4 rounded-full bg-primary-100'} />
                  </>
                )}
              </div>
            ))}
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-around text-primary-50
              drop-shadow-[6px_0_4px_rgba(0,0,0,0.25)]`}
          >
            {strings.map((fret, stringIndex) => (
              <AnimatedString stringIndex={stringIndex} />
            ))}
          </div>
          {fretNoOpen.map((fret, fretIndex) => (
            <div
              className={'flex h-full w-full items-center justify-around z-10'}
              key={fretIndex}
            >
              {strings.map((string: Note, stringIndex) => {
                const currentNote = stringNotes[stringIndex][fret]

                return (
                  <ChordNoteComponent
                    currentNote={currentNote}
                    chordNotes={chordNotes}
                    chord={chord}
                    stringIndex={stringIndex}
                    showNoteIndex={showNoteIndex}
                    fallBack={null}
                    key={stringIndex}
                    careAboutStringIndex={careAboutStringIndex}
                    onClick={
                      onClickNote
                        ? () => onClickNote(currentNote, stringIndex)
                        : undefined
                    }
                    selected={selectedNotes?.some(
                      selectedNote =>
                        selectedNote.stringIndex === stringIndex &&
                        notesAreEqual(selectedNote.note, currentNote, false) &&
                        selectedNote.note.relativeIndex ===
                          currentNote.relativeIndex
                    )}
                    onionSkinned={selectedBeat?.beats
                      .flatMap(bar => bar.sections)
                      .flatMap(bar => bar.subdivisions)
                      .flatMap(subdivision => subdivision.notes)
                      ?.some(
                        selectedNote =>
                          notesAreEqual(
                            chordNotes[selectedNote.index]?.note,
                            currentNote,
                            false
                          ) &&
                          selectedNote.relativeIndex ===
                            currentNote.relativeIndex &&
                          stringIndex === selectedNote.string
                      )}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={'grid h-full items-center text-end py-2'}>
        {frets.map(fret => (
          <div
            className={`h-2 w-2 rounded-full ${!!markedFrets[fret] ? 'bg-secondary-950' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  )
}
