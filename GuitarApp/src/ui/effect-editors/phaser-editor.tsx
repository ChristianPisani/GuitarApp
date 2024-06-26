﻿import { RangeSlider } from '../input/range-slider'
import React, { FC, useContext, useEffect, useState } from 'react'
import { Phaser, Reverb } from 'tone'
import { MusicContext } from '../../context/app-context'

export const PhaserEditor: FC<{ effectIndex: number }> = ({ effectIndex }) => {
  const [frequency, setFrequency] = useState<number>(15)
  const [baseFrequency, setBaseFrequency] = useState<number>(1000)
  const [wet, setWet] = useState<number>(0.5)
  const [octaves, setOctaves] = useState<number>(1)

  const { effectNodes, setEffectNodes } = useContext(MusicContext)

  const effect = effectNodes[effectIndex]?.effect

  useEffect(() => {
    if (!(effect instanceof Phaser)) return

    setFrequency(Number(effect.frequency.value))
    setWet(effect.wet.value)
    setBaseFrequency(
      Number(effect.baseFrequency.toString()) ? Number(effect.baseFrequency) : 0
    )
    setOctaves(Number(effect.octaves.toString()) ? Number(effect.octaves) : 0)
  }, [effect])

  if (!(effect instanceof Phaser)) return <></>

  return (
    <div className={'flex gap-4'}>
      <RangeSlider
        name={'frequency'}
        label={'Frequency'}
        orient={'vertical'}
        value={frequency}
        max={100}
        min={0}
        step={1}
        onSlide={value => {
          effect.frequency.value = value
          setFrequency(value)
        }}
      />
      <RangeSlider
        name={'basefrequency'}
        label={'Base frequency'}
        orient={'vertical'}
        value={baseFrequency}
        max={1500}
        min={750}
        step={10}
        onSlide={value => {
          effect.baseFrequency = value
          setBaseFrequency(value)
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
        name={'octaves'}
        label={'Octaves'}
        orient={'vertical'}
        value={octaves}
        max={5}
        min={-5}
        step={1}
        onSlide={value => {
          effect.octaves = value
          setOctaves(value)
        }}
      />
    </div>
  )
}
