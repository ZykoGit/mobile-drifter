let isPointerDown = false;
let pointerStartX = 0;
let pointerCurrentX = 0;

function setupInput(canvasElement) {
  // Pointer
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

  // Keyboard
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') driftTarget = -1;
    if (e.key === 'ArrowRight' || e.key === 'd') driftTarget = 1;
  });

  window.addEventListener('keyup', e => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
      driftTarget = 0;
    }
  });
}

function onPointerDown(x) {
  isPointerDown = true;
  pointerStartX = x;
  pointerCurrentX = x;
}

function onPointerMove(x) {
  if (!isPointerDown) return;
  pointerCurrentX = x;
  const dx = pointerCurrentX - pointerStartX;
  driftTarget = clamp(dx / (window.innerWidth * 0.3), -1, 1);
}

function onPointerUp() {
  isPointerDown = false;
  driftTarget = 0;
}
