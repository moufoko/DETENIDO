// ═══════════════════════════════════════════════════════
// GAME STATE & FLOW
// ═══════════════════════════════════════════════════════

let G = {
  char: null,
  state: null,
  phase: 1,
  turn: 1,
  stats: { calm:70, pressure:20, cred:60, risk:30 },
  flags: {},
  sceneIdx: 0,
  lying: false,
  believeOwnLie: false,
  currentPhase: 0
};

// Soundtrack mapping per phase
const PHASE_TRACKS = {
  1: 'phase1_detencion',
  2: 'phase2_interrogatorio',
  3: 'phase3_fiscalia',
  4: 'phase4_defensor',
  5: 'phase5_juez'
};

// SFX por evento de fase
const PHASE_INTRO_SFX = {
  1: 'siren',
  5: 'gavel'
};

// Ambient particles por fase
const PHASE_AMBIENT = {
  1: 'rain',
  2: 'smoke',
  3: 'dust',
  4: 'dust',
  5: null
};

// ═══════════════════════════════════════════════════════
// STAT CHANGES + EFFECTS
// ═══════════════════════════════════════════════════════

function applyChanges(changes) {
  if (!changes) return;
  let totalBad = 0, totalGood = 0;
  Object.keys(changes).forEach(k => {
    if (G.stats[k] === undefined) return;
    const delta = changes[k];
    G.stats[k] += delta;
    floatStatDelta(k, delta);
    // calm + cred up are "good", pressure + risk up are "bad"
    const isGoodKey = (k === 'calm' || k === 'cred');
    if (isGoodKey ? delta > 0 : delta < 0) totalGood += Math.abs(delta);
    else totalBad += Math.abs(delta);
    if (Math.abs(delta) >= 15) {
      // big change effects
      if ((isGoodKey && delta > 0) || (!isGoodKey && delta < 0)) {
        Particles.emit('spark', undefined, undefined, 12);
      } else {
        Particles.emit('damage', undefined, undefined, 12);
      }
    }
  });
  if (totalBad >= 15) {
    shakeScene();
    flashScene('red');
    AudioMgr.playSfx('stat_down');
    // Hit the player sprite
    const rightCanvas = document.getElementById('sprite-right');
    if (rightCanvas) hitSprite(rightCanvas, 350);
  } else if (totalGood >= 15) {
    flashScene('green');
    AudioMgr.playSfx('stat_up');
  } else if (totalBad > 0) {
    AudioMgr.playSfx('stat_down');
  } else if (totalGood > 0) {
    AudioMgr.playSfx('stat_up');
  }
  updateStats(G.stats);
}

// ═══════════════════════════════════════════════════════
// SCENE RENDERING
// ═══════════════════════════════════════════════════════

function renderScene(sceneData) {
  if (!sceneData) { endGame(); return; }

  // Phase transition
  if (sceneData.phase !== G.currentPhase) {
    G.currentPhase = sceneData.phase;
    document.getElementById('phase-label').textContent = PHASE_NAMES[sceneData.phase] || 'FASE';
    // Music + lighting + ambient
    AudioMgr.playMusic(PHASE_TRACKS[sceneData.phase]);
    Lighting.setPhase(sceneData.phase);
    Particles.clear();
    if (PHASE_AMBIENT[sceneData.phase]) Particles.setAmbient(PHASE_AMBIENT[sceneData.phase]);
    if (PHASE_INTRO_SFX[sceneData.phase]) AudioMgr.playSfx(PHASE_INTRO_SFX[sceneData.phase]);
    showPhaseBanner(PHASE_NAMES[sceneData.phase], PHASE_SUBS[sceneData.phase], () => {});
  }

  document.getElementById('scene-location').textContent = sceneData.location;
  document.getElementById('left-name').textContent = sceneData.leftName;
  document.getElementById('right-name').textContent = CHARS[G.char].name;
  document.getElementById('turn-label').textContent = 'Turno ' + G.turn;

  // Background
  Backgrounds.set(sceneData.bg);

  // Sprites — register & switch sprite as needed
  const leftCanvas = document.getElementById('sprite-left');
  const rightCanvas = document.getElementById('sprite-right');
  registerSprite(leftCanvas, sceneData.left || 'cop');
  registerSprite(rightCanvas, CHARS[G.char].sprite);

  // Portrait in dialogue box uses the speaker sprite
  const portraitCanvas = document.getElementById('dialogue-portrait');
  if (portraitCanvas) registerSprite(portraitCanvas, sceneData.left || 'cop');

  // Speaker animation
  setSpriteTalking(leftCanvas, 3500);
  if (portraitCanvas) setSpriteTalking(portraitCanvas, 3500);

  document.getElementById('speaker-name').textContent = sceneData.leftName;
  document.getElementById('speaker-role').textContent = sceneData.leftRole;

  // Hide options until typewriter completes, then show them
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  setOptionsTitle('… escuchando');

  typeText('dialogue-text', sceneData.text, 42, () => AudioMgr.playSfx('type', 0.25), () => {
    // On typewriter complete: show options
    setOptionsTitle('⚔ ELIGE TU ACCIÓN — Turno del jugador');
    sceneData.options.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'btn';
      b.innerHTML = opt.text;
      b.onclick = () => chooseOption(opt);
      grid.appendChild(b);
    });
  });
}

