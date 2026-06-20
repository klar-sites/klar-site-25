/**
 * Nordic Shoulder Clinic - Main JavaScript
 * Handles: Theme toggle, Mobile Nav, Sticky Header, Scroll Reveal,
 * FAQ Accordion, Active Nav Highlighting, Smooth Scroll, Form Validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ===============================================
  // 1. Theme Toggle (Dark/Light Mode)
  // ===============================================
  const themeToggle = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('theme-icon-sun');
  const moonIcon = document.getElementById('theme-icon-moon');
  const rootElement = document.documentElement;

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    rootElement.setAttribute('data-theme', 'dark');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        rootElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        rootElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    });
  }

  // ===============================================
  // 2. Mobile Navigation Toggle
  // ===============================================
  const navToggle = document.getElementById('nav-toggle');
  const siteHeader = document.getElementById('site-header');
  
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      siteHeader.classList.toggle('nav-open');
      const isExpanded = siteHeader.classList.contains('nav-open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        siteHeader.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===============================================
  // 3. Sticky Header Shadow on Scroll
  // ===============================================
  const handleScroll = () => {
    if (window.scrollY > 10) {
      siteHeader.style.boxShadow = 'var(--shadow-sm)';
    } else {
      siteHeader.style.boxShadow = 'none';
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ===============================================
  // 4. Active Navigation Highlighting
  // ===============================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // ===============================================
  // 5. Smooth Scrolling with Header Offset
  // ===============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = siteHeader.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===============================================
  // 6. Scroll Reveal Animations
  // ===============================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ===============================================
  // 7. FAQ Accordion
  // ===============================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const parentItem = this.parentElement;
      const isActive = parentItem.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
        const headerBtn = item.querySelector('.accordion-header');
        if(headerBtn) headerBtn.setAttribute('aria-expanded', 'false');
      });

      // Open the clicked one if it was closed
      if (!isActive) {
        parentItem.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===============================================
  // 8. Contact Form Validation
  // ===============================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      let isValid = true;

      // Clear previous errors
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });

      // Validate Name
      const name = document.getElementById('name');
      if (!name.value.trim() || name.value.trim().length < 2) {
        name.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate Email
      const email = document.getElementById('email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate Phone
      const phone = document.getElementById('phone');
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      if (!phoneRegex.test(phone.value.trim())) {
        phone.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // Validate Message
      const message = document.getElementById('message');
      if (!message.value.trim() || message.value.trim().length < 10) {
        message.closest('.form-group').classList.add('error');
        isValid = false;
      }

      // If valid, show success message
      if (isValid) {
        const successMessage = document.getElementById('form-success');
        successMessage.style.display = 'block';
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      }
    });

    // Real-time validation on input
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', function() {
        if (this.value.trim()) {
          this.closest('.form-group').classList.remove('error');
        }
      });
    });
  }

}); // End DOMContentLoaded
