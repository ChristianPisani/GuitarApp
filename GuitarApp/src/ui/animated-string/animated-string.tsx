import { Canvas } from '../canvas/canvas'
import { FC, useContext, useEffect, useState } from 'react'
import { MusicContext } from '../../context/app-context'

export const AnimatedString: FC<{ stringIndex: number }> = ({
  stringIndex,
}) => {
  const { currentBarIndex, bars, currentSubdivisionIndex, currentBeatIndex } =
    useContext(MusicContext)
  const [animate, setAnimate] = useState(false)
  const selectedBeat = bars[currentBarIndex]

  useEffect(() => {
    if (
      selectedBeat?.beats[currentBeatIndex].subdivisions[
        currentSubdivisionIndex
      ].notes.some(note => note.string === stringIndex)
    ) {
      setAnimate(true)
    }
  }, [currentSubdivisionIndex])

  useEffect(() => {
    if (animate) setAnimate(false)
  }, [animate])

  const draw = (context: CanvasRenderingContext2D, time: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    let stringX = context.canvas.width / 2
    let amplitude = 15 / time

    context.beginPath()
    context.moveTo(stringX, 0)

    for (let y = 0; y <= context.canvas.height; y++) {
      const x =
        stringX +
        amplitude *
          Math.sin(
            (y / (context.canvas.height / (stringIndex + 1))) * 2 * Math.PI +
              time
          )
      context.lineTo(x, y)
    }

    context.strokeStyle = stringIndex > 2 ? 'rgb(240,240,240)' : '#fdd7a3'
    context.lineWidth = Math.round(6 - stringIndex / 2)
    context.stroke()
  }

  return (
    <div className={'grid h-full w-full'}>
      <Canvas
        animate={animate}
        draw={draw}
        width={0}
        height={0}
        animationLength={100}
      />
    </div>
  )
}
