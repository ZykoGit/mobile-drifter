window.track = {
  points: [],
  width: 40,
  lapLength: 0
};

window.generateProceduralTrack = function() {
  const pts = [];
  const radius = 400;
  const segments = 40;
  let angle = 0;
  let x = 0, y = 0;

  for (let i = 0; i < segments; i++) {
    const turn = randRange(-0.4, 0.4);
    angle += turn;
    const step = randRange(40, 80);
    x += Math.cos(angle) * step;
    y += Math.sin(angle) * step;
    pts.push({ x, y });
  }

  // center track
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  pts.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  pts.forEach(p => {
    p.x -= cx;
    p.y -= cy;
  });

  // close loop
  pts.push({ x: pts[0].x, y: pts[0].y });

  track.points = pts;
  track.width = 70;

  // approximate lap length
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
  ctx.strokeStyle = 'rgba(0,229,255,0.25)';
  ctx.lineWidth = track.width * cam.zoom * 1.6;
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 40;
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
  ctx.strokeStyle = '#111122';
  ctx.lineWidth = track.width * cam.zoom;
  ctx.beginPath();
  track.points.forEach((p, i) => {
    const sx = (p.x - cam.x) * cam.zoom + cam.screenW / 2;
    const sy = (p.y - cam.y) * cam.zoom + cam.screenH / 2;
    if (i === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  });
  ctx.stroke();

  // center neon line
  ctx.strokeStyle = 'rgba(255,0,255,0.9)';
  ctx.lineWidth = 3 * cam.zoom;
  ctx.setLineDash([16 * cam.zoom, 16 * cam.zoom]);
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
