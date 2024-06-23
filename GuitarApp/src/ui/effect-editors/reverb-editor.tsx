import { RangeSlider } from '../input/range-slider'
import React, { FC, useState } from 'react'
import { Reverb } from 'tone'

export const ReverbEditor: FC<{ reverb: Reverb }> = ({ reverb }) => {
  const [decay, setDecay] = useState<number>(0.5)
  const [wet, setWet] = useState<number>(0.5)
  const [preDelay, setPreDelay] = useState<number>(0.01)

  return (
    <div className={'flex gap-4'}>
      <RangeSlider
        name={'decay'}
        label={'Decay'}
        orient={'vertical'}
        value={decay}
        max={2}
        min={0}
        step={0.1}
        onSlide={value => {
          reverb.decay = value
          setDecay(value)
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
          reverb.wet.value = value
          setWet(value)
        }}
      />
      <RangeSlider
        name={'preDelay'}
        label={'Pre delay'}
        orient={'vertical'}
        value={preDelay}
        max={0.5}
        min={0}
        step={0.01}
        onSlide={value => {
          reverb.preDelay = value
          setPreDelay(value)
        }}
      />
    </div>
  )
}
