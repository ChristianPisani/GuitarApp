﻿import { ChangeEvent, FC, HTMLProps } from 'react'

type RangeSliderProps = {
  onSlide?: (value: number) => void
  orient?: 'horizontal' | 'vertical'
  showValue?: boolean
} & HTMLProps<HTMLInputElement>

export const RangeSlider: FC<RangeSliderProps> = props => {
  const { showValue = false } = props

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.onSlide?.(Number(e.target.value))
  }

  return (
    <div className={'flex flex-col items-center w-full'}>
      {props.orient === 'vertical' && (
        <>
          <div className={'h-36 min-w-16 grid place-items-center relative'}>
            <input
              {...props}
              className={'rotate-[-90deg] min-w-32 absolute'}
              onChange={onChange}
              type={'range'}
            />
          </div>
          <label
            className={
              'font-bold whitespace-nowrap mt-2 grid place-items-center'
            }
          >
            <p>{props.label}</p>
            <p> {showValue ? `(${props.value})` : ''}</p>
          </label>
        </>
      )}
      {(!props.orient || props.orient === 'horizontal') && (
        <>
          <label className={'font-bold whitespace-nowrap mt-2'}>
            {props.label} {showValue ? `(${props.value})` : ''}
          </label>
          <input {...props} onChange={onChange} type={'range'} />
        </>
      )}
    </div>
  )
}
