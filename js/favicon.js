/* ========================================
   FAVICON.JS — Animated Canvas Favicon
   Draws a glowing "SN" icon in the browser
   tab that pulses with cyan/purple glow.
   ======================================== */

(function animatedFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    let animId = null;

    // Get or create the <link rel="icon"> element
    let link = document.getElementById('favicon');
    if (!link) {
        link = document.createElement('link');
        link.id = 'favicon';
        link.rel = 'icon';
        link.type = 'image/png';
        document.head.appendChild(link);
    }

    function draw() {
        const size = 64;
        const cx = size / 2;
        const cy = size / 2;
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.08); // 0 → 1 oscillation

        ctx.clearRect(0, 0, size, size);

        // ── Background ───────────────────────
        ctx.fillStyle = '#08080e';
        roundRect(ctx, 0, 0, size, size, 14);
        ctx.fill();

        // ── Outer glow ring (pulses) ──────────
        const glowSize = 28 + pulse * 6;
        const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize);
        radial.addColorStop(0, `rgba(0,200,255,${0.18 + pulse * 0.14})`);
        radial.addColorStop(0.5, `rgba(139,92,246,${0.10 + pulse * 0.08})`);
        radial.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, size, size);

        // ── Gradient border ───────────────────
        const borderGrad = ctx.createLinearGradient(0, 0, size, size);
        borderGrad.addColorStop(0, `rgba(0,200,255,${0.5 + pulse * 0.3})`);
        borderGrad.addColorStop(1, `rgba(139,92,246,${0.5 + pulse * 0.3})`);
        ctx.strokeStyle = borderGrad;
        ctx.lineWidth = 2;
        roundRect(ctx, 1, 1, size - 2, size - 2, 13);
        ctx.stroke();

        // ── "SN" text ─────────────────────────
        ctx.save();
        const textGrad = ctx.createLinearGradient(0, 0, size, size);
        textGrad.addColorStop(0, '#00c8ff');
        textGrad.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = textGrad;
        ctx.font = `900 28px "Space Grotesk", "Helvetica Neue", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtle text glow
        ctx.shadowColor = `rgba(0,200,255,${0.6 + pulse * 0.4})`;
        ctx.shadowBlur = 8 + pulse * 6;
        ctx.fillText('SN', cx, cy + 1);
        ctx.restore();

        // Update favicon
        link.href = canvas.toDataURL('image/png');
        frame++;
        animId = requestAnimationFrame(draw);
    }

    // Helper: rounded rectangle path
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // Start animation when page is visible, pause when hidden (saves battery)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            draw();
        }
    });

    // Kick off
    draw();
})();
