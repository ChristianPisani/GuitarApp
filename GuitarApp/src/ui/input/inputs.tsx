import { FC, HTMLProps, ReactNode } from 'react'

export type InputWrapperProps = {
  label: string
  id: string
  children?: ReactNode
}

export type NumberInputProps = {} & InputWrapperProps &
  HTMLProps<HTMLInputElement>

export type SelectProps = {
  options: { key: string; value: string }[]
  bgColor?: string
} & InputWrapperProps &
  HTMLProps<HTMLSelectElement>

export const NumberInput: FC<NumberInputProps> = props => {
  const { label, id } = props

  return (
    <InputWrapper label={label} id={id}>
      <input
        {...props}
        id={id}
        type={'number'}
        className={`shadow-accent w-full rounded-full border-4 border-secondary-950 bg-transparent
          px-2 py-2 text-center text-2xl font-extrabold`}
      ></input>
    </InputWrapper>
  )
}

export const Select: FC<SelectProps> = props => {
  const { label, id, options, bgColor } = props

  return (
    <InputWrapper label={label} id={id}>
      <select
        {...props}
        id={id}
        className={`shadow-accent rounded-full border-4 border-secondary-950 px-2 py-2 text-center
        text-2xl font-extrabold ${bgColor ? bgColor : 'bg-transparent'}`}
      >
        {options.map(option => (
          <option key={option.key} value={option.value}>
            {option.key}
          </option>
        ))}
      </select>
    </InputWrapper>
  )
}

export const InputWrapper: FC<InputWrapperProps> = ({
  label,
  id,
  children,
}) => {
  return (
    <div className={'flex flex-col place-items-center gap-2'}>
      <label
        className={'text-center text-sm font-bold text-secondary-950'}
        htmlFor={id}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
