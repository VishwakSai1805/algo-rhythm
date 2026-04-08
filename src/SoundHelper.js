// src/SoundHelper.js

// Setup the main audio engine (using webkit for Safari support)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export const playNote = (freq) => {
    // Browsers block audio until the user interacts with the page, so we wake it up here
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator(); // Generates the tone
    const gainNode = audioCtx.createGain();         // Controls the volume

    // Connect the tone generator to the volume control, then to the speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // 'sine' gives a smooth, clean beep sound
    oscillator.type = 'sine'; 
    
    // Add 150Hz so the very short array bars don't sound like an inaudible low rumble
    oscillator.frequency.value = freq + 150; 

    const now = audioCtx.currentTime;
    
    // Volume Envelope: Start at 0, quick fade-in to prevent clicking noises, then smooth fade-out
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01); 
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    // Play for exactly half a second
    oscillator.start(now);
    oscillator.stop(now + 0.5); 
};