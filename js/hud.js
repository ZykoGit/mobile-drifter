window.hud = {
  speedEl: null,
  driftEl: null,
  scoreEl: null,
  bestEl: null,
  lapEl: null,
  trackEl: null,
  score: 0,
  bestScore: 0,
  lap: 1
};

window.initHUD = function() {
  hud.speedEl = document.getElementById('hud-speed');
  hud.driftEl = document.getElementById('hud-drift');
  hud.scoreEl = document.getElementById('hud-score');
  hud.bestEl = document.getElementById('hud-best');
  hud.lapEl = document.getElementById('hud-lap');
  hud.trackEl = document.getElementById('hud-track');

  const stored = localStorage.getItem('ndr_best_score');
  hud.bestScore = stored ? parseInt(stored, 10) || 0 : 0;
  hud.bestEl.textContent = hud.bestScore.toString();
};

window.updateHUD = function(dt) {
  const speedKmh = car.speed * 0.12;
  hud.speedEl.textContent = speedKmh.toFixed(0);

  const driftPct = clamp(Math.abs(car.driftAngle) / 0.6, 0, 1) * 100;
  hud.driftEl.textContent = driftPct.toFixed(0);

  const driftFactor = clamp(Math.abs(car.driftAngle) / 0.7, 0, 1);
  const gain = (speedKmh * 0.03 + driftFactor * 3.0) * (dt / 16.67);
  hud.score += gain;
  hud.scoreEl.textContent = Math.floor(hud.score).toString();

  if (hud.score > hud.bestScore) {
    hud.bestScore = Math.floor(hud.score);
    hud.bestEl.textContent = hud.bestScore.toString();
    localStorage.setItem('ndr_best_score', hud.bestScore.toString());
  }

  hud.lapEl.textContent = hud.lap.toString();
};

window.onLapComplete = function() {
  hud.lap += 1;
  hud.score += 250;

  // unlock next track when you complete first lap of this one
  if (hud.lap === 2 && window.onTrackCompleted) {
    window.onTrackCompleted(track.number);
  }
};
