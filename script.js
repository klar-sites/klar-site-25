/**
 * Linear SaaS Landing Page - Vanilla JavaScript
 * Handles:
 * - Mobile navigation toggle
 * - Smooth scrolling
 * - FAQ accordion
 * - Intersection Observer for animations
 * - Form handling (CTA buttons)
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Query selector wrapper with error handling
 */
function $(selector) {
  return document.querySelector(selector);
}

/**
 * Query selector all wrapper
 */
function $$(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Add class to element
 */
function addClass(el, cls) {
  if (el) el.classList.add(cls);
}

/**
 * Remove class from element
 */
function removeClass(el, cls) {
  if (el) el.classList.remove(cls);
}

/**
 * Toggle class on element
 */
function toggleClass(el, cls) {
  if (el) el.classList.toggle(cls);
}

/**
 * Check if element has class
 */
function hasClass(el, cls) {
  return el && el.classList.contains(cls);
}

// ============================================================================
// MOBILE NAVIGATION
// ============================================================================

class MobileNav {
  constructor() {
    this.hamburger = $(".hamburger");
    this.navList = $(".nav-list");
    this.navActions = $(".nav-actions");
    this.body = document.body;

    if (!this.hamburger) return;

    this.init();
  }

  init() {
    this.hamburger.addEventListener("click", () => this.toggle());

    // Close menu when clicking on a link
    $$(".nav-link").forEach((link) => {
      link.addEventListener("click", () => this.close());
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const isClickInsideNav =
        this.hamburger.contains(e.target) ||
        this.navList?.contains(e.target) ||
        this.navActions?.contains(e.target);

      if (!isClickInsideNav && hasClass(this.hamburger, "active")) {
        this.close();
      }
    });

    // Close menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && hasClass(this.hamburger, "active")) {
        this.close();
      }
    });
  }

  toggle() {
    if (hasClass(this.hamburger, "active")) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    addClass(this.hamburger, "active");
    addClass(this.navList, "active");
    addClass(this.navActions, "active");
    addClass(this.body, "no-scroll");
    this.hamburger.setAttribute("aria-expanded", "true");
  }

  close() {
    removeClass(this.hamburger, "active");
    removeClass(this.navList, "active");
    removeClass(this.navActions, "active");
    removeClass(this.body, "no-scroll");
    this.hamburger.setAttribute("aria-expanded", "false");
  }
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================

class FAQAccordion {
  constructor() {
    this.items = $$(".faq-item");

    if (this.items.length === 0) return;

    this.init();
  }

  init() {
    this.items.forEach((item) => {
      const button = item.querySelector(".faq-question");

      button.addEventListener("click", () => {
        this.toggle(item);
      });

      // Keyboard navigation
      button.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextItem = item.nextElementSibling;
          if (nextItem) {
            nextItem.querySelector(".faq-question").focus();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevItem = item.previousElementSibling;
          if (prevItem) {
            prevItem.querySelector(".faq-question").focus();
          }
        }
      });
    });
  }

  toggle(item) {
    const isActive = hasClass(item, "active");

    if (isActive) {
      this.close(item);
    } else {
      this.close(this.items); // Close all
      this.open(item);
    }
  }

  open(item) {
    if (!item) return;
    addClass(item, "active");
    const answer = item.querySelector(".faq-answer");
    if (answer) {
      const height = answer.scrollHeight;
      answer.style.maxHeight = height + "px";
    }
  }

  close(items) {
    const itemsToClose = items instanceof NodeList ? items : [items];

    itemsToClose.forEach((item) => {
      removeClass(item, "active");
      const answer = item.querySelector(".faq-answer");
      if (answer) {
        answer.style.maxHeight = "0px";
      }
    });
  }
}

// ============================================================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================================================

