window.lastTime = 0;

window.initGame = function() {
  const c = document.getElementById('game');
  initRender(c);
  setupInput(c);

  // optional: initAudio('assets/sem_nada_like_loop.mp3'); // add file if you have rights

  // double-tap / double-click to trigger Phonk Mode
  let lastTap = 0;
  c.addEventListener('touchend', () => {
    const now = performance.now();
    if (now - lastTap < 300) window.enterPhonkMode();
    lastTap = now;
  });
  c.addEventListener('dblclick', () => window.enterPhonkMode());

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

  window.speed += window.accel * dt;
  if (window.speed > window.maxSpeed) window.speed = window.maxSpeed;

  window.updateCar(dt);
  window.updateParticles(dt);
  window.updateObstacles(dt);
  window.updateExplosions(dt);

  window.shake *= 0.9;

  // audio-driven intensity
  const audioBoost = window.audioEnergy || 0;
  if (audioBoost > 0.12) {
    window.shake = Math.max(window.shake, 2 + audioBoost * 12);
  }

  window.resetTransform();
  window.ctx.clearRect(0, 0, window.w, window.h);

  window.applyScreenTransform();

  window.drawRoad(timestamp);
  window.drawObstacles(window.ctx);
  window.drawExplosions(window.ctx);
  window.drawParticles(window.ctx);
  window.drawCar(window.ctx, window.w, window.h, window.cx, window.cy);

  window.resetTransform();

  requestAnimationFrame(gameLoop);
}

window.addEventListener('load', initGame);
