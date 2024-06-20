import { ChangeEvent, FC, HTMLProps } from 'react'

type RangeSliderProps = {
  onSlide?: (value: number) => void
} & HTMLProps<HTMLInputElement>

export const RangeSlider: FC<RangeSliderProps> = props => {
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onSlide?.(Number(e.target.value))
  }

  return (
    <div className={'flex flex-col items-center w-full'}>
      <label className={'font-bold'}>
        {props.label} ({props.value})
      </label>
      <input {...props} onChange={onChange} type={'range'} />
    </div>
  )
}
