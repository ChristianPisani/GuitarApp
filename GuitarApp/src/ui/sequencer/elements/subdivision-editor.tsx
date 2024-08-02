import {
  AddCircleOutlined,
  ChevronLeftRounded,
  ChevronRightRounded,
  RemoveCircleOutline,
} from '@mui/icons-material'
import { useContext } from 'react'
import { MusicContext } from '../../../context/app-context'
import { useTrackEditor } from '../../../hooks/track-editor-hook'

export const SubdivisionEditor = () => {
  const {
    state,
    currentBeatIndex,
    currentBarIndex,
    bars,
    addSubdivision,
    removeSubdivision,
    currentSubdivisionIndex,
      currentSectionIndex
  } = useContext(MusicContext)

  const { gotoPreviousSubdivision, gotoNextSubdivision, changeSubdivision } =
    useTrackEditor()

  const currentBar = bars[currentBarIndex]
  const currentBeat = currentBar.beats[currentBeatIndex]

  return (
    <div className={'flex gap-2 justify-between w-full items-center'}>
      <button onClick={gotoPreviousSubdivision}>
        <ChevronLeftRounded />
      </button>
      <div className={'flex flex-wrap items-start justify-start gap-2'}>
        {currentBar?.beats.map((beat, beatIndex) =>
          beat.sections.map((section, sectionIndex) => (
            <div className={'flex flex-col gap-2 flex-wrap items-center'}>
              {state === 'editing' && (
                <>
                  <button
                    onClick={() =>
                      addSubdivision(currentBarIndex, beatIndex, sectionIndex)
                    }
                  >
                    <AddCircleOutlined />
                  </button>
                  <button
                    onClick={() =>
                      removeSubdivision(
                        currentBarIndex,
                        beatIndex,
                        sectionIndex
                      )
                    }
                  >
                    <RemoveCircleOutline />
                  </button>
                </>
              )}
              {section.subdivisions.map((subdivision, subdivisionIndex) => {
                  const isSelected = currentBeat?.id === beat.id && currentBeatIndex === beatIndex &&
                      currentSectionIndex === sectionIndex && (subdivisionIndex === 0 || currentSubdivisionIndex === subdivisionIndex)
                  
                return (
                  <button
                    className={`rounded-full outline-2 outline-secondary-950 w-4 h-4 ${
                      isSelected
                        ? 'bg-secondary-950'
                        : subdivision.notes.length > 0
                          ? 'bg-secondary-700'
                          : ''
                    } ${
                      subdivisionIndex === 0
                        ? 'transform scale-110 outline-double'
                        : 'outline-dotted'
                    }`}
                    onClick={() =>
                      changeSubdivision(beatIndex, sectionIndex, subdivisionIndex)
                    }
                  ></button>
                )
              })}
            </div>
          ))
        )}
      </div>
      <button onClick={gotoNextSubdivision}>
        <ChevronRightRounded />
      </button>
    </div>
  )
}
