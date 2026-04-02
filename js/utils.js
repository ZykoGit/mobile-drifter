function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}
