// ===== Portfolio interactions =====
(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar background on scroll ---- */
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu toggle ---- */
  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close menu when a link is clicked or Escape pressed
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', closeMenu)
  );
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Active link highlighting via IntersectionObserver ---- */
  const sections = document.querySelectorAll('main section[id]');
  const linkFor = {};
  document.querySelectorAll('.nav-link').forEach((link) => {
    const id = link.getAttribute('href').slice(1);
    linkFor[id] = link;
  });

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Object.values(linkFor).forEach((l) => l.classList.remove('active'));
          const active = linkFor[entry.target.id];
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---- Scroll reveal animations ---- */
  const revealEls = document.querySelectorAll(
    '.section-head, .about-text, .about-side, .project-card, .project-soon, .skill-card, .contact-form, .contact-side'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---- Contact form validation ---- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  const setError = (id, msg) => {
    const field = document.getElementById(id).closest('.field');
    const errEl = document.getElementById('err-' + id);
    field.classList.toggle('invalid', Boolean(msg));
    errEl.textContent = msg || '';
  };

  const validators = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ''
        : 'Please enter a valid email address.',
    message: (v) =>
      v.trim().length >= 10 ? '' : 'Message should be at least 10 characters.',
  };

  // Validate on blur
  ['name', 'email', 'message'].forEach((id) => {
    const input = document.getElementById(id);
    input.addEventListener('blur', () => setError(id, validators[id](input.value)));
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('invalid')) {
        setError(id, validators[id](input.value));
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    let firstInvalid = null;
    ['name', 'email', 'message'].forEach((id) => {
      const input = document.getElementById(id);
      const msg = validators[id](input.value);
      setError(id, msg);
      if (msg && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.add('error');
      return;
    }

    // Build a mailto fallback (no backend required)
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    status.textContent = 'Opening your email app…';
    status.classList.add('success');
    window.location.href = `mailto:tahainahrakan@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
})();
