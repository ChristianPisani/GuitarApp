import './sequencer-page.scss'
import { allNotes } from '../../utility/noteFunctions'
import { useState } from 'react'
import { FretboardContext } from '../../ui/Fretboard/FretboardContext'
import { Mode, Note, Scale } from '../../types/musical-terms'
import { majorScale } from '../../data/scales'
import { Sequencer } from '../../ui/sequencer/sequencer'
import { SequencerUi } from '../../ui/sequencer/sequencer-ui'
import { Beat, MusicContext } from '../../context/app-context'

export const SequencerPage = () => {
  const [selectedNote, setSelectedNote] = useState<Note>(allNotes[0])
  const [selectedScale, setSelectedScale] = useState<Scale>(majorScale)
  const [selectedMode, setSelectedMode] = useState<Mode>(1)
  const [selectedBeat, setSelectedBeat] = useState<Beat | undefined>(undefined)
  const [beats, setBeats] = useState<Beat[]>([])

  return (
    <MusicContext.Provider
      value={{
        setSelectedNote,
        selectedNote,
        selectedScale,
        selectedMode,
        setSelectedMode,
        setSelectedScale,
        beats,
        setBeats,
        selectedBeat,
        setSelectedBeat,
      }}
    >
      <main
        className={
          'flex h-full w-full flex-col place-items-center bg-primary-100'
        }
      >
        <h2 className={'p-4 md:p-8'}>Sequencer</h2>
        <SequencerUi />
      </main>
    </MusicContext.Provider>
  )
}
