window.canvas = null;
window.ctx = null;
window.w = 0;
window.h = 0;
window.cx = 0;
window.cy = 0;

window.speed = 0.4;
window.maxSpeed = 3.5;
window.accel = 0.00025;
window.shake = 0;

window.initRender = function(c) {
  window.canvas = c;
  window.ctx = c.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
};

function resizeCanvas() {
  window.w = window.canvas.width = window.innerWidth;
  window.h = window.canvas.height = window.innerHeight;
  window.cx = window.w / 2;
  window.cy = window.h * 0.7;
}
window.resizeCanvas = resizeCanvas;

window.drawRoad = function(time) {
  const roadWidthBottom = window.w * 0.9;
  const roadWidthTop = window.w * 0.1;
  const roadCenterX = window.cx + window.carX * window.w * 0.18;

  const lineCount = 18;
  for (let i = 0; i < lineCount; i++) {
    const t = ((i / lineCount) + (time * window.speed * 0.002)) % 1;
    const y = window.cy - (t * window.h * 0.9);
    const width = roadWidthTop + (roadWidthBottom - roadWidthTop) * (y / window.h);
    const alpha = 1 - t;
    window.ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
    window.ctx.lineWidth = 2;
    window.ctx.beginPath();
    window.ctx.moveTo(roadCenterX - width / 2, y);
    window.ctx.lineTo(roadCenterX + width / 2, y);
    window.ctx.stroke();
  }

  // Side edges
  window.ctx.strokeStyle = 'rgba(255, 0, 255, 0.7)';
  window.ctx.lineWidth = 3;
  window.ctx.beginPath();
  window.ctx.moveTo(roadCenterX - roadWidthBottom / 2, window.h);
  window.ctx.lineTo(roadCenterX - roadWidthTop / 2, window.h * 0.1);
  window.ctx.moveTo(roadCenterX + roadWidthBottom / 2, window.h);
  window.ctx.lineTo(roadCenterX + roadWidthTop / 2, window.h * 0.1);
  window.ctx.stroke();
};

window.applyScreenTransform = function() {
  const t = clamp(window.speed / window.maxSpeed, 0, 1);
  const zoom = 1 + t * 0.15;
  const ellipse = 1 - t * 0.18;

  const shakeAmount = window.shake;
  const sx = (Math.random() * 2 - 1) * shakeAmount;
  const sy = (Math.random() * 2 - 1) * shakeAmount;

  window.ctx.setTransform(1, 0, 0, 1, 0, 0);
  window.ctx.translate(window.cx + sx, window.cy + sy);
  window.ctx.scale(zoom, zoom * ellipse);
  window.ctx.translate(-window.cx, -window.cy);
};

window.resetTransform = function() {
  window.ctx.setTransform(1, 0, 0, 1, 0, 0);
};
