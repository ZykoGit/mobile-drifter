let lastTime = 0;

function initGame() {
  const c = document.getElementById('game');
  initRender(c);
  setupInput(c);

  // Speed-based shake pulses
  setInterval(() => {
    if (speed > maxSpeed * 0.6) {
      shake = Math.max(shake, 6);
    } else if (speed > maxSpeed * 0.3) {
      shake = Math.max(shake, 3);
    }
  }, 600);

  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;

  // Speed ramp
  speed += accel * dt;
  if (speed > maxSpeed) speed = maxSpeed;

  // Update car + particles
  updateCar(dt);
  updateParticles(dt);

  // Shake decay
  shake *= 0.9;

  // Clear
  resetTransform();
  ctx.clearRect(0, 0, w, h);

  // Warp / zoom / shake
  applyScreenTransform();

  // Draw world
  drawRoad(timestamp);
  drawParticles(ctx);
  drawCar(ctx, w, h, cx, cy);

  resetTransform();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('load', initGame);
