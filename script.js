/* =========================================================
   script.js — Premium SaaS Landing Page
   Handles: mobile nav toggle, theme toggle, FAQ accordion,
   scroll fade-in animations.
   No dependencies, vanilla JS.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initThemeToggle();
  initFaqAccordion();
  initScrollAnimations();
});

/* ── Mobile menu toggle ── */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.getElementById('navLinks');

  if (!btn || !navLinks) return;

  btn.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when clicking a link (for better UX)
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }
  });
}

/* ── Theme toggle (light/dark) ── */
function initThemeToggle() {
  const btn = document.querySelector('.theme-toggle');
  const sunIcon = btn?.querySelector('.sun-icon');
  const moonIcon = btn?.querySelector('.moon-icon');
  const html = document.documentElement;

  if (!btn) return;

  // Load saved preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = 'block';
  } else {
    html.classList.add('light');
    html.classList.remove('dark');
    if (sunIcon) sunIcon.style.display = 'block';
    if (moonIcon) moonIcon.style.display = 'none';
  }

  btn.addEventListener('click', function () {
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
      html.classList.add('light');
      localStorage.setItem('theme', 'light');
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      html.classList.remove('light');
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  });
}

/* ── FAQ Accordion ── */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all other items (accordion behavior)
      items.forEach(function (other) {
        if (other !== item && other.classList.contains('open')) {
          other.classList.remove('open');
          other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('open');
        question.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });

    // Ensure initial state is closed
    question.setAttribute('aria-expanded', 'false');
  });
}

/* ── Scroll fade-in animations using IntersectionObserver ── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally stop observing once visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}
