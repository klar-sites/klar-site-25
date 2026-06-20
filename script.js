/**
 * Klar SaaS Landing Page — Interactive Scripts
 *
 * Handles:
 * - Theme toggle (light/dark) with localStorage + OS preference detection
 * - Mobile menu open/close
 * - Header scroll shadow
 * - Scroll-triggered entrance animations (Intersection Observer)
 * - FAQ accordion (enhanced <details>-like behaviour)
 * - Smooth anchor scroll offset for sticky header
 * - Active nav link highlighting on scroll (optional, lightweight)
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. DOM ELEMENT REFERENCES
     ───────────────────────────────────────────── */
  const siteHeader = document.getElementById('site-header');
  const themeToggle = document.getElementById('theme-toggle');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;
  const html = document.documentElement;

  // FAQ elements
  const faqItems = document.querySelectorAll('[data-faq-item]');

  // Elements that animate on scroll
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // All internal anchor links (for offset scrolling)
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  // All sections with IDs (for active nav)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav__link');

  /* ─────────────────────────────────────────────
     2. THEME TOGGLE (Light / Dark)
     ───────────────────────────────────────────── */
  const THEME_KEY = 'klar-theme-preference';

  /**
   * Detect the user's OS-level colour scheme preference.
   * Returns 'dark' if the OS prefers dark, otherwise 'light'.
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Returns the current theme: checks localStorage first, then system preference.
   */
  function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return getSystemTheme();
  }

  /**
   * Apply the given theme to the document.
   */
  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
      // Update theme-color meta tag for browser chrome
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', '#0d0d10');
      }
    } else {
      html.removeAttribute('data-theme');
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', '#5b5fe3');
      }
    }
  }

  /**
   * Toggle between light and dark themes.
   */
  function toggleTheme() {
    const currentTheme = html.hasAttribute('data-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  // Initialize theme on page load (before paint, so run immediately)
  applyTheme(getInitialTheme());

  // Listen for changes to OS-level preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      // Only auto-switch if the user hasn't manually set a preference
      const stored = localStorage.getItem(THEME_KEY);
      if (!stored) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Theme toggle button click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  /* ─────────────────────────────────────────────
     3. MOBILE MENU
     ───────────────────────────────────────────── */
  let menuOpen = false;

  function openMobileMenu() {
    menuOpen = true;
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    menuOpen = false;
    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('no-scroll');
  }

  function toggleMobileMenu() {
    if (menuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile menu when a link inside it is clicked
  if (mobileMenu) {
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });
  }

  // Close mobile menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) {
      closeMobileMenu();
      mobileMenuToggle.focus(); // Return focus to toggle button
    }
  });

  /* ─────────────────────────────────────────────
     4. HEADER SCROLL SHADOW
     ───────────────────────────────────────────── */
  function handleHeaderScroll() {
    if (!siteHeader) return;
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 8) {
      siteHeader.classList.add('site-header--scrolled');
    } else {
      siteHeader.classList.remove('site-header--scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  // Run once on load
  handleHeaderScroll();

  /* ─────────────────────────────────────────────
     5. SCROLL-TRIGGERED ANIMATIONS
     ───────────────────────────────────────────── */
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -60px 0px', // trigger slightly before element enters view
      threshold: 0.1
    };

    const animationObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-on-scroll--visible');
          // Once visible, stop observing this element
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(function (el) {
      animationObserver.observe(el);
    });
  } else if (animatedElements.length > 0) {
    // Fallback: just show everything immediately if IntersectionObserver isn't available
    animatedElements.forEach(function (el) {
      el.classList.add('animate-on-scroll--visible');
    });
  }

  /* ─────────────────────────────────────────────
     6. FAQ ACCORDION
     ───────────────────────────────────────────── */
  function initFaq() {
    faqItems.forEach(function (item) {
      const toggle = item.querySelector('[data-faq-toggle]');
      if (!toggle) return;

      toggle.addEventListener('click', function () {
        const isOpen = item.classList.contains('faq__item--open');
        const wasExpanded = toggle.getAttribute('aria-expanded') === 'true';

        // Close all other FAQ items (optional — accordion behaviour)
        // Comment out the next lines if you want multiple open at once.
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('faq__item--open');
            const otherToggle = otherItem.querySelector('[data-faq-toggle]');
            if (otherToggle) {
              otherToggle.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current item
        if (isOpen && wasExpanded) {
          item.classList.remove('faq__item--open');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('faq__item--open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });

      // Allow keyboard activation with Enter/Space
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    });
  }

  initFaq();

  /* ─────────────────────────────────────────────
     7. SMOOTH ANCHOR SCROLL WITH HEADER OFFSET
     ───────────────────────────────────────────── */
  function getHeaderHeight() {
    if (!siteHeader) return 0;
    return siteHeader.getBoundingClientRect().height;
  }

  function scrollToTarget(targetEl) {
    if (!targetEl) return;
    const headerHeight = getHeaderHeight();
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = targetPosition - headerHeight - 16; // 16px extra breathing room

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  internalLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      // Only handle internal anchors
      if (!href || !href.startsWith('#')) return;
      // Ignore empty hash links
      if (href === '#') return;

      const targetId = href.substring(1);
      const targetEl = document.getElementById(targetId);

      if (targetEl) {
        e.preventDefault();
        scrollToTarget(targetEl);

        // Update URL hash without jump (after scroll completes)
        if (history.pushState) {
          history.pushState(null, null, href);
        } else {
          // Fallback for older browsers
          setTimeout(function () {
            window.location.hash = href;
          }, 500);
        }
      }
    });
  });

  /* ─────────────────────────────────────────────
     8. ACTIVE NAV LINK HIGHLIGHTING (on scroll)
     ───────────────────────────────────────────── */
  if (sections.length > 0 && navLinks.length > 0 && 'IntersectionObserver' in window) {
    const navObserverOptions = {
      root: null,
      rootMargin: '-80px 0px -40% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const activeId = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            link.classList.remove('site-nav__link--active');
            if (link.getAttribute('href') === '#' + activeId) {
              link.classList.add('site-nav__link--active');
            }
          });
        }
      });
    }, navObserverOptions);

    sections.forEach(function (section) {
      if (section.id) {
        sectionObserver.observe(section);
      }
    });
  }

  /* ─────────────────────────────────────────────
     9. RESIZE HANDLER (debounced)
     ───────────────────────────────────────────── */
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      // Close mobile menu on desktop breakpoint
      if (window.innerWidth >= 768 && menuOpen) {
        closeMobileMenu();
      }
    }, 150);
  }

  window.addEventListener('resize', handleResize, { passive: true });

  /* ─────────────────────────────────────────────
     10. INITIALISATION COMPLETE
     ───────────────────────────────────────────── */
  // Log a subtle welcome for devs who inspect the console
  if (window.console && window.console.log) {
    console.log(
      '%c🚀 Klar %cSaaS Landing Page',
      'font-weight: bold; font-size: 1.2em; color: #5b5fe3;',
      'color: #8e8e96;'
    );
    console.log(
      '%cBuilt with vanilla HTML, CSS & JS. No frameworks, no build step.',
      'font-style: italic; color: #8e8e96;'
    );
  }
})();
