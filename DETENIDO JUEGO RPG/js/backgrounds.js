// ═══════════════════════════════════════════════════════
// BACKGROUNDS — Escenarios pixel art procedural por fase
// ═══════════════════════════════════════════════════════
// Cada función dibuja un fondo en un canvas dado. Reciben (ctx, w, h, t)
// donde t = performance.now() para animar elementos sutiles.

const Backgrounds = (() => {

  function _rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
  }

  // === Calle nocturna ===
  function street_night(ctx, w, h, t) {
    // Cielo nocturno
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.7);
    sky.addColorStop(0, '#0a0a1a');
    sky.addColorStop(1, '#1a1a3a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.7);

    // Estrellas (deterministic)
    ctx.fillStyle = '#e8e8f0';
    for (let i = 0; i < 25; i++) {
      const sx = (i * 73) % w;
      const sy = (i * 41) % (h * 0.5);
      const twinkle = (Math.sin(t * 0.001 + i) * 0.5 + 0.5);
      ctx.globalAlpha = 0.3 + twinkle * 0.5;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1;

    // Luna
    _rect(ctx, w - 80, 20, 30, 30, '#f5f5e8');
    _rect(ctx, w - 75, 25, 20, 20, '#dcdcc8');

    // Edificios al fondo (siluetas)
    _rect(ctx, 0, h * 0.4, w * 0.25, h * 0.3, '#0a0a14');
    _rect(ctx, w * 0.25, h * 0.35, w * 0.2, h * 0.35, '#0c0c18');
    _rect(ctx, w * 0.45, h * 0.45, w * 0.18, h * 0.25, '#0a0a14');
    _rect(ctx, w * 0.63, h * 0.32, w * 0.22, h * 0.38, '#0c0c18');
    _rect(ctx, w * 0.85, h * 0.42, w * 0.15, h * 0.28, '#0a0a14');

    // Ventanas iluminadas
    ctx.fillStyle = '#ffd060';
    const winRows = 5, winCols = 12;
    for (let r = 0; r < winRows; r++) {
      for (let c = 0; c < winCols; c++) {
        const lit = ((c * 7 + r * 13) % 5) < 2;
        if (lit) {
          const wx = 20 + c * (w / winCols);
          const wy = h * 0.4 + r * (h * 0.05);
          ctx.fillRect(wx, wy, 4, 5);
        }
      }
    }

    // Calle (asfalto)
    _rect(ctx, 0, h * 0.7, w, h * 0.3, '#1a1a22');
    // Banqueta
    _rect(ctx, 0, h * 0.68, w, 6, '#2a2a32');
    // Línea blanca discontinua
    ctx.fillStyle = '#f5f5e0';
    for (let lx = 10; lx < w; lx += 30) {
      ctx.fillRect(lx, h * 0.85, 15, 3);
    }

    // Faroles
    for (let i = 0; i < 3; i++) {
      const lx = w * 0.15 + i * (w * 0.35);
      _rect(ctx, lx, h * 0.45, 3, h * 0.25, '#2a2a3a');
      _rect(ctx, lx - 6, h * 0.43, 15, 4, '#3a3a4a');
      // Glow
      const glow = ctx.createRadialGradient(lx, h * 0.45, 0, lx, h * 0.45, 60);
      glow.addColorStop(0, 'rgba(255,200,100,0.4)');
      glow.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(lx - 60, h * 0.4, 120, 120);
    }
  }

  // === Patrulla (interior coche) ===
  function patrol_car(ctx, w, h, t) {
    // Cielo nocturno por ventana
    _rect(ctx, 0, 0, w, h * 0.4, '#0a0a1a');
    // Movimiento de luces (línea de luz que pasa)
    const lightX = (t * 0.15) % (w + 200) - 100;
    const lg = ctx.createLinearGradient(lightX - 80, 0, lightX + 80, 0);
    lg.addColorStop(0, 'rgba(255,200,100,0)');
    lg.addColorStop(0.5, 'rgba(255,200,100,0.5)');
    lg.addColorStop(1, 'rgba(255,200,100,0)');
    ctx.fillStyle = lg;
    ctx.fillRect(0, h * 0.1, w, h * 0.3);

    // Marco de ventana (interior del coche)
    _rect(ctx, 0, 0, w, h * 0.05, '#0a0a14');
    _rect(ctx, 0, h * 0.4, w, h * 0.05, '#0a0a14');
    _rect(ctx, 0, 0, 30, h * 0.45, '#0a0a14');
    _rect(ctx, w - 30, 0, 30, h * 0.45, '#0a0a14');

    // Interior del coche (negro/azul)
    _rect(ctx, 0, h * 0.45, w, h * 0.55, '#0c1020');

    // Reja divisoria (siluetas verticales)
    ctx.fillStyle = '#1a1a2a';
    for (let bx = 40; bx < w - 40; bx += 18) {
      ctx.fillRect(bx, h * 0.5, 3, h * 0.5);
    }

    // Luces parpadeantes patrulla (rojo/azul)
    const flash = Math.floor(t / 300) % 2;
    if (flash === 0) {
      const lg2 = ctx.createRadialGradient(w * 0.2, 0, 0, w * 0.2, 0, w * 0.4);
      lg2.addColorStop(0, 'rgba(232,64,64,0.35)');
      lg2.addColorStop(1, 'rgba(232,64,64,0)');
      ctx.fillStyle = lg2;
      ctx.fillRect(0, 0, w, h * 0.4);
    } else {
      const lg2 = ctx.createRadialGradient(w * 0.8, 0, 0, w * 0.8, 0, w * 0.4);
      lg2.addColorStop(0, 'rgba(74,143,255,0.35)');
      lg2.addColorStop(1, 'rgba(74,143,255,0)');
      ctx.fillStyle = lg2;
      ctx.fillRect(0, 0, w, h * 0.4);
    }
  }

  // === Estación / Recepción ===
  function station(ctx, w, h, t) {
    // Pared color institucional
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#3a3a45');
    wall.addColorStop(1, '#2a2a35');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);

    // Suelo (mosaico)
    _rect(ctx, 0, h * 0.7, w, h * 0.3, '#1a1a22');
    ctx.fillStyle = '#2a2a32';
    for (let fx = 0; fx < w; fx += 32) {
      for (let fy = h * 0.7; fy < h; fy += 16) {
        ctx.fillRect(fx, fy, 16, 8);
      }
    }

    // Mostrador
    _rect(ctx, w * 0.3, h * 0.55, w * 0.4, h * 0.18, '#3a2a1a');
    _rect(ctx, w * 0.3, h * 0.53, w * 0.4, 4, '#4a3a2a');

    // Bandera mexicana detrás
    _rect(ctx, w * 0.42, h * 0.15, w * 0.16, h * 0.3, '#3a3a3a');
    _rect(ctx, w * 0.42, h * 0.15, w * 0.053, h * 0.3, '#006847');
    _rect(ctx, w * 0.42 + w * 0.053, h * 0.15, w * 0.053, h * 0.3, '#ffffff');
    _rect(ctx, w * 0.42 + w * 0.106, h * 0.15, w * 0.054, h * 0.3, '#ce1126');

    // Cartel "POLICÍA"
    _rect(ctx, w * 0.1, h * 0.1, w * 0.2, h * 0.08, '#1a3a8a');
    ctx.fillStyle = '#ffeb3b';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('POLICÍA', w * 0.2, h * 0.16);
    ctx.textAlign = 'start';

    // Luz fluorescente parpadeo
    if (Math.floor(t / 100) % 47 < 2) {
      _rect(ctx, 0, 0, w, h, 'rgba(0,0,0,0.4)');
    }
  }

  // === Sala de interrogatorio ===
  function interrogation(ctx, w, h, t) {
    // Pared gris sucia
    _rect(ctx, 0, 0, w, h, '#2a2820');
    // Manchas/textura
    ctx.fillStyle = '#1f1d18';
    for (let i = 0; i < 60; i++) {
      const sx = (i * 53) % w;
      const sy = (i * 37) % h;
      ctx.fillRect(sx, sy, 3, 2);
    }

    // Espejo unidireccional (rectángulo brillante)
    _rect(ctx, w * 0.05, h * 0.15, w * 0.4, h * 0.4, '#1a1a22');
    _rect(ctx, w * 0.06, h * 0.16, w * 0.38, h * 0.38, '#3a3a4a');
    // Reflejo
    const refl = ctx.createLinearGradient(w * 0.06, h * 0.16, w * 0.44, h * 0.54);
    refl.addColorStop(0, 'rgba(180,200,230,0.4)');
    refl.addColorStop(0.5, 'rgba(80,90,110,0.2)');
    refl.addColorStop(1, 'rgba(180,200,230,0.4)');
    ctx.fillStyle = refl;
    ctx.fillRect(w * 0.06, h * 0.16, w * 0.38, h * 0.38);

    // Foco colgante
    const swing = Math.sin(t * 0.001) * 4;
    const focusX = w * 0.7 + swing;
    _rect(ctx, focusX, 0, 2, h * 0.2, '#1a1a1a');
    _rect(ctx, focusX - 8, h * 0.18, 18, 6, '#2a2a2a');
    _rect(ctx, focusX - 6, h * 0.22, 14, 8, '#3a3a3a');

    // Halo del foco (con flicker)
    const flicker = (Math.sin(t * 0.005) * 0.1) + (Math.random() < 0.02 ? -0.3 : 0);
    const halo = ctx.createRadialGradient(focusX + 2, h * 0.25, 0, focusX + 2, h * 0.25, w * 0.5);
    halo.addColorStop(0, `rgba(255,220,120,${0.5 + flicker})`);
    halo.addColorStop(0.5, 'rgba(255,200,80,0.15)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);

    // Mesa
    _rect(ctx, w * 0.2, h * 0.65, w * 0.6, h * 0.08, '#3a3530');
    _rect(ctx, w * 0.2, h * 0.65, w * 0.6, 3, '#5a504a');

    // Suelo
    _rect(ctx, 0, h * 0.85, w, h * 0.15, '#1a1612');
  }

  // === Tribunal / Audiencia ===
  function court(ctx, w, h, t) {
    // Pared con madera
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#3a2818');
    wall.addColorStop(0.6, '#4a3520');
    wall.addColorStop(1, '#2a1810');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);

    // Paneles de madera
    ctx.fillStyle = '#5a4028';
    for (let px = 0; px < w; px += 40) {
      ctx.fillRect(px, 0, 2, h * 0.7);
    }

    // Bandera mexicana grande detrás
    const flagX = w * 0.35, flagY = h * 0.05, flagW = w * 0.3, flagH = h * 0.4;
    _rect(ctx, flagX - 3, flagY - 3, flagW + 6, flagH + 6, '#1a1208');
    _rect(ctx, flagX, flagY, flagW / 3, flagH, '#006847');
    _rect(ctx, flagX + flagW / 3, flagY, flagW / 3, flagH, '#ffffff');
    _rect(ctx, flagX + (flagW / 3) * 2, flagY, flagW / 3, flagH, '#ce1126');
    // Escudo (simple círculo)
    ctx.fillStyle = '#5a3a1a';
    ctx.beginPath();
    ctx.arc(flagX + flagW / 2, flagY + flagH / 2, flagH * 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Estrado
    _rect(ctx, w * 0.15, h * 0.55, w * 0.7, h * 0.2, '#3a2515');
    _rect(ctx, w * 0.15, h * 0.55, w * 0.7, 4, '#6a4a2a');

    // Balanza de la justicia
    const bx = w * 0.85, by = h * 0.2;
    _rect(ctx, bx, by, 3, h * 0.25, '#a08040');
    _rect(ctx, bx - 18, by, 39, 3, '#a08040');
    _rect(ctx, bx - 20, by + 8, 12, 8, '#a08040');
    _rect(ctx, bx + 9, by + 8, 12, 8, '#a08040');
    // Mazo en el estrado
    _rect(ctx, w * 0.45, h * 0.62, 20, 5, '#4a2a14');
    _rect(ctx, w * 0.5, h * 0.6, 4, 12, '#3a1f0a');

    // Suelo madera
    _rect(ctx, 0, h * 0.75, w, h * 0.25, '#1a1208');
    ctx.fillStyle = '#2a1a0a';
    for (let fy = h * 0.78; fy < h; fy += 12) {
      ctx.fillRect(0, fy, w, 1);
    }
  }

  // === Defensor / Sala de espera ===
  function defender(ctx, w, h, t) {
    // Pared azul institucional
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#1a2a3a');
    wall.addColorStop(1, '#0f1a28');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);

    // Línea horizontal divisoria
    _rect(ctx, 0, h * 0.45, w, 3, '#3a4a5a');

    // Ventana con barrotes (a la izquierda)
    _rect(ctx, w * 0.05, h * 0.12, w * 0.3, h * 0.3, '#0a0a14');
    _rect(ctx, w * 0.06, h * 0.13, w * 0.28, h * 0.28, '#1a2a4a');
    // Barrotes
    ctx.fillStyle = '#2a2a35';
    for (let bx = w * 0.06; bx < w * 0.35; bx += w * 0.045) {
      ctx.fillRect(bx, h * 0.13, 3, h * 0.28);
    }

    // Mesa
    _rect(ctx, w * 0.25, h * 0.6, w * 0.5, h * 0.1, '#2a3a4a');
    _rect(ctx, w * 0.25, h * 0.6, w * 0.5, 3, '#4a5a6a');
    // Documentos
    _rect(ctx, w * 0.4, h * 0.62, 15, 10, '#e8e8d8');
    _rect(ctx, w * 0.45, h * 0.63, 15, 10, '#e8e8d8');
    _rect(ctx, w * 0.55, h * 0.62, 15, 10, '#e8e8d8');

    // Teléfono
    _rect(ctx, w * 0.7, h * 0.6, 12, 8, '#1a1a1a');
    _rect(ctx, w * 0.71, h * 0.58, 10, 3, '#2a2a2a');

    // Reloj de pared
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.2, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f5f5e0';
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.2, 15, 0, Math.PI * 2);
    ctx.fill();
    // Manecillas
    const minRad = (t * 0.001) % (Math.PI * 2);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.85, h * 0.2);
    ctx.lineTo(w * 0.85 + Math.cos(minRad - Math.PI / 2) * 12, h * 0.2 + Math.sin(minRad - Math.PI / 2) * 12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.85, h * 0.2);
    ctx.lineTo(w * 0.85 + Math.cos(minRad * 0.1 - Math.PI / 2) * 8, h * 0.2 + Math.sin(minRad * 0.1 - Math.PI / 2) * 8);
    ctx.stroke();

    // Suelo
    _rect(ctx, 0, h * 0.85, w, h * 0.15, '#0a1018');
  }

  // === Estrado del juez ===
  function judge(ctx, w, h, t) {
    // Fondo madera oscura
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#2a1808');
    wall.addColorStop(1, '#1a0e04');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);

    // Vitrales arriba
    for (let i = 0; i < 5; i++) {
      const vx = w * 0.1 + i * w * 0.2;
      _rect(ctx, vx, h * 0.05, w * 0.12, h * 0.15, '#1a3a5a');
      // Patrón
      ctx.fillStyle = ['#5a8aaa','#aa5a5a','#aa8a3a','#5aaa5a','#5a5aaa'][i];
      ctx.fillRect(vx + 4, h * 0.07, w * 0.1, h * 0.05);
      ctx.fillStyle = '#3a5a7a';
      ctx.fillRect(vx + 4, h * 0.13, w * 0.1, h * 0.05);
    }

    // Estrado elevado (centro)
    _rect(ctx, w * 0.2, h * 0.4, w * 0.6, h * 0.4, '#3a2818');
    _rect(ctx, w * 0.2, h * 0.4, w * 0.6, 6, '#6a4a2a');
    // Borde frontal con grabado
    _rect(ctx, w * 0.2, h * 0.55, w * 0.6, 3, '#6a4a2a');
    _rect(ctx, w * 0.2, h * 0.7, w * 0.6, 3, '#6a4a2a');

    // Mazo en el estrado
    const mazoBob = Math.sin(t * 0.001) * 1;
    _rect(ctx, w * 0.62, h * 0.42 + mazoBob, 30, 6, '#5a3a1a');
    _rect(ctx, w * 0.66, h * 0.38 + mazoBob, 6, 14, '#4a2a14');

    // Balanza grande detrás
    const bx = w * 0.5, by = h * 0.15;
    _rect(ctx, bx - 1, by, 3, h * 0.2, '#c8a040');
    _rect(ctx, bx - 35, by, 73, 3, '#c8a040');
    // Platillos
    _rect(ctx, bx - 40, by + 12, 18, 3, '#c8a040');
    _rect(ctx, bx + 22, by + 12, 18, 3, '#c8a040');
    _rect(ctx, bx - 38, by + 15, 14, 6, '#a07020');
    _rect(ctx, bx + 24, by + 15, 14, 6, '#a07020');
    // Pedestal
    _rect(ctx, bx - 5, by + h * 0.2, 13, 6, '#c8a040');

    // Suelo
    _rect(ctx, 0, h * 0.85, w, h * 0.15, '#0a0604');
  }

  // === Hospital / CAISAME ===
  function hospital(ctx, w, h, t) {
    // Pared blanca clínica
    const wall = ctx.createLinearGradient(0, 0, 0, h);
    wall.addColorStop(0, '#d0d8e0');
    wall.addColorStop(1, '#a0a8b0');
    ctx.fillStyle = wall;
    ctx.fillRect(0, 0, w, h);

    // Línea verde de hospital
    _rect(ctx, 0, h * 0.6, w, 4, '#42c874');

    // Camilla
    _rect(ctx, w * 0.15, h * 0.65, w * 0.35, h * 0.12, '#f5f5f5');
    _rect(ctx, w * 0.15, h * 0.65, w * 0.35, 3, '#dadadc');
    // Patas
    _rect(ctx, w * 0.16, h * 0.77, 3, h * 0.08, '#9a9a9a');
    _rect(ctx, w * 0.49, h * 0.77, 3, h * 0.08, '#9a9a9a');

    // Cruz de hospital
    _rect(ctx, w * 0.7, h * 0.15, 16, 36, '#c84040');
    _rect(ctx, w * 0.7 - 10, h * 0.22, 36, 16, '#c84040');

    // Monitor médico (línea ECG)
    _rect(ctx, w * 0.65, h * 0.45, w * 0.25, h * 0.15, '#1a1a1a');
    _rect(ctx, w * 0.66, h * 0.46, w * 0.23, h * 0.13, '#0a3a1a');
    ctx.strokeStyle = '#42c874';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const baseY = h * 0.52;
    let lineX = w * 0.66;
    const lineEnd = w * 0.89;
    const phase = (t * 0.003) % 1;
    while (lineX < lineEnd) {
      const localT = (lineX - w * 0.66) / (lineEnd - w * 0.66) - phase;
      let y = baseY;
      if (localT > 0.4 && localT < 0.5) y = baseY - 18 * Math.sin((localT - 0.4) * Math.PI * 10);
      ctx.lineTo(lineX, y);
      lineX += 2;
    }
    ctx.stroke();

    // Suelo
    _rect(ctx, 0, h * 0.85, w, h * 0.15, '#7a8088');
  }

  const HANDLERS = {
    street_night, patrol_car, station, interrogation, court, defender, judge, hospital
  };

  let currentBg = null;
  let canvas = null;
  let ctx = null;
  let _rafId = null;

  function attach(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    _resize();
    window.addEventListener('resize', _resize);
    _loop();
  }

  function _resize() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(100, Math.floor(r.width));
    canvas.height = Math.max(100, Math.floor(r.height));
  }

  function set(bgName) {
    currentBg = bgName;
    _resize();
  }

  function _loop() {
    if (canvas && ctx && currentBg && HANDLERS[currentBg]) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      HANDLERS[currentBg](ctx, canvas.width, canvas.height, performance.now());
    } else if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    _rafId = requestAnimationFrame(_loop);
  }

  return { attach, set };
})();
