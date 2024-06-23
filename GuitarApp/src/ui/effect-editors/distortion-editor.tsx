import { RangeSlider } from '../input/range-slider'
import React, { FC, useState } from 'react'
import { Distortion, Reverb } from 'tone'

export const DistortionEditor: FC<{ effect: Distortion }> = ({ effect }) => {
  const [distortion, setDistortion] = useState<number>(0.5)
  const [wet, setWet] = useState<number>(0.5)

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
