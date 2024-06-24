import { RangeSlider } from '../input/range-slider'
import React, { FC, useContext, useEffect, useState } from 'react'
import { JCReverb, Phaser, Reverb } from 'tone'
import { MusicContext } from '../../context/app-context'

export const JCReverbEditor: FC<{ effectIndex: number }> = ({
  effectIndex,
}) => {
  const [roomSize, setRoomSize] = useState<number>(0.5)
  const [wet, setWet] = useState<number>(0.5)

  const { effectNodes, setEffectNodes } = useContext(MusicContext)

  const effect = effectNodes[effectIndex]?.effect

  useEffect(() => {
    if (!(effect instanceof JCReverb)) return

    setRoomSize(
      Number(effect.roomSize.toString()) ? Number(effect.roomSize) : 0
    )
    setWet(effect.wet.value)
  }, [effect])

  if (!(effect instanceof JCReverb)) return <></>

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