function chooseOption(opt) {
  G.turn++;
  AudioMgr.playSfx('click');

  document.querySelectorAll('#options-grid .btn').forEach(b => b.classList.add('disabled'));

  if (opt.flag) G.flags[opt.flag] = true;

  if (opt.consequence) showNotif(opt.consequence, 8000);

  setTimeout(() => {
    applyChanges(opt.changes || {});

    if (opt.flag === 'lied' || opt.flag === 'lied_mp' || opt.flag === 'lied2') {
      G.lying = true;
      glitchScene();
      AudioMgr.playSfx('glitch');
      if (G.stats.pressure < 40 && G.stats.calm > 50) {
        G.believeOwnLie = true;
        setTimeout(() => showNotif('⚡ Tu historia se vuelve más convincente... incluso para ti.', 6000), 500);
      } else {
        setTimeout(() => showNotif('⚠️ Las mentiras acumuladas aumentan la presión.', 6000), 500);
      }
    }

    // Show CONTINUAR button (player-driven advance)
    setTimeout(() => {
      showContinueButton(() => {
        G.sceneIdx++;
        const scenes = STORY[G.char];
        if (opt.next === 'end' || G.sceneIdx >= scenes.length) {
          endGame();
        } else {
          renderScene(scenes[G.sceneIdx]);
        }
      });
    }, 700);
  }, 400);
}

// ═══════════════════════════════════════════════════════
// ENDINGS
// ═══════════════════════════════════════════════════════

