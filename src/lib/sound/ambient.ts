/* =====================================================================
   SENSORIUM — AMBIENT SOUND ENGINE (doc 04 §6 / doc 11 §B7)
   A synthesised, peaceful dark-fantasy piece — in the spirit of a
   lilting harpsichord waltz (à la "Golden Brown") but darker, calmer
   and dreamlike: a slow music-box / harp arpeggio over an A-minor
   progression (Am – Dm – E – Am, the major-V giving that baroque,
   fantasy colour), floating on a soft pedal drone with long reverb.

   Opt-in, gesture-gated, click-free gain ramps, compressor on the
   master, and the context suspends when off. Nothing is a file.
   ===================================================================== */

const TARGET_GAIN = 0.34; // master level when on (kept low — felt, not loud)

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let built = false;
let suspendTimer: ReturnType<typeof setTimeout> | null = null;

// arpeggio scheduler
let arpFilter: BiquadFilterNode | null = null;
let arpBus: GainNode | null = null;
let schedTimer: ReturnType<typeof setInterval> | null = null;
let nextNoteTime = 0;
let step = 0;

const NOTE = 0.36; // seconds per note — slow, peaceful
// Am – Dm – E – Am, each a gentle rocking arpeggio (6 notes, up then down)
const A3 = 220.0, C4 = 261.63, E4 = 329.63, A4 = 440.0;
const D4 = 293.66, F4 = 349.23, D5 = 587.33;
const Gs4 = 415.3, B4 = 493.88, E5 = 659.25;
const SEQ: number[] = [
  A3, C4, E4, A4, E4, C4, // Am
  D4, F4, A4, D5, A4, F4, // Dm
  E4, Gs4, B4, E5, B4, Gs4, // E  (the fantasy colour)
  A3, C4, E4, A4, E4, C4, // Am
];

function brownNoiseBuffer(ac: AudioContext, seconds: number): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

