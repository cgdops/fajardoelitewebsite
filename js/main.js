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

  // ---- Init ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnnouncement);
  } else {
    initAnnouncement();
  }
})();
