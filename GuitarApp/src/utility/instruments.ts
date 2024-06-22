import { Reverb, Sampler, Synth, Tremolo, Vibrato } from 'tone'

const vibrato = new Vibrato(1.5, 0.5)
const tremolo = new Tremolo(9, 0.75)
const reverb = new Reverb({ decay: 10 })

export const synth = new Synth().toDestination()

export const acousticGuitar = new Sampler({
  urls: {
    F4: 'F4.ogg',
    'F#2': 'Fs2.ogg',
    'F#3': 'Fs3.ogg',
    'F#4': 'Fs4.ogg',
    G2: 'G2.ogg',
    G3: 'G3.ogg',
    G4: 'G4.ogg',
    'G#2': 'Gs2.ogg',
    'G#3': 'Gs3.ogg',
    'G#4': 'Gs4.ogg',
    A2: 'A2.ogg',
    A3: 'A3.ogg',
    A4: 'A4.ogg',
    'A#2': 'As2.ogg',
    'A#3': 'As3.ogg',
    'A#4': 'As4.ogg',
    B2: 'B2.ogg',
    B3: 'B3.ogg',
    B4: 'B4.ogg',
    C3: 'C3.ogg',
    C4: 'C4.ogg',
    C5: 'C5.ogg',
    'C#3': 'Cs3.ogg',
    'C#4': 'Cs4.ogg',
    'C#5': 'Cs5.ogg',
    D2: 'D2.ogg',
    D3: 'D3.ogg',
    D4: 'D4.ogg',
    D5: 'D5.ogg',
    'D#2': 'Ds2.ogg',
    'D#3': 'Ds3.ogg',
    'D#4': 'Ds3.ogg',
    E2: 'E2.ogg',
    E3: 'E3.ogg',
    E4: 'E4.ogg',
    F2: 'F2.ogg',
    F3: 'F3.ogg',
  },
  release: '4n',
  curve: 'exponential',
  baseUrl: 'assets/sounds/guitar-acoustic/',
})

acousticGuitar.toDestination()
