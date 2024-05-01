import { PlayArrowOutlined } from '@material-ui/icons'
import { FC, HTMLProps, ReactNode } from 'react'

type ButtonProps = {
  icon?: ReactNode
  text: string
  id: string
} & HTMLProps<HTMLButtonElement>

export const Button: FC<ButtonProps> = ({ icon, text, id }) => {
  return (
    <div className={'flex flex-col place-items-center gap-2'}>
      <label className={'text-sm font-bold text-secondary-950'} htmlFor={id}>
        {text}
      </label>
      <button
        id={id}
        className={'shadow-accent grid place-items-center rounded-full border-4 border-secondary-950 px-12 py-2'}
      >
        {icon}
      </button>
    </div>
  )
}
