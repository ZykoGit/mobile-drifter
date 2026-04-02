// effects.js
window.explosions = [];

window.spawnExplosion = function(x, y, count) {
  for (let i = 0; i < count; i++) {
    window.particles.push({
      x,
      y,
      vx: randRange(-2, 2) * (0.6 + window.speed / window.maxSpeed),
      vy: randRange(-2.5, 0.5) * (0.6 + window.speed / window.maxSpeed),
      life: 500 + Math.random() * 500,
      age: 0,
      color: Math.random() < 0.6 ? '#ff6b00' : '#ffd400',
      size: randRange(2, 6)
    });
  }
  explosions.push({ x, y, r: 0, life: 500, age: 0 });
};

window.updateExplosions = function(dt) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const e = explosions[i];
    e.age += dt;
    if (e.age >= e.life) {
      explosions.splice(i, 1);
      continue;
    }
    e.r = (e.age / e.life) * 200 * (0.6 + window.speed / window.maxSpeed);
  }
};

window.drawExplosions = function(ctx) {
  explosions.forEach(e => {
    const a = 1 - e.age / e.life;
    ctx.save();
    ctx.globalAlpha = 0.25 * a;
    ctx.strokeStyle = `rgba(255,120,0,${0.6 * a})`;
    ctx.lineWidth = 6 * a;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  });
};

window.pulseShake = function(strength) {
  window.shake = Math.max(window.shake, strength);
};
