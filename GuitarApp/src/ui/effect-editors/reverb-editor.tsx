import { RangeSlider } from '../input/range-slider'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Reverb } from 'tone'
import { MusicContext } from '../../context/app-context'

export const ReverbEditor: FC<{ effectIndex: number }> = ({ effectIndex }) => {
  const [decay, setDecay] = useState<number>(0.5)
  const [wet, setWet] = useState<number>(0.5)
  const [preDelay, setPreDelay] = useState<number>(0.01)

  const { effectNodes, setEffectNodes } = useContext(MusicContext)

  const effect = effectNodes[effectIndex]?.effect

  useEffect(() => {
    if (!(effect instanceof Reverb)) return

    setDecay(Number(effect.decay.toString()) ? Number(effect.decay) : 0)
    setWet(effect.wet.value)
    setPreDelay(
      Number(effect.preDelay.toString()) ? Number(effect.preDelay) : 0
    )
  }, [effect])

  if (!(effect instanceof Reverb)) return <></>

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
          effect.decay = value
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
          effect.wet.value = value
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
          effect.preDelay = value
          setPreDelay(value)
        }}
      />
    </div>
  )
}