class AnimationObserver {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    this.init();
  }

  init() {
    // Observe feature cards
    $$(".feature-card").forEach((card, index) => {
      this.observeElement(card, index * 100);
    });

    // Observe testimonial cards
    $$(".testimonial").forEach((card, index) => {
      this.observeElement(card, index * 100);
    });

    // Observe pricing cards
    $$(".pricing-card").forEach((card, index) => {
      this.observeElement(card, index * 100);
    });

    // Observe benefit items
    $$(".benefit-item").forEach((item, index) => {
      this.observeElement(item, index * 50);
    });
  }

  observeElement(element, delay) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            addClass(entry.target, "animate-in");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    observer.observe(element);
  }
}

// ============================================================================
// SMOOTH SCROLL
// ============================================================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Handle anchor links
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");

        if (href === "#") {
          return;
        }

        const target = $(href);

        if (target) {
          e.preventDefault();

          // Scroll to target with offset for sticky header
          const headerHeight =
            $(".site-header").offsetHeight || 0;
          const targetPosition =
            target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }
}

// ============================================================================
// CTA BUTTON HANDLERS
// ============================================================================

class CTAHandler {
  constructor() {
    this.init();
  }

  init() {
    // Handle "Start Free" buttons
    $$(".btn-primary").forEach((btn) => {
      if (
        btn.textContent.includes("Start") ||
        btn.textContent.includes("Free")
      ) {
        btn.addEventListener("click", (e) => {
          this.handleStartFree(e);
        });
      }
    });

    // Handle "Watch Demo" buttons
    $$(".btn-ghost").forEach((btn) => {
      if (btn.textContent.includes("Demo")) {
        btn.addEventListener("click", (e) => {
          this.handleWatchDemo(e);
        });
      }
    });

    // Handle "Sign In" buttons
    $$(".btn-secondary").forEach((btn) => {
      if (btn.textContent.includes("Sign In")) {
        btn.addEventListener("click", (e) => {
          this.handleSignIn(e);
        });
      }
    });
  }

  handleStartFree(e) {
    e.preventDefault();

    // In a real app, this would redirect to signup
    console.log("Start Free Trial clicked");

    // Show subtle feedback
    const btn = e.target;
    const originalText = btn.textContent;

    btn.textContent = "Redirecting...";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      // Uncomment to redirect: window.location.href = '/signup';
    }, 1500);
  }

  handleWatchDemo(e) {
    e.preventDefault();

    console.log("Watch Demo clicked");

    // Show a simple modal or toast
    this.showToast("Demo video would open in a modal");
  }

  handleSignIn(e) {
    e.preventDefault();

    console.log("Sign In clicked");

    // In a real app, this would redirect to login
    this.showToast("Redirecting to sign in...");
    // Uncomment to redirect: window.location.href = '/signin';
  }

  showToast(message) {
    // Create a simple toast notification
    const toast = document.createElement("div");
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background-color: #0f172a;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideInRight 300ms ease-out;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideInLeft 300ms ease-out";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// ============================================================================
// PRICING TOGGLE (for annual/monthly)
// ============================================================================

class PricingToggle {
  constructor() {
    // This is optional - add if needed
    this.init();
  }

  init() {
    // Can be extended for billing period toggle
  }
}

// ============================================================================
// SCROLL HEADER EFFECT
// ============================================================================

class ScrollHeader {
  constructor() {
    this.header = $(".site-header");
    this.lastScrollY = 0;

    if (!this.header) return;

    this.init();
  }

  init() {
    window.addEventListener("scroll", () => {
      this.updateHeader();
    }, { passive: true });
  }

  updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 10) {
      // Add subtle shadow on scroll
      this.header.style.boxShadow =
        "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
    } else {
      this.header.style.boxShadow = "none";
    }

    this.lastScrollY = scrollY;
  }
}

// ============================================================================
// FORM HANDLING
// ============================================================================

class FormHandler {
  constructor() {
    this.init();
  }

