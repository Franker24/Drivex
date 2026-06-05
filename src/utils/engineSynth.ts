export type EngineType = 'v8' | 'v10' | 'flat6' | 'electric' | 'default';

export class EngineSoundSynth {
  private type: EngineType;
  private ctx: AudioContext | null = null;
  
  // Audio Nodes
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private distortion: WaveShaperNode | null = null;
  
  // Oscillators
  private oscs: { osc: OscillatorNode; gain: GainNode; ratio: number }[] = [];
  private electricWhine: OscillatorNode | null = null;
  private electricWhineGain: GainNode | null = null;
  
  // Modulation
  private rumbleNode: OscillatorNode | null = null;
  
  // State
  private running = false;
  private currentRPM = 800;
  private targetRPM = 800;
  private animationId: number | null = null;
  private onRPMChange: ((rpm: number) => void) | null = null;

  // Constants
  private minRPM = 800;
  private maxRPM = 8500;

  constructor(type: EngineType) {
    this.type = type;
    if (type === 'flat6') {
      this.maxRPM = 9000;
    } else if (type === 'electric') {
      this.minRPM = 0;
      this.maxRPM = 12000;
      this.currentRPM = 0;
      this.targetRPM = 0;
    } else if (type === 'v10') {
      this.maxRPM = 8500;
    } else {
      this.maxRPM = 7500;
    }
  }

  public registerRPMCallback(callback: (rpm: number) => void) {
    this.onRPMChange = callback;
  }

  private makeDistortionCurve(amount = 20) {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  private initAudio() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0; // Start muted, fade in
    this.masterGain.connect(this.ctx.destination);

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 300;
    this.filter.Q.value = 1.0;
    this.filter.connect(this.masterGain);

    this.distortion = this.ctx.createWaveShaper();
    this.distortion.curve = this.makeDistortionCurve(this.type === 'electric' ? 5 : 25);
    this.distortion.oversample = '4x';
    this.distortion.connect(this.filter);

    if (this.type === 'electric') {
      this.setupElectricSynth();
    } else {
      this.setupCombustionSynth();
    }
  }

  private setupCombustionSynth() {
    if (!this.ctx || !this.distortion) return;

    // Create 4-5 oscillators for engine harmonics
    // Ratios are relative to fundamental cylinder firing frequency
    // V8, V10, Flat-6 have different typical harmonic signatures
    let ratios: number[] = [];
    let waves: OscillatorType[] = [];
    let relativeGains: number[] = [];

    if (this.type === 'v8') {
      // V8: uneven, deep sub-harmonics and growling mid-tones
      ratios = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0];
      waves = ['triangle', 'sawtooth', 'sawtooth', 'triangle', 'sawtooth', 'sine'];
      relativeGains = [1.0, 0.8, 0.5, 0.4, 0.2, 0.1];
    } else if (this.type === 'v10') {
      // V10: high-pitched screaming 5th and 10th harmonics
      ratios = [1.0, 2.0, 2.5, 5.0, 6.0, 10.0];
      waves = ['sawtooth', 'sawtooth', 'triangle', 'sawtooth', 'triangle', 'sine'];
      relativeGains = [0.8, 0.7, 0.4, 0.5, 0.2, 0.15];
    } else if (this.type === 'flat6') {
      // Flat-6: raw mechanical raspy tone, higher order harmonics
      ratios = [1.0, 1.5, 3.0, 4.5, 6.0];
      waves = ['sawtooth', 'triangle', 'sawtooth', 'sawtooth', 'sine'];
      relativeGains = [0.9, 0.6, 0.5, 0.3, 0.1];
    } else {
      // Default: balanced V6
      ratios = [1.0, 2.0, 3.0, 4.0];
      waves = ['sawtooth', 'sawtooth', 'triangle', 'sine'];
      relativeGains = [0.9, 0.6, 0.3, 0.1];
    }

