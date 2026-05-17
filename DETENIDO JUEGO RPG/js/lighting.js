// ═══════════════════════════════════════════════════════
// LIGHTING — Aplica overlays de color/parpadeo por fase
// ═══════════════════════════════════════════════════════
// El overlay es un <div class="lighting-overlay"> dentro de .scene-area.
// Solo intercambiamos clases CSS — los keyframes viven en effects.css.

const Lighting = (() => {
  let overlay = null;

  function attach(el) {
    overlay = el;
    if (overlay) overlay.className = 'lighting-overlay';
  }

  function setPhase(phase) {
    if (!overlay) return;
    overlay.className = 'lighting-overlay';
    if (phase >= 1 && phase <= 5) {
      overlay.classList.add('light-phase-' + phase);
    }
  }

  function clear() {
    if (!overlay) return;
    overlay.className = 'lighting-overlay';
  }

  return { attach, setPhase, clear };
})();
