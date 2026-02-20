/* ========================================
   SOUND.JS — Global Sound Effects
   ======================================== */

const uiSound = new Audio('sounds/faaah.mp3');
uiSound.volume = 0.6; // Adjust volume as needed

function playGlobalSound() {
    // Clone to allow overlapping sounds on rapid clicks
    const clone = uiSound.cloneNode();
    clone.volume = uiSound.volume;
    clone.play().catch(e => console.log('Audio playback blocked:', e));
}

// 1. Play sound on button/link clicks
document.addEventListener('click', (e) => {
    // Find closest interactive element
    const interactiveEl = e.target.closest('button, a, .btn-primary, .btn-outline, .social-btn, .nav-user, .contact-link-row, input[type="submit"]');

    if (interactiveEl) {
        playGlobalSound();
    }
});

// 2. Play sound after successful login (checked on portfolio load)
window.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('play_login_sound') === 'true') {
        sessionStorage.removeItem('play_login_sound');

        // Attempt to play immediately. If browser blocks autoplay, it will fail silently in the catch block.
        // It often succeeds because the user just interacted with the login button on the same origin.
        setTimeout(() => {
            playGlobalSound();
        }, 300); // Slight delay for smoother experience after page transition
    }
});
