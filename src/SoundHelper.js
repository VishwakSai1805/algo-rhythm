// src/SoundHelper.js

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const playNote = (freq) => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = 'sine'; 
    oscillator.frequency.value = freq + 150; 

    const now = audioCtx.currentTime;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01); 
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    oscillator.start(now);
    oscillator.stop(now + 0.5); 
};