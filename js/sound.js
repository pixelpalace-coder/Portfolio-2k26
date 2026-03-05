/* ========================================
   SOUND.JS — Global Sound Effects
   ======================================== */

const uiSound = new Audio('sounds/faaah.mp3');
uiSound.volume = 0.6;

const loginSound = new Audio('sounds/after logining sound.mp3');
loginSound.volume = 0.8;

const navSound = new Audio('sounds/navbar links  clicking  sound.mp3');
navSound.volume = 0.5;

const scrollSound = new Audio('sounds/after passing sections and entering into new section .mp3');
scrollSound.volume = 0.3;

function playGlobalSound() {
    const clone = uiSound.cloneNode();
    clone.volume = uiSound.volume;
    clone.play().catch(e => console.log('Audio playback blocked:', e));
}

function playNavSound() {
    const clone = navSound.cloneNode();
    clone.volume = navSound.volume;
    clone.play().catch(e => console.log('Audio playback blocked:', e));
}

function playScrollSound() {
    const clone = scrollSound.cloneNode();
    clone.volume = scrollSound.volume;
    clone.play().catch(e => console.log('Audio playback blocked:', e));
}

function playLoginSound() {
    const clone = loginSound.cloneNode();
    clone.volume = loginSound.volume;
    clone.play().catch(e => console.log('Audio playback blocked:', e));
}

// 1. Play sound on button/link clicks
document.addEventListener('click', (e) => {
    // Nav links
    const navLink = e.target.closest('.nav-links a, .nav-brand');
    if (navLink) {
        playNavSound();
        return; // Don't play the generic sound
    }

    const interactiveEl = e.target.closest('button, a, .btn-primary, .btn-outline, .social-btn, .nav-user, .contact-link-row, input[type="submit"]');
    if (interactiveEl) {
        playGlobalSound();
    }
});

// 2. Play sound after successful login
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('play_login_sound') === 'true') {
        sessionStorage.removeItem('play_login_sound');
        setTimeout(() => {
            playLoginSound();
        }, 300);
    }
});


