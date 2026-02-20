/* ========================================
   LOADER.JS — Premium Loader Animation
   ======================================== */

function initLoader(onDone) {
    const loader = document.getElementById('loader');
    if (!loader) { onDone && onDone(); return; }

    const name = loader.querySelector('.loader-name');
    const subtitle = loader.querySelector('.loader-subtitle');
    const bar = loader.querySelector('.loader-bar');

    const tl = gsap.timeline({
        onComplete: () => {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    onDone && onDone();
                }
            });
        }
    });

    // Name reveal
    tl.to(name, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
        .to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5)
        // Progress bar
        .to(bar, { width: '100%', duration: 1.4, ease: 'power2.inOut' }, 0.6)
        // Pause briefly at 100%
        .to({}, { duration: 0.3 });

    return tl;
}

window.initLoader = initLoader;
