const layers = {
  bg: {
    el: document.getElementById('bg'),
    depth: 0.55,
    maxX: 10,
    maxY: 10,
    floatX: 0.6,
    floatY: 1.1,
    floatFreq: 0.0002,
    rotAmp: 0.2,
    rotFreq: 0.00012,
    phase: 0.4,
    rotPhase: 0.8,
    baseScale: 1.07
  },
  char: {
    el: document.getElementById('char'),
    depth: 0.85,
    maxX: 16,
    maxY: 16,
    floatX: 0.8,
    floatY: 12,
    floatFreq: 0.00145,
    rotAmp: 1.5,
    rotFreq: 0.00128,
    phase: 0,
    rotPhase: 0,
    baseScale: 1
  },
  gold: {
    el: document.getElementById('clock-gold'),
    depth: 1,
    maxX: 20,
    maxY: 20,
    floatX: 0.5,
    floatY: 6,
    floatFreq: 0.00162,
    rotAmp: 1,
    rotFreq: 0.00135,
    phase: 0.9,
    rotPhase: 1.1,
    baseScale: 1
  },
  purple: {
    el: document.getElementById('clock-purple'),
    depth: 1,
    maxX: 20,
    maxY: 20,
    floatX: 0.4,
    floatY: 6,
    floatFreq: 0.00147,
    rotAmp: 1,
    rotFreq: 0.00124,
    phase: 2.35,
    rotPhase: 2.45,
    baseScale: 1
  }
};

const viewport = {
  width: window.innerWidth,
  height: window.innerHeight,
  centerX: window.innerWidth / 2,
  centerY: window.innerHeight / 2
};

const pointer = { x: 0, y: 0, clientX: viewport.centerX, clientY: viewport.centerY };
const smoothed = { x: 0, y: 0 };
const smoothFactor = 0.065;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const updateNormalizedPointer = (clientX, clientY) => {
  pointer.clientX = clientX;
  pointer.clientY = clientY;

  const nx = (clientX - viewport.centerX) / (viewport.width / 2 || 1);
  const ny = (clientY - viewport.centerY) / (viewport.height / 2 || 1);

  pointer.x = clamp(nx, -1, 1);
  pointer.y = clamp(ny, -1, 1);
};

const recalcViewport = () => {
  viewport.width = window.innerWidth;
  viewport.height = window.innerHeight;
  viewport.centerX = viewport.width / 2;
  viewport.centerY = viewport.height / 2;

  updateNormalizedPointer(pointer.clientX, pointer.clientY);

  const shortSide = Math.min(viewport.width, viewport.height);
  const longSide = Math.max(viewport.width, viewport.height);
  const ratio = longSide / (shortSide || 1);
  const aspectBoost = clamp((ratio - 1) * 0.35, 0, 0.8);

  Object.values(layers).forEach((layer) => {
    const sizeFactor = clamp(shortSide / 900, 0.72, 1.35);
    const depthFactor = 0.75 + layer.depth * 0.35;

    layer.boundX = layer.maxX * sizeFactor * (1 + aspectBoost * depthFactor);
    layer.boundY = layer.maxY * sizeFactor;
  });
};

window.addEventListener('mousemove', (event) => {
  updateNormalizedPointer(event.clientX, event.clientY);
}, { passive: true });

window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  updateNormalizedPointer(touch.clientX, touch.clientY);
}, { passive: true });

window.addEventListener('mouseleave', () => {
  updateNormalizedPointer(viewport.centerX, viewport.centerY);
});

window.addEventListener('blur', () => {
  updateNormalizedPointer(viewport.centerX, viewport.centerY);
});

let resizeTicking = false;
window.addEventListener('resize', () => {
  if (resizeTicking) return;
  resizeTicking = true;
  requestAnimationFrame(() => {
    recalcViewport();
    resizeTicking = false;
  });
}, { passive: true });

const renderLayer = (layer, now) => {
  const parallaxX = smoothed.x * layer.boundX;
  const parallaxY = smoothed.y * layer.boundY;

  const wave = now * layer.floatFreq + layer.phase;
  const floatX = Math.sin(wave) * layer.floatX;
  const floatY = Math.cos(wave) * layer.floatY;
  const rot = Math.sin(now * layer.rotFreq + layer.rotPhase) * layer.rotAmp;

  layer.el.style.transform = `translate3d(${(parallaxX + floatX).toFixed(2)}px, ${(parallaxY + floatY).toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${layer.baseScale})`;
};

const animate = (now) => {
  smoothed.x += (pointer.x - smoothed.x) * smoothFactor;
  smoothed.y += (pointer.y - smoothed.y) * smoothFactor;

  renderLayer(layers.bg, now);
  renderLayer(layers.char, now);
  renderLayer(layers.gold, now);
  renderLayer(layers.purple, now);

  requestAnimationFrame(animate);
};

recalcViewport();
requestAnimationFrame(animate);
