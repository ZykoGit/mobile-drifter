window.levels = {
  ids: ['map1', 'map2', 'map3', 'map4', 'map5'],
  meta: [],
  unlockedMax: 1
};

window.loadLevelsMeta = async function() {
  const stored = localStorage.getItem('ndr_unlocked_max');
  levels.unlockedMax = stored ? parseInt(stored, 10) || 1 : 1;

  const meta = [];
  for (const id of levels.ids) {
    const res = await fetch(`maps/${id}.json`);
    const data = await res.json();
    meta.push({
      id,
      name: data.name || id,
      number: data.number || 1
    });
  }
  meta.sort((a, b) => a.number - b.number);
  levels.meta = meta;

  const select = document.getElementById('track-select');
  const lockMsg = document.getElementById('track-lock-msg');
  select.innerHTML = '';

  meta.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `Level ${m.number} — ${m.name}`;
    if (m.number > levels.unlockedMax) {
      opt.disabled = true;
    }
    select.appendChild(opt);
  });

  const lockedCount = meta.filter(m => m.number > levels.unlockedMax).length;
  lockMsg.textContent = lockedCount
    ? `Unlock more tracks by completing laps!`
    : '';
};

window.onTrackCompleted = function(number) {
  if (number + 1 > levels.unlockedMax && number < levels.ids.length) {
    levels.unlockedMax = number + 1;
    localStorage.setItem('ndr_unlocked_max', levels.unlockedMax.toString());
    loadLevelsMeta(); // refresh menu
  }
};