function calcEnding() {
  const {calm, pressure, cred, risk} = G.stats;
  const f = G.flags;
  const char = G.char;

  if (f.snitched && cred < 40 && char === 'ratero') {
    return {
      type:'secret', color:'var(--purple)',
      title:'⚠️ FINAL SECRETO',
      verdict:'GIRO INESPERADO: El nombre que diste era el de otro ratero que sí fue el ladrón. El video pericial demostró que la chamarra era de otra persona. Quedas libre... pero en la colonia todos saben que cantaste.',
      law:'Art. 256 CNPP — Criterio de oportunidad. Art. 222 CP — Falsedad en declaraciones.',
      emoji:'😱'
    };
  }
  if (f.snitch && char === 'narco') {
    return {
      type:'secret', color:'var(--purple)',
      title:'⚠️ FINAL SECRETO',
      verdict:'Diste el nombre de tu jefe. El MP activó protocolo de testigo colaborador. Sales en 18 meses con identidad protegida... pero tu familia recibe una llamada amenazante esa noche.',
      law:'Art. 256 CNPP — Criterio de oportunidad. Ley Federal contra la Delincuencia Organizada.',
      emoji:'🕵️'
    };
  }

  if (char === 'loco') {
    if (f.accept_help || f.ask_help) {
      return {type:'good', color:'var(--blue)', title:'MEDIDA DE SEGURIDAD',
        verdict:'El juez dicta internamiento en institución psiquiátrica por 6 meses con revisiones periódicas. No hay condena penal. Es la primera vez en años que tienes cama, comida y alguien que te escucha.',
        law:'Art. 406-412 CNPP — Inimputabilidad. La medida de seguridad no es pena, es tratamiento.',emoji:'🏥'};
    }
    if (f.deny_mental) {
      return {type:'bad', color:'var(--red)', title:'PROCESO REGULAR',
        verdict:'Al negar tu condición, el juez no puede aplicar inimputabilidad. Proceso penal ordinario. 2 años de prisión con suspensión condicional si demuestras buen comportamiento.',
        law:'Art. 406 CNPP — La inimputabilidad debe ser reconocida por dictamen pericial aceptado.',emoji:'🔒'};
    }
    return {type:'neutral', color:'var(--gold)', title:'MEDIDA CAUTELAR',
      verdict:'Tratamiento ambulatorio obligatorio. Debes reportarte cada 15 días a la clínica. Sin hogar fijo, esto será difícil de cumplir.',
      law:'Art. 155 CNPP — Medidas cautelares distintas a la prisión.',emoji:'📋'};
  }

  const score = (calm + cred) - (pressure + risk);

  if (f.no_lawyer) {
    return {type:'bad', color:'var(--red)', title:'SIN DEFENSA',
      verdict:'Fuiste a audiencia sin abogado. El juez designó uno de oficio al último momento. Sin preparación, la defensa fue mínima. Vinculación a proceso y prisión preventiva de 3 meses.',
      law:'Art. 128 Fr. VIII CNPP — Derecho irrenunciable a defensa adecuada.',emoji:'⚠️'};
  }

  if (f.bribe) {
    return {type:'bad', color:'var(--red)', title:'CASO AGRAVADO',
      verdict:'El intento de soborno se sumó al expediente. Ahora enfrentas dos cargos: el original y cohecho. Pena incrementada. La deshonestidad te costó más que el delito.',
      law:'Art. 222 CP Federal — Cohecho. Pena de 3 a 12 años adicionales.',emoji:'💸'};
  }

  if (score > 60) {
    return {type:'good', color:'var(--green)', title:'LIBERTAD — FALTA DE PRUEBAS',
      verdict:'El juez no encontró pruebas suficientes para vincular a proceso. Detención ilegal o evidencia insuficiente. Quedas libre. Pero el expediente existe. Siempre existirá.',
      law:'Art. 316 CNPP — No vinculación por insuficiencia probatoria.',emoji:'🚪'};
  }
  if (score > 20) {
    return {type:'neutral', color:'var(--gold)', title:'MEDIDAS CAUTELARES',
      verdict:'El juez dicta medidas cautelares: presentación periódica cada 8 días, prohibición de salir del estado y garantía económica de $5,000 pesos. No es la cárcel... pero tampoco es libertad.',
      law:'Art. 155 CNPP — Medidas cautelares distintas a la prisión preventiva.',emoji:'📎'};
  }
  if (score > -20) {
    return {type:'bad', color:'var(--red)', title:'PRISIÓN PREVENTIVA',
      verdict:'Vinculación a proceso con prisión preventiva justificada. Esperas el juicio oral desde el CERESO. Promedio de espera: 14 meses. Tu familia viene a visitarte los domingos.',
      law:'Art. 19 CPEUM — Prisión preventiva justificada. Art. 167 CNPP.',emoji:'🔒'};
  }
  return {type:'worst', color:'var(--red)', title:'SENTENCIA CONDENATORIA ANTICIPADA',
    verdict:'Tu perfil, tus contradicciones y tu actitud durante el proceso llevaron al MP a ofrecer un procedimiento abreviado. Lo aceptaste sin entender lo que firmabas. 4 años de prisión.',
    law:'Art. 201-207 CNPP — Procedimiento abreviado. Siempre pide leer antes de firmar.',emoji:'⛓️'};
}

function endGame() {
  const ending = calcEnding();

  document.getElementById('ending-title').textContent = ending.title;
  document.getElementById('ending-title').style.color = ending.color;
  document.getElementById('ending-verdict').textContent = ending.emoji + '  ' + ending.verdict;
  document.getElementById('ending-law-note').innerHTML = '📜 ' + ending.law;

  document.getElementById('end-calm').textContent = G.stats.calm;
  document.getElementById('end-pressure').textContent = G.stats.pressure;
  document.getElementById('end-cred').textContent = G.stats.cred;
  document.getElementById('end-risk').textContent = G.stats.risk;

  const endSpriteCanvas = document.getElementById('ending-sprite');
  registerSprite(endSpriteCanvas, CHARS[G.char].sprite);

  // Ending music + particles + stinger SFX
  Particles.clear();
  if (ending.type === 'good') {
    AudioMgr.playSfx('win');
    AudioMgr.playMusic('ending_good');
    setTimeout(() => Particles.emit('confetti', undefined, undefined, 60), 300);
    setTimeout(() => Particles.emit('confetti', undefined, undefined, 60), 1200);
  } else if (ending.type === 'secret') {
    AudioMgr.playSfx('glitch');
    AudioMgr.playMusic('ending_secret');
    Particles.setAmbient('smoke');
  } else {
    AudioMgr.playSfx('lose');
    setTimeout(() => AudioMgr.playSfx('handcuffs'), 400);
    setTimeout(() => AudioMgr.playSfx('door_close'), 900);
    AudioMgr.playMusic('ending_bad');
    Particles.setAmbient('ash');
  }

  Lighting.clear();
  showScreen('ending-screen');
}

