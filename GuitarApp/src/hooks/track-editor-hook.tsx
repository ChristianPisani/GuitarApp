import { ScaleDegree } from '../data/chords'
import { Note, Scale } from '../types/musical-terms'
import { useContext } from 'react'
import { Bar, MusicContext } from '../context/app-context'
import {
  getChordNotes,
  getScaleChord,
  notesAreEqual,
} from '../utility/noteFunctions'
import { playNotes } from '../utility/instrumentFunctions'

export const useTrackEditor = () => {
  const {
    bars,
    currentBarIndex,
    setCurrentBeatIndex,
    setBars,
    currentBeatIndex,
    updateBar,
    setCurrentSubdivisionIndex,
    selectedNote,
    instrument,
    selectedMode,
    selectedScale,
    currentSubdivisionIndex,
  } = useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex ?? 0]

  const removeBeat = (bar: Bar, beatIndex: number) => {
    bar.beats.splice(beatIndex, 1)
    if (bar.beats.length === 0) removeBar(bar)
    updateBar(bar)
  }

  const removeBar = (bar: Bar) => {
    const barIndex = bars.indexOf(bar)

    bars.splice(barIndex, 1)
    setBars([...bars])
  }

  const updateScaleDegree = (bar: Bar, newScaleDegree: ScaleDegree) => {
    if (!currentBeat) return
    currentBeat.scaleDegree = newScaleDegree
    updateBar(bar)
  }

  const updateScale = (bar: Bar, newScale: Scale | undefined) => {
    if (!currentBeat) return
    currentBeat.scale = newScale
    updateBar(bar)
  }

  const changeTimeSignature = (bar: Bar, timeSignature: number) => {
    if (!currentBeat) return

    bar.timeSignature = timeSignature
    updateBar(bar)
  }

  const goToNextBeat = () => {
    setCurrentBeatIndex(current => {
      if (current < currentBar.beats.length - 1) {
        return current + 1
      }
      return current
    })
  }
  const goToPreviousBeat = () => {
    setCurrentBeatIndex(current => {
      if (current > 0) {
        return current - 1
      }
      return current
    })
  }

  const gotoNextSubdivision = () => {
    setCurrentSubdivisionIndex(current => {
      if (current >= currentBar.timeSignature - 1) {
        goToNextBeat()
        if (currentBeatIndex < currentBar.beats.length - 1) {
          return 0
        }
        return current
      }
      return current + 1
    })
  }
  const gotoPreviousSubdivision = () => {
    setCurrentSubdivisionIndex(current => {
      if (current <= 0) {
        goToPreviousBeat()

        if (currentBeatIndex > 0) {
          return currentBar.timeSignature - 1
        }
        return current
      }
      return current - 1
    })
  }

  const changeSubdivision = (barIndex: number, subdivisionIndex: number) => {
    setCurrentSubdivisionIndex(subdivisionIndex)
    setCurrentBeatIndex(barIndex)
  }

  const toggleNote = (note: Note, stringIndex: number) => {
    if (!currentBar || !currentBeat) return

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        currentBeat?.scale ?? selectedScale,
        selectedMode,
        currentBeat?.scaleDegree ?? 1
      )
    )
    const chordIndex = chordNotes.findIndex(chordNote =>
      notesAreEqual(chordNote, note, false)
    )

    const noteIndex = currentBeat.subdivisions[
      currentSubdivisionIndex
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === chordIndex &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    const stringAlreadyHasNoteIndex = currentBeat.subdivisions[
      currentSubdivisionIndex
    ].notes.findIndex(subdivisionNote => subdivisionNote.string === stringIndex)
    if (stringAlreadyHasNoteIndex !== -1) {
      currentBeat.subdivisions[currentSubdivisionIndex].notes?.splice(
        stringAlreadyHasNoteIndex,
        1
      )
    }

    if (!hasNote) {
      const noteToPush = {
        string: stringIndex,
        index: chordIndex,
        pitch: note.pitch,
        relativeIndex: note.relativeIndex ?? 0,
      }

      instrument && playNotes(instrument, [note])

      currentBeat?.subdivisions[currentSubdivisionIndex].notes?.push(noteToPush)
    }

    updateBar(currentBar)
  }

  const getCurrentBeatNotes = () => {
    if (!currentBar || !currentBeat) {
      return
    }

    const chordNotes = getChordNotes(
      getScaleChord(
        selectedNote,
        currentBeat?.scale ?? selectedScale,
        selectedMode,
        currentBeat.scaleDegree
      )
    )

    return currentBeat.subdivisions[
      Math.min(currentSubdivisionIndex, currentBeat.subdivisions.length - 1)
    ]?.notes
      ?.map(note => {
        const scaleNote = chordNotes[note.index]
        return {
          note: {
            ...scaleNote,
            pitch: note.pitch,
            relativeIndex: note.relativeIndex,
          },
          stringIndex: note.string ?? 1,
        }
      })
      .filter(note => !!note)
  }

  const getCurrentBeatChord = () => {
    return currentBar && currentBeat
      ? getScaleChord(
          selectedNote,
          currentBeat?.scale ?? selectedScale,
          selectedMode,
          currentBeat.scaleDegree,
          currentBeat.chordExtensionScaleDegrees
        )
      : undefined
  }

  return {
    removeBeat,
    removeBar,
    updateScaleDegree,
    updateScale,
    changeTimeSignature,
    gotoNextSubdivision,
    gotoPreviousSubdivision,
    changeSubdivision,
    toggleNote,
    getCurrentBeatNotes,
    getCurrentBeatChord,
  }
}
