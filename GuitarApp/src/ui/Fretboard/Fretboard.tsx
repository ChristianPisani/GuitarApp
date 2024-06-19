import { FC, useContext, useState } from 'react'
import { FretboardContext } from './FretboardContext'
import {
  allNotes,
  getNote,
  getScaleChromaticScaleIndexes,
  getScaleDegree,
  getStringNotes,
  noteDegreeClasses,
  noteToString,
} from '../../utility/noteFunctions'
import { Note } from '../../types/musical-terms'
import { acousticGuitar } from '../../utility/instruments'
import { standardTuningNotes } from '../../data/tunings'

export const Fret = ({ note }: { note: Note }) => {
  const { selectedNote, setSelectedNote, selectedScale } =
    useContext(FretboardContext)

  return (
    <div className="fret">
      <FretboardNote note={note} open={false} />
    </div>
  )
}

export const FretboardNote: FC<{ note: Note; open: boolean }> = ({
  note,
  open,
}) => {
  const { selectedNote, setSelectedNote, selectedScale } =
    useContext(FretboardContext)

  const scaleDegree = getScaleDegree(selectedNote, note, selectedScale, 1)

  const activeNotes = getScaleChromaticScaleIndexes(
    selectedNote,
    selectedScale,
    1
  )

  const highLighted = activeNotes.includes(allNotes.indexOf(note))

  return (
    <div
      className={`note ${highLighted && 'active'} ${open && 'open'} ${
        noteDegreeClasses[scaleDegree]
      }`}
      onClick={() => {
        const noteName = noteToString(note)

        acousticGuitar.triggerAttackRelease(noteName + note.pitch, '4n')
      }}
    >
      {highLighted && (
        <p className={'font-bold'}>
          {note.name}
          {note.sharp ? '#' : ''}
        </p>
      )}
      {open && !highLighted && <p className={'font-bold text-2xl'}>X</p>}
    </div>
  )
}

export const String = ({
  startingNote,
  startIndex,
  numberOfNotes,
}: {
  startingNote: Note
  startIndex: number
  numberOfNotes: number
}) => {
  const stringNotes = getStringNotes(startingNote, numberOfNotes)

  return (
    <div className="string">
      {stringNotes.splice(startIndex).map((note, index) => (
        <Fret note={note} key={index}></Fret>
      ))}
    </div>
  )
}

export const FretBoard = (props: any) => {
  const basePitch = 2
  const notes = standardTuningNotes(basePitch)

  return (
    <div className="fretboard-container">
      <div className={'h-full grid place-items-stretch'}>
        {notes.map((note, index) => (
          <div className={'grid w-16 place-items-center'} key={index}>
            <FretboardNote note={note} open={true} />
          </div>
        ))}
      </div>
      <div className="fretboard">
        {notes.map((note, index) => (
          <String
            startIndex={1}
            startingNote={note}
            numberOfNotes={26}
            key={index * 200}
          />
        ))}
      </div>
    </div>
  )
}
