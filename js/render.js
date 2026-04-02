let canvas, ctx;
let w, h, cx, cy;

let speed = 0.4;
let maxSpeed = 3.5;
let accel = 0.00025;
let shake = 0;

function initRender(c) {
  canvas = c;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  cx = w / 2;
  cy = h * 0.7;
}

function drawRoad(time) {
  const laneCount = 5;
  const roadWidthBottom = w * 0.9;
  const roadWidthTop = w * 0.1;
  const roadCenterX = cx + carX * w * 0.18;

  const lineCount = 18;
  for (let i = 0; i < lineCount; i++) {
    const t = ((i / lineCount) + (time * speed * 0.002)) % 1;
    const y = cy - (t * h * 0.9);
    const width = roadWidthTop + (roadWidthBottom - roadWidthTop) * (y / h);
    const alpha = 1 - t;
    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(roadCenterX - width / 2, y);
    ctx.lineTo(roadCenterX + width / 2, y);
    ctx.stroke();
  }

  // Side edges
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(roadCenterX - roadWidthBottom / 2, h);
  ctx.lineTo(roadCenterX - roadWidthTop / 2, h * 0.1);
  ctx.moveTo(roadCenterX + roadWidthBottom / 2, h);
  ctx.lineTo(roadCenterX + roadWidthTop / 2, h * 0.1);
  ctx.stroke();
}

function applyScreenTransform() {
  const t = clamp(speed / maxSpeed, 0, 1);
  const zoom = 1 + t * 0.15;
  const ellipse = 1 - t * 0.18;

  const shakeAmount = shake;
  const sx = (Math.random() * 2 - 1) * shakeAmount;
  const sy = (Math.random() * 2 - 1) * shakeAmount;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(cx + sx, cy + sy);
  ctx.scale(zoom, zoom * ellipse);
  ctx.translate(-cx, -cy);
}

function resetTransform() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
