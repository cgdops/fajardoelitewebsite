/* Fajardo Elite — main.js
   Vanilla JS, no dependencies. */

(function () {
  'use strict';

  // ---- Announcement bar ----
  // Loads content from /content/announcement.json. Renders only if enabled and
  // not dismissed within the last 7 days.

  const DISMISS_KEY = 'fe_announcement_dismissed_at';
  const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

  function isDismissed() {
    try {
      const ts = parseInt(localStorage.getItem(DISMISS_KEY), 10);
      if (!ts) return false;
      return Date.now() - ts < DISMISS_TTL_MS;
    } catch (_) { return false; }
  }

  function setDismissed() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
  }

  async function initAnnouncement() {
    const bar = document.getElementById('announcement-bar');
    if (!bar) return;
    if (isDismissed()) { bar.remove(); return; }

    try {
      const res = await fetch('/content/announcement.json', { cache: 'no-cache' });
      if (!res.ok) { bar.remove(); return; }
      const data = await res.json();
      if (!data || !data.enabled || !data.text) { bar.remove(); return; }

      const link = bar.querySelector('[data-announcement-link]');
      const text = bar.querySelector('[data-announcement-text]');
      if (text) text.textContent = data.text;
      if (link && data.href) link.setAttribute('href', data.href);
      if (data.bgColor) bar.style.background = data.bgColor;

      bar.hidden = false;

      const dismiss = bar.querySelector('[data-announcement-dismiss]');
      if (dismiss) {
        dismiss.addEventListener('click', () => {
          setDismissed();
          bar.remove();
        });
      }
    } catch (_) {
      bar.remove();
    }
  }

  // ---- Mobile nav toggle ----
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    if (!toggle || !nav) return;

    function setOpen(open) {
      document.body.classList.toggle('is-nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', () => {
      setOpen(!document.body.classList.contains('is-nav-open'));
    });

    // Close when a nav link is tapped
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setOpen(false));
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('is-nav-open')) {
        setOpen(false);
      }
    });

    // Close if the viewport grows past the desktop breakpoint
    const mq = window.matchMedia('(min-width: 900px)');
    const onChange = (e) => { if (e.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange); // older Safari
  }

  // ---- Copyright Year ----
  function initCopyrightYear() {
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ---- Contact Form Verification ----
  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      // If g-recaptcha is present on the page, check its response
      const recaptchaEl = form.querySelector('.g-recaptcha');
      if (recaptchaEl && typeof grecaptcha !== 'undefined') {
        const response = grecaptcha.getResponse();
        if (response.length === 0) {
          e.preventDefault();
          alert('Please complete the reCAPTCHA to send your message.');
        }
      }
    });
  }

  // ---- Init ----
  function init() {
    initAnnouncement();
    initMobileNav();
    initCopyrightYear();
    initContactForm();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
