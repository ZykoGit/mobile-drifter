let carX = 0;       // -1 to 1
let drift = 0;      // -1 to 1
let driftTarget = 0;

function updateCar(dt) {
  drift += (driftTarget - drift) * 0.02 * dt;
  carX += drift * 0.0015 * dt;
  carX = clamp(carX, -1, 1);
}

function drawCar(ctx, w, h, cx, cy) {
  const x = cx + carX * w * 0.2;
  const y = cy;
  const carWidth = w * 0.12;
  const carHeight = h * 0.12;

  // Trail
  const trailLen = h * 0.25;
  const gradient = ctx.createLinearGradient(x, y, x, y + trailLen);
  gradient.addColorStop(0, 'rgba(255, 0, 255, 0.9)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(x - carWidth * 0.25, y);
  ctx.lineTo(x + carWidth * 0.25, y);
  ctx.lineTo(x + carWidth * 0.5, y + trailLen);
  ctx.lineTo(x - carWidth * 0.5, y + trailLen);
  ctx.closePath();
  ctx.fill();

  // Body
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(drift * 0.35);
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);

  // Neon edges
  ctx.strokeStyle = '#ff00ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(-carWidth / 2, -carHeight / 2, carWidth, carHeight);

  // Windows
  ctx.fillStyle = '#111122';
  ctx.fillRect(-carWidth * 0.3, -carHeight * 0.35, carWidth * 0.6, carHeight * 0.3);

  ctx.restore();

  // Drift particles
  if (Math.abs(drift) > 0.2) {
    spawnDriftParticles(
      x - carWidth * 0.4 * Math.sign(drift),
      y + carHeight * 0.3,
      -Math.sign(drift)
    );
  }
}
