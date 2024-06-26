import { FC, HTMLProps, useEffect, useRef, useState } from 'react'

type CanvasProps = {
  draw: (context: CanvasRenderingContext2D, time: number) => void
  animationLength: number
  animate: boolean
} & HTMLProps<HTMLCanvasElement>

export const Canvas: FC<CanvasProps> = ({
  draw,
  animationLength,
  animate,
  ...htmlProps
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const [animationId, setAnimationId] = useState<number | undefined>()

  const resize = (context: CanvasRenderingContext2D) => {
    const container = ref.current?.parentElement

    if (!container) return

    const width = container.offsetWidth
    const height = container.offsetHeight

    context.canvas.width = width
    context.canvas.height = height

    draw(context, animationLength)
  }

  const cancelAnimation = () => {
    animationId !== undefined && window.cancelAnimationFrame(animationId)
    setAnimationId(undefined)
  }

  const startAnimation = () => {
    cancelAnimation()

    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!context) return

    let time = 0

    const renderer = () => {
      time++
      draw(context, time)

      if (time >= animationLength) {
        return
      }

      setAnimationId(window.requestAnimationFrame(renderer))
    }
    renderer()

    return () => {
      cancelAnimation()
    }
  }

  useEffect(() => {
    if (animate) startAnimation()
  }, [animate])

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')

    if (!context) return

    resize(context)
  }, [ref.current?.parentElement])

  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')

    if (!context) return
  }, [])

  return (
    <canvas onClick={() => startAnimation()} ref={ref} {...htmlProps}></canvas>
  )
}
