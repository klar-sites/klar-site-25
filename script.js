document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // Mobile Navigation Toggle
  // ===================================================================
  const navToggle = document.getElementById('nav-toggle');
  const navDrawer = document.getElementById('nav-drawer');

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navDrawer.getAttribute('data-open') === 'true';
      navDrawer.setAttribute('data-open', !isOpen);
      navToggle.setAttribute('aria-expanded', !isOpen);
    });

    // Close drawer when a link is clicked
    navDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.setAttribute('data-open', 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===================================================================
  // Command Palette (⌘K) Modal Handling
  // ===================================================================
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const openCmdNav = document.getElementById('open-cmd-nav');
  const cmdItems = document.querySelectorAll('.cmd-item');
  let activeCmdIndex = 0;

  function updateCmdActive() {
    cmdItems.forEach((item, i) => {
      item.setAttribute('data-active', i === activeCmdIndex);
      if (i === activeCmdIndex) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  function openCmd() {
    if (!cmdOverlay) return;
    cmdOverlay.setAttribute('data-open', 'true');
    activeCmdIndex = 0;
    updateCmdActive();
    setTimeout(() => cmdInput && cmdInput.focus(), 50);
  }

  function closeCmd() {
    if (!cmdOverlay) return;
    cmdOverlay.setAttribute('data-open', 'false');
    if (cmdInput) cmdInput.value = '';
  }

  if (cmdOverlay) {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (cmdOverlay.getAttribute('data-open') === 'true') {
          closeCmd();
        } else {
          openCmd();
        }
      }
      if (e.key === 'Escape' && cmdOverlay.getAttribute('data-open') === 'true') {
        closeCmd();
      }

      // Command palette navigation
      if (cmdOverlay.getAttribute('data-open') === 'true' && cmdItems.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeCmdIndex = (activeCmdIndex + 1) % cmdItems.length;
          updateCmdActive();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeCmdIndex = (activeCmdIndex - 1 + cmdItems.length) % cmdItems.length;
          updateCmdActive();
        }
      }
    });

    // Click handlers
    if (openCmdNav) openCmdNav.addEventListener('click', openCmd);
    
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCmd();
    });

    cmdItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Simulate action
        closeCmd();
      });
      item.addEventListener('mouseenter', () => {
        activeCmdIndex = index;
        updateCmdActive();
      });
    });
  }

  // ===================================================================
  // FAQ Accordion
  // ===================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-q');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.setAttribute('data-open', 'false');
          const otherBtn = otherItem.querySelector('.faq-q');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      item.setAttribute('data-open', !isOpen);
      button.setAttribute('aria-expanded', !isOpen);
    });
  });

  // ===================================================================
  // Scroll Reveal Animations
  // ===================================================================
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-shown', 'true');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    reveals.forEach(el => el.setAttribute('data-shown', 'true'));
  }

  // ===================================================================
  // Feature Card Mouse Glow Tracking
  // ===================================================================
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  // ===================================================================
  // Docs TOC Active State on Scroll
  // ===================================================================
  const tocLinks = document.querySelectorAll('.docs-toc a');
  const headings = document.querySelectorAll('.docs-main h2, .docs-main h1');

  if (tocLinks.length > 0 && headings.length > 0 && 'IntersectionObserver' in window) {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tocLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isActive);
          });
        }
      });
    }, {
      rootMargin: '0px 0px -70% 0px' // Trigger when heading is in top 30%
    });

    headings.forEach(h => headingObserver.observe(h));
  }

});
