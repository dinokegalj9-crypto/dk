/* =====================================================================
   SENSORIUM — AMBIENT SOUND ENGINE (doc 04 §6 / doc 11 §B7)
   A synthesised dark-fantasy bed, not a file. A deep C-minor drone with
   a minor 7th and a longing minor 6th, spread across octaves so the
   tones stay distinct; gritty saw voices through a low moving filter; a
   breath of wind (filtered noise); a distant eerie shimmer that bypasses
   the dark filter; and a long, dim reverb. Each voice swells on its own
   slow LFO, so individual tones drift forward and back — felt as a
   shifting, brooding chord rather than one fused note.

   Opt-in, gesture-gated (autoplay policy), click-free gain ramps,
   compressor on the master, and the context suspends when off.
   ===================================================================== */

const TARGET_GAIN = 0.8;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let built = false;
let suspendTimer: ReturnType<typeof setTimeout> | null = null;

/** Brown noise — soft, like distant air / wind in a vast dark hall. */
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

/** A long, dim reverb tail. */
function impulse(ac: AudioContext, seconds = 4.2, decay = 3): AudioBuffer {
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

/** Gentle analog-ish saturation — warmth and a little grit (darker). */
function softCurve(k: number) {
  const n = 1024;
  const curve = new Float32Array(new ArrayBuffer(n * 4));
  const d = Math.tanh(k);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(k * x) / d;
  }
  return curve;
}

/** A slow control oscillator modulating an AudioParam (swell / movement). */
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
  lfo: number; // per-voice swell rate (Hz)
  thick?: boolean; // detuned pair for body
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

  // a slow breath swells the whole bed
  const breath = ac.createGain();
  breath.gain.value = 0.82;
  breath.connect(master);
  startLfo(ac, 0.05, 0.12, breath.gain);

  // mix points
  const dry = ac.createGain();
  dry.gain.value = 0.82;
  dry.connect(breath);
  const wet = ac.createGain();
  wet.gain.value = 0.55;
  wet.connect(breath);
  const conv = ac.createConvolver();
  conv.buffer = impulse(ac);
  conv.connect(wet);

  // the dark path: drone bus -> saturation -> a low filter that drifts
  const bus = ac.createGain();
  bus.gain.value = 1;
  const shaper = ac.createWaveShaper();
  shaper.curve = softCurve(1.7);
  shaper.oversample = "2x";
  const tone = ac.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 700;
  tone.Q.value = 0.7;
  bus.connect(shaper);
  shaper.connect(tone);
  tone.connect(dry);
  tone.connect(conv);
  startLfo(ac, 0.025, 300, tone.frequency); // movement: cutoff ~400–1000

  // the dark chord — C minor add♭6/♭7, spread across octaves so the
  // tones stay distinct, and pitched up enough to survive phone speakers
  const voices: Voice[] = [
    { f: 32.7, type: "sine", g: 0.06, lfo: 0.017 }, // C1 sub — depth (headphones)
    { f: 65.41, type: "sawtooth", g: 0.045, lfo: 0.023, thick: true }, // C2 root
    { f: 130.81, type: "sawtooth", g: 0.05, lfo: 0.031, thick: true }, // C3 — audible root
    { f: 155.56, type: "sawtooth", g: 0.045, lfo: 0.019 }, // Eb3 — the dark minor 3rd
    { f: 196.0, type: "sawtooth", g: 0.04, lfo: 0.037 }, // G3 — fifth
    { f: 233.08, type: "triangle", g: 0.034, lfo: 0.027 }, // Bb3 — minor 7th (brooding)
    { f: 311.13, type: "triangle", g: 0.026, lfo: 0.043 }, // Eb4 — high color, distinct
  ];
  for (const v of voices) {
    const vg = ac.createGain();
    vg.gain.value = v.g;
    vg.connect(bus);
    // independent swell so this tone drifts forward and back on its own
    startLfo(ac, v.lfo, v.g * 0.62, vg.gain);
    const detunes = v.thick ? [-6, 6] : [0];
    for (const d of detunes) {
      const o = ac.createOscillator();
      o.type = v.type;
      o.frequency.value = v.f;
      o.detune.value = d + (Math.random() * 4 - 2); // gentle beating
      o.connect(vg);
      o.start();
    }
  }

  // a distant, eerie high shimmer — bypasses the dark filter so it stays
  // present (the "fantasy" glint above the gloom)
  const shimmer = ac.createGain();
  shimmer.gain.value = 0.015;
  shimmer.connect(dry);
  shimmer.connect(conv);
  startLfo(ac, 0.07, 0.011, shimmer.gain);
  for (const f of [466.16, 622.25]) {
    // Bb4, Eb5
    const o = ac.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    o.detune.value = Math.random() * 6 - 3;
    o.connect(shimmer);
    o.start();
  }

  // wind — filtered brown noise beneath it all
  const noise = ac.createBufferSource();
  noise.buffer = brownNoiseBuffer(ac, 4);
  noise.loop = true;
  const nf = ac.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 520;
  const ng = ac.createGain();
  ng.gain.value = 0.055;
  noise.connect(nf).connect(ng).connect(bus);
  noise.start();
}

/** Turn the bed on (must be called from a user gesture). */
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
  if (!master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(TARGET_GAIN, now + 3); // fade in, no click
}

/** Fade out and, once silent, suspend the context to save battery. */
export function disableAmbient(): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.6);
  if (suspendTimer) clearTimeout(suspendTimer);
  suspendTimer = setTimeout(() => {
    ctx?.suspend().catch(() => {});
  }, 1900);
}
