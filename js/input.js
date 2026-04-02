window.isPointerDown = false;
window.pointerStartX = 0;
window.pointerCurrentX = 0;

window.setupInput = function(canvasElement) {
  canvasElement.addEventListener('mousedown', e => onPointerDown(e.clientX));
  window.addEventListener('mousemove', e => onPointerMove(e.clientX));
  window.addEventListener('mouseup', onPointerUp);

  canvasElement.addEventListener('touchstart', e => {
    const t = e.touches[0];
    onPointerDown(t.clientX);
  }, { passive: false });

  canvasElement.addEventListener('touchmove', e => {
    const t = e.touches[0];
    onPointerMove(t.clientX);
    e.preventDefault();
  }, { passive: false });

  canvasElement.addEventListener('touchend', onPointerUp);

  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') window.driftTarget = -1;
    if (e.key === 'ArrowRight' || e.key === 'd') window.driftTarget = 1;
  });

  window.addEventListener('keyup', e => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
      window.driftTarget = 0;
    }
  });
};

function onPointerDown(x) {
  window.isPointerDown = true;
  window.pointerStartX = x;
  window.pointerCurrentX = x;
}

function onPointerMove(x) {
  if (!window.isPointerDown) return;
  window.pointerCurrentX = x;
  const dx = window.pointerCurrentX - window.pointerStartX;
  window.driftTarget = clamp(dx / (window.innerWidth * 0.3), -1, 1);
}

function onPointerUp() {
  window.isPointerDown = false;
  window.driftTarget = 0;
}