// ═══════════════════════════════════════════════════════
// FLOW
// ═══════════════════════════════════════════════════════

function startGame() {
  AudioMgr.playSfx('click');
  showScreen('char-screen');
  setTimeout(() => {
    registerSprite(document.getElementById('sp-ratero'), 'ratero');
    registerSprite(document.getElementById('sp-narco'), 'narco');
    registerSprite(document.getElementById('sp-loco'), 'loco');
  }, 50);
}

function selectChar(c) {
  AudioMgr.playSfx('click');
  G.char = c;
  showScreen('state-screen');
  renderStateSelect();
}

function renderStateSelect() {
  const grid = document.getElementById('state-grid');
  grid.innerHTML = '';
  STATES.forEach(s => {
    const b = document.createElement('button');
    b.className = 'state-option';
    b.innerHTML = `<div style="color:var(--white);margin-bottom:4px">${s.name}</div><div style="font-size:6px;line-height:1.8">${s.note}</div>`;
    b.onclick = () => selectState(s);
    grid.appendChild(b);
  });
}

function selectState(s) {
  AudioMgr.playSfx('click');
  G.state = s;
  G.flags = {};
  G.turn = 1;
  G.sceneIdx = 0;
  G.currentPhase = 0;
  G.lying = false;
  G.believeOwnLie = false;

  const ch = CHARS[G.char];
  G.stats = {
    calm: ch.startCalm,
    pressure: ch.startPressure,
    cred: ch.startCred,
    risk: ch.startRisk
  };

  if (s.bonus === 'police_pressure') { G.stats.pressure += 10; G.stats.calm -= 5; }
  if (s.bonus === 'fiscal_aggressive') { G.stats.risk += 10; }
  if (s.bonus === 'corruption_risk') { G.stats.cred -= 5; }

  showScreen('game-ui');
  document.getElementById('char-label-top').textContent = 'Personaje: ' + ch.name;
  document.getElementById('state-label-top').textContent = 'Estado: ' + s.name;
  updateStats(G.stats);

  // Attach scene-area renderers (only once, but safe to re-call)
  const bgCanvas = document.getElementById('scene-bg-canvas');
  const particleCanvas = document.getElementById('particles-canvas');
  const lightOverlay = document.getElementById('lighting-overlay');
  Backgrounds.attach(bgCanvas);
  Particles.attach(particleCanvas);
  Lighting.attach(lightOverlay);

  showPhaseBanner('DETENIDO', ch.intro, () => {
    renderScene(STORY[G.char][0]);
  });
}

function restartGame() {
  AudioMgr.playSfx('click');
  G = { char:null, state:null, phase:1, turn:1, stats:{calm:70,pressure:20,cred:60,risk:30}, flags:{}, sceneIdx:0, lying:false, believeOwnLie:false, currentPhase:0 };
  Particles.clear();
  Lighting.clear();
  AudioMgr.playMusic('title');
  showScreen('title-screen');
}

function showCredits() {
  showNotif('DETENIDO — RPG Legal Mexicano\nBasado en CNPP 2014\nFines educativos. No promueve delitos.', 4000);
}

// ═══════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════

window.addEventListener('load', () => {
  AudioMgr.init();
  setTimeout(() => {
    registerSprite(document.getElementById('cop-sprite'), 'cop');
    registerSprite(document.getElementById('suspect-sprite'), 'ratero');
    AudioMgr.playMusic('title');
  }, 100);

  // Click on dialogue box to instantly complete typewriter
  const dlg = document.querySelector('.dialogue-box');
  if (dlg) {
    dlg.addEventListener('click', (e) => {
      if (skipTypewriter()) e.stopPropagation();
    });
    dlg.style.cursor = 'pointer';
    dlg.title = 'Click para completar el texto';
  }
});
