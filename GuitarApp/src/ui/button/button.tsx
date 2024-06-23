import { FC, HTMLProps, ReactNode } from 'react'

type ButtonProps = {
  icon?: ReactNode
  text: string
  id: string
  labelPlacement?: 'inside' | 'over'
} & HTMLProps<HTMLButtonElement>

export const Button: FC<ButtonProps> = props => {
  const { icon, text, id, labelPlacement = 'inside' } = props

  const label = (
    <label className={'text-sm font-bold text-secondary-950'} htmlFor={id}>
      {text}
    </label>
  )

  return (
    <div className={'flex flex-col place-items-center gap-2'}>
      {labelPlacement === 'over' && label}
      <button
        onClick={props.onClick}
        id={id}
        className={`shadow-accent grid place-items-center rounded-full border-4 border-secondary-950
          px-12 py-2 hover:bg-fuchsia-200`}
      >
        {labelPlacement === 'inside' && label}
        {icon}
      </button>
    </div>
  )
}
