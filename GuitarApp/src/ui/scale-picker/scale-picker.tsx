import { availableScales } from '../../data/scales'
import { Scale } from '../../types/musical-terms'
import { ChangeEvent } from 'react'
import { Select } from '../input/inputs'

export const ScalePicker = (props: {
  onChange: (scale: Scale | undefined) => void
  bgColor?: string
  selectedScale?: Scale
  defaultValue?: string
}) => {
  const { onChange, bgColor, selectedScale, defaultValue } = props

  return (
    <Select
      label={''}
      id={'scale-select'}
      value={selectedScale?.name ?? defaultValue}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        const scale = availableScales.find(
          scale => scale.name === e.target.value
        )
        onChange(scale ?? undefined)
      }}
      options={[{ name: defaultValue ?? '' }, ...availableScales].map(
        (scale, index) => ({
          key: scale.name,
          value: scale.name,
        })
      )}
      bgColor={bgColor}
    />
  )
}
