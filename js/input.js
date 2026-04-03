window.input = {
  steer: 0,
  throttle: 0,
  braking: 0
};

(function() {
  let pointerDown = false;
  let pointerX = 0;

  window.setupInput = function(canvas) {
    canvas.addEventListener('mousedown', e => {
      pointerDown = true;
      pointerX = e.clientX;
    });
    window.addEventListener('mouseup', () => {
      pointerDown = false;
      input.steer = 0;
      input.throttle = 0;
    });
    window.addEventListener('mousemove', e => {
      if (!pointerDown) return;
      const dx = e.clientX - pointerX;
      input.steer = clamp(dx / (window.innerWidth * 0.25), -1, 1);
      input.throttle = 1;
    });

    canvas.addEventListener('touchstart', e => {
      const t = e.touches[0];
      pointerDown = true;
      pointerX = t.clientX;
    }, { passive: false });

    canvas.addEventListener('touchmove', e => {
      const t = e.touches[0];
      const dx = t.clientX - pointerX;
      input.steer = clamp(dx / (window.innerWidth * 0.25), -1, 1);
      input.throttle = 1;
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      pointerDown = false;
      input.steer = 0;
      input.throttle = 0;
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'a') input.steer = -1;
      if (e.key === 'ArrowRight' || e.key === 'd') input.steer = 1;
      if (e.key === 'ArrowUp' || e.key === 'w') input.throttle = 1;
      if (e.key === 'ArrowDown' || e.key === 's') input.braking = 1;
    });
    window.addEventListener('keyup', e => {
      if (['ArrowLeft','a','ArrowRight','d'].includes(e.key)) input.steer = 0;
      if (['ArrowUp','w'].includes(e.key)) input.throttle = 0;
      if (['ArrowDown','s'].includes(e.key)) input.braking = 0;
    });
  };
})();
