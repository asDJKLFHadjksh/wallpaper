const layers = {
  bg: {
    el: document.getElementById('bg'),
    maxX: 10,
    maxY: 10,
    floatX: 0.6,
    floatY: 1.1,
    floatFreq: 0.0002,
    rotAmp: 0.2,
    rotFreq: 0.00012,
    phase: 0.4,
    rotPhase: 0.8,
    scale: 1.05
  },
  char: {
    el: document.getElementById('char'),
    maxX: 16,
    maxY: 16,
    floatX: 0.8,
    floatY: 6,
    floatFreq: 0.00028,
    rotAmp: 1,
    rotFreq: 0.00015,
    phase: 0,
    rotPhase: 0,
    scale: 1
  },
  gold: {
    el: document.getElementById('clock-gold'),
    maxX: 20,
    maxY: 20,
    floatX: 0.5,
    floatY: 3,
    floatFreq: 0.0003,
    rotAmp: 0.5,
    rotFreq: 0.00017,
    phase: 0.7,
    rotPhase: 1,
    scale: 1
  },
  purple: {
    el: document.getElementById('clock-purple'),
    maxX: 20,
    maxY: 20,
    floatX: 0.4,
    floatY: 3,
    floatFreq: 0.00031,
    rotAmp: 0.5,
    rotFreq: 0.00016,
    phase: 1.8,
    rotPhase: 2,
    scale: 1
  }
};

const pointer = { x: 0, y: 0 };
const smoothed = { x: 0, y: 0 };
const smoothFactor = 0.04;

const setPointerFromEvent = (clientX, clientY) => {
  pointer.x = (clientX / window.innerWidth) * 2 - 1;
  pointer.y = (clientY / window.innerHeight) * 2 - 1;
};

window.addEventListener('mousemove', (event) => {
  setPointerFromEvent(event.clientX, event.clientY);
}, { passive: true });

window.addEventListener('touchmove', (event) => {
  const touch = event.touches[0];
  if (!touch) return;
  setPointerFromEvent(touch.clientX, touch.clientY);
}, { passive: true });

window.addEventListener('mouseleave', () => {
  pointer.x = 0;
  pointer.y = 0;
});

window.addEventListener('blur', () => {
  pointer.x = 0;
  pointer.y = 0;
});

const renderLayer = (layer, now) => {
  const parallaxX = smoothed.x * layer.maxX;
  const parallaxY = smoothed.y * layer.maxY;

  const wave = now * layer.floatFreq + layer.phase;
  const floatX = Math.sin(wave) * layer.floatX;
  const floatY = Math.cos(wave) * layer.floatY;
  const rot = Math.sin(now * layer.rotFreq + layer.rotPhase) * layer.rotAmp;

  layer.el.style.transform = `translate3d(${(parallaxX + floatX).toFixed(2)}px, ${(parallaxY + floatY).toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${layer.scale})`;
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

requestAnimationFrame(animate);
