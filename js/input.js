window.input = {
  steer: 0,
  throttle: 0,
  braking: 0
};

window.isMobileDevice = function() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

(function() {
  let pointerDown = false;
  let pointerX = 0;

  window.setupInput = function(canvas) {
    // Keyboard (desktop)
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

    // Mobile controls: show buttons and wire them
    const mobileControls = document.getElementById('mobile-controls');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    if (isMobileDevice()) {
      mobileControls.style.display = 'flex';
      input.throttle = 1; // always accelerating on mobile

      const pressLeft = () => { input.steer = -1; };
      const releaseLeft = () => { if (input.steer < 0) input.steer = 0; };
      const pressRight = () => { input.steer = 1; };
      const releaseRight = () => { if (input.steer > 0) input.steer = 0; };

      btnLeft.addEventListener('touchstart', e => { e.preventDefault(); pressLeft(); }, { passive: false });
      btnLeft.addEventListener('touchend', e => { e.preventDefault(); releaseLeft(); }, { passive: false });
      btnLeft.addEventListener('mousedown', pressLeft);
      btnLeft.addEventListener('mouseup', releaseLeft);
      btnLeft.addEventListener('mouseleave', releaseLeft);

      btnRight.addEventListener('touchstart', e => { e.preventDefault(); pressRight(); }, { passive: false });
      btnRight.addEventListener('touchend', e => { e.preventDefault(); releaseRight(); }, { passive: false });
      btnRight.addEventListener('mousedown', pressRight);
      btnRight.addEventListener('mouseup', releaseRight);
      btnRight.addEventListener('mouseleave', releaseRight);
    } else {
      // Desktop: no on-screen buttons
      mobileControls.style.display = 'none';
    }
  };
})();
