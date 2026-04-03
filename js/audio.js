// audio.js
window.audioCtx = null;
window.analyser = null;
window.audioElement = null;
window.audioData = new Uint8Array(128);
window.audioEnergy = 0;

window.initAudio = function(audioUrl) {
  try {
    window.audioElement = new Audio();
    audioElement.src = audioUrl;
    audioElement.loop = true;
    audioElement.crossOrigin = "anonymous";
    audioElement.volume = 0.9;

    window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audioElement);
    window.analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    audioElement.play().catch(()=>{ /* user gesture required on mobile */ });
    window.updateAudioData();
  } catch (e) {
    console.warn('Audio init failed', e);
  }
};

window.updateAudioData = function() {
  if (!analyser) return;
  analyser.getByteFrequencyData(window.audioData);
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) sum += audioData[i];
  window.audioEnergy = sum / audioData.length / 255;
  requestAnimationFrame(updateAudioData);
};
