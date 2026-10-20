// Web Audio API Synthesizer for Tibetan Singing Bowls & Zen Soundscapes
// Runs completely client-side without external audio assets

let audioCtx: AudioContext | null = null;
let ambientOsc1: OscillatorNode | null = null;
let ambientOsc2: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;
let noiseNode: AudioNode | null = null;
let noiseGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Synthesize a resonant Tibetan Singing Bowl chime
 * @param frequency Base frequency in Hz (default 320 Hz)
 * @param duration Decay duration in seconds
 */
export function playTibetanSingingBowl(frequency = 324, duration = 4.2): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.35, now + 0.04);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // Harmonic partials typical of hammered bronze singing bowls
    // (fundamental, minor third/fifth overtones, detuned harmonics)
    const partials = [
      { freq: frequency * 1.0, gain: 0.6, detune: 0 },
      { freq: frequency * 1.5, gain: 0.35, detune: 4 },
      { freq: frequency * 2.76, gain: 0.2, detune: -6 },
      { freq: frequency * 4.08, gain: 0.1, detune: 8 },
    ];

    partials.forEach(({ freq, gain, detune }) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detune, now);

      pGain.gain.setValueAtTime(gain, now);
      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });
  } catch (err) {
    console.debug('Audio synthesis disabled or blocked by browser', err);
  }
}

/**
 * Start 432Hz ambient harmonic drone
 */
export function startAmbientDrone(volume = 0.15): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ambientGain) return; // already playing

    const now = ctx.currentTime;
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.0001, now);
    ambientGain.gain.exponentialRampToValueAtTime(volume, now + 1.5);

    // Warm Low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    ambientOsc1 = ctx.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(216, now); // Sub-octave of 432Hz

    ambientOsc2 = ctx.createOscillator();
    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(432, now); // Sacred 432Hz harmonic
    ambientOsc2.detune.setValueAtTime(2, now);

    ambientOsc1.connect(filter);
    ambientOsc2.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    ambientOsc1.start();
    ambientOsc2.start();
  } catch (err) {
    console.debug('Ambient drone error', err);
  }
}

/**
 * Stop ambient harmonic drone
 */
export function stopAmbientDrone(): void {
  try {
    if (!ambientGain || !audioCtx) return;
    const now = audioCtx.currentTime;
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
    setTimeout(() => {
      try {
        ambientOsc1?.stop();
        ambientOsc2?.stop();
        ambientOsc1?.disconnect();
        ambientOsc2?.disconnect();
        ambientGain?.disconnect();
      } catch {}
      ambientOsc1 = null;
      ambientOsc2 = null;
      ambientGain = null;
    }, 1100);
  } catch {}
}

/**
 * Gentle pink noise rain / stream generator
 */
export function startZenStream(volume = 0.08): void {
  try {
    const ctx = getAudioContext();
    if (!ctx || noiseGain) return;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate Pink Noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to simulate soft stream/breeze
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    noiseGain = ctx.createGain();
    const now = ctx.currentTime;
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(volume, now + 1.2);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start();
    noiseNode = whiteNoise;
  } catch (err) {
    console.debug('Zen stream sound error', err);
  }
}

export function stopZenStream(): void {
  try {
    if (!noiseGain || !audioCtx) return;
    const now = audioCtx.currentTime;
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      try {
        (noiseNode as AudioBufferSourceNode)?.stop();
        noiseNode?.disconnect();
        noiseGain?.disconnect();
      } catch {}
      noiseNode = null;
      noiseGain = null;
    }, 900);
  } catch {}
}

/**
 * Procedural Web Audio game sound effects (no external audio files required)
 */
export function playGameClickSound(freq = 560): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {}
}

export function playGameSuccessSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Major triad: C5 (523.25), E5 (659.25), G5 (783.99)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.12, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  } catch {}
}

export function playGameErrorSound(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.16);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.19);
  } catch {}
}

export function playGameVictoryFanfare(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.09;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.52);
    });
  } catch {}
}

export function playGameTick(isFinal = false): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isFinal ? 1046.5 : 880, now);

    gain.gain.setValueAtTime(isFinal ? 0.15 : 0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  } catch {}
}

export function playPsychPulse(frequency = 528, duration = 0.25): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {}
}

export function playSubtleClick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  } catch {}
}

