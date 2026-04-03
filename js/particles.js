window.particles = [];

window.spawnParticle = function(opts) {
  particles.push({
    x: opts.x,
    y: opts.y,
    vx: opts.vx || 0,
    vy: opts.vy || 0,
    life: opts.life || 400,
    age: 0,
    size: opts.size || 3,
    color: opts.color || '#ffffff',
    glow: opts.glow || false
  });
};

window.spawnDriftTrail = function(x, y, angle) {
  const speed = randRange(0.05, 0.18);
  const dir = angle + (Math.random() - 0.5) * 0.6;
  spawnParticle({
    x,
    y,
    vx: Math.cos(dir) * speed,
    vy: Math.sin(dir) * speed,
    life: 500 + Math.random() * 400,
    size: randRange(2, 4),
    color: Math.random() < 0.5 ? '#ff00ff' : '#00e5ff',
    glow: true
  });
};

window.spawnImpact = function(x, y, count) {
  for (let i = 0; i < count; i++) {
    const dir = Math.random() * Math.PI * 2;
    const spd = randRange(0.2, 0.7);
    spawnParticle({
      x,
      y,
      vx: Math.cos(dir) * spd,
      vy: Math.sin(dir) * spd,
      life: 400 + Math.random() * 400,
      size: randRange(2, 5),
      color: Math.random() < 0.5 ? '#ff6b00' : '#ffd400',
      glow: true
    });
  }
};

window.updateParticles = function(dt) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.age += dt;
    if (p.age >= p.life) {
      particles.splice(i, 1);
      continue;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
  }
};

window.drawParticles = function(ctx, cam) {
  particles.forEach(p => {
    const t = p.age / p.life;
    const alpha = 1 - t;
    const sx = (p.x - cam.x) * cam.zoom + cam.screenW / 2;
    const sy = (p.y - cam.y) * cam.zoom + cam.screenH / 2;

    if (p.glow) {
      ctx.save();
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(sx, sy, p.size * cam.zoom * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(sx, sy, p.size * cam.zoom, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
};
