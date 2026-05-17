// ═══════════════════════════════════════════════════════
// PIXEL ART SPRITE RENDERER — Animated, multi-frame
// ═══════════════════════════════════════════════════════
// Palette: each character maps to a hex color.
// Sprite grid is 16 wide x 22 tall.

const PALETTE = {
  B:'#1a237e', // police blue
  G:'#283593', // police mid blue
  K:'#1a1a1a', // black/dark outline
  S:'#37474f', // pants gray
  N:'#4e342e', // brown
  D:'#6d4c41', // dark brown
  L:'#f5f5f5', // white/shirt
  O:'#ff6f00', // orange accent
  W:'#eceff1', // white-gray
  T:'#78909c', // gray
  R:'#e53935', // red
  P:'#880e4f', // purple
  H:'#ad1457', // pink
  A:'#4a148c', // dark purple
  C:'#3e2723', // very dark brown
  M:'#795548', // brown mid
  F:'#fdd9b5', // skin tone
  E:'#c1856a', // skin shadow
  Y:'#ffeb3b', // badge yellow
  X:'#000000', // pure black
  U:'#90a4ae', // light gray
  V:'#212121', // near-black
  Q:'#5d4037', // hair brown
  Z:'#bf360c', // dark orange/red
  J:'#1565c0', // medium blue
  I:'#ffffff', // pure white
  '0': null    // transparent
};

/* Each sprite has multiple frames. All frames are 16 wide × 22 tall.
   Frames: idle1, idle2 (slight head bob), talk1, talk2 (mouth open), hit (red flash overlay). */

