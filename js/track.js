window.track = {
  points: [],
  width: 120,
  lapLength: 0,
  name: 'Unknown',
  number: 1
};

function distPointToSegment(px, py, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLen2 = abx*abx + aby*aby || 1;
  let t = (apx*abx + apy*aby) / abLen2;
  t = clamp(t, 0, 1);
  const cx = ax + abx * t;
  const cy = ay + aby * t;
  const dx = px - cx;
  const dy = py - cy;
  return Math.hypot(dx, dy);
}

window.loadTrack = async function(id = 'map1') {
  const res = await fetch(`maps/${id}.json`);
  const data = await res.json();

  track.points = data.points || [];
  track.width = data.widthTrack || 120;
  track.name = data.name || id;
  track.number = data.number || 1;

  let len = 0;
  for (let i = 1; i < track.points.length; i++) {
    const a = track.points[i-1];
    const b = track.points[i];
    len += Math.hypot(b.x - a.x, b.y - a.y);
  }
  track.lapLength = len;
};

window.isOffTrack = function(x, y) {
  if (track.points.length < 2) return false;
  let minDist = Infinity;
  for (let i = 1; i < track.points.length; i++) {
    const a = track.points[i-1];
    const b = track.points[i];
    const d = distPointToSegment(x, y, a.x, a.y, b.x, b.y);
    if (d < minDist) minDist = d;
  }
  return minDist > track.width * 0.6;
};

window.drawTrack = function(ctx, cam) {
  if (track.points.length < 2) return;

  ctx.save();
  ctx.lineCap = 'round';

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