function impulse(ac: AudioContext, seconds = 4.6, decay = 3): AudioBuffer {
  const len = Math.floor(ac.sampleRate * seconds);
  const buf = ac.createBuffer(2, len, ac.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function startLfo(ac: AudioContext, rate: number, depth: number, param: AudioParam) {
  const lfo = ac.createOscillator();
  lfo.frequency.value = rate;
  const g = ac.createGain();
  g.gain.value = depth;
  lfo.connect(g).connect(param);
  lfo.start();
}

interface Voice {
  f: number;
  type: OscillatorType;
  g: number;
  thick?: boolean;
}

function build(ac: AudioContext) {
  if (built) return;
  built = true;

  master = ac.createGain();
  master.gain.value = 0;

  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.knee.value = 30;
  comp.ratio.value = 3;
  comp.attack.value = 0.05;
  comp.release.value = 0.6;
  master.connect(comp);
  comp.connect(ac.destination);

  const breath = ac.createGain();
  breath.gain.value = 0.85;
  breath.connect(master);
  startLfo(ac, 0.05, 0.1, breath.gain);

  const dry = ac.createGain();
  dry.gain.value = 0.85;
  dry.connect(breath);
  const wet = ac.createGain();
  wet.gain.value = 0.6;
  wet.connect(breath);
  const conv = ac.createConvolver();
  conv.buffer = impulse(ac);
  conv.connect(wet);

  // --- the soft pedal drone (A minor), low and warm ---
  const droneBus = ac.createGain();
  droneBus.gain.value = 1;
  const droneTone = ac.createBiquadFilter();
  droneTone.type = "lowpass";
  droneTone.frequency.value = 620;
  droneTone.Q.value = 0.6;
  droneBus.connect(droneTone);
  droneTone.connect(dry);
  droneTone.connect(conv);
  startLfo(ac, 0.024, 220, droneTone.frequency);

  const voices: Voice[] = [
    { f: 55.0, type: "sine", g: 0.05 }, // A1 sub
    { f: 110.0, type: "sawtooth", g: 0.03, thick: true }, // A2
    { f: 164.81, type: "sawtooth", g: 0.026 }, // E3 (fifth)
    { f: 220.0, type: "sawtooth", g: 0.026, thick: true }, // A3
    { f: 261.63, type: "triangle", g: 0.02 }, // C4 (minor third — dark)
  ];
  for (const v of voices) {
    const vg = ac.createGain();
    vg.gain.value = v.g;
    vg.connect(droneBus);
    for (const d of v.thick ? [-5, 5] : [0]) {
      const o = ac.createOscillator();
      o.type = v.type;
      o.frequency.value = v.f;
      o.detune.value = d + (Math.random() * 3 - 1.5);
      o.connect(vg);
      o.start();
    }
  }

  // air
  const noise = ac.createBufferSource();
  noise.buffer = brownNoiseBuffer(ac, 4);
  noise.loop = true;
  const nf = ac.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 480;
  const ng = ac.createGain();
  ng.gain.value = 0.045;
  noise.connect(nf).connect(ng).connect(droneBus);
  noise.start();

  // --- the arpeggio path (soft harp / music box) ---
  arpFilter = ac.createBiquadFilter();
  arpFilter.type = "lowpass";
  arpFilter.frequency.value = 2000; // soft, darker than a true harpsichord
  arpFilter.Q.value = 0.4;
  arpBus = ac.createGain();
  arpBus.gain.value = 0.9;
  arpFilter.connect(arpBus);
  arpBus.connect(dry);
  arpBus.connect(conv); // plenty of reverb — dreamy
}

/** One plucked note: fast attack, gentle decay — a music-box tone. */
function playPluck(time: number, freq: number, vel: number) {
  if (!ctx || !arpFilter) return;
  const peak = 0.13 * vel;

  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.value = freq;
  const env = ctx.createGain();
  env.gain.value = 0.0001;
  o.connect(env).connect(arpFilter);
  env.gain.setValueAtTime(0.0001, time);
  env.gain.exponentialRampToValueAtTime(peak, time + 0.014);
  env.gain.exponentialRampToValueAtTime(0.0001, time + 1.7);
  o.start(time);
  o.stop(time + 1.8);

  // a soft octave shimmer above it
  const o2 = ctx.createOscillator();
  o2.type = "sine";
  o2.frequency.value = freq * 2;
  const env2 = ctx.createGain();
  env2.gain.value = 0.0001;
  o2.connect(env2).connect(arpFilter);
  env2.gain.setValueAtTime(0.0001, time);
  env2.gain.exponentialRampToValueAtTime(peak * 0.28, time + 0.02);
  env2.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);
  o2.start(time);
  o2.stop(time + 1.2);
}

function scheduler() {
  if (!ctx) return;
  const ahead = 0.12;
  while (nextNoteTime < ctx.currentTime + ahead) {
    const vel = step % 6 === 0 ? 1.15 : 0.78; // gentle lilt on the downbeat
    playPluck(nextNoteTime, SEQ[step % SEQ.length], vel);
    nextNoteTime += NOTE;
    step++;
  }
}

function startScheduler() {
  if (schedTimer || !ctx) return;
  nextNoteTime = ctx.currentTime + 0.15;
  schedTimer = setInterval(scheduler, 25);
}

function stopScheduler() {
  if (schedTimer) {
    clearInterval(schedTimer);
    schedTimer = null;
  }
}

/** Turn the piece on (must be called from a user gesture). */
export async function enableAmbient(): Promise<void> {
  const AC: typeof AudioContext | undefined =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) ctx = new AC();
  build(ctx);
  if (suspendTimer) {
    clearTimeout(suspendTimer);
    suspendTimer = null;
  }
  try {
    await ctx.resume();
  } catch {
    /* ignore */
  }
  startScheduler();
  if (!master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(TARGET_GAIN, now + 3);
}

/** Fade out and, once silent, suspend the context to save battery. */
export function disableAmbient(): void {
  if (!ctx || !master) return;
  stopScheduler();
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.8);
  if (suspendTimer) clearTimeout(suspendTimer);
  suspendTimer = setTimeout(() => {
    ctx?.suspend().catch(() => {});
  }, 2100);
}
