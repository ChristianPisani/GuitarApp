import { RangeSlider } from '../input/range-slider'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Distortion, JCReverb, Reverb } from 'tone'
import { MusicContext } from '../../context/app-context'

export const DistortionEditor: FC<{ effectIndex: number }> = ({
  effectIndex,
}) => {
  const [distortion, setDistortion] = useState<number>(0.5)
  const [wet, setWet] = useState<number>(0.5)

  const { effectNodes, setEffectNodes } = useContext(MusicContext)

  const effect = effectNodes[effectIndex]?.effect

  useEffect(() => {
    if (!(effect instanceof Distortion)) return

    setDistortion(
      Number(effect.distortion.toString()) ? Number(effect.distortion) : 0
    )
    setWet(effect.wet.value)
  }, [effect])

  if (!(effect instanceof Distortion)) return <></>

  return (
    <div className={'flex gap-4'}>
      <RangeSlider
        name={'distortion'}
        label={'Distortion'}
        orient={'vertical'}
        value={distortion}
        max={1}
        min={0}
        step={0.1}
        onSlide={value => {
          effect.distortion = value
          setDistortion(value)
        }}
      />
      <RangeSlider
        name={'wet'}
        label={'Wet'}
        orient={'vertical'}
        value={wet}
        max={1}
        min={0}
        step={0.1}
        onSlide={value => {
          effect.wet.value = value
          setWet(value)
        }}
      />
    </div>
  )
}
