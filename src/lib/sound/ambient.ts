/* =====================================================================
   SENSORIUM — AMBIENT SOUND ENGINE (doc 04 §6 / doc 11 §B7)
   A synthesised ambient bed, not a file: a low warm drone (a soft C
   minor), a breath of filtered noise for air, slow movement, and a
   long reverb for space. Felt more than heard. Opt-in only, gesture-
   gated (Web Audio autoplay policy), with click-free gain ramps.

   Synthesised so it needs no asset, stays tiny, and can be tuned to the
   exact mood of the page — memory, dusk, the dark behind the eyes.
   ===================================================================== */

const TARGET_GAIN = 0.85; // master level when on (compressor tames peaks)

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let built = false;
let suspendTimer: ReturnType<typeof setTimeout> | null = null;

/** Brown noise — softer than white, like distant air / rain. */
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

/** A decaying-noise impulse response — a simple, spacious reverb tail. */
function impulse(ac: AudioContext, seconds = 2.8, decay = 2.6): AudioBuffer {
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

function build(ac: AudioContext) {
  if (built) return;
  built = true;

  master = ac.createGain();
  master.gain.value = 0;

  // keep peaks gentle no matter how the voices stack
  const comp = ac.createDynamicsCompressor();
  master.connect(comp);
  comp.connect(ac.destination);

  // breathing — a slow LFO swells the whole bed
  const breath = ac.createGain();
  breath.gain.value = 0.85;
  breath.connect(master);
  const breathLfo = ac.createOscillator();
  breathLfo.frequency.value = 0.06;
  const breathDepth = ac.createGain();
  breathDepth.gain.value = 0.12;
  breathLfo.connect(breathDepth).connect(breath.gain);
  breathLfo.start();

  // a warm lowpass that drifts open and closed — movement
  const tone = ac.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 900;
  tone.Q.value = 0.6;
  tone.connect(breath); // dry path
  const moveLfo = ac.createOscillator();
  moveLfo.frequency.value = 0.03;
  const moveDepth = ac.createGain();
  moveDepth.gain.value = 320;
  moveLfo.connect(moveDepth).connect(tone.frequency);
  moveLfo.start();

  // reverb send for space
  const conv = ac.createConvolver();
  conv.buffer = impulse(ac);
  const wet = ac.createGain();
  wet.gain.value = 0.5;
  tone.connect(conv).connect(wet).connect(breath);

  // the drone bus
  const bus = ac.createGain();
  bus.gain.value = 1;
  bus.connect(tone);

  // the chord — a soft, wistful C minor (root, fifth, octave, minor 3rd)
  const pitches = [65.41, 98.0, 130.81, 155.56];
  for (const freq of pitches) {
    for (const detune of [-4, 4]) {
      const osc = ac.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = detune; // gentle beating between the pair
      const g = ac.createGain();
      g.gain.value = 0.05;
      osc.connect(g).connect(bus);
      osc.start();
    }
  }

  // air — a breath of filtered noise beneath it all
  const noise = ac.createBufferSource();
  noise.buffer = brownNoiseBuffer(ac, 4);
  noise.loop = true;
  const nf = ac.createBiquadFilter();
  nf.type = "lowpass";
  nf.frequency.value = 680;
  const ng = ac.createGain();
  ng.gain.value = 0.06;
  noise.connect(nf).connect(ng).connect(bus);
  noise.start();
}

/** Turn the bed on (must be called from a user gesture). */
export async function enableAmbient(): Promise<void> {
  const AC: typeof AudioContext | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
  master.gain.linearRampToValueAtTime(TARGET_GAIN, now + 2.5); // fade in, no click
}

/** Fade out and, once silent, suspend the context to save battery. */
export function disableAmbient(): void {
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.5);
  if (suspendTimer) clearTimeout(suspendTimer);
  suspendTimer = setTimeout(() => {
    ctx?.suspend().catch(() => {});
  }, 1800);
}
