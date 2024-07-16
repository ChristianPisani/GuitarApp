﻿import './sequencer-page.scss'
import {
  allNotes,
  getChordNotes,
  getScaleChord,
  getStringNotes,
  notesAreEqual,
} from '../../utility/noteFunctions'
import { FC, useEffect, useState } from 'react'
import { Mode, Note, Scale } from '../../types/musical-terms'
import { majorScale } from '../../data/scales'
import { SequencerUi } from '../../ui/sequencer/sequencer-ui'
import { Beat, MusicContext, SequencerState } from '../../context/app-context'
import { useSequencer } from '../../hooks/sequencer-hook'
import { acousticGuitar } from '../../utility/instruments'
import { playNotes } from '../../utility/instrumentFunctions'
import useLocalStorage from 'react-use-localstorage'
import { ScaleDegree } from '../../data/chords'
import { getDefaultSubdivision } from '../../utility/sequencer-utilities'
import { Outlet, useMatch } from 'react-router-dom'
import {
  AutoFilter,
  AutoPanner,
  AutoWah,
  BitCrusher,
  Chebyshev,
  Chorus,
  Convolver,
  Distortion,
  FeedbackDelay,
  Freeverb,
  JCReverb,
  Phaser,
  PingPongDelay,
  PitchShift,
  Reverb,
  Sampler,
  StereoWidener,
  Synth,
  Tremolo,
  Vibrato,
} from 'tone'
import { standardTuningNotes } from '../../data/tunings'
import { defaultTracks } from '../../data/tracks'
import { chunk } from '../../utility/chunk'

export type SequencerMode = 'Chords' | 'Effects'

type SequencerPageProps = {}

export type EffectType =
  | Reverb
  | Tremolo
  | Vibrato
  | AutoFilter
  | AutoPanner
  | AutoWah
  | BitCrusher
  | Chebyshev
  | Chorus
  | Convolver
  | Distortion
  | FeedbackDelay
  | Freeverb
  | JCReverb
  | Phaser
  | PingPongDelay
  | PitchShift
  | StereoWidener

export type EffectNode = {
  effect: EffectType
  enabled: boolean
}

