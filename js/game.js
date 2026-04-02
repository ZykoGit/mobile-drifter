window.lastTime = 0;

window.initGame = function() {
  const c = document.getElementById('game');
  initRender(c);
  setupInput(c);

  // Speed-based shake pulses
  setInterval(() => {
    if (window.speed > window.maxSpeed * 0.6) {
      window.shake = Math.max(window.shake, 6);
    } else if (window.speed > window.maxSpeed * 0.3) {
      window.shake = Math.max(window.shake, 3);
    }
  }, 600);

  requestAnimationFrame(gameLoop);
};

function gameLoop(timestamp) {
  const dt = timestamp - (window.lastTime || timestamp);
  window.lastTime = timestamp;

  // Speed ramp
  window.speed += window.accel * dt;
  if (window.speed > window.maxSpeed) window.speed = window.maxSpeed;

  // Update car + particles
  window.updateCar(dt);
  window.updateParticles(dt);

  // Shake decay
  window.shake *= 0.9;

  // Clear
  window.resetTransform();
  window.ctx.clearRect(0, 0, window.w, window.h);

  // Warp / zoom / shake
  window.applyScreenTransform();

  // Draw world
  window.drawRoad(timestamp);
  window.drawParticles(window.ctx);
  window.drawCar(window.ctx, window.w, window.h, window.cx, window.cy);

  window.resetTransform();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('load', initGame);
