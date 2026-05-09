const layers = {
  bg: {
    el: document.getElementById('bg'),
    maxX: 10,
    maxY: 10,
    lerp: 0.045,
    floatAmpX: 1.2,
    floatAmpY: 1.8,
    floatFreq: 0.00042,
    rotAmp: 0.25,
    rotFreq: 0.0002,
    baseOffsetX: 0,
    baseOffsetY: 0,
    phase: 0.6,
    rotPhase: 0.2,
    parallaxScale: 0.85
  },
  char: {
    el: document.getElementById('char'),
    maxX: 24,
    maxY: 24,
    lerp: 0.06,
    floatAmpX: 2,
    floatAmpY: 8.5,
    floatFreq: 0.00055,
    rotAmp: 1.4,
    rotFreq: 0.00036,
    baseOffsetX: 0,
    baseOffsetY: 0,
    phase: 0,
    rotPhase: 0,
    parallaxScale: 1
  },
  gold: {
    el: document.getElementById('clock-gold'),
    maxX: 31,
    maxY: 29,
    lerp: 0.052,
    floatAmpX: 3.1,
    floatAmpY: 5.6,
    floatFreq: 0.00058,
    rotAmp: 1,
    rotFreq: 0.00041,
    baseOffsetX: 36,
    baseOffsetY: -10,
    phase: 0.9,
    rotPhase: 1.2,
    parallaxScale: 1.08
  },
  purple: {
    el: document.getElementById('clock-purple'),
    maxX: 29,
    maxY: 31,
    lerp: 0.05,
    floatAmpX: 2.5,
    floatAmpY: 4.8,
    floatFreq: 0.00061,
    rotAmp: 0.9,
    rotFreq: 0.00039,
    baseOffsetX: -34,
    baseOffsetY: 22,
    phase: 2.1,
    rotPhase: 2.4,
    parallaxScale: 1.05
  }
};

const pointer = { x: 0, y: 0 };
const smoothPointer = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
}, { passive: true });

window.addEventListener('mouseleave', () => {
  pointer.x = 0;
  pointer.y = 0;
});

window.addEventListener('blur', () => {
  pointer.x = 0;
  pointer.y = 0;
});

const updateLayer = (layer, now) => {
  const parallaxX = smoothPointer.x * layer.maxX * layer.parallaxScale;
  const parallaxY = smoothPointer.y * layer.maxY * layer.parallaxScale;

  const floatX = Math.sin(now * layer.floatFreq + layer.phase) * layer.floatAmpX;
  const floatY = Math.cos(now * layer.floatFreq + layer.phase) * layer.floatAmpY;
  const rotate = Math.sin(now * layer.rotFreq + layer.rotPhase) * layer.rotAmp;

  const x = layer.baseOffsetX + parallaxX + floatX;
  const y = layer.baseOffsetY + parallaxY + floatY;

  layer.el.style.transform = `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) rotate(${rotate.toFixed(2)}deg)`;
};

const animate = (now) => {
  smoothPointer.x += (pointer.x - smoothPointer.x) * 0.045;
  smoothPointer.y += (pointer.y - smoothPointer.y) * 0.045;

  updateLayer(layers.bg, now);
  updateLayer(layers.char, now);
  updateLayer(layers.gold, now);
  updateLayer(layers.purple, now);
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