    this.oscs = [];
    ratios.forEach((ratio, index) => {
      if (!this.ctx || !this.distortion) return;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = waves[index];
      gainNode.gain.value = relativeGains[index];
      
      osc.connect(gainNode);
      gainNode.connect(this.distortion);
      
      this.oscs.push({ osc, gain: gainNode, ratio });
    });

    // Cylinder rumble LFO (low-frequency oscillator) to modulate sub-harmonic gain
    // This creates the random-ish combustion "burble" at idle
    this.rumbleNode = this.ctx.createOscillator();
    this.rumbleNode.type = 'sawtooth';
    this.rumbleNode.frequency.value = 8.5; // 8.5 Hz flutter
    
    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.value = 0.25;

    this.rumbleNode.connect(rumbleGain);
    
    // Connect LFO to modulate the master gain or main sub osc gain
    if (this.oscs.length > 0) {
      rumbleGain.connect(this.oscs[0].gain.gain);
    }
  }

  private setupElectricSynth() {
    if (!this.ctx || !this.distortion) return;

    // Electric motor has a main hum and a high pitched inverter whine
    // Inverter whine is sine/triangle at very high frequency
    this.electricWhine = this.ctx.createOscillator();
    this.electricWhine.type = 'triangle';
    this.electricWhine.frequency.value = 1000;

    this.electricWhineGain = this.ctx.createGain();
    this.electricWhineGain.gain.value = 0.15;

    this.electricWhine.connect(this.electricWhineGain);
    this.electricWhineGain.connect(this.distortion);

    // Main drive shaft hum (smooth sine/triangle mix)
    const baseOsc = this.ctx.createOscillator();
    baseOsc.type = 'sine';
    baseOsc.frequency.value = 40;

    const baseGain = this.ctx.createGain();
    baseGain.gain.value = 0.8;

    baseOsc.connect(baseGain);
    baseGain.connect(this.distortion);

    this.oscs = [{ osc: baseOsc, gain: baseGain, ratio: 1.0 }];
  }

  public start() {
    if (this.running) return;
    this.running = true;

    if (!this.ctx) {
      this.initAudio();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Start all oscillators
    this.oscs.forEach((o) => {
      try { o.osc.start(); } catch (e) {}
    });
    if (this.electricWhine) {
      try { this.electricWhine.start(); } catch (e) {}
    }
    if (this.rumbleNode) {
      try { this.rumbleNode.start(); } catch (e) {}
    }

    // Fade in master volume
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.15);
    }

    this.currentRPM = this.type === 'electric' ? 0 : 800;
    this.targetRPM = this.type === 'electric' ? 0 : 800;

    this.runPhysicsLoop();
  }

  public stop() {
    if (!this.running) return;
    this.running = false;

    // Fade out master volume
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.15);
    }

    // Stop animation tick
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // Stop nodes after fade-out
    setTimeout(() => {
      if (this.running) return; // if restarted in-between
      
      this.oscs.forEach((o) => {
        try { o.osc.stop(); } catch(e) {}
      });
      if (this.electricWhine) {
        try { this.electricWhine.stop(); } catch(e) {}
      }
      if (this.rumbleNode) {
        try { this.rumbleNode.stop(); } catch(e) {}
      }

      this.oscs = [];
      this.electricWhine = null;
      this.rumbleNode = null;
      this.ctx = null;
    }, 200);
  }

  public setThrottle(throttle: number) {
    // throttle is a value between 0.0 (idle) and 1.0 (max rev)
    if (!this.running) return;
    
    if (this.type === 'electric') {
      this.targetRPM = throttle * this.maxRPM;
    } else {
      // Combustion engines have an idle RPM floor
      this.targetRPM = this.minRPM + throttle * (this.maxRPM - this.minRPM);
    }
  }

  private runPhysicsLoop() {
    if (!this.running) return;

    // Simulates the physical flywheel inertia of an engine
    // Revs up fast, drops RPM a bit slower
    const diff = this.targetRPM - this.currentRPM;
    const rate = diff > 0 ? 0.08 : 0.045; // faster acceleration than deceleration
    
    this.currentRPM += diff * rate;
    
    // Add tiny engine vibration noise
    const rpmWithJitter = this.currentRPM + (Math.random() - 0.5) * (this.currentRPM * 0.005);

    this.updateSynthesizerFreqs(rpmWithJitter);

    if (this.onRPMChange) {
      this.onRPMChange(this.currentRPM);
    }

    this.animationId = requestAnimationFrame(() => this.runPhysicsLoop());
  }

  private updateSynthesizerFreqs(rpm: number) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.type === 'electric') {
      // Electric: base frequency starts at 30Hz and ramps to 350Hz
      const baseFreq = 30 + (rpm / this.maxRPM) * 320;
      if (this.oscs[0]) {
        this.oscs[0].osc.frequency.setTargetAtTime(baseFreq, now, 0.03);
      }

      // Inverter whine climbs from 800Hz to 6000Hz, volume increases with load
      const whineFreq = 800 + (rpm / this.maxRPM) * 5200;
      if (this.electricWhine) {
        this.electricWhine.frequency.setTargetAtTime(whineFreq, now, 0.03);
      }
      
      if (this.electricWhineGain) {
        const loadVolume = 0.05 + (rpm / this.maxRPM) * 0.22;
        this.electricWhineGain.gain.setTargetAtTime(loadVolume, now, 0.03);
      }

      // Adjust lowpass filter frequency (opens up to allow high inverter noise through)
      if (this.filter) {
        const filterCutoff = 250 + (rpm / this.maxRPM) * 6000;
        this.filter.frequency.setTargetAtTime(filterCutoff, now, 0.04);
      }

      // Master volume matches motor speed
      if (this.masterGain) {
        const masterVol = 0.15 + (rpm / this.maxRPM) * 0.35;
        this.masterGain.gain.setTargetAtTime(masterVol, now, 0.05);
      }

    } else {
      // Combustion calculations: fundamental frequency (firing rate)
      // V8 fundamental at 800 RPM: 800 * 8 / 120 = 53.3 Hz
      // GT3 Flat-6 at 9000 RPM: 9000 * 6 / 120 = 450 Hz
      let cylinders = 8;
      if (this.type === 'v10') cylinders = 10;
      if (this.type === 'flat6') cylinders = 6;
      
      const fundFreq = (rpm * cylinders) / 120;

      // Update each oscillator frequency based on its ratio to the fundamental
      this.oscs.forEach((o) => {
        const targetFreq = Math.max(10, fundFreq * o.ratio);
        o.osc.frequency.setTargetAtTime(targetFreq, now, 0.02);

        // Adjust gain dynamically to simulate engine strain and valve sounds at higher RPMs
        if (o.ratio > 2.0) {
          // high harmonics louder at high RPM
          const loadVol = (rpm / this.maxRPM) * 0.4;
          o.gain.gain.setTargetAtTime(loadVol, now, 0.03);
        }
      });

      // Filter cutoff sweeps upward with RPM to make the engine scream brighter
      if (this.filter) {
        const minCutoff = this.type === 'v8' ? 220 : 350;
        const maxCutoff = this.type === 'v10' || this.type === 'flat6' ? 5500 : 3500;
        const cutoff = minCutoff + Math.pow(rpm / this.maxRPM, 1.5) * (maxCutoff - minCutoff);
        this.filter.frequency.setTargetAtTime(cutoff, now, 0.03);
        
        // Boost resonance at high RPM for screaming exhaust sound
        const qVal = 0.8 + (rpm / this.maxRPM) * 1.5;
        this.filter.Q.setTargetAtTime(qVal, now, 0.03);
      }

      // Master gain increases slightly under heavy throttle/RPM
      if (this.masterGain) {
        const masterVol = 0.28 + (rpm / this.maxRPM) * 0.22;
        this.masterGain.gain.setTargetAtTime(masterVol, now, 0.03);
      }
    }
  }
}
