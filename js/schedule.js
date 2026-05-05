/* Fajardo Elite — schedule.js
   Filter-pill toggling for /schedule.html. Pure DOM, no deps. */

(function () {
  'use strict';

  const schedule = document.querySelector('.schedule');
  const pills = document.querySelectorAll('.filter-pill');
  if (!schedule || pills.length === 0) return;

  function setFilter(filter) {
    schedule.setAttribute('data-active-filter', filter);
    pills.forEach((p) => {
      const isActive = p.getAttribute('data-filter') === filter;
      p.classList.toggle('is-active', isActive);
      p.setAttribute('aria-selected', String(isActive));
    });
    hideEmptyDayColumns(filter);
  }

  // For browsers without :has(), we hide a day column when none of its
  // class-cards remain visible after the filter is applied.
  function hideEmptyDayColumns(filter) {
    const cols = document.querySelectorAll('.day-column');
    cols.forEach((col) => {
      const cards = col.querySelectorAll('.class-card');
      let visibleCount = 0;
      cards.forEach((c) => {
        if (window.getComputedStyle(c).display !== 'none') visibleCount += 1;
      });
      col.style.display = visibleCount === 0 ? 'none' : '';
    });
  }

  pills.forEach((p) => {
    p.addEventListener('click', () => {
      const filter = p.getAttribute('data-filter') || 'all';
      setFilter(filter);
    });
  });
})();
