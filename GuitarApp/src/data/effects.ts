import { Distortion, Phaser, Reverb, Tremolo } from 'tone'

export const effectTypes = () => [
  {
    name: 'Reverb',
    description: 'Adds reverb! Oh yeah! Hide your mistakes like a pro!',
    effect: () => new Reverb(),
  },
  {
    name: 'Tremolo',
    description: 'Adds tremolo!',
    effect: () => new Tremolo(),
  },
  {
    name: 'Distortion',
    description: 'Adds distortion! Chug away!',
    effect: () => new Distortion(),
  },
  {
    name: 'Phaser',
    description: 'Adds phasing! So dreamy!',
    effect: () => new Phaser(),
  },
]