export const SequencerPage: FC<SequencerPageProps> = ({}) => {
  const isEffectsPage = useMatch('effects')
  const isChordsPage = useMatch('chords')
  const sequencerMode = isEffectsPage ? 'Effects' : 'Chords'

  const [loadedTrackName, setLoadedTrackName] = useState(
    defaultTracks[0]?.name ?? ''
  )
  const [saveState, setSaveState] = useLocalStorage(
    loadedTrackName,
    JSON.stringify('')
  )

  const [selectedNote, setSelectedNote] = useState<Note>(allNotes[0])
  const [selectedScale, setSelectedScale] = useState<Scale>(majorScale)
  const [selectedMode, setSelectedMode] = useState<Mode>(1)
  const [beats, setBeats] = useState<Beat[]>([])
  const [state, setState] = useState<SequencerState>('editing')
  const [bpm, setBpm] = useState(130)
  const [effectNodes, setEffectNodes] = useState<EffectNode[]>([])
  const [instrument, setInstrument] = useState<Sampler | Synth | undefined>(
    acousticGuitar
  )

  const savableState = {
    selectedNote,
    selectedScale,
    selectedMode,
    beats,
    state,
    bpm,
    effectNodes,
  }

  useEffect(() => {
    const loadedState = JSON.parse(saveState)

    if (!loadedState) return

    setSelectedNote(loadedState.selectedNote ?? allNotes[0])
    setSelectedScale(loadedState.selectedScale ?? majorScale)
    setSelectedMode(loadedState.selectedMode ?? 1)
    setBeats(loadedState.beats ?? [])
    setBpm(loadedState.bpm ?? 130)
    setEffectNodes(loadedState.effects ?? [])
  }, [saveState])

  useEffect(() => {
    if (!instrument) {
      return
    }

    effectNodes.forEach(effect => {
      effect.effect.disconnect()
    })

    let chainNode: Sampler | Synth | EffectType = instrument
    effectNodes
      .filter(effect => effect.enabled)
      .forEach(effect => {
        chainNode?.connect(effect.effect)
        chainNode = effect.effect
      })
    chainNode?.toDestination()
  }, [effectNodes])

  const addDefaultTracksToLocalStorage = () => {
    defaultTracks?.forEach(defaultTrack => {
      localStorage.setItem(
        defaultTrack?.name ?? '',
        JSON.stringify(defaultTrack?.track)
      )
    })
  }

  useEffect(() => {
    addDefaultTracksToLocalStorage()
  }, [])

  const saveTrack = () => {
    setSaveState(JSON.stringify(savableState))
  }

  const loadTrack = (trackName: string) => {
    setLoadedTrackName(trackName)
  }

  // To play the correct pitch.
  const stringNotes = standardTuningNotes().map(note =>
    getStringNotes(note, 24)
  )

  const sequencer = useSequencer({
    instrument: acousticGuitar,
    onBeat: (beat, beatIndex, subdivision, subdivisionIndex) => {
      const notes = subdivision.notes.map(beatNote => {
        const scaleChord = getScaleChord(
          selectedNote,
          beat.bars[beatIndex].scale ?? selectedScale,
          selectedMode,
          beat.bars[beatIndex].scaleDegree
        )
        const chordNotes = getChordNotes(scaleChord)
        const chordNote = chordNotes[beatNote.index]

        const stringNote = beatNote.string
          ? stringNotes[beatNote.string].filter(stringNote =>
              notesAreEqual(stringNote, chordNote, false)
            )[beatNote.relativeIndex]
          : undefined

        return {
          pitch: stringNote?.pitch ?? beatNote.pitch,
          sharp: chordNote.sharp,
          name: chordNote.name,
        }
      })

      if (!instrument) {
        return
      }

      playNotes(
        instrument,
        notes,
        subdivision.strumSpeed,
        subdivision.sustain,
        subdivisionIndex % 2 !== 0,
        subdivision.velocity
      )
    },
    beats,
    selectedNote,
    selectedScale,
    bpm,
  })

  const updateBeat = (beat: Beat) => {
    const beatIndex = beats.findIndex(b => b.id === beat.id)
    beats[beatIndex] = beat
    setBeats([...beats])
  }

  const removeSubdivision = (beat: Beat, barIndex: number) => {
    const currentAmountOfSubdivisions = beat.bars[barIndex].subdivisions.length

    if (currentAmountOfSubdivisions <= 1) return

    beat.bars[barIndex].subdivisions.splice(-1, 1)

    updateBeat(beat)
  }

  const addSubdivision = (beat: Beat, barIndex: number) => {
    const maxAmountOfSubdivisions = beat.bars.length * 8

    const currentAmountOfSubdivisions = beat.bars[barIndex].subdivisions.length

    if (currentAmountOfSubdivisions >= maxAmountOfSubdivisions) return

    beat.bars[barIndex].subdivisions.push(getDefaultSubdivision())
    updateBeat(beat)
  }

  const toggleInterval = (
    beat: Beat,
    barIndex: number,
    interval: ScaleDegree
  ) => {
    const index =
      beat.bars[barIndex].chordExtensionScaleDegrees.indexOf(interval)
    if (index === -1) {
      beat.bars[barIndex].chordExtensionScaleDegrees.push(interval)
    } else {
      beat.bars[barIndex].chordExtensionScaleDegrees.splice(index, 1)
    }
    updateBeat(beat)
  }

  useEffect(() => {
    if (state === 'playing') {
      sequencer.startBeat()
    } else {
      sequencer.stopBeat()
    }
  }, [state])

  return (
    <MusicContext.Provider
      value={{
        setSelectedNote,
        setSelectedMode,
        setSelectedScale,
        setBeats,
        setState,
        setCurrentBarIndex: sequencer.setCurrentBar,
        currentBarIndex: sequencer.currentBar,
        currentBeatIndex: sequencer.currentBeat,
        setCurrentBeat: sequencer.setCurrentBeat,
        currentSubdivision: sequencer.currentSubdivision,
        setCurrentSubdivision: sequencer.setCurrentSubdivision,
        removeSubdivision,
        addSubdivision,
        updateBeat,
        setBpm,
        toggleInterval,
        setEffectNodes,
        instrument,
        ...savableState,
      }}
    >
      <main
        className={
          'flex min-h-full w-full flex-col place-items-center bg-secondary-950 p-8'
        }
      >
        <div className={'flex gap-8 my-8'}>
          <h3>Beats: {beats.length}</h3>
          <button
            className={
              'rounded-full px-8 py-4 bg-primary-200 hover:bg-primary-400'
            }
            onClick={() => saveTrack()}
          >
            Save track
          </button>
          <select
            defaultValue={loadedTrackName}
            className={'bg-primary-50 p-4'}
            onChange={e => loadTrack(e.target.value)}
          >
            {new Array(localStorage.length)
              .fill(0)
              .map((_, localStorageIndex) => {
                const localStorageKey =
                  localStorage.key(localStorageIndex) ?? 'No key'

                return (
                  <option value={localStorageKey}>{localStorageKey}</option>
                )
              })}
          </select>
          <h4>
            Subdivisions:
            {beats[sequencer.currentBeat]?.bars?.flatMap(
              bar => bar.subdivisions
            )?.length ?? 0}
          </h4>
          <h3>
            {sequencer.currentBeat}:{sequencer.currentSubdivision}
          </h3>
        </div>
        <SequencerUi sequencerMode={sequencerMode}>
          <Outlet />
        </SequencerUi>
      </main>
    </MusicContext.Provider>
  )
}
