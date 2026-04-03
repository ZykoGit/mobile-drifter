window.car = {
  x: 0,
  y: 0,
  angle: 0,
  speed: 0,
  vx: 0,
  vy: 0,
  driftAngle: 0,
  lapProgress: 0,
  lastPointIndex: 0,

  width: 70,   // hitbox width
  height: 38   // hitbox height
};

window.initCarOnTrack = function() {
  const p0 = track.points[0];
  const p1 = track.points[1] || { x: p0.x + 1, y: p0.y };

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

  // TUNING CONSTANTS
  const accel = 900;
  const maxSpeed = 1200;
  const steerStrength = 3.2;
  const driftFactor = 0.14;

  // ACCELERATION
  if (input.throttle > 0) {
    car.speed += accel * dtSec * input.throttle;
  } else {
    car.speed *= 0.995;
  }

  // BRAKING
  if (input.braking > 0) {
    car.speed *= 0.96;
  }

  car.speed = clamp(car.speed, 0, maxSpeed);

  // STEERING
  const steer = input.steer * steerStrength * (car.speed / maxSpeed);
  car.angle += steer * dtSec;

  // TARGET VELOCITY
  const targetVx = Math.cos(car.angle) * car.speed;
  const targetVy = Math.sin(car.angle) * car.speed;

  // DRIFT BLEND
  car.vx = lerp(car.vx, targetVx, driftFactor);
  car.vy = lerp(car.vy, targetVy, driftFactor);

  // APPLY VELOCITY
  car.x += car.vx * dtSec;
  car.y += car.vy * dtSec;

  // DRIFT ANGLE CALC
  const forwardAngle = car.angle;
  const velAngle = Math.atan2(car.vy, car.vx);

  let diff = velAngle - forwardAngle;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;

  car.driftAngle = diff;

  // OFF-TRACK COLLISION
  if (window.isOffTrack(car.x, car.y)) {
    car.speed *= 0.92;          // slow down
    window.shake = Math.max(window.shake, 10); // camera shake
  }

  // DRIFT PARTICLES
  const driftMag = Math.abs(diff);
  if (driftMag > 0.18 && car.speed > 250) {
    const backX = car.x - Math.cos(car.angle) * 30;
    const backY = car.y - Math.sin(car.angle) * 30;
    spawnDriftTrail(backX, backY, velAngle + Math.PI);
  }

  // LAP PROGRESS (nearest point)
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

  // LAP COMPLETE
  if (bestIdx < car.lastPointIndex && car.lastPointIndex > track.points.length * 0.6) {
    window.onLapComplete();
  }

  car.lastPointIndex = bestIdx;
  car.lapProgress = bestIdx / (track.points.length - 1);
};

window.drawCar = function(ctx, cam) {
  const sx = (car.x - cam.x) * cam.zoom + cam.screenW / 2;
  const sy = (car.y - cam.y) * cam.zoom + cam.screenH / 2;

  const w = car.width * cam.zoom;
  const h = car.height * cam.zoom;

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(car.angle);

  // UNDERGLOW
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = 'rgba(0,229,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(0, h*0.2, w*0.9, h*0.6, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // GLOW BODY
  ctx.save();
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-w/2, -h/2, w, h);
  ctx.restore();

  // MAIN BODY
  ctx.fillStyle = '#f5f5ff';
  ctx.fillRect(-w/2, -h/2, w, h);

  // ACCENT STRIPES
  ctx.fillStyle = '#ff00ff';
  ctx.fillRect(-w/2 + w*0.05, -h/2 + h*0.1, w*0.12, h*0.8);

  ctx.fillStyle = '#00e5ff';
  ctx.fillRect(w/2 - w*0.17, -h/2 + h*0.1, w*0.12, h*0.8);

  // COCKPIT
  ctx.fillStyle = '#111122';
  ctx.fillRect(-w*0.12, -h*0.35, w*0.24, h*0.45);

  ctx.restore();
};
