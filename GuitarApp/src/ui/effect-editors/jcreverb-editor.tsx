import { RangeSlider } from '../input/range-slider'
import React, { FC, useState } from 'react'
import { JCReverb, Reverb } from 'tone'

export const JCReverbEditor: FC<{ effect: JCReverb }> = ({ effect }) => {
  const [roomSize, setRoomSize] = useState<number>(0.5)
  const [wet, setWet] = useState<number>(0.5)
  const [preDelay, setPreDelay] = useState<number>(0.01)

  return (
    <div className={'flex gap-4'}>
      <RangeSlider
        name={'roomsize'}
        label={'Roomsize'}
        orient={'vertical'}
        value={roomSize}
        max={1}
        min={0}
        step={0.1}
        onSlide={value => {
          effect.roomSize.value = value
          setRoomSize(value)
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
