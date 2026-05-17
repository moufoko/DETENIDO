// ═══════════════════════════════════════════════════════
// UI HELPERS — Pantallas, diálogo, notif, banner, stats
// ═══════════════════════════════════════════════════════

function showScreen(id) {
  ['title-screen','char-screen','state-screen','game-ui','ending-screen'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) target.style.display = 'flex';
}

let typeTimer;
let typeState = { active:false, text:'', elId:null, onComplete:null };
function typeText(elId, text, speed=40, onTypeChar, onComplete) {
  const el = document.getElementById(elId);
  el.textContent = '';
  let i = 0;
  clearInterval(typeTimer);
  typeState = { active:true, text, elId, onComplete };
  typeTimer = setInterval(() => {
    el.textContent += text[i] || '';
    if (onTypeChar && i % 3 === 0) onTypeChar();
    i++;
    if (i >= text.length) {
      clearInterval(typeTimer);
      typeState.active = false;
      if (onComplete) onComplete();
    }
  }, speed);
}

// Click anywhere on the dialogue area to skip typewriter
function skipTypewriter() {
  if (!typeState.active) return false;
  clearInterval(typeTimer);
  const el = document.getElementById(typeState.elId);
  if (el) el.textContent = typeState.text;
  typeState.active = false;
  const cb = typeState.onComplete;
  if (cb) cb();
  return true;
}

let notifTimer;
function showNotif(text, dur=3000) {
  let el = document.getElementById('notif');
  if (!el) {
    el = document.createElement('div');
    el.id = 'notif';
    el.className = 'notification';
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.display = 'block';
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => { el.style.display = 'none'; }, dur);
  if (typeof AudioMgr !== 'undefined') AudioMgr.playSfx('notif');
}

function showPhaseBanner(phase, subtitle, cb) {
  const b = document.createElement('div');
  b.className = 'phase-banner';
  b.innerHTML = `<h2>${phase}</h2><p>${subtitle}</p><p style="font-size:6px;color:var(--gray);margin-top:12px">Haz clic para continuar</p>`;
  document.body.appendChild(b);
  if (typeof AudioMgr !== 'undefined') AudioMgr.playSfx('phase_banner');
  b.onclick = () => {
    b.remove();
    if (typeof AudioMgr !== 'undefined') AudioMgr.playSfx('click');
    if (cb) cb();
  };
}

function updateStats(stats) {
  ['calm','pressure','cred','risk'].forEach(k => {
    const v = Math.max(0, Math.min(100, stats[k]));
    stats[k] = v;
    const bar = document.getElementById('bar-' + k);
    const val = document.getElementById('val-' + k);
    if (bar) bar.style.width = v + '%';
    if (val) val.textContent = v;
  });
}

// Flash overlay (red for damage, green for buff) over scene-area
function flashScene(color='red') {
  const scene = document.getElementById('scene-area');
  if (!scene) return;
  const flash = document.createElement('div');
  flash.className = color === 'red' ? 'damage-flash' : 'good-flash';
  scene.appendChild(flash);
  setTimeout(() => flash.remove(), 600);
}

function shakeScene() {
  const scene = document.getElementById('scene-area');
  if (!scene) return;
  scene.classList.remove('fx-shake');
  // force reflow to restart animation
  void scene.offsetWidth;
  scene.classList.add('fx-shake');
  setTimeout(() => scene.classList.remove('fx-shake'), 500);
}

function glitchScene() {
  const scene = document.getElementById('scene-area');
  if (!scene) return;
  scene.classList.remove('fx-glitch');
  void scene.offsetWidth;
  scene.classList.add('fx-glitch');
  setTimeout(() => scene.classList.remove('fx-glitch'), 450);
}

// Show a single "▶ CONTINUAR" button in the options area; click triggers callback
function showContinueButton(onClick, label='▶ CONTINUAR') {
  const grid = document.getElementById('options-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const b = document.createElement('button');
  b.className = 'btn';
  b.style.textAlign = 'center';
  b.style.borderColor = 'var(--gold)';
  b.style.color = 'var(--gold)';
  b.innerHTML = label;
  b.onclick = () => {
    b.disabled = true;
    if (typeof AudioMgr !== 'undefined') AudioMgr.playSfx('click');
    onClick();
  };
  grid.appendChild(b);
  // Update header
  const title = document.querySelector('.options-title');
  if (title) title.textContent = '➜ AVANZAR — Lee y presiona continuar';
}

function setOptionsTitle(text) {
  const title = document.querySelector('.options-title');
  if (title) title.textContent = text;
}

// Floating "+10" / "-15" indicator next to a stat bar
function floatStatDelta(statKey, delta) {
  const item = document.querySelector('.stat-' + statKey);
  if (!item) return;
  const tag = document.createElement('div');
  tag.className = 'stat-delta ' + (delta >= 0 ? 'pos' : 'neg');
  tag.textContent = (delta >= 0 ? '+' : '') + delta;
  tag.style.right = '4px';
  tag.style.top = '2px';
  item.appendChild(tag);
  setTimeout(() => tag.remove(), 1200);
}
