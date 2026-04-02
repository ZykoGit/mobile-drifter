// obstacles.js
window.obstacles = [];
window.score = 0;
window.nearMissMultiplier = 1;
window.lastSpawn = 0;
window.spawnInterval = 900; // ms

function spawnObstacle() {
  const laneX = window.cx + randRange(-0.45, 0.45) * window.w;
  const size = randRange(window.w * 0.06, window.w * 0.12);
  const y = -size;
  obstacles.push({
    x: laneX,
    y,
    size,
    vy: randRange(0.6, 1.6) * window.speed * 0.6 + 0.2,
    hit: false,
    created: performance.now()
  });
}

window.updateObstacles = function(dt) {
  window.lastSpawn += dt;
  const interval = Math.max(300, spawnInterval - window.speed * 120);
  if (window.lastSpawn > interval) {
    window.lastSpawn = 0;
    spawnObstacle();
  }

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.y += o.vy * dt;
    if (o.y - o.size > window.h + 200) {
      obstacles.splice(i, 1);
      continue;
    }

    const carScreenX = window.cx + window.carX * window.w * 0.2;
    const carScreenY = window.cy;
    const carW = window.w * 0.12;
    const carH = window.h * 0.12;
    const dx = Math.abs(o.x - carScreenX);
    const dy = Math.abs(o.y - carScreenY);
    const collide = dx < (o.size / 2 + carW / 2) && dy < (o.size / 2 + carH / 2);

    if (collide && !o.hit) {
      o.hit = true;
      window.spawnExplosion(o.x, o.y, Math.max(12, Math.floor(o.size / 6)));
      window.shake = Math.max(window.shake, 18);
      window.speed = Math.max(0.6, window.speed * 0.7);
      window.score = Math.max(0, Math.floor(window.score - 50));
      obstacles.splice(i, 1);
      continue;
    }

    if (!o.hit && o.y > carScreenY - carH && o.y < carScreenY + carH * 2) {
      const nearDx = Math.abs(o.x - carScreenX);
      if (nearDx < carW * 1.2 && !o._nearCounted) {
        o._nearCounted = true;
        window.nearMissMultiplier = Math.min(5, window.nearMissMultiplier + 0.2);
        window.score += Math.floor(10 * window.nearMissMultiplier);
        window.shake = Math.max(window.shake, 6);
        for (let i = 0; i < 8; i++) {
          spawnDriftParticles(o.x + randRange(-10,10), o.y + randRange(-10,10), randRange(-1,1));
        }
      }
    }
  }
};

window.drawObstacles = function(ctx) {
  obstacles.forEach(o => {
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.ellipse(o.x, o.y, o.size / 2, o.size / 2 * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,0,255,0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(o.x - o.size/2, o.y - o.size/2, o.size, o.size);
    ctx.restore();
  });
};
