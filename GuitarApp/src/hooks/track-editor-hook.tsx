import { ScaleDegree } from '../data/chords'
import { Note, Scale } from '../types/musical-terms'
import { useContext } from 'react'
import { Bar, Beat, MusicContext } from '../context/app-context'
import {
  getChordNotes,
  getScaleChord,
  notesAreEqual,
} from '../utility/noteFunctions'
import { playNotes } from '../utility/instrumentFunctions'
import { createNewBar, defaultBeat } from '../utility/sequencer-utilities'

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
    currentSectionIndex,
    setCurrentSectionIndex,
  } = useContext(MusicContext)

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar?.beats[currentBeatIndex ?? 0]
  const currentSection = currentBeat?.sections[currentSectionIndex]
  const currentSubdivision =
    currentSection?.subdivisions[currentSubdivisionIndex]

  const addBeat = () => {
    currentBar.beats.push(defaultBeat())
    updateBar(currentBar)
  }

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

  const goToNextSection = () => {
    setCurrentSectionIndex(current => {
      if (current >= currentBeat?.sections.length - 1) {
        goToNextBeat()
        if (currentBeatIndex < currentBar.beats.length - 1) {
          return 0
        }
        return current
      }
      return current + 1
    })
  }
  const goToPreviousSection = () => {
    setCurrentSectionIndex(current => {
      if (current <= 0) {
        goToPreviousBeat()

        if (currentBeatIndex > 0) {
          return currentBar.beats[currentBeatIndex - 1]?.sections.length - 1
        }
        return current
      }
      return current - 1
    })
  }

  const gotoNextSubdivision = () => {
    setCurrentSubdivisionIndex(current => {
      if (current >= currentSection?.subdivisions.length - 1) {
        goToNextSection()
        if (currentSectionIndex < currentBeat?.sections.length - 1) {
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
        goToPreviousSection()

        if (currentSectionIndex > 0) {
          return (
            currentBeat?.sections[currentSectionIndex - 1]?.subdivisions
              .length - 1
          )
        }
        return current
      }
      return current - 1
    })
  }

  const changeSubdivision = (
    beatIndex: number,
    sectionIndex: number,
    subdivisionIndex: number
  ) => {
    setCurrentSectionIndex(sectionIndex)
    setCurrentSubdivisionIndex(subdivisionIndex)
    setCurrentBeatIndex(beatIndex)
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

    const noteIndex = currentSection.subdivisions[
      currentSubdivisionIndex
    ].notes?.findIndex(
      subDivisionNote =>
        subDivisionNote.index === chordIndex &&
        subDivisionNote.pitch === note.pitch &&
        subDivisionNote.string === stringIndex
    )
    const hasNote = noteIndex !== -1

    const stringAlreadyHasNoteIndex = currentSection.subdivisions[
      currentSubdivisionIndex
    ].notes.findIndex(subdivisionNote => subdivisionNote.string === stringIndex)
    if (stringAlreadyHasNoteIndex !== -1) {
      currentSection.subdivisions[currentSubdivisionIndex].notes?.splice(
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

      currentSection?.subdivisions[currentSubdivisionIndex].notes?.push(
        noteToPush
      )
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

    return currentSection.subdivisions[
      Math.min(currentSubdivisionIndex, currentSection.subdivisions.length - 1)
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

  const addBar = () => {
    const beats: Beat[] = [defaultBeat()]

    const newBar = createNewBar(beats)

    setBars([...bars, newBar])
  }

  return {
    addBar,
    addBeat,
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
    currentBeat,
    currentBar,
    currentSubdivision,
    currentSection,
  }
}
