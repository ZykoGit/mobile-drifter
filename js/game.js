window.canvas = null;
window.ctx = null;
window.cam = {
  x: 0,
  y: 0,
  zoom: 1,
  screenW: 0,
  screenH: 0
};
window.lastTime = 0;
window.shake = 0;
window.gameRunning = false;

window.initGame = function() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  setupInput(canvas);
  generateProceduralTrack();
  initCarOnTrack();
  initHUD();

  const home = document.getElementById('home-screen');
  const btnStart = document.getElementById('btn-start');
  btnStart.addEventListener('click', () => {
    home.style.display = 'none';
    gameRunning = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
  });
};

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cam.screenW = canvas.width;
  cam.screenH = canvas.height;
  cam.zoom = Math.min(canvas.width, canvas.height) / 600; /* bigger world on screen */
}

function updateCamera(dt) {
  const targetX = car.x;
  const targetY = car.y;
  cam.x = lerp(cam.x, targetX, 0.1);
  cam.y = lerp(cam.y, targetY, 0.1);

  const baseZoom = Math.min(cam.screenW, cam.screenH) / 600;
  const speedFactor = clamp(car.speed / 1200, 0, 1);
  const targetZoom = baseZoom * (1 - speedFactor * 0.2);
  cam.zoom = lerp(cam.zoom, targetZoom, 0.06);

  if (shake > 0.1) {
    const sx = (Math.random() * 2 - 1) * shake;
    const sy = (Math.random() * 2 - 1) * shake;
    cam.x += sx;
    cam.y += sy;
    shake *= 0.9;
  } else {
    shake = 0;
  }
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, cam.screenH);
  g.addColorStop(0, '#050010');
  g.addColorStop(0.5, '#020008');
  g.addColorStop(1, '#000000');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cam.screenW, cam.screenH);

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#0b0015';
  const gridSize = 120 * cam.zoom;
  for (let x = (cam.x * cam.zoom) % gridSize - gridSize; x < cam.screenW + gridSize; x += gridSize) {
    ctx.fillRect(x, 0, 1, cam.screenH);
  }
  for (let y = (cam.y * cam.zoom) % gridSize - gridSize; y < cam.screenH + gridSize; y += gridSize) {
    ctx.fillRect(0, y, cam.screenW, 1);
  }
  ctx.restore();
}

function gameLoop(timestamp) {
  if (!gameRunning) return;

  const dt = timestamp - lastTime;
  lastTime = timestamp;

  updateCar(dt);
  updateParticles(dt);
  updateCamera(dt);
  updateHUD(dt);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawBackground();

  drawTrack(ctx, cam);
  drawParticles(ctx, cam);
  drawCar(ctx, cam);

  requestAnimationFrame(gameLoop);
}

window.addEventListener('load', initGame);
