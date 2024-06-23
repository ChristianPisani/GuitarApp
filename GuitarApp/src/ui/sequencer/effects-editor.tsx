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
import { Distortion, JCReverb, Phaser, Reverb } from 'tone'
import { ReverbEditor } from '../effect-editors/reverb-editor'
import { DistortionEditor } from '../effect-editors/distortion-editor'
import { PhaserEditor } from '../effect-editors/phaser-editor'
import { JCReverbEditor } from '../effect-editors/jcreverb-editor'

export const EffectsEditor = () => {
  const { effects, setEffects } = useContext(MusicContext)

  const [effectSelectorOpen, setEffectSelectorOpen] = useState(false)

  const addEffect = (effect: EffectType) => {
    effects.push({ effect, enabled: true })
    setEffects([...effects])
    setEffectSelectorOpen(false)
  }

  const removeEffect = (index: number) => {
    effects[index].effect.dispose()
    const copy = [...effects]
    copy.splice(index, 1)

    setEffects(copy)
  }

  const onEffectClick = (beat: Beat) => {}

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
              <div className={'flex flex-col gap-4'}>
                <div
                  className={`no-scroll select-none bg-gradient-to-br from-gray-600 to-gray-700 text-gray-200
                    border-4 border-gray-400 rounded p-6 flex flex-col gap-4 h-fit justify-between`}
                >
                  <div
                    className={
                      'flex justify-between w-full items-center relative'
                    }
                  >
                    <h2>{effect.effect.name}</h2>
                    <button
                      className={`rounded-full border-4 border-gray-50 bg-gray-100 w-8 h-8 shadow-xl
                      shadow-gray-900 bg-gradient-to-br from-gray-50 to-gray-300 after:absolute
                      after:right-10 after:bottom-2 after:w-2 after:h-2 ${
                        effect.enabled
                          ? 'after:bg-green-400'
                          : 'after:bg-red-600'
                      } after:rounded-full`}
                      onClick={() => {
                        effect.enabled = !effect.enabled
                        setEffects([...effects])
                      }}
                    />
                  </div>
                  <div>
                    {effect.effect instanceof Reverb && (
                      <ReverbEditor reverb={effect.effect} />
                    )}
                    {effect.effect instanceof Distortion && (
                      <DistortionEditor effect={effect.effect} />
                    )}
                    {effect.effect instanceof Phaser && (
                      <PhaserEditor effect={effect.effect} />
                    )}
                    {effect.effect instanceof JCReverb && (
                      <JCReverbEditor effect={effect.effect} />
                    )}
                  </div>
                </div>
                <button onClick={() => removeEffect(index)}>Remove</button>
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
                className={`bg-primary-50 rounded p-6 max-h-64 text-secondary-950 flex flex-col gap-8 h-full
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
