import { BeatChord } from './beat-chord'
import React, { useContext, useEffect, useState } from 'react'
import { getScaleChord } from '../../utility/noteFunctions'
import { ScaleDegree } from '../../data/chords'
import { ScrollContainer } from 'react-indiana-drag-scroll'
import { Beat, MusicContext } from '../../context/app-context'
import { getDefaultSubdivision } from '../../utility/sequencer-utilities'
import { EffectType } from '../../routes/sequencer-page/sequencer-page'
import { effectTypes } from '../../data/effects'
import { Button } from '../button/button'
import { RangeSlider } from '../input/range-slider'
import { Distortion, Phaser, Reverb } from 'tone'
import { ReverbEditor } from '../effect-editors/reverb-editor'
import { DistortionEditor } from '../effect-editors/distortion-editor'
import { PhaserEditor } from '../effect-editors/phaser-editor'

export const EffectsEditor = () => {
  const {
    beats,
    selectedBeat,
    setBeats,
    setSelectedBeat,
    selectedMode,
    currentBeat,
    state,
    selectedScale,
    selectedNote,
    effects,
    setEffects,
  } = useContext(MusicContext)

  const [selectedEffectIndex, setSelectedEffectIndex] = useState<
    number | undefined
  >()
  const [effectSelectorOpen, setEffectSelectorOpen] = useState(false)

  const addEffect = (effect: EffectType) => {
    effects.push(effect)
    setEffects([...effects])
    setEffectSelectorOpen(false)
  }

  const removeEffect = (index: number, divRef?: HTMLDivElement) => {
    const copy = [...effects]
    copy.splice(index, 1)

    // Want to animate out, so just wait until that is completed before actually deleting the element
    divRef?.addEventListener('animationend', () => {
      setEffects(copy)

      if (copy.length > 0) {
        if ((selectedEffectIndex ?? 0) >= copy.length) {
          setSelectedEffectIndex(copy.length - 1)
        }
      } else {
        setSelectedBeat(undefined)
      }

      return undefined
    })
  }

  const onEffectClick = (beat: Beat) => {}

  useEffect(() => {
    if (state !== 'playing') return
  }, [])

  return (
    <div className={'w-auto overflow-hidden h-full'}>
      <ScrollContainer
        hideScrollbars={true}
        mouseScroll={{ ignoreElements: '.no-scroll' }}
        className={
          'sequencer-chords p-16 gap-8 h-full text-primary-50 relative transition-all'
        }
      >
        {!effectSelectorOpen && effects.length === 0 && (
          <div className={'absolute left-16'}>
            <h2 className={'font-extrabold text-8xl'}>No effects added.</h2>
            <button
              onClick={() => setEffectSelectorOpen(true)}
              className={`border-2 rounded-2xl px-8 py-2 hover:text-secondary-950 hover:bg-primary-100
                mt-2 transition`}
            >
              Add your first effect
            </button>
          </div>
        )}
        {!effectSelectorOpen &&
          effects.map((effect, index) => {
            return (
              <div
                className={`no-scroll select-none bg-primary-50 rounded p-6 text-secondary-950 flex flex-col
                  gap-8 h-full justify-between`}
              >
                <div>
                  <h2 className={'mb-2 min-w-40'}>{effect.name}</h2>
                  {effect instanceof Reverb && <ReverbEditor reverb={effect} />}
                  {effect instanceof Distortion && (
                    <DistortionEditor effect={effect} />
                  )}
                  {effect instanceof Phaser && <PhaserEditor effect={effect} />}
                </div>
              </div>
            )
          })}
        {!effectSelectorOpen && effects.length > 0 && (
          <button
            onClick={() => setEffectSelectorOpen(true)}
            className={
              'text-3xl border-primary-100 border-2 p-4 rounded-full aspect-square h-16'
            }
          >
            +
          </button>
        )}
        {effectSelectorOpen && (
          <>
            {effectTypes().map(effectType => (
              <div
                className={`bg-primary-50 rounded p-6 text-secondary-950 flex flex-col gap-8 h-full
                  select-none justify-between`}
              >
                <div>
                  <h2 className={'mb-2'}>{effectType.name}</h2>
                  <p>{effectType.description}</p>
                </div>
                <Button
                  text={'Add'}
                  id={effectType.name}
                  onClick={() => addEffect(effectType.effect())}
                />
              </div>
            ))}
          </>
        )}
      </ScrollContainer>
    </div>
  )
}
