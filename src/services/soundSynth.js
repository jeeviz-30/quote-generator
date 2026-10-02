// Web Audio API Ambient Sound Generator
let audioCtx = null;
let activeNodes = [];

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAmbientSound() {
  activeNodes.forEach(node => {
    try {
      node.stop ? node.stop() : node.disconnect();
    } catch (e) {}
  });
  activeNodes = [];
}

export function playAmbientSound(type = 'rain') {
  stopAmbientSound();
  const ctx = getAudioContext();

  if (type === 'rain') {
    // Generate pink/brown noise for soothing rain sound
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.035; // Soft volume
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    whiteNoise.connect(filter);
    filter.connect(ctx.destination);
    whiteNoise.start();

    activeNodes.push(whiteNoise, filter);
  } else if (type === 'waves') {
    // Ocean waves using modulated lowpass filter
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;

    // LFO to modulate waves
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15; // slow ocean swell
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(ctx.destination);

    noise.start();
    lfo.start();
    activeNodes.push(noise, filter, lfo, lfoGain);
  } else if (type === 'zen') {
    // Warm harmonic sine chord (Zen Chimes / Bowls)
    const frequencies = [220, 277.18, 329.63, 440]; // A Major Chord
    frequencies.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.02;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      activeNodes.push(osc, gain);
    });
  }
}
