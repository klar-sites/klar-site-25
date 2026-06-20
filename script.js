/* ==========================================================================
   Flux — Client-side interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initSmoothScroll();
  initCommandPalette();
  initAccordion();
  initScrollReveal();
  initFeatureCardGlow();
});

/* --------------------------------------------------------------------------
   Navbar: add .scrolled class when page is scrolled
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial state
}

/* --------------------------------------------------------------------------
   Mobile hamburger menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const hamburger = document.getElementById('navbarHamburger');
  const links = document.getElementById('navbarLinks');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (!hamburger || !links || !overlay) return;

  const openMenu = () => {
    links.classList.add('active');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    links.classList.remove('active');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = links.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  links.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      if (links.classList.contains('active')) closeMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   Smooth anchor scrolling
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return; // ignore top-of-page links

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* --------------------------------------------------------------------------
   Command Palette (⌘K / Ctrl+K)
   -------------------------------------------------------------------------- */
function initCommandPalette() {
  const overlay = document.getElementById('commandPaletteOverlay');
  const trigger = document.getElementById('cmdKTrigger');
  const input = document.getElementById('cpInput');
  if (!overlay || !trigger || !input) return;

  const open = () => {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    // Focus the input field with a tiny delay for animation
    setTimeout(() => input.focus(), 100);
  };

  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    input.value = '';
  };

  // Trigger button click
  trigger.addEventListener('click', open);

  // Keyboard shortcut: Meta+K (Mac) or Ctrl+K (Win/Linux)
  document.addEventListener('keydown', (e) => {
    const modKey = e.metaKey || e.ctrlKey;
    if (modKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      // Toggle: if open, close; else open
      overlay.classList.contains('open') ? close() : open();
    }
    // Escape to close
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      e.preventDefault();
      close();
    }
  });

  // Close when clicking overlay background (not the palette itself)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}

/* --------------------------------------------------------------------------
   FAQ Accordion (single open at a time)
   -------------------------------------------------------------------------- */
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other accordion items
      accordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* --------------------------------------------------------------------------
   Scroll reveal animation (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, stop observing to save resources
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px',
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Feature card mouse-tracking glow
   -------------------------------------------------------------------------- */
function initFeatureCardGlow() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length || !window.matchMedia('(pointer: fine)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });

    // Reset on mouse leave to avoid stale values
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mouse-x', '50%');
      card.style.setProperty('--mouse-y', '50%');
    });
  });
}
