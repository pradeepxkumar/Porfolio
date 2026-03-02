/* ============================================================
   MAIN.JS — Navigation, Dark Mode, Coffee Animation, Scroll Reveal
   ============================================================ */

/* ======= PAGE LOADER ======= */
(function () {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = '<div class="loader-inner"></div>';
    document.body.prepend(loader);
    window.addEventListener('load', () => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
    });
})();

/* ======= BACK-TO-TOP ======= */
(function () {
    const btn = document.createElement('button');
    btn.id = 'back-to-top'; btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
})();

/* ======= NAVBAR shadow ======= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ======= HAMBURGER ======= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

/* ======= ACTIVE NAV ======= */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
function setActiveNav() {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + current));
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

/* ======= SMOOTH SCROLL ======= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
});

/* ======= DARK / LIGHT MODE ======= */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
applyTheme(localStorage.getItem('pk-theme') || 'dark');
themeToggle.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
});
function applyTheme(t) {
    document.body.classList.toggle('dark-mode', t === 'dark');
    document.body.classList.toggle('light-mode', t === 'light');
    themeIcon.className = t === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('pk-theme', t);
}

/* ======= "COFFEE INTO CODE" WORD ANIMATION ======= */
(function () {
    const el = document.getElementById('coffeeTagline');
    if (!el) return;

    // Words to display — mark highlighted ones
    const words = [
        { text: 'Turning', cls: '' },
        { text: 'Coffee', cls: 'green' },
        { text: '☕', cls: '' },
        { text: 'into', cls: '' },
        { text: 'Code,', cls: 'green' },
        { text: 'then', cls: '' },
        { text: 'Magic.', cls: 'green' },
        { text: '✨', cls: '' },
    ];

    // Build spans
    words.forEach(w => {
        const span = document.createElement('span');
        span.className = `coffee-word${w.cls ? ' ' + w.cls : ''}`;
        span.textContent = w.text + ' ';
        el.appendChild(span);
    });

    // Reveal one by one after hero entrance delay
    const spans = el.querySelectorAll('.coffee-word');
    let i = 0;
    function revealNext() {
        if (i < spans.length) {
            spans[i].classList.add('show');
            i++;
            setTimeout(revealNext, 160);
        }
    }
    setTimeout(revealNext, 1100); // start after hero animates in
})();

/* ======= SCROLL REVEAL ======= */
(function () {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observer.observe(el));
})();

/* ======= PROFILE IMAGE fallback ======= */
(function () {
    const img = document.getElementById('profileImg');
    const ph = document.getElementById('profilePlaceholder');
    if (!img || !ph) return;
    img.addEventListener('error', () => { img.style.display = 'none'; ph.style.display = 'flex'; });
    if (!img.src || img.src === window.location.href) { img.style.display = 'none'; ph.style.display = 'flex'; }
})();

/* ======= CONTACT FORM ======= */
(function () {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();
        if (!name || !email || !message) { showNote('⚠️ Please fill in all fields.', '#f59e0b'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNote('⚠️ Invalid email.', '#f59e0b'); return; }
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
        setTimeout(() => {
            btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            form.reset();
            showNote('✅ Message sent! I\'ll get back to you soon.', 'var(--green)');
        }, 1400);
    });
    function showNote(msg, color) {
        note.textContent = msg; note.style.color = color;
        setTimeout(() => (note.textContent = ''), 5000);
    }
})();

/* ======= COUNTER ANIMATION ======= */
(function () {
    const stats = document.querySelectorAll('.stat-num');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = parseInt(el.textContent.replace(/\D/g, ''), 10);
            const sfx = el.textContent.replace(/[\d]/g, '');
            if (isNaN(raw)) return;
            let cur = 0; const step = Math.ceil(raw / 25);
            const t = setInterval(() => {
                cur = Math.min(cur + step, raw);
                el.textContent = cur + sfx;
                if (cur >= raw) clearInterval(t);
            }, 45);
            observer.unobserve(el);
        });
    }, { threshold: 0.6 });
    stats.forEach(s => observer.observe(s));
})();
