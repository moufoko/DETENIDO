// ═══════════════════════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════════════════════

const Particles = (() => {
  let canvas = null, ctx = null;
  let particles = [];
  let ambientEmitter = null; // function(dt) llamada en cada tick
  let lastTick = performance.now();

  function attach(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    _resize();
    window.addEventListener('resize', _resize);
    requestAnimationFrame(_loop);
  }

  function _resize() {
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(100, Math.floor(r.width));
    canvas.height = Math.max(100, Math.floor(r.height));
  }

  function _spawn(p) { particles.push(p); }

  function emit(type, x, y, count=10) {
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    if (x === undefined) x = w / 2;
    if (y === undefined) y = h / 2;
    switch (type) {
      case 'smoke':
        for (let i = 0; i < count; i++) _spawn({
          type, x: x + (Math.random()-0.5)*20, y, vx: (Math.random()-0.5)*0.3, vy: -0.4-Math.random()*0.4,
          life: 1, decay: 0.005, size: 4+Math.random()*6, color: '180,180,180'
        });
        break;
      case 'rain':
        for (let i = 0; i < count; i++) _spawn({
          type, x: Math.random()*w, y: -10, vx: -0.5, vy: 6+Math.random()*3,
          life: 1, decay: 0.01, size: 1, color: '180,200,230'
        });
        break;
      case 'dust':
        for (let i = 0; i < count; i++) _spawn({
          type:'dust', x: Math.random()*w, y: -5, vx: (Math.random()-0.5)*0.5, vy: 0.3+Math.random()*0.5,
          life: 1, decay: 0.004, size: 2, color: '245,200,66'
        });
        break;
      case 'spark':
        for (let i = 0; i < count; i++) {
          const ang = Math.random() * Math.PI * 2;
          const sp = 2 + Math.random() * 3;
          _spawn({
            type, x, y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp,
            life: 1, decay: 0.025, size: 3, color: '66,200,116'
          });
        }
        break;
      case 'damage':
        for (let i = 0; i < count; i++) {
          const ang = Math.random() * Math.PI * 2;
          const sp = 1.5 + Math.random() * 2.5;
          _spawn({
            type, x, y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp,
            life: 1, decay: 0.03, size: 3, color: '232,64,64'
          });
        }
        break;
      case 'confetti':
        for (let i = 0; i < count; i++) {
          const colors = ['255,215,80','232,64,64','66,200,116','74,143,255','155,93,229'];
          _spawn({
            type, x: Math.random()*w, y: -10,
            vx: (Math.random()-0.5)*1.5, vy: 1+Math.random()*2,
            spin: (Math.random()-0.5)*0.2, angle: 0,
            life: 1, decay: 0.004, size: 4+Math.random()*4,
            color: colors[Math.floor(Math.random()*colors.length)]
          });
        }
        break;
      case 'ash':
        for (let i = 0; i < count; i++) _spawn({
          type:'ash', x: Math.random()*w, y: -10, vx: (Math.random()-0.5)*0.4, vy: 0.4+Math.random()*0.6,
          life: 1, decay: 0.0025, size: 2+Math.random()*2, color: '120,120,130'
        });
        break;
    }
  }

  function setAmbient(type) {
    // Continuous emitter (called every tick with dt)
    ambientEmitter = null;
    if (!type) return;
    const intervalMap = {
      rain: { every: 80, count: 3, kind: 'rain' },
      smoke: { every: 600, count: 1, kind: 'smoke', x: 'right' },
      ash: { every: 300, count: 1, kind: 'ash' },
      dust: { every: 1000, count: 2, kind: 'dust' }
    };
    const cfg = intervalMap[type];
    if (!cfg) return;
    let acc = 0;
    ambientEmitter = (dt) => {
      acc += dt;
      while (acc >= cfg.every) {
        acc -= cfg.every;
        let x, y;
        if (cfg.x === 'right' && canvas) { x = canvas.width * 0.7; y = canvas.height * 0.7; }
        emit(cfg.kind, x, y, cfg.count);
      }
    };
  }

  function clear() {
    particles = [];
    ambientEmitter = null;
  }

  function _update(dt) {
    if (ambientEmitter) ambientEmitter(dt);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.life -= p.decay * (dt / 16);
      if (p.spin !== undefined) p.angle += p.spin * (dt / 16);
      // gravity for some
      if (p.type === 'spark' || p.type === 'damage') p.vy += 0.15 * (dt / 16);
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function _render() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
      ctx.fillStyle = `rgb(${p.color})`;
      if (p.type === 'rain') {
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 1, 6);
      } else if (p.type === 'confetti') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.5);
        ctx.restore();
      } else if (p.type === 'smoke' || p.type === 'ash') {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(Math.floor(p.x - p.size/2), Math.floor(p.y - p.size/2), p.size, p.size);
      }
    }
    ctx.globalAlpha = 1;
  }

  function _loop(now) {
    const dt = Math.min(50, now - lastTick);
    lastTick = now;
    _update(dt);
    _render();
    requestAnimationFrame(_loop);
  }

  return { attach, emit, setAmbient, clear };
})();
