window.clamp = function(v, a, b) {
  return v < a ? a : v > b ? b : v;
};
window.lerp = function(a, b, t) {
  return a + (b - a) * t;
};
window.randRange = function(min, max) {
  return Math.random() * (max - min) + min;
};
window.randSign = function() {
  return Math.random() < 0.5 ? -1 : 1;
};
