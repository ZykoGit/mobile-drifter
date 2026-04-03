window.track = {
  points: [],
  width: 120,
  lapLength: 0
};

window.generateProceduralTrack = function() {
  const pts = [];
  const segments = 80;
  const baseRadius = 650;
  let radius = baseRadius;
  let angle = 0;
  const angleStep = (Math.PI * 2) / segments;

  for (let i = 0; i < segments; i++) {
    // smooth radius variation
    radius += randRange(-40, 40);
    radius = clamp(radius, baseRadius * 0.7, baseRadius * 1.3);

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    pts.push({ x, y });

    angle += angleStep + randRange(-0.05, 0.05);
  }

  // close loop
  pts.push({ x: pts[0].x, y: pts[0].y });

  track.points = pts;

  // lap length
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i-1].x;
    const dy = pts[i].y - pts[i-1].y;
    len += Math.hypot(dx, dy);
  }
  track.lapLength = len;
};

window.drawTrack = function(ctx, cam) {
  if (track.points.length < 2) return;

  ctx.save();
  ctx.lineCap = 'round';

  // outer glow
  ctx.strokeStyle = 'rgba(0,229,255,0.3)';
  ctx.lineWidth = track.width * cam.zoom * 1.8;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 50;
  ctx.beginPath();
  track.points.forEach((p, i) => {
    const sx = (p.x - cam.x) * cam.zoom + cam.screenW / 2;
    const sy = (p.y - cam.y) * cam.zoom + cam.screenH / 2;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.stroke();

  // main road
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#0b0b18';
  ctx.lineWidth = track.width * cam.zoom * 1.1;
  ctx.beginPath();
  track.points.forEach((p, i) => {
    const sx = (p.x - cam.x) * cam.zoom + cam.screenW / 2;
    const sy = (p.y - cam.y) * cam.zoom + cam.screenH / 2;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.stroke();

  // center neon line
  ctx.strokeStyle = 'rgba(255,0,255,0.95)';
  ctx.lineWidth = 4 * cam.zoom;
  ctx.setLineDash([22 * cam.zoom, 18 * cam.zoom]);
  ctx.beginPath();
  track.points.forEach((p, i) => {
    const sx = (p.x - cam.x) * cam.zoom + cam.screenW / 2;
    const sy = (p.y - cam.y) * cam.zoom + cam.screenH / 2;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
};