  init() {
    // Handle any forms (if added later)
    const forms = $$("form");

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        this.handleSubmit(e, form);
      });
    });
  }

  handleSubmit(e, form) {
    e.preventDefault();

    console.log("Form submitted");

    // In a real app, send data to server
    const formData = new FormData(form);
    console.log(Object.fromEntries(formData));

    // Show success message
    const successMsg = document.createElement("div");
    successMsg.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      animation: slideInDown 300ms ease-out;
    `;
    successMsg.textContent =
      "Thank you! We'll be in touch soon.";

    document.body.appendChild(successMsg);

    form.reset();

    setTimeout(() => {
      successMsg.remove();
    }, 4000);
  }
}

// ============================================================================
// ACCESSIBILITY UTILITIES
// ============================================================================

class Accessibility {
  constructor() {
    this.init();
  }

  init() {
    // Skip to main content link
    this.addSkipLink();

    // Handle focus visible
    this.handleFocusVisible();
  }

  addSkipLink() {
    const skipLink = document.createElement("a");
    skipLink.href = "#main";
    skipLink.textContent = "Skip to main content";
    skipLink.className = "sr-only";
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      z-index: 100;
    `;

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Make main element focusable
    const mainEl = $("main");
    if (mainEl && !mainEl.id) {
      mainEl.id = "main";
    }
  }

  handleFocusVisible() {
    // This helps with keyboard navigation visibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.style.outline = "none";
      }
    });

    document.addEventListener("mousedown", () => {
      // Reset when user uses mouse
    });
  }
}

// ============================================================================
// PERFORMANCE OPTIMIZATION
// ============================================================================

class PerformanceOptimization {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images if needed
    this.setupLazyLoading();

    // Prefetch resources
    this.setupPrefetch();
  }

  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      const images = $$("img[data-src]");

      images.forEach((img) => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const src = entry.target.getAttribute("data-src");
              entry.target.src = src;
              entry.target.removeAttribute("data-src");
              observer.unobserve(entry.target);
            }
          });
        });

        observer.observe(img);
      });
    }
  }

  setupPrefetch() {
    // Prefetch DNS for external resources
    const links = [
      '<link rel="dns-prefetch" href="https://fonts.googleapis.com">',
      '<link rel="dns-prefetch" href="https://cdn.example.com">',
    ];

    // Can be added to head if needed
  }
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

class App {
  constructor() {
    this.init();
  }

  init() {
    // Check if DOM is ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.bootstrap();
      });
    } else {
      this.bootstrap();
    }
  }

  bootstrap() {
    // Initialize all components
    new MobileNav();
    new FAQAccordion();
    new AnimationObserver();
    new SmoothScroll();
    new CTAHandler();
    new ScrollHeader();
    new FormHandler();
    new Accessibility();
    new PerformanceOptimization();

    console.log("Linear SaaS landing page initialized");
  }
}

// ============================================================================
// START THE APP
// ============================================================================

// Initialize app when script loads
new App();

// ============================================================================
// HELPER: Polyfills for older browsers
// ============================================================================

// Polyfill for Object.fromEntries if needed
if (!Object.fromEntries) {
  Object.fromEntries = function (entries) {
    if (!entries || !entries[Symbol.iterator]) {
      throw new TypeError(
        "Object.fromEntries requires an iterable"
      );
    }

    const result = {};

    for (const [key, value] of entries) {
      result[key] = value;
    }

    return result;
  };
}

// Polyfill for smooth scroll behavior
if (!("scrollBehavior" in document.documentElement.style)) {
  const smoothScroll = function (element, to, duration) {
    if (duration <= 0) return;

    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;

    setTimeout(() => {
      element.scrollTop += perTick;

      if (element.scrollTop === to) return;

      smoothScroll(element, to, duration - 10);
    }, 10);
  };

  window.scrollTo = function (options) {
    if (typeof options === "object" && options.behavior === "smooth") {
      smoothScroll(
        document.documentElement,
        options.top,
        300
      );
    }
  };
}
