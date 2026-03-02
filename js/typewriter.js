/* ============================================================
   TYPEWRITER.JS — Animated typed text for the hero section
   ============================================================ */

(function () {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'AI & Data Science Enthusiast',
        'Machine Learning Engineer',
        'Computer Vision Developer',
        'Time Series Forecasting Expert',
        'DSA Problem Solver',
        'Railway AI Innovator',
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let delay = 120;
    const pauseEnd = 1800;
    const pauseStart = 400;

    function type() {
        const current = phrases[phraseIdx];

        if (!deleting) {
            el.textContent = current.slice(0, ++charIdx);
            if (charIdx === current.length) {
                deleting = true;
                delay = pauseEnd;
            } else {
                delay = 85 + Math.random() * 50;
            }
        } else {
            el.textContent = current.slice(0, --charIdx);
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                delay = pauseStart;
            } else {
                delay = 40 + Math.random() * 20;
            }
        }
        setTimeout(type, delay);
    }

    // Start after a short initial delay
    setTimeout(type, 800);
})();
