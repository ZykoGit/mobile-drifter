window.particles = [];

window.spawnDriftParticles = function(x, y, dir) {
  for (let i = 0; i < 6; i++) {
    window.particles.push({
      x,
      y,
      vx: randRange(-1, 1) * 0.4 + dir * 0.8,
      vy: -Math.random() * 0.5 - 0.2,
      life: 400 + Math.random() * 200,
      age: 0,
      color: Math.random() < 0.5 ? '#ff00ff' : '#00e5ff'
    });
  }
};

window.updateParticles = function(dt) {
  for (let i = window.particles.length - 1; i >= 0; i--) {
    const p = window.particles[i];
    p.age += dt;
    if (p.age >= p.life) {
      window.particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
};

window.drawParticles = function(ctx) {
  window.particles.forEach(p => {
    const t = p.age / p.life;
    const alpha = 1 - t;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3 + 3 * (1 - t), 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
};
