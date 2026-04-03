window.car = {
  x: 0,
  y: 0,
  angle: 0,
  speed: 0,
  vx: 0,
  vy: 0,
  driftAngle: 0,
  lapProgress: 0,
  lastPointIndex: 0
};

window.initCarOnTrack = function() {
  const p0 = track.points[0];
  const p1 = track.points[1];
  car.x = p0.x;
  car.y = p0.y;
  car.angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  car.speed = 0;
  car.vx = 0;
  car.vy = 0;
  car.driftAngle = 0;
  car.lapProgress = 0;
  car.lastPointIndex = 0;
};

window.updateCar = function(dt) {
  const dtSec = dt / 1000;
  const accel = 600;
  const maxSpeed = 900;
  const friction = 0.98;
  const steerStrength = 2.8;
  const driftFactor = 0.12;

  if (input.throttle > 0) {
    car.speed += accel * dtSec * input.throttle;
  } else {
    car.speed *= 0.995;
  }
  if (input.braking > 0) {
    car.speed *= 0.96;
  }

  car.speed = clamp(car.speed, 0, maxSpeed);

  const steer = input.steer * steerStrength * (car.speed / maxSpeed);
  car.angle += steer * dtSec;

  const targetVx = Math.cos(car.angle) * car.speed;
  const targetVy = Math.sin(car.angle) * car.speed;

  car.vx = lerp(car.vx, targetVx, driftFactor);
  car.vy = lerp(car.vy, targetVy, driftFactor);

  car.x += car.vx * dtSec;
  car.y += car.vy * dtSec;

  const forwardAngle = car.angle;
  const velAngle = Math.atan2(car.vy, car.vx);
  let diff = velAngle - forwardAngle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  car.driftAngle = diff;

  // drift particles
  const driftMag = Math.abs(diff);
  if (driftMag > 0.15 && car.speed > 200) {
    const backX = car.x - Math.cos(car.angle) * 20;
    const backY = car.y - Math.sin(car.angle) * 20;
    spawnDriftTrail(backX, backY, velAngle + Math.PI);
  }

  // lap progress (rough: nearest segment)
  let bestIdx = car.lastPointIndex;
  let bestDist = Infinity;
  for (let i = 0; i < track.points.length; i++) {
    const p = track.points[i];
    const dx = p.x - car.x;
    const dy = p.y - car.y;
    const d = dx*dx + dy*dy;
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  if (bestIdx < car.lastPointIndex && car.lastPointIndex > track.points.length * 0.6) {
    // completed lap
    window.onLapComplete();
  }
  car.lastPointIndex = bestIdx;
  car.lapProgress = bestIdx / (track.points.length - 1);
};

window.drawCar = function(ctx, cam) {
  const sx = (car.x - cam.x) * cam.zoom + cam.screenW / 2;
  const sy = (car.y - cam.y) * cam.zoom + cam.screenH / 2;
  const w = 40 * cam.zoom;
  const h = 22 * cam.zoom;

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(car.angle);

  // glow
  ctx.save();
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-w/2, -h/2, w, h);
  ctx.restore();

  // body
  ctx.fillStyle = '#f5f5ff';
  ctx.fillRect(-w/2, -h/2, w, h);

  // neon edges
  ctx.strokeStyle = '#ff00ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(-w/2, -h/2, w, h);

  // cockpit
  ctx.fillStyle = '#111122';
  ctx.fillRect(-w*0.1, -h*0.35, w*0.2, h*0.4);

  ctx.restore();
};
