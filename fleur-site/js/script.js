/* ===========================================================
   Fleur — общий скрипт для всех страниц сайта
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Page loader ---------- */
  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 250);
  });
  // fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader && loader.classList.add('hidden'), 250);
  }

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 30);
    updateProgress();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  updateProgress();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('header nav');
  const scrim = document.querySelector('.nav-scrim');
  function closeNav() {
    navToggle && navToggle.classList.remove('open');
    nav && nav.classList.remove('open');
    scrim && scrim.classList.remove('show');
  }
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      scrim && scrim.classList.toggle('show', open);
    });
    scrim && scrim.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  }

  /* ---------- Active nav link ---------- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('nav a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#') && href.split('/').pop() === currentPage) {
      a.classList.add('active');
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const value = target * eased;
        el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  /* ---------- Card cursor-follow glow ---------- */
  document.querySelectorAll('.phil-card, .service-card, .team-card, .info-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });
  });

  /* ---------- Cursor glow orb ---------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && matchMedia('(hover:hover)').matches) {
    let gx = 0, gy = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add('active');
    });
    function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------- Booking form (frontend only) ---------- */
  const form = document.getElementById('bookForm');
  const successMsg = document.getElementById('successMsg');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successMsg && successMsg.classList.add('show');
      form.querySelectorAll('input, select').forEach(el => (el.value = ''));
    });
  }

  /* ---------- Contact quick form (contacts page) ---------- */
  const cform = document.getElementById('contactForm');
  const csuccess = document.getElementById('contactSuccess');
  if (cform) {
    cform.addEventListener('submit', (e) => {
      e.preventDefault();
      csuccess && csuccess.classList.add('show');
      cform.reset();
    });
  }

  /* ---------- Gentle floating petals ---------- */
  const petalsWrap = document.getElementById('petals');
  if (petalsWrap) {
    const petalCount = window.innerWidth < 768 ? 8 : 14;
    for (let i = 0; i < petalCount; i++) {
      const p = document.createElement('div');
      p.className = 'petal';
      const size = 14 + Math.random() * 22;
      p.style.width = size + 'px';
      p.style.height = size * 0.85 + 'px';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      const duration = 22 + Math.random() * 18;
      const delay = -Math.random() * duration;
      p.style.animation = `petalFloat ${duration}s ease-in-out ${delay}s infinite`;
      petalsWrap.appendChild(p);
    }
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes petalFloat{
        0%,100%{ transform: translate(0,0) rotate(0deg); }
        25%{ transform: translate(3vw,-4vh) rotate(15deg); }
        50%{ transform: translate(-2vw,-8vh) rotate(-10deg); }
        75%{ transform: translate(-4vw,-3vh) rotate(8deg); }
      }`;
    document.head.appendChild(styleTag);
  }

});
