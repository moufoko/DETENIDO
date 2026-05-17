// ═══════════════════════════════════════════════════════
// AUDIO MANAGER — Música y SFX procedural (Web Audio API)
// ═══════════════════════════════════════════════════════
// Todo el audio se genera por código con osciladores.
// Estilo: chiptune retro 8/16-bit, noir, sombrío, legal.

const AudioMgr = (() => {
  const STORAGE_KEY = 'detenido_muted';
  let muted = (typeof localStorage !== 'undefined') && localStorage.getItem(STORAGE_KEY) === '1';
  let unlocked = false;
  let ctx = null;
  let masterGain, musicGain, sfxGain;
  let currentTrack = null;
  let _musicSchedulerId = null;
  let _musicStep = 0;
  let _musicStartTime = 0;
  let toggleBtn = null;

  function _ensureCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 0.5;
    masterGain.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(masterGain);
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.7;
    sfxGain.connect(masterGain);
    return ctx;
  }

  // ───────── MIDI / Note helpers ─────────
  const NOTE_OFFSETS = { C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11 };
  function noteToFreq(name) {
    if (!name) return 0;
    const m = String(name).match(/^([A-G][#b]?)(\d+)$/);
    if (!m) return 0;
    const semi = NOTE_OFFSETS[m[1]];
    const oct = parseInt(m[2]);
    const midi = (oct + 1) * 12 + semi;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // ───────── Tone & noise primitives ─────────
  function _toneAt(freq, type, startTime, duration, gain, dest) {
    if (!ctx || !freq) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, startTime);
    o.connect(g);
    g.connect(dest || musicGain);
    const a = 0.005, r = Math.min(0.08, duration * 0.4);
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gain, startTime + a);
    g.gain.setValueAtTime(gain * 0.85, startTime + duration - r);
    g.gain.linearRampToValueAtTime(0, startTime + duration);
    o.start(startTime);
    o.stop(startTime + duration + 0.02);
  }

  function _noiseAt(startTime, duration, gain, filterFreq=2000, dest) {
    if (!ctx) return;
    const bufSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = filterFreq;
    filt.Q.value = 1.2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, startTime);
    g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    src.connect(filt);
    filt.connect(g);
    g.connect(dest || musicGain);
    src.start(startTime);
    src.stop(startTime + duration + 0.02);
  }

  // ═══════════════════════════════════════════════════════
  // SFX — short procedural sounds
  // ═══════════════════════════════════════════════════════

  function _sfxTone(freq, type, dur, gain, delay=0) {
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    _toneAt(freq, type, t, dur, gain, sfxGain);
  }
  function _sfxNoise(dur, gain, filterFreq=2000, delay=0) {
    if (!ctx) return;
    const t = ctx.currentTime + delay;
    _noiseAt(t, dur, gain, filterFreq, sfxGain);
  }
  function _sfxSweep(fromHz, toHz, type, dur, gain, delay=0) {
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(fromHz, start);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, toHz), start + dur);
    g.gain.setValueAtTime(gain, start);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g); g.connect(sfxGain);
    o.start(start); o.stop(start + dur + 0.02);
  }

  const SFX = {
    click() {
      _sfxTone(880, 'square', 0.04, 0.18);
      _sfxTone(1320, 'square', 0.03, 0.10, 0.02);
    },
    hover() {
      _sfxTone(660, 'square', 0.02, 0.08);
    },
    type() {
      _sfxTone(1400 + Math.random()*400, 'square', 0.012, 0.04);
    },
    stat_up() {
      _sfxTone(523, 'square', 0.07, 0.16, 0);
      _sfxTone(659, 'square', 0.07, 0.16, 0.07);
      _sfxTone(784, 'square', 0.10, 0.18, 0.14);
    },
    stat_down() {
      _sfxTone(392, 'sawtooth', 0.09, 0.18, 0);
      _sfxTone(294, 'sawtooth', 0.12, 0.20, 0.09);
    },
    siren() {
      // Two-tone police siren
      _sfxSweep(700, 1000, 'sawtooth', 0.4, 0.14, 0);
      _sfxSweep(1000, 700, 'sawtooth', 0.4, 0.14, 0.4);
      _sfxSweep(700, 1000, 'sawtooth', 0.4, 0.14, 0.8);
    },
    gavel() {
      // Bang: low thud + sharp noise
      _sfxTone(120, 'square', 0.18, 0.35, 0);
      _sfxNoise(0.08, 0.45, 800, 0);
      _sfxTone(80, 'sine', 0.25, 0.30, 0.02);
    },
    handcuffs() {
      _sfxNoise(0.06, 0.30, 5500, 0);
      _sfxNoise(0.05, 0.28, 4500, 0.10);
      _sfxNoise(0.06, 0.25, 6000, 0.22);
    },
    notif() {
      _sfxTone(880, 'sine', 0.10, 0.18, 0);
      _sfxTone(1320, 'sine', 0.14, 0.16, 0.06);
    },
    phase_banner() {
      _sfxTone(196, 'sawtooth', 0.18, 0.20, 0);
      _sfxTone(261, 'sawtooth', 0.18, 0.20, 0);
      _sfxTone(311, 'sawtooth', 0.30, 0.22, 0.18);
      _sfxNoise(0.4, 0.10, 200, 0);
    },
    glitch() {
      _sfxNoise(0.04, 0.30, 6000, 0);
      _sfxTone(2200, 'square', 0.03, 0.20, 0.04);
      _sfxNoise(0.05, 0.28, 800, 0.07);
      _sfxTone(440, 'sawtooth', 0.05, 0.18, 0.10);
    },
    win() {
      // Ascending fanfare
      _sfxTone(523, 'square', 0.10, 0.20, 0);
      _sfxTone(659, 'square', 0.10, 0.20, 0.10);
      _sfxTone(784, 'square', 0.10, 0.20, 0.20);
      _sfxTone(1047, 'square', 0.25, 0.22, 0.30);
    },
    lose() {
      _sfxTone(330, 'sawtooth', 0.18, 0.22, 0);
      _sfxTone(247, 'sawtooth', 0.22, 0.22, 0.18);
      _sfxTone(196, 'sawtooth', 0.40, 0.25, 0.40);
    },
    door_close() {
      _sfxNoise(0.20, 0.30, 400, 0);
      _sfxTone(60, 'sine', 0.30, 0.45, 0.05);
    },
    page_turn() {
      _sfxNoise(0.08, 0.18, 3500, 0);
    },
    error() {
      _sfxTone(220, 'square', 0.10, 0.20, 0);
      _sfxTone(207, 'square', 0.18, 0.20, 0.05);
    }
  };

  function playSfx(name, vol=1) {
    if (muted) return;
    _ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume().catch(()=>{});
    if (SFX[name]) {
      // Apply vol via temporary scale (just rescale gain output)
      const prev = sfxGain.gain.value;
      if (vol !== 1) sfxGain.gain.value = prev * vol;
      try { SFX[name](); } finally {
        if (vol !== 1) sfxGain.gain.value = prev;
      }
    }
  }

  // ═══════════════════════════════════════════════════════
  // MUSIC — Patterns stepped at 16th note resolution
  // ═══════════════════════════════════════════════════════
  // Each TRACK has:
  //   bpm: tempo
  //   layers: array of { type, vol, pattern, filter? }
  //     type: 'square' | 'triangle' | 'sawtooth' | 'sine' | 'noise'
  //     pattern: array of note strings or null (rest). For noise: 'X' = hit.
  //     filter: cutoff for noise layer
  // Pattern step = 16th note (4 steps per beat).

  const TRACKS = {

    // ───── TITLE — Detective noir, sombrío ─────
    title: {
      bpm: 70,
      layers: [
        // Walking bass (noir jazz feel)
        { type:'triangle', vol:0.20, pattern: [
          'A2',null,null,null,'A2',null,null,null,'C3',null,null,null,'E3',null,null,null,
          'A2',null,null,null,'A2',null,null,null,'G2',null,null,null,'F2',null,null,null,
          'E2',null,null,null,'E2',null,null,null,'F2',null,null,null,'G2',null,null,null,
          'A2',null,null,null,'C3',null,null,null,'B2',null,null,null,'E2',null,null,null
        ]},
        // Melancholy lead melody
        { type:'triangle', vol:0.13, pattern: [
          null,null,null,null,'A4',null,'C5',null,'B4',null,null,null,'A4',null,null,null,
          null,null,null,null,'A4',null,'G4',null,'F4',null,'G4',null,'A4',null,null,null,
          null,null,null,null,'E4',null,'G4',null,'A4',null,null,null,'C5',null,null,null,
          null,null,null,null,'B4',null,'A4',null,'G4',null,'F4',null,'E4',null,null,null
        ]},
        // Sparse high arp (mystery)
        { type:'sine', vol:0.05, pattern: [
          'A5',null,null,null,null,null,null,null,null,null,'C6',null,null,null,null,null,
          null,null,null,null,null,null,null,null,'E5',null,null,null,null,null,null,null,
          'A5',null,null,null,null,null,null,null,null,null,'B5',null,null,null,null,null,
          null,null,null,null,'C6',null,null,null,null,null,null,null,null,null,null,null
        ]}
      ]
    },

    // ───── FASE 1 — Detención: tensión, persecución ─────
    phase1_detencion: {
      bpm: 132,
      layers: [
        // Driving bass (urgent)
        { type:'square', vol:0.14, pattern: [
          'A2',null,'A2','A2','A2',null,'A2',null,'A2',null,'A2','A2','A2',null,'A2',null,
          'F2',null,'F2','F2','F2',null,'F2',null,'F2',null,'F2','F2','F2',null,'F2',null,
          'G2',null,'G2','G2','G2',null,'G2',null,'G2',null,'G2','G2','G2',null,'G2',null,
          'E2',null,'E2','E2','E2',null,'E2',null,'E2',null,'E2','E2','E2',null,'E2',null
        ]},
        // Fast arpeggio
        { type:'square', vol:0.08, pattern: [
          'A4','C5','E5','C5','A4','C5','E5','C5','A4','C5','E5','C5','A4','C5','E5','C5',
          'F4','A4','C5','A4','F4','A4','C5','A4','F4','A4','C5','A4','F4','A4','C5','A4',
          'G4','Bb4','D5','Bb4','G4','Bb4','D5','Bb4','G4','Bb4','D5','Bb4','G4','Bb4','D5','Bb4',
          'E4','G4','B4','G4','E4','G4','B4','G4','E4','G4','B4','G4','E4','G4','B4','G4'
        ]},
        // Drum hi-hat
        { type:'noise', vol:0.08, filter:5000, pattern: [
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null
        ]},
        // Kick on every beat
        { type:'noise', vol:0.16, filter:80, pattern: [
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null
        ]}
      ]
    },

    // ───── FASE 2 — Interrogatorio: claustrofóbico, reloj ─────
    phase2_interrogatorio: {
      bpm: 60,
      layers: [
        // Deep ominous bass
        { type:'sawtooth', vol:0.10, pattern: [
          'D2',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'D2',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'C2',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'Bb1',null,null,null,null,null,null,null,'A1',null,null,null,null,null,null,null
        ]},
        // Tick-tock clock
        { type:'noise', vol:0.07, filter:6500, pattern: [
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null
        ]},
        // Slow tense lead
        { type:'sine', vol:0.07, pattern: [
          null,null,null,null,null,null,null,null,'D4',null,null,null,null,null,'F4',null,
          'E4',null,null,null,'D4',null,null,null,null,null,null,null,null,null,null,null,
          null,null,null,null,null,null,null,null,'C4',null,null,null,null,null,'E4',null,
          'D4',null,null,null,'C4',null,null,null,'Bb3',null,null,null,'A3',null,null,null
        ]}
      ]
    },

    // ───── FASE 3 — Fiscalía: batalla RPG, agresivo ─────
    phase3_fiscalia: {
      bpm: 142,
      layers: [
        // Aggressive bass
        { type:'square', vol:0.14, pattern: [
          'D2','D2','D2','D2','A2',null,'A2',null,'D2','D2','D2','D2','C3',null,'A2',null,
          'D2','D2','D2','D2','A2',null,'A2',null,'Bb2',null,'C3',null,'D3',null,null,null,
          'G2','G2','G2','G2','D3',null,'D3',null,'G2','G2','G2','G2','F3',null,'D3',null,
          'A2','A2','A2','A2','E3',null,'E3',null,'F3',null,'G3',null,'A3',null,null,null
        ]},
        // Battle melody (dramatic)
        { type:'square', vol:0.10, pattern: [
          'D5','F5','A5','F5','A5','G5','F5','E5','D5','C5','D5','E5','F5','G5','A5','D5',
          'D5','F5','A5','F5','C6','Bb5','A5','G5','F5','E5','F5','G5','A5','D5','A5','D5',
          'G5','Bb5','D6','Bb5','D6','C6','Bb5','A5','G5','F5','G5','A5','Bb5','C6','D6','G5',
          'A5','C6','E6','C6','E6','D6','C6','Bb5','A5','G5','A5','Bb5','C6','D6','E6','A5'
        ]},
        // Snare/hat
        { type:'noise', vol:0.12, filter:3500, pattern: [
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X','X',
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,
          'X',null,'X',null,'X',null,'X',null,'X',null,'X',null,'X','X','X','X'
        ]},
        // Kick
        { type:'noise', vol:0.16, filter:100, pattern: [
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,'X','X',
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,
          'X',null,null,null,'X',null,null,null,'X',null,null,null,'X','X','X','X'
        ]}
      ]
    },

    // ───── FASE 4 — Defensor: esperanza incierta ─────
    phase4_defensor: {
      bpm: 92,
      layers: [
        { type:'triangle', vol:0.14, pattern: [
          'C3',null,null,null,'C3',null,null,null,'G2',null,null,null,'G2',null,null,null,
          'A2',null,null,null,'A2',null,null,null,'F2',null,null,null,'F2',null,null,null,
          'D3',null,null,null,'D3',null,null,null,'A2',null,null,null,'A2',null,null,null,
          'G2',null,null,null,'B2',null,null,null,'C3',null,null,null,'E3',null,'G3',null
        ]},
        // Gentle melody
        { type:'square', vol:0.09, pattern: [
          'E5',null,'G5',null,'C5',null,'E5',null,'D5',null,'F5',null,'G5',null,null,null,
          'A4',null,'C5',null,'E5',null,'C5',null,'F4',null,'A4',null,'C5',null,null,null,
          'D5',null,'F5',null,'A5',null,'F5',null,'A5',null,'G5',null,'F5',null,'E5',null,
          'B4',null,'D5',null,'G5',null,'D5',null,'C5',null,'E5',null,'G5',null,'C6',null
        ]},
        // Soft hi-hat
        { type:'noise', vol:0.04, filter:7000, pattern: [
          null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,
          null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,
          null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null,
          null,null,'X',null,null,null,'X',null,null,null,'X',null,null,null,'X',null
        ]}
      ]
    },

    // ───── FASE 5 — Juez: solemne, ceremonial ─────
    phase5_juez: {
      bpm: 58,
      layers: [
        // Deep organ bass
        { type:'sawtooth', vol:0.10, pattern: [
          'C2',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'G2',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'A2',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'F2',null,null,null,null,null,null,null,'G2',null,null,null,null,null,null,null
        ]},
        // Sustained chord
        { type:'triangle', vol:0.07, pattern: [
          'C4',null,null,null,null,null,null,null,'E4',null,null,null,null,null,null,null,
          'G4',null,null,null,null,null,null,null,'B3',null,null,null,null,null,null,null,
          'A3',null,null,null,null,null,null,null,'C4',null,null,null,null,null,null,null,
          'F4',null,null,null,null,null,null,null,'G4',null,null,null,'A4',null,null,null
        ]},
        // High celesta (sparse)
        { type:'sine', vol:0.06, pattern: [
          null,null,null,null,null,null,null,null,'C6',null,null,null,null,null,null,null,
          null,null,null,null,null,null,null,null,'G5',null,null,null,null,null,null,null,
          null,null,null,null,null,null,null,null,'E5',null,null,null,null,null,null,null,
          null,null,null,null,null,null,null,null,'C6',null,null,null,null,null,null,null
        ]}
      ]
    },

    // ───── ENDING BUENO — Agridulce ─────
    ending_good: {
      bpm: 100,
      layers: [
        { type:'triangle', vol:0.12, pattern: [
          'C3',null,null,null,'G3',null,null,null,'A3',null,null,null,'E3',null,null,null,
          'F3',null,null,null,'C4',null,null,null,'G3',null,null,null,'C3',null,null,null
        ]},
        { type:'square', vol:0.10, pattern: [
          'C5','E5','G5','C6','G5','E5','C5','E5','A4','C5','E5','A5','E5','C5','A4','C5',
          'F4','A4','C5','F5','C5','A4','F4','A4','G4','B4','D5','G5','C5','E5','G5','C6'
        ]}
      ]
    },

    // ───── ENDING MALO — Pesado, prisión ─────
    ending_bad: {
      bpm: 52,
      layers: [
        { type:'sawtooth', vol:0.13, pattern: [
          'A2',null,null,null,null,null,null,null,'G2',null,null,null,null,null,null,null,
          'F2',null,null,null,null,null,null,null,'E2',null,null,null,null,null,null,null
        ]},
        { type:'triangle', vol:0.08, pattern: [
          'A3',null,null,null,null,null,null,null,'G3',null,null,null,null,null,null,null,
          'F3',null,null,null,null,null,null,null,'E3',null,null,null,'D3',null,null,null
        ]},
        // Heavy tolling
        { type:'noise', vol:0.06, filter:200, pattern: [
          'X',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
          'X',null,null,null,null,null,null,null,null,null,null,null,null,null,null,null
        ]}
      ]
    },

    // ───── ENDING SECRETO — Misterioso, glitch ─────
    ending_secret: {
      bpm: 116,
      layers: [
        { type:'square', vol:0.10, pattern: [
          'D#3','F#3','A3','D#4','D#3','F#3','A3','D#4','D3','F3','A3','D4','D3','F3','A3','D4',
          'C#3','F3','G#3','C#4','C#3','F3','G#3','C#4','C3','E3','G3','C4','C3','E3','G3','C4'
        ]},
        { type:'sine', vol:0.06, pattern: [
          null,null,'A5',null,null,null,'D#6',null,null,null,'A5',null,null,null,'D#6',null,
          null,null,'G#5',null,null,null,'D#6',null,null,null,'G5',null,null,null,'C6',null
        ]},
        // Glitchy hi-hat (irregular)
        { type:'noise', vol:0.06, filter:8000, pattern: [
          'X',null,null,'X',null,'X','X',null,null,'X','X',null,'X',null,null,'X',
          null,'X',null,null,'X',null,'X','X',null,null,'X',null,'X','X',null,'X'
        ]}
      ]
    }
  };

  function _scheduleStep(track, step, time) {
    track.layers.forEach(layer => {
      const note = layer.pattern[step % layer.pattern.length];
      if (!note) return;
      const stepDur = 60 / track.bpm / 4;
      const dur = stepDur * 0.92;
      if (layer.type === 'noise') {
        _noiseAt(time, dur * 0.8, layer.vol, layer.filter || 2000);
      } else {
        const freq = noteToFreq(note);
        if (freq) _toneAt(freq, layer.type, time, dur, layer.vol);
      }
    });
  }

  function _startMusicLoop(trackName) {
    if (!ctx || !TRACKS[trackName]) return;
    const track = TRACKS[trackName];
    const stepDur = 60 / track.bpm / 4;
    _musicStep = 0;
    _musicStartTime = ctx.currentTime + 0.12;

    // Fade music gain in
    musicGain.gain.cancelScheduledValues(ctx.currentTime);
    musicGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    musicGain.gain.exponentialRampToValueAtTime(0.55, ctx.currentTime + 0.7);

    const scheduler = () => {
      if (currentTrack !== trackName) return;
      const lookahead = 0.30;
      const now = ctx.currentTime;
      while (_musicStartTime + _musicStep * stepDur < now + lookahead) {
        _scheduleStep(track, _musicStep, _musicStartTime + _musicStep * stepDur);
        _musicStep++;
      }
      _musicSchedulerId = setTimeout(scheduler, 60);
    };
    scheduler();
  }

  function _stopMusicLoop(rampMs=300) {
    if (_musicSchedulerId) { clearTimeout(_musicSchedulerId); _musicSchedulerId = null; }
    if (ctx && musicGain) {
      const now = ctx.currentTime;
      musicGain.gain.cancelScheduledValues(now);
      musicGain.gain.setValueAtTime(Math.max(0.0001, musicGain.gain.value), now);
      musicGain.gain.exponentialRampToValueAtTime(0.0001, now + rampMs / 1000);
    }
  }

  function playMusic(track) {
    if (track === currentTrack) return;
    const wasPlaying = !!_musicSchedulerId;
    currentTrack = track;

    if (!muted && unlocked && track && TRACKS[track]) {
      _ensureCtx();
      if (wasPlaying) {
        _stopMusicLoop(350);
        setTimeout(() => {
          if (currentTrack === track) _startMusicLoop(track);
        }, 380);
      } else {
        _startMusicLoop(track);
      }
    } else {
      _stopMusicLoop();
    }
  }

  function stopMusic() {
    currentTrack = null;
    _stopMusicLoop();
  }

  // ═══════════════════════════════════════════════════════
  // MUTE / UNLOCK / TOGGLE UI
  // ═══════════════════════════════════════════════════════

  function setMuted(v) {
    muted = !!v;
    try { localStorage.setItem(STORAGE_KEY, muted ? '1' : '0'); } catch(e){}
    if (ctx && masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(muted ? 0 : 0.5, ctx.currentTime + 0.2);
    }
    if (!muted && currentTrack && unlocked && !_musicSchedulerId) {
      _ensureCtx();
      _startMusicLoop(currentTrack);
    }
    _updateToggleBtn();
  }
  function toggleMute() { setMuted(!muted); }
  function isMuted() { return muted; }

  function unlock() {
    if (unlocked) return;
    unlocked = true;
    _ensureCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(()=>{});
    if (currentTrack && !muted) _startMusicLoop(currentTrack);
  }

  function _ensureToggleBtn() {
    if (toggleBtn) return;
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'audio-toggle';
    toggleBtn.title = 'Silenciar / Activar audio';
    toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMute(); });
    document.body.appendChild(toggleBtn);
    _updateToggleBtn();
  }
  function _updateToggleBtn() {
    if (!toggleBtn) return;
    toggleBtn.textContent = muted ? '🔇' : '🔊';
    toggleBtn.classList.toggle('muted', muted);
  }

  function init() {
    _ensureToggleBtn();
    const unlockOnce = () => unlock();
    // Capture phase so we unlock BEFORE any button click handler fires
    document.addEventListener('click', unlockOnce, true);
    document.addEventListener('keydown', unlockOnce, true);
    document.addEventListener('touchstart', unlockOnce, true);
  }

  return { init, playMusic, stopMusic, playSfx, setMuted, toggleMute, isMuted };
})();