const SPRITES = {
  cop: {
    idle1: [
      '0000BBBBBBBB0000',
      '000B00000000B000',
      '00B0BBBBBBBB0B00',
      '00B0FFFFFFFF0B00',
      '00B0FXFFFFXF0B00',
      '00B0FFFFFFFF0B00',
      '00B0FFFKKFFF0B00',
      '00B00FFFFFF00B00',
      '000BBBBBBBBBB000',
      '00BGGGGYYGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGKKKKKKGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '000BBBBBBBBBB000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ],
    idle2: [
      '0000BBBBBBBB0000',
      '000B00000000B000',
      '00B0BBBBBBBB0B00',
      '00B0FFFFFFFF0B00',
      '00B0FXFFFFXF0B00',
      '00B0FFFFFFFF0B00',
      '00B0FFFKKFFF0B00',
      '00B00FFFFFF00B00',
      '000BBBBBBBBBB000',
      '00BGGGGYYGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGKKKKKKGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '000BBBBBBBBBB000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ],
    talk1: [
      '0000BBBBBBBB0000',
      '000B00000000B000',
      '00B0BBBBBBBB0B00',
      '00B0FFFFFFFF0B00',
      '00B0FXFFFFXF0B00',
      '00B0FFFFFFFF0B00',
      '00B0FFKKKKFF0B00',
      '00B00FFFFFF00B00',
      '000BBBBBBBBBB000',
      '00BGGGGYYGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGKKKKKKGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '000BBBBBBBBBB000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ],
    talk2: [
      '0000BBBBBBBB0000',
      '000B00000000B000',
      '00B0BBBBBBBB0B00',
      '00B0FFFFFFFF0B00',
      '00B0FXFFFFXF0B00',
      '00B0FFFFFFFF0B00',
      '00B0FFXXXXFF0B00',
      '00B00FXFFXF00B00',
      '000BBBBBBBBBB000',
      '00BGGGGYYGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGKKKKKKGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '000BBBBBBBBBB000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ]
  },
  cop_angry: {
    idle1: [
      '0000BBBBBBBB0000',
      '000B00000000B000',
      '00B0BBBBBBBB0B00',
      '00B0FFFFFFFF0B00',
      '00B0RXFFFFXR0B00',
      '00B0FRRFRRRFRB00',
      '00B0FFXXXXFF0B00',
      '00B00FFFFFF00B00',
      '000BBBBBBBBBB000',
      '00BGGGGYYGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGKKKKKKGGB00',
      '00BGGGGGGGGGGB00',
      '00BGGGGGGGGGGB00',
      '000BBBBBBBBBB000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ]
  },
  ratero: {
    idle1: [
      '000QQQQQQQQQ0000',
      '00QQQQQQQQQQQ000',
      '0QQQFFFFFFFFQQ00',
      '00QFFFFFFFFFFQ00',
      '00QFXFFFFFFXFQ00',
      '00QFFFFFFFFFFQ00',
      '00QFFFFKKFFFFQ00',
      '00QQFFFFFFFFQQ00',
      '0000NNNNNNNN0000',
      '000NNDDDDDDNN000',
      '000NDDLLLLDDN000',
      '000NDDLLLLDDN000',
      '000NDDDDDDDDN000',
      '000NNDDDDDDNN000',
      '0000NNDDDDNN0000',
      '00000DDDDDD00000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ],
    idle2: [
      '000QQQQQQQQQ0000',
      '00QQQQQQQQQQQ000',
      '0QQQFFFFFFFFQQ00',
      '00QFFFFFFFFFFQ00',
      '00QFXFFFFFFXFQ00',
      '00QFFFFFFFFFFQ00',
      '00QFFFKKKKFFFQ00',
      '00QQFFFFFFFFQQ00',
      '0000NNNNNNNN0000',
      '000NDDLLLLDDN000',
      '000NDDLLLLDDN000',
      '000NDDDDDDDDN000',
      '000NDDLLLLDDN000',
      '000NNDDDDDDNN000',
      '0000NNDDDDNN0000',
      '00000DDDDDD00000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ],
    talk1: [
      '000QQQQQQQQQ0000',
      '00QQQQQQQQQQQ000',
      '0QQQFFFFFFFFQQ00',
      '00QFFFFFFFFFFQ00',
      '00QFXFFFFFFXFQ00',
      '00QFFFFFFFFFFQ00',
      '00QFFXXXXXXFFQ00',
      '00QQFXFFFFXFQQ00',
      '0000NNNNNNNN0000',
      '000NNDDDDDDNN000',
      '000NDDLLLLDDN000',
      '000NDDLLLLDDN000',
      '000NDDDDDDDDN000',
      '000NNDDDDDDNN000',
      '0000NNDDDDNN0000',
      '00000DDDDDD00000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '0000NNN00NNN0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ]
  },
  narco: {
    idle1: [
      '0000KKKKKKKK0000',
      '000K00000000K000',
      '0000KKKKKKKK0000',
      '00FFFFFFFFFFFF00',
      '00FXFFFFFFFFXF00',
      '00FFFFFFFFFFFF00',
      '00FFFFFKKFFFFF00',
      '000FFFFFFFFFF000',
      '0000WWWWWWWW0000',
      '000WWLLLLLLWW000',
      '00WWLLOOOOLLWW00',
      '00WWLLLLLLLLWW00',
      '00WWLLLLLLLLWW00',
      '00WWLLLLLLLLWW00',
      '0000WWWWWWWW0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ],
    idle2: [
      '0000KKKKKKKK0000',
      '000K00000000K000',
      '0000KKKKKKKK0000',
      '00FFFFFFFFFFFF00',
      '00FXFFFFFFFFXF00',
      '00FFFFFFFFFFFF00',
      '00FFFFFKKFFFFF00',
      '000FFFFFFFFFF000',
      '0000WWWWWWWW0000',
      '00WWLLOOOOLLWW00',
      '00WWLLLLLLLLWW00',
      '00WWLLLLLLLLWW00',
      '00WWLLLLLLLLWW00',
      '000WWLLLLLLWW000',
      '0000WWWWWWWW0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ],
    talk1: [
      '0000KKKKKKKK0000',
      '000K00000000K000',
      '0000KKKKKKKK0000',
      '00FFFFFFFFFFFF00',
      '00FXFFFFFFFFXF00',
      '00FFFFFFFFFFFF00',
      '00FFFFXXXXFFFF00',
      '000FFFXFFXFFF000',
      '0000WWWWWWWW0000',
      '000WWLLLLLLWW000',
      '00WWLLOOOOLLWW00',
      '00WWLLLLLLLLWW00',
      '00WWLLLLLLLLWW00',
      '00WWLLLLLLLLWW00',
      '0000WWWWWWWW0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '0000DDD00DDD0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ]
  },
  loco: {
    idle1: [
      '00QQQQQQQQQQQ000',
      '0QQQQQQQQQQQQQ00',
      '0QQEEEEEEEEEEQQ0',
      '0QQEEEEEEEEEEQQ0',
      '0QQERXEEEEEXREQ0',
      '0QQEEEEXXEEEEQQ0',
      '0QQEEEKKKKEEEQQ0',
      '0QQEEEEEEEEEEQQ0',
      '00QEEEEEEEEEEQ00',
      '000TTTTTTTTTT000',
      '000TTRRRRRRTT000',
      '000TTTTTTTTTT000',
      '000TTTTTTTTTT000',
      '000TTTRRRRTTT000',
      '000TTTTTTTTTT000',
      '0000TTTTTTTT0000',
      '0000TTT00TTT0000',
      '0000TTT00TTT0000',
      '0000TTT00TTT0000',
      '00000T0000T00000',
      '00000T0000T00000',
      '0000TT0000TT0000'
    ],
    idle2: [
      '00QQQQQQQQQQQ000',
      '0QQQQQQQQQQQQQ00',
      '0QQEEEEEEEEEEQQ0',
      '0QQEEEEEEEEEEQQ0',
      '0QQERXEEEEEXREQ0',
      '0QQEEEXXXXEEEQQ0',
      '0QQEEEKKKKEEEQQ0',
      '0QQEEEEEEEEEEQQ0',
      '00QEEEEEEEEEEQ00',
      '000TTTTTTTTTT000',
      '000TTRRRRRRTT000',
      '000TTTTTTTTTT000',
      '000TTRRRRRRTT000',
      '000TTTTTTTTTT000',
      '000TTTTTTTTTT000',
      '0000TTTTTTTT0000',
      '0000TTT00TTT0000',
      '0000TTT00TTT0000',
      '0000TTT00TTT0000',
      '00000T0000T00000',
      '00000T0000T00000',
      '0000TT0000TT0000'
    ],
    talk1: [
      '00QQQQQQQQQQQ000',
      '0QQQQQQQQQQQQQ00',
      '0QQEEEEEEEEEEQQ0',
      '0QQEEEEEEEEEEQQ0',
      '0QQERXEEEEEXREQ0',
      '0QQEEEEEEEEEEQQ0',
      '0QQEEXXXXXXEEQQ0',
      '0QQEEXEEEEXEEQQ0',
      '00QEEEEEEEEEEQ00',
      '000TTTTTTTTTT000',
      '000TTRRRRRRTT000',
      '000TTTTTTTTTT000',
      '000TTTTTTTTTT000',
      '000TTTRRRRTTT000',
      '000TTTTTTTTTT000',
      '0000TTTTTTTT0000',
      '0000TTT00TTT0000',
      '0000TTT00TTT0000',
      '0000TTT00TTT0000',
      '00000T0000T00000',
      '00000T0000T00000',
      '0000TT0000TT0000'
    ]
  },
  fiscal: {
    idle1: [
      '000KKKKKKKKKK000',
      '00KKKKKKKKKKKK00',
      '0KKKFFFFFFFFKK00',
      '00KFFFFFFFFFFK00',
      '00KFXFFFFFFXFK00',
      '00KFFFFFFFFFFK00',
      '00KFFFFKKFFFFK00',
      '00KKFFFFFFFFKK00',
      '0000VVVVVVVV0000',
      '000VVLLLLLLVV000',
      '00VVLLLRRRLLVV00',
      '00VVLLLLLLLLVV00',
      '00VVLLLLLLLLVV00',
      '00VVLLLLLLLLVV00',
      '0000VVVVVVVV0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ],
    talk1: [
      '000KKKKKKKKKK000',
      '00KKKKKKKKKKKK00',
      '0KKKFFFFFFFFKK00',
      '00KFFFFFFFFFFK00',
      '00KFXFFFFFFXFK00',
      '00KFFFFFFFFFFK00',
      '00KFFXXXXXXFFK00',
      '00KKFXFFFFXFKK00',
      '0000VVVVVVVV0000',
      '000VVLLLLLLVV000',
      '00VVLLLRRRLLVV00',
      '00VVLLLLLLLLVV00',
      '00VVLLLLLLLLVV00',
      '00VVLLLLLLLLVV00',
      '0000VVVVVVVV0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '0000SSS00SSS0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ]
  },
  juez: {
    idle1: [
      '000IIIIIIIIII000',
      '00IIIIIIIIIIII00',
      '0IIIWWWWWWWWII00',
      '00IWFFFFFFFFWI00',
      '00IWFXFFFFXFWI00',
      '00IWFFFFFFFFWI00',
      '00IWFFFKKFFFWI00',
      '00IIWFFFFFFWII00',
      '0000VVVVVVVV0000',
      '000VVVVVVVVVV000',
      '00VVVVVVVVVVVV00',
      '00VVVVVIIVVVVV00',
      '00VVVVVIIVVVVV00',
      '00VVVVVVVVVVVV00',
      '0000VVVVVVVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ],
    talk1: [
      '000IIIIIIIIII000',
      '00IIIIIIIIIIII00',
      '0IIIWWWWWWWWII00',
      '00IWFFFFFFFFWI00',
      '00IWFXFFFFXFWI00',
      '00IWFFFFFFFFWI00',
      '00IWFFXXXXFFWI00',
      '00IIWFFFFFFWII00',
      '0000VVVVVVVV0000',
      '000VVVVVVVVVV000',
      '00VVVVVVVVVVVV00',
      '00VVVVVIIVVVVV00',
      '00VVVVVIIVVVVV00',
      '00VVVVVVVVVVVV00',
      '0000VVVVVVVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ]
  },
  abogado: {
    idle1: [
      '000QQQQQQQQQ0000',
      '00QQQQQQQQQQQ000',
      '0QQQFFFFFFFFQQ00',
      '00QFFFFFFFFFFQ00',
      '00QFXFFFFFFXFQ00',
      '00QFFFFFFFFFFQ00',
      '00QFFFFKKFFFFQ00',
      '00QQFFFFFFFFQQ00',
      '0000VVVVVVVV0000',
      '000VVIIIIIIVV000',
      '00VVIIRRRRIIVV00',
      '00VVIIIIIIIIVV00',
      '00VVIIIIIIIIVV00',
      '00VVIIIIIIIIVV00',
      '0000VVVVVVVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ],
    talk1: [
      '000QQQQQQQQQ0000',
      '00QQQQQQQQQQQ000',
      '0QQQFFFFFFFFQQ00',
      '00QFFFFFFFFFFQ00',
      '00QFXFFFFFFXFQ00',
      '00QFFFFFFFFFFQ00',
      '00QFFXXXXXXFFQ00',
      '00QQFXFFFFXFQQ00',
      '0000VVVVVVVV0000',
      '000VVIIIIIIVV000',
      '00VVIIRRRRIIVV00',
      '00VVIIIIIIIIVV00',
      '00VVIIIIIIIIVV00',
      '00VVIIIIIIIIVV00',
      '0000VVVVVVVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '0000VVV00VVV0000',
      '000KKKK00KKKK000',
      '00KKKKK00KKKKK00'
    ]
  },
  familia: {
    idle1: [
      '0000QQQQQQQQ0000',
      '000QQQQQQQQQQ000',
      '00QQEEEEEEEEQQ00',
      '000EEEEEEEEEE000',
      '000EXEEEEEEXE000',
      '000EEEEEEEEEE000',
      '000EEEEKKEEEE000',
      '00000EEEEEE00000',
      '0000PPPPPPPP0000',
      '000PPHHHHHHPP000',
      '00PPHHHHHHHHPP00',
      '00PPHHHHHHHHPP00',
      '00PPHHHHHHHHPP00',
      '00PPHHHHHHHHPP00',
      '0000PPPPPPPP0000',
      '0000AAA00AAA0000',
      '0000AAA00AAA0000',
      '0000AAA00AAA0000',
      '0000AAA00AAA0000',
      '0000AAA00AAA0000',
      '000VVV0000VVV000',
      '00VVVV0000VVVV00'
    ]
  }
};

// Fallback: missing frames inherit from idle1
function getFrame(name, frame) {
  const s = SPRITES[name] || SPRITES['cop'];
  return s[frame] || s.idle1 || s.idle || Object.values(s)[0];
}

// Cache rendered frames in OffscreenCanvas keyed by name+frame+size
const SPRITE_CACHE = new Map();

function _renderFrameToCache(name, frame, w, h) {
  const key = `${name}::${frame}::${w}x${h}`;
  if (SPRITE_CACHE.has(key)) return SPRITE_CACHE.get(key);
  const rows = getFrame(name, frame);
  const cnv = (typeof OffscreenCanvas !== 'undefined')
    ? new OffscreenCanvas(w, h)
    : Object.assign(document.createElement('canvas'), {width:w, height:h});
  const ctx = cnv.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const cellW = w / rows[0].length;
  const cellH = h / rows.length;
  for (let y=0; y<rows.length; y++) {
    const row = rows[y];
    for (let x=0; x<row.length; x++) {
      const c = PALETTE[row[x]];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(Math.floor(x*cellW), Math.floor(y*cellH), Math.ceil(cellW), Math.ceil(cellH));
      }
    }
  }
  SPRITE_CACHE.set(key, cnv);
  return cnv;
}

function drawSprite(canvas, spriteName, frame='idle1', hitFlash=false) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0,0,W,H);
  const cached = _renderFrameToCache(spriteName, frame, W, H);
  ctx.drawImage(cached, 0, 0, W, H);
  if (hitFlash) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(255,40,40,0.55)';
    ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation = 'source-over';
  }
}

// ═══════════════════════════════════════════════════════
// Animation manager: each animated canvas registers here
// ═══════════════════════════════════════════════════════

const ANIMATED_CANVASES = new Map(); // canvas -> {sprite, mode, talkUntil, lastFrame}

function registerSprite(canvas, spriteName, opts={}) {
  if (!canvas) return;
  ANIMATED_CANVASES.set(canvas, {
    sprite: spriteName,
    mode: opts.mode || 'idle', // 'idle' | 'talking'
    talkUntil: 0,
    hitUntil: 0,
    idleFrame: 0,
    talkFrame: 0
  });
  drawSprite(canvas, spriteName, 'idle1');
}

function setSpriteTalking(canvas, durationMs=2000) {
  const s = ANIMATED_CANVASES.get(canvas);
  if (!s) return;
  s.mode = 'talking';
  s.talkUntil = performance.now() + durationMs;
}

function stopSpriteTalking(canvas) {
  const s = ANIMATED_CANVASES.get(canvas);
  if (!s) return;
  s.mode = 'idle';
  s.talkUntil = 0;
}

function hitSprite(canvas, durationMs=300) {
  const s = ANIMATED_CANVASES.get(canvas);
  if (!s) return;
  s.hitUntil = performance.now() + durationMs;
}

function unregisterSprite(canvas) {
  ANIMATED_CANVASES.delete(canvas);
}

let _lastIdleTick = 0, _lastTalkTick = 0;
function _animationLoop(now) {
  // Idle bobble: 500ms per frame
  if (now - _lastIdleTick > 500) {
    _lastIdleTick = now;
    ANIMATED_CANVASES.forEach(s => { s.idleFrame = (s.idleFrame + 1) % 2; });
  }
  // Talking mouth: 130ms per frame
  if (now - _lastTalkTick > 130) {
    _lastTalkTick = now;
    ANIMATED_CANVASES.forEach(s => { s.talkFrame = (s.talkFrame + 1) % 2; });
  }
  ANIMATED_CANVASES.forEach((s, canvas) => {
    if (s.mode === 'talking' && now >= s.talkUntil) s.mode = 'idle';
    let frame;
    if (s.mode === 'talking') {
      frame = s.talkFrame === 0 ? 'talk1' : 'idle1';
      // For sprites without talk1, fall back gracefully
      if (!SPRITES[s.sprite] || !SPRITES[s.sprite].talk1) frame = s.idleFrame === 0 ? 'idle1' : 'idle2';
    } else {
      frame = s.idleFrame === 0 ? 'idle1' : 'idle2';
      if (!SPRITES[s.sprite] || !SPRITES[s.sprite].idle2) frame = 'idle1';
    }
    const hit = now < s.hitUntil;
    drawSprite(canvas, s.sprite, frame, hit);
  });
  requestAnimationFrame(_animationLoop);
}
requestAnimationFrame(_animationLoop);
