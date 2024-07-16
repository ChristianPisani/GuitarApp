import React, { FC, useContext, useState } from 'react'
import { ScrollContainer } from 'react-indiana-drag-scroll'
import { MusicContext } from '../../context/app-context'
import { EffectType } from '../../routes/sequencer-page/sequencer-page'
import { effectTypes } from '../../data/effects'
import { Button } from '../button/button'
import { Distortion, JCReverb, Phaser, Reverb } from 'tone'
import { ReverbEditor } from '../effect-editors/reverb-editor'
import { DistortionEditor } from '../effect-editors/distortion-editor'
import { PhaserEditor } from '../effect-editors/phaser-editor'
import { JCReverbEditor } from '../effect-editors/jcreverb-editor'
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { DragIndicator } from '@mui/icons-material'

type EffectEditorProps = {
  effectNodeIndex: number
}

const EffectEditor: FC<EffectEditorProps> = ({ effectNodeIndex }) => {
  const { effectNodes, setEffectNodes } = useContext(MusicContext)

  const effectNode = effectNodes[effectNodeIndex]

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable' + effectNodeIndex,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const dragListeners = listeners

  const removeEffect = (index: number) => {
    effectNodes[index].effect.dispose()
    const copy = [...effectNodes]
    copy.splice(index, 1)

    setEffectNodes(copy)
  }

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: 'droppable' + effectNodeIndex,
  })
  const droppableStyle = {
    border: isOver ? '0.5rem solid' : undefined,
    borderStyle: isOver ? 'dashed' : undefined,
  }

  return (
    <div className={'relative z-0'}>
      <div
        style={droppableStyle}
        ref={setDroppableNodeRef}
        className={'absolute inset-[-1rem] min-w-32 z-[-1] min-h-64'}
      />
      <div ref={setNodeRef} style={style} {...attributes}>
        <div className={'flex flex-col gap-4'}>
          <div
            className={`no-scroll select-none bg-gradient-to-br from-gray-600 to-gray-700 text-gray-200
              border-4 border-gray-400 rounded p-6 flex flex-col gap-4 h-fit justify-between`}
          >
            <div
              className={'flex justify-between w-full items-center relative'}
            >
              <h2>{effectNode.effect.name}</h2>
              <button
                className={`rounded-full border-4 border-gray-50 bg-gray-100 w-8 h-8 shadow-xl
                shadow-gray-900 bg-gradient-to-br from-gray-50 to-gray-300 after:absolute
                after:right-10 after:bottom-2 after:w-2 after:h-2 ${
                  effectNode.enabled ? 'after:bg-green-400' : 'after:bg-red-600'
                } after:rounded-full`}
                onClick={() => {
                  effectNode.enabled = !effectNode.enabled
                  setEffectNodes([...effectNodes])
                }}
              />
            </div>
            <div>
              {effectNode.effect instanceof Reverb && (
                <ReverbEditor effectIndex={effectNodeIndex} />
              )}
              {effectNode.effect instanceof Distortion && (
                <DistortionEditor effectIndex={effectNodeIndex} />
              )}
              {effectNode.effect instanceof Phaser && (
                <PhaserEditor effectIndex={effectNodeIndex} />
              )}
              {effectNode.effect instanceof JCReverb && (
                <JCReverbEditor effectIndex={effectNodeIndex} />
              )}
            </div>
            <div
              className={`w-fit self-center border-2 rounded px-4 border-gray-300 text-gray-300
                hover:border-gray-100`}
              {...dragListeners}
            >
              <DragIndicator className={'rotate-90'} fontSize={'large'} />
            </div>
          </div>
          <button onClick={() => removeEffect(effectNodeIndex)}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export const EffectsEditor = () => {
  const { effectNodes, setEffectNodes } = useContext(MusicContext)

  const [effectSelectorOpen, setEffectSelectorOpen] = useState(false)

  const addEffect = (effect: EffectType) => {
    effectNodes.push({ effect, enabled: true })
    setEffectNodes([...effectNodes])
    setEffectSelectorOpen(false)
  }

  const onDragEnd = (event: DragEndEvent) => {
    if (event.over) {
      const dropIndex = Number(
        event.over.id.toString().replace('droppable', '')
      )
      const dragIndex = Number(
        event.active.id.toString().replace('draggable', '')
      )

      const effectNodesCopy = [...effectNodes]
      const dropEffect = { ...effectNodesCopy[dropIndex] }
      effectNodesCopy[dropIndex] = effectNodesCopy[dragIndex]
      effectNodesCopy[dragIndex] = dropEffect
      setEffectNodes([...effectNodesCopy])
    }
  }

  return (
    <div className={'w-auto overflow-hidden h-full relative'}>
      <ScrollContainer
        hideScrollbars={true}
        mouseScroll={{ ignoreElements: '.no-scroll' }}
        className={
          'sequencer-chords p-16 gap-8 h-full text-primary-50 relative transition-all'
        }
      >
        {!effectSelectorOpen && effectNodes.length === 0 && (
          <div className={'absolute left-16'}>
            <h2 className={'font-extrabold text-8xl'}>No effects added.</h2>
            <button
              onClick={() => setEffectSelectorOpen(true)}
              className={`border-2 rounded-2xl px-8 py-2 hover:text-secondary-950 hover:bg-primary-100
                mt-2 transition`}
            >
              Add your first effect
            </button>
          </div>
        )}

        {!effectSelectorOpen && effectNodes.length > 0 && (
          <DndContext onDragEnd={onDragEnd}>
            <div className={'flex gap-16'}>
              {effectNodes.map((_, index) => {
                return <EffectEditor effectNodeIndex={index} />
              })}
            </div>
          </DndContext>
        )}
        {!effectSelectorOpen && effectNodes.length > 0 && (
          <button
            onClick={() => setEffectSelectorOpen(true)}
            className={
              'text-3xl border-primary-100 border-2 p-4 rounded-full aspect-square h-16'
            }
          >
            +
          </button>
        )}
        {effectSelectorOpen && (
          <>
            {effectTypes().map(effectType => (
              <div
                className={`bg-primary-50 rounded p-6 max-h-64 text-secondary-950 flex flex-col gap-8 h-full
                  select-none justify-between`}
              >
                <div>
                  <h2 className={'mb-2'}>{effectType.name}</h2>
                  <p>{effectType.description}</p>
                </div>
                <Button
                  text={'Add'}
                  id={effectType.name}
                  onClick={() => addEffect(effectType.effect())}
                />
              </div>
            ))}
            <Button
              className={'bg-primary-300'}
              onClick={() => setEffectSelectorOpen(false)}
              text={'Cancel'}
              id={'cancel-add-effect'}
            ></Button>
          </>
        )}
      </ScrollContainer>
    </div>
  )
}
